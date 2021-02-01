<template>
  <span />
</template>

<script>
import xml from 'fast-xml-parser';
import VueOption from "../../Base/Vue/VueOptions";

export default {
  name: "zondy-3d-ogc-wms-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    layers: { type: String, default: '0' },
    url: { type: String, required: true },
    options: {
      type: Object,
    },
    ...VueOption,
  },
  data () {
    return {};
  },
  created () { },
  mounted () {
    this.mount();
  },
  destroyed () {
    this.unmount();
  },
  watch: {},
  methods: {
    createCesiumObject () {
      const { url, layers, options = {} } = this;
      const { headers } = options;

      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({ url: url, headers: headers });
      } else {
        urlSource = url;
      }

      let opt = { ...options, url: urlSource, layers: layers };
      if (opt.tilingScheme) {
        if (
          opt.tilingScheme === "EPSG:4326" ||
          opt.tilingScheme === "EPSG:4490" ||
          opt.tilingScheme === "EPSG:4610" ||
          opt.tilingScheme === "EPSG:4214"
        ) {
          opt.tilingScheme = new Cesium.GeographicTilingScheme();
        } else if (opt.tilingScheme) {
          opt.tilingScheme = opt.tilingScheme;
        } else {
          opt.tilingScheme = new Cesium.WebMercatorTilingScheme();
        }
      }
      return new Cesium.WebMapServiceImageryProvider(opt);
    },
    mount () {
      const { webGlobe, options, vueIndex, vueKey } = this;
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

      window.CesiumZondy.OGCWMSManager.addSource(vueKey, vueIndex, imageLayer);

      this.$emit("load", this.layer, this);
      let tObj = xml.getTraversalObj(xmlData,options);
      let jsonObj = xml.convertToJson(tObj,options);
    },
    unmount () {
      let { webGlobe, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      let find = window.CesiumZondy.OGCWMSManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      window.CesiumZondy.OGCWMSManager.deleteSource(vueKey, vueIndex);

      this.$emit("unload", this.layer, this);
    }
  }
};
</script>
