<script>
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
      var terrianlayer = new CesiumZondy.Layer.TerrainLayer({
        viewer: webGlobe.viewer,
      });
      return terrianlayer;
    },
    watchProp() {},
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
        !viewer.isDestroyed() && terrains && terrains.forEach(l => {l.destroy();})
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
