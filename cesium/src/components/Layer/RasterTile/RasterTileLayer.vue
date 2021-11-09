<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-rastertile-layer",
  inject: ["Cesium", "viewer", "vueCesium"],
  mixins: [ServiceLayer],
  props: {
    crs: {
      type: String,
      defalut: "EPSG:4326"
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
        vueIndex: "string | Number"
      },
      managerName: "RasterManager",
      providerName: "UrlTemplateImageryProvider"
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      const { $props } = this;
      const provider = new Cesium.UrlTemplateImageryProvider($props);
      return new Cesium.ImageryLayer(provider);
    },
    mount() {
      const { crs, baseUrl } = this;
      //先处理相关参数：
      let options = {};
      //如果crs存在，则生成tilingScheme对象
      if (crs) {
        options.tilingScheme = this.$_setTilingScheme(crs);
      }
      const allOptions = { ...options, baseUrl };

      this.$_mount(allOptions);
    },
    unmount() {
      this.$_unmount();
    }
  }
};
</script>
