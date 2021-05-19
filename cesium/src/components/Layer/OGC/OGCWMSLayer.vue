<template>
  <span/>
</template>

<script>
import VueOption from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-ogc-wms-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    url: {type: String, required: true},
    layers: {type: String, required: true},
    crs: {type: String},
    srs: {type: String},
    tileWidth: {type: Number, default: 256},
    tileHeight: {type: Number, default: 256},
    show: {type: Boolean, default: true},
    layerIndex: Number,
    options: {
      type: Object,
      default: () => {
        return {};
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
    layers: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    srs: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    crs: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    wmsStyle: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    show: {
      handler: function () {
        let {vueKey, vueIndex} = this;
        let layer = window.CesiumZondy.OGCWMSManager.findSource(vueKey, vueIndex);
        layer.source.show = this.show;
      }
    }
  },
  methods: {
    async createCesiumObject() {
      let {url, layers, options = {}} = this;
      const {headers} = options;

      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({url: url, headers: headers});
      } else {
        urlSource = url;
      }

      //将部分参数转为Cesium自己的参数
      let wmsOpt = {}, vm = this;
      Object.keys(this.$props).forEach(function (key) {
        if (key !== "options") {
          if (key === "wmsStyle") {
            wmsOpt["styles"] = vm.$props[key];
          } else {
            wmsOpt[key] = vm.$props[key];
          }
        }
      });

      let opt = {...options, ...wmsOpt};
      //如果srs或crs存在，则生成tilingScheme对象，动态投影会用到
      if (opt.srs || opt.crs) {
        opt.tilingScheme = opt.srs ? opt.srs : opt.crs;
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
    async mount() {
      const {webGlobe, options, vueIndex, vueKey, layerIndex} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      const {saturation, hue} = options;
      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = await this.createCesiumObject();
      let imageLayer = imageryLayers.addImageryProvider(provider, layerIndex);
      if (saturation !== undefined) {
        imageLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageLayer.hue = hue;
      }

      window.CesiumZondy.OGCWMSManager.addSource(vueKey, vueIndex, imageLayer);
      let layer = window.CesiumZondy.OGCWMSManager.findSource(vueKey, vueIndex);
      this.$emit("load", layer, this);
    },
    unmount() {
      let {webGlobe, vueKey, vueIndex} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      let find = window.CesiumZondy.OGCWMSManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      window.CesiumZondy.OGCWMSManager.deleteSource(vueKey, vueIndex);

      this.$emit("unload", this);
    }
  }
};
</script>
