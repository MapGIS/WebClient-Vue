<template>
  <span />
</template>

<script>
import VueOption from "../../Base/Vue/VueOptions";
import { OGC } from '@mapgis/webclient-es6-service';

export default {
  name: "mapgis-3d-ogc-wms-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    layers: { type: String },
    url: { type: String, required: true },
    options: {
      type: Object,
      default: () => {
        return {};
      }
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
    async createCesiumObject () {
      let { url, layers, options = {} } = this;
      const { headers } = options;

      let urlSource = undefined;
      let wms = new OGC.WMS({ url: url })
      if (wms.isBaseUrl()) {
        let json = await wms.getCapabilities();
        layers = json.WMT_MS_Capabilities.Capability.Layer.Layer.map(l => l.Name);
      }

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
        } else if (opt.tilingScheme === "EPSG:3857") {
          opt.tilingScheme = new Cesium.WebMercatorTilingScheme();
        } else if (opt.tilingScheme) {
          opt.tilingScheme = opt.tilingScheme;
        } else {
          opt.tilingScheme = new Cesium.GeographicTilingScheme();
        }
      }
      return new Cesium.WebMapServiceImageryProvider(opt);
    },
    async mount () {
      const { webGlobe, options, vueIndex, vueKey } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      const { saturation, hue } = options;
      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = await this.createCesiumObject();
      let imageLayer = imageryLayers.addImageryProvider(provider);
      if (saturation !== undefined) {
        imageLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageLayer.hue = hue;
      }

      window.CesiumZondy.OGCWMSManager.addSource(vueKey, vueIndex, imageLayer);

      this.$emit("load", this.layer, this);
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
