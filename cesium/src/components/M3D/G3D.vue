<script>
import Tileset3dOptions from "./3DTilesetOptions";

export default {
  name: "mapgis-3d-igs-m3d",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...Tileset3dOptions
  },
  created() {},
  mounted() {
    this.mount();
    this.watchProp();
  },
  destroyed() {
    this.unmount();
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
            !vm.show && m3ds && m3ds.forEach(m3d => (m3d.show = vm.show));
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
            m3ds.forEach(
              m3d =>
                (m3d.style = new Cesium.Cesium3DTileStyle({
                  color: `color('#FFFFFF', ${opacity})`
                }))
            );
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
    },
    changeOpacity(opacity) {
      const { vueKey, vueIndex } = this;
      let find = CesiumZondy.M3DIgsManager.findSource(vueKey, vueIndex);
      console.log('find', find.source);
      if (find) {
        let m3ds = find.source;
        m3ds &&
          m3ds.forEach(m3d => {
            m3d.style = new Cesium.Cesium3DTileStyle({
              color: `color('#FFFFFF', ${opacity})`
            });
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
