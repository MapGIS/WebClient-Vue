<template>
  <span/>
</template>

<script>
import VueOption from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    url: {type: String, required: true},
    layer: {type: String, required: true},
    tileMatrixSet: {type: String, required: true, default: ""},
    wmtsStyle: {type: String, default: "default"},
    tileWidth: {type: Number, default: 256},
    tileHeight: {type: Number, default: 256},
    tileMatrixLabels: {
      type: Array, default: function () {
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      }
    },
    show: {type: Boolean, default: true},
    layerIndex: Number,
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    ...VueOption,
  },
  data() {
    return {};
  },
  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    url: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layer: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    tileMatrixSet: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    wmtsStyle: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    show: {
      handler: function () {
        let {vueKey, vueIndex} = this;
        let layer = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
        layer.source.show = this.show;
      }
    }
  },
  methods: {
    createCesiumObject() {
      const {url, options = {}} = this;
      const {headers} = options;

      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({url: url, headers: headers});
      } else {
        urlSource = url;
      }

      //将部分参数转为Cesium自己的参数
      let wmtsOpt = {}, vm = this;
      Object.keys(this.$props).forEach(function (key) {
        if (key !== "options") {
          if (key === "tileMatrixSet") {
            wmtsOpt["tileMatrixSetID"] = vm.$props[key];
          } else if (key === "wmtsLayer") {
            wmtsOpt["layer"] = vm.$props[key];
          } else if (key === "wmtsStyle") {
            wmtsOpt["style"] = vm.$props[key];
          } else {
            wmtsOpt[key] = vm.$props[key];
          }
        }
      });
      let opt = {...options, ...wmtsOpt};

      //如果tileMatrixSetID存在，则生成tilingScheme对象，动态投影会用到
      if (opt.tileMatrixSetID) {
        opt.tilingScheme = opt.tileMatrixSetID
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
      return new Cesium.WebMapTileServiceImageryProvider(opt);
    },
    mount() {
      const {webGlobe, options, vueIndex, vueKey, layerIndex} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      const {saturation, hue} = options;
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
      let layer = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
      this.$emit("load",layer, this);
    },
    unmount() {
      let {webGlobe, vueKey, vueIndex} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      let find = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      window.CesiumZondy.OGCWMTSManager.deleteSource(vueKey, vueIndex);

      this.$emit("unload", this);
    },
  },
};
</script>
