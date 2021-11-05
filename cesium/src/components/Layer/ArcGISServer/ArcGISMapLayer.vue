<template>
  <span></span>
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-arcgis-map-layer",
  props: {
    srs: {
      type: String,
      defalut:"EPSG:4326"
    },
    layers: {
      type: String
    }
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        rectangle: "object",
        tilingScheme: "object",
        ellipsoid: "object",
        tileWidth: "number",
        tileHeight: "number",
        maximumLevel: "number",
        credit: "object|String",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      managerName: "ArcgisManager",
      providerName: "ArcGisMapServerImageryProvider",
    }
  },
  mixins: [ServiceLayer],
  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    srs: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layers: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
  },
  methods: {
    initUrl() {
      if (this.baseUrl) {
        let url = this.baseUrl;
        const _url = url + "/export";
        return _url;
      }
    },
    mount() {
      //先处理相关参数：
      let options = {};
      let {layers} = this;
      if (layers) {
        if (layers.indexOf("show") >= 0 ) {
          layers = this.layers.replace("show:", "");
        }
      }
      const baseUrl = this.initUrl();
      //tilingScheme，则生成tilingScheme对象
      if (this.srs) {
        options.tilingScheme = this.$_setTilingScheme(this.srs);
      };
      const allOptions = {...options, layers, baseUrl};

      this.$_mount(allOptions);
    },
    unmount() {
      this.$_unmount();
    }
  }
}
</script>

<style scoped>

</style>