<template>
  <span/>
</template>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-ogc-wms-layer",
  inject: ["Cesium", "webGlobe"],
  mixins: [ServiceLayer],
  props: {
    layers: {type: String, required: true},
    styles: {type: String},
    crs: {type: String},
    srs: {type: String}
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        parameters: "object",
        getFeatureInfoParameters: "object",
        enablePickFeatures: "object",
        getFeatureInfoFormats: "array",
        rectangle: "object",
        tilingScheme: "object",
        ellipsoid: "object",
        tileWidth: "number",
        tileHeight: "number",
        minimumLevel: "number",
        maximumLevel: "number",
        credit: "object|String",
        subdomains: "string|array",
        clock: "object",
        times: "object",
        proxy: "object",
        vueKey: "string",
        vueIndex: "string|number",
      },
      managerName: "OGCWMSManager",
      providerName: "WebMapServiceImageryProvider",
    };
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
    styles: {
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
    }
  },
  methods: {
    mount() {
      let { srs,crs } = this;
      let opt = {};
      //处理独有参数
      //如果srs或crs存在，则生成tilingScheme对象，动态投影会用到
      if (srs || crs) {
        let tileMatrixSetName = srs ? srs : crs;
        options.tilingScheme = this.$_setTilingScheme(tileMatrixSetName);
      }
      this.$_mount(opt);
    },
    unmount() {
      this.$_unmount();
    }
  }
};
</script>
