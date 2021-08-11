<script>
import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-igs-terrain",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
    },
    scale: {
      type: Number,
      default: 1,
    },
    requestVertexNormals: {
      type: Boolean,
      default: false,
    },
    ...VueOptions,
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    show: function (next) {
      if (next) {
        this.mount();
      } else {
        this.unmount();
      }
    },
  },
  methods: {
    createCesiumObject() {
      const { $props, url, CesiumZondy, webGlobe } = this;
      var terrianlayer = new CesiumZondy.Layer.TerrainLayer({
        viewer: webGlobe.viewer,
      });
      return terrianlayer;
    },
    mount() {
      const { webGlobe, vueIndex, vueKey, $props } = this;
      const viewer = webGlobe.viewer;

      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let terrianlayer = this.createCesiumObject();
      let terrainLayers = terrianlayer.append(`${this.url}`, { ...$props });
      if (vueKey && vueIndex) {
        window.CesiumZondy.IgsTerrainManager.addSource(
          vueKey,
          vueIndex,
          terrainLayers
        );
      }
    },
    unmount() {
      const { webGlobe, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
      let find = window.CesiumZondy.IgsTerrainManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        let terrains = find.source;
        if (!viewer.isDestroyed() && terrains) {
          terrains.forEach((l) => {
            l.destroy && l.destroy();
          });
          webGlobe.deleteTerrain();
          // viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
        }
      }
      window.CesiumZondy.IgsTerrainManager.deleteSource(vueKey, vueIndex);
    },
  },
  render(h) {
    return h("span", {
      class: "mapgis-3d-igs-terrain",
      ref: "m3d",
    });
  },
};
</script>
