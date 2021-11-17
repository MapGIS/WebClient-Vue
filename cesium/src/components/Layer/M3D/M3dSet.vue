<script>
import Tileset3dOptions from "./3DTilesetOptions";

export default {
  name: "mapgis-3d-m3dset",
  inject: ["Cesium", "vueCesium", "viewer"],
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
      const { vueCesium, viewer } = this;
      let m3dLayer = new window.CesiumZondy.Layer.M3DLayer({
        viewer: viewer
      });
      return m3dLayer;
    },
    watchProp() {
      let { show } = this;
      if (show) {
        this.$watch("show", function(next) {
          if (this.initial) return;
          this.changeShow(next);
        });
      }
    },
    onM3dLoaded(e) {},
    mount() {
      const vm = this;
      const { viewer, vueIndex, vueKey, $props, offset, scale } = this;

      if (viewer.isDestroyed()) return;
      // this.$emit("load", { component: this });

      let m3dLayer = this.createCesiumObject();
      let m3ds = m3dLayer.append(`${this.url}`, {
        ...$props,
        loaded: tileset => {
          if (vueKey && vueIndex) {
            vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds);
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
          vm.$emit("loaded", { tileset: tileset, m3ds: m3ds });
        }
      });
    },
    unmount() {
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
      this.$emit("unload", { component: this });
      vueCesium.M3DIgsManager.deleteSource(vueKey, vueIndex);
    },
    changeShow(show) {
      const {vueKey, vueIndex} = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        m3ds &&
          m3ds.forEach(m3d => {
            m3d.show = show;
            console.log(m3d.show);
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
