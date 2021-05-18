<template>
  <span />
</template>

<script>
import VueOption from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    layer: Object,
    layerIndex: Number,
    url: { type: String, required: true },
    wmtsLayer: { type: String, required: true },
    tileMatrixSet: { type: String, required: true },
    tilingScheme: { type: String, required: true },
    wmtsStyle: { type: String, default: "default" },
    format: { type: String, default: "image/png" },
    version: { type: String, default: "1.0.0" },
    tileMatrixLabels: { type: Array},
    show: { type: Boolean },
    options: {
      type: Object,
      default: () => {
        return {}
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
  watch: {
    wmtsLayer:{
      handler:function () {
        this.unmount();
        this.mount();
      }
    },
    tileMatrixSet:{
      handler:function () {
        this.unmount();
        this.mount();
      }
    },
    tilingScheme:{
      handler:function () {
        this.unmount();
        this.mount();
      }
    },
    wmtsStyle:{
      handler:function () {
        this.unmount();
        this.mount();
      }
    },
    version:{
      handler:function () {
        this.unmount();
        this.mount();
      }
    },
    show: {
      handler:function () {
        let { vueKey, vueIndex } = this;
        let layer = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
        layer.source.show = this.show;
      }
    }
  },
  methods: {
    createCesiumObject () {
      const { url, options = {} } = this;
      const { headers } = options;

      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({ url: url, headers: headers });
      } else {
        urlSource = url;
      }

      let wmtsOpt = {},vm = this;
      Object.keys(this.$props).forEach(function (key) {
        if(key !== "options"){
          if(key === "tileMatrixSet"){
            wmtsOpt["tileMatrixSetID"] = vm.$props[key];
          }else if(key === "wmtsLayer"){
            wmtsOpt["layer"] = vm.$props[key];
          }else if(key === "wmtsStyle"){
            wmtsOpt["style"] = vm.$props[key];
          }else {
            wmtsOpt[key] = vm.$props[key];
          }
        }
      });
      let opt = { ...options, ...wmtsOpt };
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
      console.log("opt",opt)
      return new Cesium.WebMapTileServiceImageryProvider(opt);
    },
    mount () {
      const { webGlobe, options, vueIndex, vueKey, layerIndex } = this;
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      const { saturation, hue } = options;
      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = this.createCesiumObject();
      let imageLayer = imageryLayers.addImageryProvider(provider, layerIndex);
      if (saturation !== undefined) {
        imageLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageLayer.hue = hue;
      }

      window.CesiumZondy.OGCWMTSManager.addSource(vueKey, vueIndex, imageLayer);

      this.$emit("load", this.layer, this);
    },
    unmount () {
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
