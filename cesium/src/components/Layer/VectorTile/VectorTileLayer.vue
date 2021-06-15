<script>
import VectorTileOptions from "./VectorTileOptions";
export default {
  name: "mapgis-3d-vectortile-layer",
  props: { ...VectorTileOptions },
  inject: ["Cesium", "webGlobe", "CesiumZondy"],
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
      const { $props, webGlobe, CesiumZondy } = this;
      const { tilingScheme } = $props;
      const viewer = webGlobe.viewer;
      let tileScheme;
      
      if (typeof tilingScheme === 'string') {
        tileScheme = this.checkTiling(tilingScheme);
      } else {
        tileScheme = tilingScheme;
      }

      const opt = {...$props, tilingScheme: tileScheme}
      return new CesiumZondy.Overlayer.VectorTileLayer(viewer, opt);
    },
    checkTiling(tileMatrixSetName) {
      let tilingScheme;
      if (
        tileMatrixSetName === "EPSG:4326" ||
        tileMatrixSetName === "EPSG:4490" ||
        tileMatrixSetName === "EPSG:4610" ||
        tileMatrixSetName === "EPSG:4214"
      ) {
        tilingScheme = new Cesium.GeographicTilingScheme();
      } else if (tileMatrixSetName === "EPSG:3857") {
        tilingScheme = new Cesium.WebMercatorTilingScheme();
      } else {
        tilingScheme = new Cesium.GeographicTilingScheme();
      }
      return tilingScheme;
    },
    watchProp() {
      const {
        CesiumZondy,
        webGlobe,
        vueKey,
        vueIndex,
        show,
        mvtStyle,
        vectortilejson,
      } = this;
      const viewer = webGlobe.viewer;
      let find = CesiumZondy.VectorTileManager.findSource(
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
      const { webGlobe, vueIndex, vueKey, CesiumZondy } = this;
      const viewer = webGlobe.viewer;

      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let vectortile = this.createCesiumObject();
      this.$vectortile = vectortile;

      if (vueKey && vueIndex) {
        CesiumZondy.VectorTileManager.addSource(
          vueKey,
          vueIndex,
          vectortile
        );
      }
    },
    unmount() {
      const { webGlobe, vueKey, vueIndex, CesiumZondy } = this;
      const viewer = webGlobe.viewer;
      let find = CesiumZondy.VectorTileManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        !viewer.isDestroyed() && find.source.destroy();
      }
      CesiumZondy.VectorTileManager.deleteSource(vueKey, vueIndex);
    },
  },
  render(createElement) {
    return createElement("span");
  },
};
</script>
