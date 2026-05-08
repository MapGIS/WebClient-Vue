<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { ArcGISTileLayer } from "@mapgis/webclient-common";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
  props: {
    srs: {
      type: String,
      default: "EPSG:4326",
    },
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      managerName: "ArcgisManager",
      providerName: "ArcGISTileServerImageryProvider",
    };
  },
  inject: ["Cesium", "vueCesium"],
  mixins: [ServiceLayer],
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      // 当commonLayer存在时，使用commonLayer构造图层，否则按照原始逻辑构造图层
      if (this.commonLayer) {
        return;
      }
      const { viewer, options, token } = this;

      const paramOptions = {
        url: this.baseUrl,
        extent: options.rectangle || null,
        extensionOptions: this.options?.extensions
          ? this.options.extensions
          : {},
      };

      if (token.key && token.value) {
        paramOptions.tokenKey = token.key;
        paramOptions.tokenValue = token.value;
      }

      // 创建ArcGIS瓦片图层对象
      const arcgisTileLayer = new ArcGISTileLayer(paramOptions);
      this.$_loadCommonLayer(arcgisTileLayer);
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>

<style scoped></style>
