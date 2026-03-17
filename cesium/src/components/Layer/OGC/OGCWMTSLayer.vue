<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";
import { WMTSLayer } from "@mapgis/webclient-common";

export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "viewer"],
  mixins: [ServiceLayer],
  props: {
    wmtsLayer: { type: String },
    tileMatrixSet: { type: String, default: "" },
    wmtsStyle: { type: String, default: "default" },
    // tilingScheme: { type: String, required: true },
    format: { type: String, default: "image/png" },
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
  computed: {
    watchList() {
      const { wmtsLayer, tileMatrixSet, tilingScheme, wmtsStyle } = this;
      return { wmtsLayer, tileMatrixSet, tilingScheme, wmtsStyle };
    },
  },
  watch: {
    watchList: {
      handler: function (next, old) {
        if (JSON.stringify(next) === JSON.stringify(old)) {
          return;
        }
        // 防止初始化的时候，图层被多次加载，图层未加载成功时，不执行
        const { vueIndex, vueKey } = this;
        const find = window.vueCesium[this.managerName].findSource(
          vueKey,
          vueIndex
        );
        if (!find) {
          return;
        }
        this.unmount();
        this.mount();
      },
      deep: true,
    },
  },
  methods: {
    mount() {
      // 只有当baseUrl存在时，才进行原始图层添加的逻辑，当baseUrl不存在时，有可能是仅初始化图层或者通过sourceLayer来添加图层
      if (!this.baseUrl) {
        return;
      }
      const { viewer } = this;
      const { tileMatrixSet, wmtsStyle, format, options, token } = this;
      const activeWMTSLayer = this.wmtsLayer;
      // 创建WMTS图层对象
      const paramOptions = {
        url: this.baseUrl,
        extent: null,
        extensionOptions: this.options?.extensions
          ? this.options.extensions
          : {},
        activeLayer: {
          id: activeWMTSLayer,
          tileMatrixSetId: tileMatrixSet,
          styleId: wmtsStyle,
          imageFormat: format,
        },
      };
      if (token.key && token.value) {
        paramOptions.tokenKey = token.key;
        paramOptions.tokenValue = token.value;
      }
      const wmtsLayer = new WMTSLayer(paramOptions);
      this.$_loadCommonLayer(wmtsLayer);
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
