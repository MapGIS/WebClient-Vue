<template>
  <Popup
    v-if="modelSwitchVisible"
    :visible="modelSwitchVisible"
    :position="iClickPosition"
    forceRender
  >
    <mapgis-ui-popup-content class="mapgis-multi-model-status-popup">
      <modelSwitchPopup :tile="tile" @handleModel="handleModel">
      </modelSwitchPopup>
    </mapgis-ui-popup-content>
  </Popup>
  <!-- <mapgis-3d-virtual-popup
    v-else-if="popupShowType === 'default'"
    :enablePopup="enablePopup"
    :enableTips="enableTips"
    :enableIot="iEnableIot"
    :popupOptions="popupOptions"
    :tipsOptions="tipsOptions"
    :iotOptions="iotOptions"
    :clickVisible="iClickVisible"
    :clickPosition="iClickPosition"
    :clickFeatures="iClickFeatures"
  >
  </mapgis-3d-virtual-popup> -->
  <mapgis-3d-feature-popup
    v-else-if="popupShowType === 'default' && featureposition"
    :position="featureposition"
    :popupOptions="popupOptions"
  >
    <mapgis-3d-popup-iot
      :properties="featureproperties"
      :dataStoreIp="dataStoreIp"
      :dataStorePort="dataStorePort"
      :dataStoreDataset="dataStoreDataset"
    >
    </mapgis-3d-popup-iot>
  </mapgis-3d-feature-popup>
</template>

<script>
import { G3D } from "@mapgis/webclient-es6-service";
import Tileset3dOptions from "./3DTilesetOptions";
import { M3dType, M3dType_0_0 } from "./M3dType";
import PopupMixin from "../Mixin/PopupMixin";
import modelSwitchPopup from "./components/M3dModelSwitch";
import Popup from "../../UI/Popup/Popup.vue";

const { M3DTileDataInfo } = G3D;

