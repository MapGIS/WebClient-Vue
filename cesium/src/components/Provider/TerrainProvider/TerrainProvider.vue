<template>
  <span />
</template>

<script>
export default {
  name: "cesium-terrain-provider",
  inject: ["Cesium", "webGlobe"],
  props: {
    layer: Object,
    /**
     * @type String
     * @description 该key的主要作用市用来记录Cesium的Source,primitive,
     * entity的内存中的引用数组的引用，从而避免vue对cesium的内存劫持
     */
    vueKey: { typs: String, default: "default" },
    /**
     * @type String
     * @description 该key的主要作用市用来记录Cesium的Source,primitive,
     * entity的内存中的引用数组的下标，从而避免vue对cesium的内存劫持
     */
    vueIndex: {
      typs: [String, Number],
      default: (Math.random() * 10000).toFixed(0),
    },
    url: { type: [String, Object], required: true },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
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
