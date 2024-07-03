<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-web-tile-layer",
  props: {
    baseUrl: {
      type: String,
      default: ""
    },
    spatialReference: {
      type: Object,
      default: () => {}
    },
    srs: {
      type: String,
      default: "EPSG:4326"
    }
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        vueKey: "string",
        vueIndex: "string | Number"
      },
      managerName: "WebTileManager",
      // providerName: "BaiduImageryProvider", //cesium调用的类名
      providerName: "UrlTemplateImageryProvider"
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
      let options = {};
      if (this.$props.spatialReference) {
        // 构造CustomTilingScheme
        options.tilingScheme = this.$_setTilingScheme(
          this.$props.spatialReference.wkid
        );
      }
      this.$_mount(options);
    },
    unmount() {
      this.$_unmount();
    }
  }
};
</script>

<style scoped></style>