export default {
  name: "mapgis-3d-m3d-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [PopupMixin],
  props: {
    ...Tileset3dOptions,
    // 右侧展示气泡框props
    popupShowType: {
      type: String,
      default: "default"
    },
    popupOverlay: {
      type: Object,
      default: () => {}
    },
    dataStoreIp: {
      type: String,
      default: "192.168.96.101"
    },
    dataStorePort: {
      type: String,
      default: "9014"
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1"
    },
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      }
    }
  },
  components: {
    modelSwitchPopup,
    Popup
  },
  data() {
    return {
      layerIndex: undefined,
      layerList: undefined,
      version: undefined,
      modelSwitchVisible: false,
      tileIndex: undefined,
      tile: {},
      iEnableIot: false,
      featureposition: undefined,
      featureproperties: undefined
    };
  },
  created() {},
  mounted() {
    this.layerList = this.parseLayers(this.layers);
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    tileIndex(next) {
      this.tile.tileIndex = next;
    },
    url(next) {
      this.unmount();
      this.mount();
    },
    layers(next) {
      if (this.initial) return;
      this.layerList = this.parseLayers(next);
      this.changeLayerVisible(this.layerList);
    },
    show(next) {
      if (this.initial) return;
      this.changeShow(next);
    },
    opacity(next) {
      if (this.initial) return;
      if (next >= 0 && next <= 1) {
        this.changeOpacity(next);
      }
    },
    enablePopup(next) {
      if (next) {
        this.bindPopupEvent();
      } else {
        this.unbindPopupEvent();
      }
    },
    enableIot(next) {
      this.iEnableIot = next;
    }
  },
  /* render(h) {
    return this.$_render(h);
  }, */
  methods: {
    handleModel(index) {
      const vm = this;
      vm.tileIndex = index;
      vm.modelSwitchVisible = false;
    },
    createCesiumObject() {
      const vm = this;
      const { vueCesium, viewer, url, $props } = this;
      let version = this.parseCesiumVersion(url);
      if (version == "1.0") {
        return new Promise(
          resolve => {
            let m3dLayer = new window.CesiumZondy.Layer.M3DLayer({
              viewer: viewer
            });
            resolve({ layer: m3dLayer });
          },
          reject => {}
        );
      } else if (version == "2.0") {
        return new Promise(
          resolve => {
            let layerIndex;
            let options = this.getOptions();
            options.loaded = vm.onSceneLoaded;
            // 判断服务类型，三维场景服务调用Cesium底层appendSceneLayer，本质是调用appendSceneServer方法
            if (url.indexOf("SceneServer") !== -1) {
              viewer.scene.layers.appendSceneLayer(url, options);
              layerIndex = viewer.scene.layers._index;
              // const sceneLayer = viewer.scene.layers.sceneLayerMap.get(layerIndex);
            } else {
              // M3D服务调用Cesium底层appendM3DLayer方法
              layerIndex = viewer.scene.layers.appendM3DLayer(url, options);
            }
            resolve({ layerIndex: layerIndex });
          },
          reject => {}
        );
      }

      return m3dLayer;
    },
    // 解决 ...props报错
    getOptions() {
      const { $props } = this;
      let options = {};
      Object.keys($props).forEach(function(key) {
        if ($props[key]) {
          options[key] = $props[key];
        }
      });
      return options;
    },
    parseCesiumVersion(url) {
      let g3d = new RegExp("/igs/rest/g3d/");
      let find = url.search(g3d);
      if (find >= 0) {
        // 0.0 1.0版本的m3d图层，等于2.0版本的g3d图层
        this.version = "1.0";
      } else {
        // 2.0 版本
        this.version = "2.0";
      }
      console.log("version", this.version);
      return this.version;
    },
    parseM3dVersion() {},
    // Cesium底层回调，返回加载的tileset，并用vueCesium进行管理
    onSceneLoaded(tileset) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, url } = this;
      if (tileset) {
        let m3ds = [tileset];
        vm.loopM3d(m3ds, "2.0");
        vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
          version: "2.0",
          url: url
        });
        console.log("vueCesium.M3DIgsManager", vueCesium.M3DIgsManager);
        vm.$emit("loaded", { tileset: tileset, m3ds: m3ds });
        vm.bindPopupEvent();
      }
    },
    onM3dLoaded(tileset, n) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, url } = this;
      if (tileset) {
        let m3ds = [tileset];
        vm.loopM3d(m3ds, "2.0");
        vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
          version: "2.0",
          url: url
        });
        console.log("vueCesium.M3DIgsManager", vueCesium.M3DIgsManager);
        vm.$emit("loaded", { tileset: tileset, m3ds: m3ds });
        vm.bindPopupEvent();
      }
    },
    mount() {
      const vm = this;
      const { viewer, vueIndex, vueKey, vueCesium, $props } = this;
      const { offset, scale, opacity, enablePopup, url } = this;

      if (viewer.isDestroyed()) return;

      let promise = this.createCesiumObject();
      promise.then(payload => {
        const { layer, layerIndex } = payload;

        if (layer) {
          // 0.0 1.0版本的处理方式
          let options = this.getOptions();
          options.loaded = tileset => {
            if (vueKey && vueIndex) {
              vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
                url: url
              });
              vm.bindPopupEvent();
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
              tileset.setScale(
                new Cesium.Cartesian3(scale.x, scale.y, scale.z)
              );
            }
            vm.loopM3d(m3ds, "1.0");
            vm.$emit("loaded", { tileset: tileset, m3ds: m3ds });
          };
          let m3ds = layer.append(`${url}`, options);
        } else if (layerIndex >= 0) {
          // 2.0版本的处理方式
          /**
           * @修改说明 临时解决m3dLayer获取失败问题
           * @修改人 龚跃健
           * @修改时间 2022/2/22
           */
          vm.layerIndex = layerIndex;
          let m3dLayer;
          if (url.indexOf("SceneServer") == -1) {
            m3dLayer = viewer.scene.layers.m3dLayersMap.get(layerIndex);
            let m3ds = [m3dLayer];
            vm.loopM3d(m3ds, "2.0");
            vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
              version: "2.0",
              url: url
            });
            vm.$emit("loaded", { tileset: m3dLayer, m3ds: m3ds });
            vm.bindPopupEvent();
          }
        }
      });
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      this.removeLayer();
      // 直接调用cesium底层MapGISM3DSet的destroy方法会导致地球卡死的问题，目前改用统一的layers管理图层，移除图层并销毁内存中的资源
      // this.unbindSource();
      this.unbindPopupEvent();
      this.$emit("unload", { component: this });
      vueCesium.M3DIgsManager.deleteSource(vueKey, vueIndex);
    },
    removeLayer() {
      const { url, layerIndex } = this;
      if (layerIndex === undefined) {
        return;
      }

      const layer = viewer.scene.layers.getLayer(layerIndex);
      if (!layer) return;

      if (url.indexOf("SceneServer") != -1) {
        if (viewer.scene.layers.sceneLayerMap._length > 0) {
          viewer.scene.layers.removeSceneLayerByID(layerIndex);
        }
      } else {
        if (viewer.scene.layers.m3dLayersMap.length > 0) {
          viewer.scene.layers.removeM3DLayerByID(layerIndex);
        }
      }
    },
    unbindSource() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        !viewer.isDestroyed() &&
          m3ds &&
          m3ds.forEach(l => {
            l.destroy();
          });
      }
    },
    bindPopupEvent() {
      const { vueKey, vueIndex } = this;
      const { enablePopup, enableTips, enableModelSwitch } = this;

      let clickhandler, hoverhandler;
      if (enablePopup || enableModelSwitch) {
        clickhandler = this.$_bindClickEvent(
          this.pickFeature,
          this.cancelFeature
        );
      }
      if (enableTips) {
        hoverhandler = this.$_bindHoverEvent(this.pickFeature);
      }
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "clickhandler",
        clickhandler
      );
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "hoverhandler",
        hoverhandler
      );
    },
    unbindPopupEvent() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        if (find.options.clickhandler) {
          find.options.clickhandler.destroy();
        }
        if (find.options.hoverhandler) {
          find.options.hoverhandler.destroy();
        }
      }
      // 关闭右侧气泡框
      this.popupOverlay && this.popupOverlay.setContent(null);
    },
    pickFeature(payload) {
      const vm = this;
      const { movement } = payload;

      const { popupOptions, highlightStyle, vueKey, vueIndex } = this;
      // const { color = "rgba(255, 255, 0, 0.6)" } = highlightStyle;
      const { viewer } = this;
      const { version, layerIndex } = this;

      if (version == "0.0" || version == "1.0") {
      } else if (version == "2.0") {
        /* 只有在多模态下为真 */
        vm.modelSwitchVisible = false;
        let feature = viewer.scene.pick(movement.position);
        /* 多模态切换 */
        if (vm.enableModelSwitch) {
          vm.tile = feature.content.tile.searchMultimodalTile();
          vm.modelSwitchVisible = true;
          return;
        }
        let oid = viewer.scene.pickOid(movement.position);
        let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
        if (feature.tileset !== tileset) {
          tileset.pickedOid = oid;
          tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
          this.featureposition = undefined;
          this.featureproperties = undefined;
          return;
        }
        vueCesium.M3DIgsManager.changeOptions(
          vueKey,
          vueIndex,
          "pick",
          tileset
        );
        vueCesium.M3DIgsManager.changeOptions(
          vueKey,
          vueIndex,
          "pickStyle",
          tileset.pickedColor || Cesium.Color.fromCssColorString(highlightStyle)
        );
        tileset.pickedOid = oid;
        tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
        let titlefield = popupOptions ? popupOptions.title : undefined;
        if (tileset._useRawSaveAtt && Cesium.defined(feature)) {
          let result = feature.content.getAttributeByOID(oid) || {};
          if (this.popupShowType === "default") {
            // vm.iClickFeatures = [
            //   { properties: result, title: result[titlefield] }
            // ];
            vm.featureproperties = result;
          } else {
            // title放在最前面
            let popupContent = {};
            popupContent = result[titlefield]
              ? { title: result[titlefield], ...result }
              : { ...result };
            vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
          }
        } else {
          tileset.queryAttributes(oid).then(function(result) {
            result = result || {};
            if (this.popupShowType === "default") {
              // vm.iClickFeatures = [
              //   { properties: result, title: result[titlefield] }
              // ];
              vm.featureproperties = result;
            } else {
              // title放在最前面
              let popupContent = {};
              popupContent = result[titlefield]
                ? { title: result[titlefield], ...result }
                : { ...result };
              vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
            }
          });
        }
        if (this.popupShowType === "default" && vm.iClickPosition) {
          vm.featureposition = vm.iClickPosition;
          // let clickinfo = vm.iClickFeatures[0];
          // const { properties } = clickinfo;
          // if (properties) {
          //   Object.keys(properties).forEach(k => {
          //     if (k.toLowerCase() == "euid") vm.iEnableIot = true;
          //   });
          // }
        }
      }
    },
    cancelFeature(payload) {
      const { movement } = payload;
      const { version, layerIndex } = this;
      const { highlightStyle } = this;
      let oid = viewer.scene.pickOid(movement.position);
      if (version == "0.0" || version == "1.0") {
      } else if (version == "2.0") {
        let tileset = viewer.scene.layers.getM3DLayer(layerIndex);
        tileset.pickedOid = oid;
        tileset.pickedColor = Cesium.Color.fromCssColorString(highlightStyle);
        if (!oid) {
          this.featureposition = undefined;
          this.featureproperties = undefined;
        }
      }
      this.popupOverlay && this.popupOverlay.setContent(null);
    },
    changeShow(show) {
      const { vueKey, vueIndex } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        m3ds && m3ds.forEach(m3d => (m3d.show = show));
      }
      this.layerList = this.parseLayers();
      this.changeLayerVisible(this.layerList);
    },
    changeOpacity(opacity) {
      const { vueKey, vueIndex } = this;
      const vm = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach(m3d => {
          let type = vm.checkType(m3d);
          type = type == M3dType.UnKnow ? m3d.type : type;
          if (type == M3dType.Model || type == M3dType.Instance) {
            m3d.style = new Cesium.Cesium3DTileStyle({
              color: `color('#FFFFFF', ${opacity})`
            });
          }
        });
      }
    },
    checkType(tileset, callback) {
      const vm = this;
      let m3dType = M3dType.UnKnow;
      const { root } = tileset;
      if (!root) return m3dType;
      const version = root.tileset._version;
      let { children } = root;
      if (version == "0.0" || version == "1.0") {
        // m3d 0.x  1.x版本逻辑判断 type =0是模型 =1是示例化数据 =2是点云
        if (!children || children.length <= 0) return m3dType;
        children.forEach(child => {
          let tempType = vm.checkTypeNode(child, version, callback);
          m3dType = tempType || m3dType;
        });
      } else if (version == "2.0") {
        if (!children || children.length <= 0) return m3dType;
        children.forEach(child => {
          let tempType = vm.checkTypeNode(child, version, callback);
          m3dType = tempType ? tempType : m3dType;
        });
      }

      return m3dType;
    },
    checkTypeNode(tileset, version, callback) {
      let m3dType;
      const vm = this;
      if (!tileset) return m3dType;
      if (tileset._content) {
        let type = tileset._content._dataType;
        if (type >= 0) {
          if (version == "0.0" || version == "1.0") {
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
          } else if (version == "2.0") {
            switch (type) {
              case M3DTileDataInfo.Model:
                m3dType = M3dType.Model;
                break;
              case M3DTileDataInfo.Vector:
                m3dType = M3dType.Instance;
                break;
              case M3DTileDataInfo.CloudPoint:
                m3dType = M3dType.CloudPoint;
                break;
            }
          }
          if (callback) {
            callback(m3dType);
          }
          return m3dType;
        }
      }

      tileset.children.forEach(child => {
        let tempType = vm.checkTypeNode(child, version, callback);
        m3dType = tempType ? tempType : m3dType;
      });

      return m3dType;
    },
    loopM3d(m3ds, version) {
      const vm = this;
      const { vueKey, vueIndex, vueCesium, opacity, url } = this;
      let dataCallback = cbtype => {
        if (loop) {
          window.clearInterval(loop);
          loop = undefined;
          m3ds.forEach(m3d => {
            let type = vm.checkType(m3d);
            m3d.type = type || cbtype;
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
          vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
            url: url
          });
        }
      };
      // let loop = window.setInterval(() => {
      m3ds.forEach(m3d => {
        vm.checkType(m3d, dataCallback);
      });
      // }, 100);
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
      const { vueKey, vueIndex, show } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach(m3d => {
          if (layers) {
            m3d.show = true;
            // @description cesium 1.84 (M3D 2.0)将layerIndex内部隐藏起来了
            // @date 20211112 潘卓然， 等到三维放开这个属性后还原
            if (layers.indexOf(m3d.layerIndex || m3d._layerIndex) >= 0) {
            } else {
              m3d.show = false;
            }
          } else {
            m3d.show = show;
          }
        });
      }
    }
  }
};
</script>
