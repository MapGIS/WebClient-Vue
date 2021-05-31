<template>
  <span/>
</template>

<script>
import ServiceLayer from "../ServiceLayer";
export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "webGlobe"],
  mixins:[ServiceLayer],
  props: {
    wmtsLayer: {type: String, required: true},
    tileMatrixSet: {type: String, required: true},
    wmtsStyle: {type: String, default: "default"},
    srs: {type: String, required: true}
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        tileMatrixLabels: "array",
        clock: "object",
        times: "object",
        dimensions: "object",
        tileWidth: "number",
        tileHeight: "number",
        tilingScheme: "object",
        rectangle: "object",
        minimumLevel: "number",
        maximumLevel: "number",
        ellipsoid: "object",
        credit: "object|string",
        subdomains: "string|array",
        startLevel: "number",
        vueKey: "string",
        vueIndex: "number",
      },
      managerName: "OGCWMTSManager",
      providerName: "WebMapTileServiceImageryProvider",
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    wmtsLayer: {
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
    srs: {
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
    }
  },
  methods: {
    mount() {
      let options = {};

      //处理独有参数
      //设置wmts服务的style
      options.style = this.wmtsStyle;

      //如果srs存在，则生成tilingScheme对象
      if (this.srs) {
        options.tilingScheme = this.$_setTilingScheme(this.srs);
      }

      //处理天地图的wmts
      let checkTileMatrixLabels = this.$_checkValue(this.options, "tileMatrixLabels", "");
      if (checkTileMatrixLabels === "null" && this.srs === "EPSG:4326") {
        if(this.baseUrl.indexOf("tianditu") > -1){
          options.tileMatrixLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        }
      }

      //将wmtsLayer转为layer
      options.layer = this.wmtsLayer;

      //将tileMatrixSet转为tileMatrixSetID
      options.tileMatrixSetID = this.tileMatrixSet;

      this.$_mount(options);
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
