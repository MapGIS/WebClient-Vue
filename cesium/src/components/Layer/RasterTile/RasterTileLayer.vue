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
      const { offset } = this.$props.options;
      let tag;
      if (baseUrl.includes("{") && baseUrl.includes("}/")) {
        const urlStrs = baseUrl.split("{");
        tag = urlStrs[1].split("}/")[0];
      }
      if (tag && offset) {
        options.customTags = {};
        options.customTags[tag] = function(imageryProvider, x, y, level) {
          return level - offset;
        };
        //如果crs不存在，则默认生成4326的tilingScheme对象
        if (!crs) {
          options.tilingScheme = this.$_setTilingScheme("EPSG:4326");
        }
      }
      let tempBaseUrl = baseUrl;
      if (baseUrl.includes("format=")) {
        const urlStrs = baseUrl.split("format=");
        const strChilds = urlStrs[1].split("&");
        if (
          options.hasOwnProperty("extensions") &&
          options.extensions.length > 0
        ) {
          options.extensions.push({
            key: "format",
            value: strChilds[0]
          });
        } else {
          options.extensions = [{ key: "format", value: strChilds[0] }];
        }
        tempBaseUrl = urlStrs[0] + strChilds[1];
      }
      // options.minimumLevel = -2;
      const allOptions = { ...options, baseUrl: tempBaseUrl };

      this.$_mount(allOptions);
    },
    unmount() {
      this.$_unmount();
    }
  }
};
</script>
