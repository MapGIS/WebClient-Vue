<template>
  <span />
</template>

<script>
import VueOptions from '../../Base/Vue/VueOptions';

export default {
  name: "mapgis-3d-terrain-provider",
  inject: ["Cesium", "viewer"],
  props: {
    layer: Object,
    url: { type: [String, Object], required: true },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    ...VueOptions
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    {
    }
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {},
  methods: {
    createCesiumObject() {
      const { url, options } = this;
      return new Cesium.CesiumTerrainProvider({ ...options, url: url });
    },
    mount() {
      const { viewer, options, layer, vueIndex, vueKey } = this;
      const { dataSources } = viewer;
      window.Zondy = window.Zondy || window.vueCesium;
      let provider = this.createCesiumObject();
      viewer.terrainProvider = provider;

      if (vueKey && vueIndex) {
        window.vueCesium.Tileset3DManager.addSource(
          vueKey,
          vueIndex,
          provider
        );
      }
      this.$emit("load", this.layer, this);
    },
    unmount() {
      let { webGlobe, vueKey, vueIndex } = this;
      webGlobe.deleteTerrain();
      let find = window.vueCesium.Tileset3DManager.findSource(
        vueKey,
        vueIndex
      );
      window.vueCesium.Tileset3DManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this.layer, this);
    },
  },
};
</script>
