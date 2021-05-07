<script>
import Tileset from "./3DTileset";
export default {
  name: "mapgis-3d-igs-m3d",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
    },
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
      const { $props, url, CesiumZondy, webGlobe } = this;
      let m3dLayer = new CesiumZondy.Layer.M3DLayer({
        viewer: webGlobe.viewer,
      });
      return m3dLayer;
    },
    watchProp() {},
    onM3dLoaded(e) {},
    mount() {
      const { webGlobe, vueIndex, vueKey, $props } = this;
      const viewer = webGlobe.viewer;

      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let m3dLayer = this.createCesiumObject();

      let m3ds = m3dLayer.append(`${this.url}`, {
        ...$props,
        loaded: () => {
          if (vueKey && vueIndex) {
            window.CesiumZondy.M3DIgsManager.addSource(vueKey, vueIndex, m3ds);
          }
        },
      });
    },
    unmount() {
      const { webGlobe, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
      let find = window.CesiumZondy.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        !viewer.isDestroyed() &&
          m3ds &&
          m3ds.forEach((l) => {
            l.destroy();
          });
      }
      window.CesiumZondy.VectorTileManager.deleteSource(vueKey, vueIndex);
    },
  },
  render(h) {
    return h("span", {
      class: "mapgis-3d-igs-m3d",
      ref: "m3d",
    });
  },
};
</script>
