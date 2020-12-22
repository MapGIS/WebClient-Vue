<script>
import VectorTileOptions from './VectorTileOptions';
export default {
  name: "cesium-vectortile-layer",
  props: { ...VectorTileOptions },
  inject: ["Cesium", "webGlobe"],
  created () { },
  mounted () {
    this.mount();
    // this.watchProp();
  },
  destroyed () {
    this.unmount();
  },
  methods: {
    createCesiumObject () {
      const { $props, webGlobe } = this;
      const viewer = webGlobe.viewer;
      return new window.CesiumZondy.Overlayer.VectorTileLayer(viewer, $props);
    },
    watchProp () {
      const { webGlobe, vueKey, vueIndex, show } = this;
      const viewer = webGlobe.viewer;
      let find = window.CesiumZondy.VectorTileManager.findSource(
        vueKey,
        vueIndex
      );

      if (show) {
        this.$watch("show", function (next) {
          if (this.initial) return;
          if (find) {
            !viewer.isDestroyed() && find.source.setVisible(next);
          }
        });
      }
    },
    mount () {
      const { webGlobe, vueIndex, vueKey } = this;
      const viewer = webGlobe.viewer;

      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let vectortile = this.createCesiumObject();

      if (vueKey && vueIndex) {
        window.CesiumZondy.VectorTileManager.addSource(
          vueKey,
          vueIndex,
          vectortile
        );
      }
    },
    unmount () {
      const { webGlobe, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
      let find = window.CesiumZondy.VectorTileManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        !viewer.isDestroyed() && find.source.destroy();
      }
      window.CesiumZondy.VectorTileManager.deleteSource(vueKey, vueIndex);
    }
  },
  render (createElement) {
    return createElement("span");
  }
};
</script>
