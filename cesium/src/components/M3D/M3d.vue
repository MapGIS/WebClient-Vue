<script>
import Tileset3dOptions from "./3DTilesetOptions";
import { M3dType, M3dType_0_0 } from "./M3dType";

export default {
  name: "mapgis-3d-igs-m3d",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...Tileset3dOptions
  },
  data() {
    return {
      layerList: undefined
    };
  },
  created() {},
  mounted() {
    this.layerList = this.parseLayers(this.layers);
    this.mount();
    this.watchProp();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    layers(next) {
      this.layerList = this.parseLayers(next);
      this.changeLayerVisible(this.layerList);
    }
  },
  methods: {
    createCesiumObject() {
      const { CesiumZondy, webGlobe } = this;
      let m3dLayer = new CesiumZondy.Layer.M3DLayer({
        viewer: webGlobe.viewer
      });
      return m3dLayer;
    },
    watchProp() {
      let { show, opacity } = this;
      if (show) {
        this.$watch("show", function(next) {
          if (this.initial) return;
          this.changeShow(next);
        });
      }
      if (opacity >= 0 && opacity <= 1) {
        this.$watch("opacity", function(next) {
          if (this.initial) return;
          this.changeOpacity(next);
        });
      }
    },
    onM3dLoaded(e) {},
    mount() {
      const vm = this;
      const {
        webGlobe,
        vueIndex,
        vueKey,
        $props,
        offset,
        scale,
        opacity
      } = this;
      const viewer = webGlobe.viewer;

      if (viewer.isDestroyed()) return;
      // this.$emit("load", { component: this });

      let m3dLayer = this.createCesiumObject();
      let m3ds = m3dLayer.append(`${this.url}`, {
        ...$props,
        loaded: tileset => {
          if (vueKey && vueIndex) {
            CesiumZondy.M3DIgsManager.addSource(vueKey, vueIndex, m3ds);
            m3ds.forEach(m3d => console.log("m3d", m3d));

            if (!vm.show && m3ds) {
              m3ds.forEach(m3d => {
                m3d.show = vm.show;
              });
            }
          }
          if (offset) {
            let boundingSphere = tileset.boundingSphere;
            let cartographic = Cesium.Cartographic.fromCartesian(
              boundingSphere.center
            );
            let surface = Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              0.0
            );
            let { longitude = 0, latitude = 0, height = 0 } = offset;
            let offsetParam = Cesium.Cartesian3.fromRadians(
              cartographic.longitude + longitude,
              cartographic.latitude + latitude,
              height
            );

            let translation = Cesium.Cartesian3.subtract(
              offsetParam,
              surface,
              new Cesium.Cartesian3()
            );
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
          }
          if (scale) {
            tileset.setScale(new Cesium.Cartesian3(scale.x, scale.y, scale.z));
          }

          if (opacity >= 0) {
            let dataCallback = () => {
              if (loop) {
                window.clearInterval(loop);
                loop = undefined;
                m3ds.forEach(m3d => {
                  let type = vm.checkType(m3d);
                  m3d.type = type;
                  switch (type) {
                    case M3dType.Model:
                    case M3dType.Instance:
                      m3d.style = new Cesium.Cesium3DTileStyle({
                        color: `color('#FFFFFF', ${opacity})`
                      });
                      break;
                    case M3dType.CloudPoint:
                      // 0.0 1.0版本无法激活Cesium自带得下列样式代码，只能在2.0以后的版本实现透明度的改变
                      /* m3d.style = new Cesium.Cesium3DTileStyle({
                        color: {
                          conditions: [["true", "color('#FFFF00', 0.25)"]]
                        }
                      }); */
                      break;
                    case M3dType.UnKnow:
                      break;
                  }
                });
              }
            };
            let loop = window.setInterval(() => {
              m3ds.forEach(m3d => {
                vm.checkType(m3d, dataCallback);
              });
            }, 100);
          }
          vm.$emit("loaded", { tileset: tileset, m3ds: m3ds });
        }
      });
    },
    unmount() {
      const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
      let find = CesiumZondy.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        !viewer.isDestroyed() &&
          m3ds &&
          m3ds.forEach(l => {
            l.destroy();
          });
      }
      this.$emit("unload", { component: this });
      CesiumZondy.M3DIgsManager.deleteSource(vueKey, vueIndex);
    },
    changeShow(show) {
      const { vueKey, vueIndex } = this;
      let find = CesiumZondy.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        m3ds && m3ds.forEach(m3d => (m3d.show = show));
      }
      this.layerList = this.parseLayers();
      this.changeLayerVisible(this.layerList);
    },
    changeOpacity(opacity) {
      const { vueKey, vueIndex } = this;
      let find = CesiumZondy.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach(m3d => {
          if (m3d.type == M3dType.Model || m3d.type == M3dType.Instance) {
            m3d.style = new Cesium.Cesium3DTileStyle({
              color: `color('#FFFFFF', ${opacity})`
            });
          }
        });
      }
    },
    checkType(tileset, callback) {
      let m3dType = M3dType.UnKnow;
      const { root } = tileset;
      if (!root) return m3dType;

      const version = root.tileset._version;

      console.log("version", version);
      if (version == 0.0 || version == 1.0) {
        // m3d 0.x  1.x版本逻辑判断 type =0是模型 =1是示例化数据 =2是点云
        let { children } = root;
        console.log("root", root);
        if (!children || children.length <= 0) return m3dType;
        let child = children[0];
        console.log("child", child.content);
        if (child.content) {
          let type = child.content._dataType;
          console.log("type", type);
          if (callback) {
            callback();
          }
          switch (type) {
            case M3dType_0_0.Model:
              m3dType = M3dType.Model;
              break;
            case M3dType_0_0.Instance:
              m3dType = M3dType.Instance;
              break;
            case M3dType_0_0.CloudPoint:
              m3dType = M3dType.CloudPoint;
              break;
          }
        }
      } else if (version == 2.0) {
      }

      return m3dType;
    },
    parseLayers(layerString) {
      layerString = layerString || this.layers;
      if (!layerString) return undefined;
      let pattern = new RegExp(/layers=show:/i);
      if (!pattern.test(layerString)) {
        console.warn("layers格式错误，格式为layers=show:0,1,2");
      }
      let layerStr = layerString.replace(/layers=show:/i, "");
      let layerStrs = layerStr.split(",");
      let layers = layerStrs.map(l => parseInt(l));
      return layers;
    },
    changeLayerVisible(layers) {
      layers = layers || this.layerList;
      const { vueKey, vueIndex } = this;
      let find = CesiumZondy.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach(m3d => {
          if (layers) {
            m3d.show = true;
            if (layers.indexOf(m3d.layerIndex) >= 0) {
            } else {
              m3d.show = false;
            }
          } else {
            m3d.show = true;
          }
        });
      }
    }
  },
  render(h) {
    return h("span", {
      class: "mapgis-3d-igs-m3d",
      ref: "m3d"
    });
  }
};
</script>
