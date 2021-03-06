<template>
  <span />
</template>

<script>
import VueOption from "../../Base/Vue/VueOptions";

export default {
  name: "cesium-ogc-wmts-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    layer: Object,
    index: { type: Number, default: 0 },
    url: { type: String, required: true },
    options: {
      type: Object,
    },
    ...VueOption,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {},
  methods: {
    createCesiumObject() {
      const { url, options = {} } = this;
      const { headers } = options;

      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({ url: url, headers: headers });
      } else {
        urlSource = url;
      }

      let opt = { ...options, url: urlSource };
      if (opt.tilingScheme) {
        if (
          opt.tilingScheme === "EPSG:4326" ||
          opt.tilingScheme === "EPSG:4490" ||
          opt.tilingScheme === "EPSG:4610" ||
          opt.tilingScheme === "EPSG:4214"
        ) {
          opt.tilingScheme = new Cesium.GeographicTilingScheme();
        } else {
          opt.tilingScheme = new Cesium.WebMercatorTilingScheme();
        }
      }
      return new Cesium.WebMapTileServiceImageryProvider(opt);
    },
    mount() {
      const { webGlobe, options, layer, vueIndex, vueKey } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      const { saturation, hue } = options;
      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = this.createCesiumObject();
      let imageLayer = imageryLayers.addImageryProvider(provider);
      if (saturation !== undefined) {
        imageLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageLayer.hue = hue;
      }

      window.CesiumZondy.OGCWMTSManager.addSource(vueKey, vueIndex, imageLayer);

      this.$emit("load", this.layer, this);
    },
    unmount() {
      let { webGlobe, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      let find = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      window.CesiumZondy.OGCWMTSManager.deleteSource(vueKey, vueIndex);

      this.$emit("unload", this.layer, this);
    },
  },
};
</script>
