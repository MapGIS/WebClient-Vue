<template>
  <span />
</template>

<script>
export default {
  name: "cesium-ogcwmts-provider",
  inject: ["Cesium", "webGlobe"],
  props: {
    layer: Object,
    index: { type: Number, default: 0 },
    url: { type: String, required: true },
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
      window.Zondy.OGCWMTSManager = window.Zondy.OGCWMTSManager || [[], []];
      return new Cesium.WebMapTileServiceImageryProvider({
        ...options,
        url: url,
      });
    },
    mount() {
      const { webGlobe, options, layer } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = this.createCesiumObject();
      let imageLayer = imageryLayers.addImageryProvider(provider);

      if (!window.Zondy.OGCWMTSManager[this.index]) {
        window.Zondy.OGCWMTSManager[this.index] = [];
      }
      window.Zondy.OGCWMTSManager[this.index].push({
        key: layer.key,
        imageLayer: imageLayer,
      });
      this.$emit("load", this.layer, this);
    },
    unmount() {
      let { webGlobe } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      let find = this.findProvider();
      imageryLayers.remove(find.imageLayer, true);
      delete window.Zondy.OGCWMTSManager[this.index][find.index];
      this.$emit("unload", this.layer, this);
    },
    findProvider() {
      let index = -1;
      let { layer } = this;
      let find = window.Zondy.OGCWMTSManager[this.index].find((s, i) => {
        let result = false;
        if (s && layer && s.key === layer.key) {
          index = i;
          result = true;
        }
        return result;
      });
      let imageLayer = find ? find.imageLayer : undefined;
      return { index: index, imageLayer: imageLayer };
    },
  },
};
</script>
