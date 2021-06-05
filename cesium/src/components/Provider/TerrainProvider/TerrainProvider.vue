<template>
  <span />
</template>

<script>
import VueOptions from '../../Base/Vue/VueOptions';

export default {
  name: "mapgis-3d-terrain-provider",
  inject: ["Cesium", "webGlobe"],
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
      const { webGlobe, options, layer, vueIndex, vueKey } = this;
      const { viewer } = webGlobe;
      const { dataSources } = viewer;
      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = this.createCesiumObject();
      webGlobe.viewer.terrainProvider = provider;

      if (vueKey && vueIndex) {
        window.CesiumZondy.Tileset3DManager.addSource(
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
      let find = window.CesiumZondy.Tileset3DManager.findSource(
        vueKey,
        vueIndex
      );
      window.CesiumZondy.Tileset3DManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this.layer, this);
    },
  },
};
</script>
