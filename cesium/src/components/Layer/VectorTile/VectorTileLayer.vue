<script>
import VectorTileOptions from "./VectorTileOptions";
export default {
  name: "mapgis-3d-vectortile-layer",
  props: { ...VectorTileOptions },
  inject: ["Cesium", "webGlobe"],
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
      const { $props, webGlobe } = this;
      const viewer = webGlobe.viewer;
      return new window.CesiumZondy.Overlayer.VectorTileLayer(viewer, $props);
    },
    watchProp() {
      const {
        webGlobe,
        vueKey,
        vueIndex,
        show,
        mvtStyle,
        vectortilejson,
      } = this;
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
      if (mvtStyle) {
        this.$watch("mvtStyle", {
          handler(nextStyle) {
            if (typeof nextStyle === "object") {
              !viewer.isDestroyed() && this.$vectortile.updateStyle(nextStyle);
            }
          },
          deep: true,
        });
      }
      if (vectortilejson) {
        this.$watch("vectortilejson", {
          handler(nextStyle) {
            if (typeof nextStyle === "object") {
              !viewer.isDestroyed() && this.$vectortile.updateStyle(nextStyle);
            }
          },
          deep: true,
        });
      }
    },
    updateStyle(style) {
      this.$vectortile.updateStyle(style);
    },
    mount() {
      const { webGlobe, vueIndex, vueKey } = this;
      const viewer = webGlobe.viewer;

      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let vectortile = this.createCesiumObject();
      this.$vectortile = vectortile;

      if (vueKey && vueIndex) {
        window.CesiumZondy.VectorTileManager.addSource(
          vueKey,
          vueIndex,
          vectortile
        );
      }
    },
    unmount() {
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
    },
  },
  render(createElement) {
    return createElement("span");
  },
};
</script>
