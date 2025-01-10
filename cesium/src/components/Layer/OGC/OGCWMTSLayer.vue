<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";
import { WMTSLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";
import debounce from "lodash/debounce";
export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "viewer"],
  mixins: [ServiceLayer],
  props: {
    wmtsLayer: { type: String, required: true },
    tileMatrixSet: { type: Object, required: true },
    wmtsStyle: { type: String, default: "default" },
    tilingScheme: { type: String, required: true },
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
      handler: function () {
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
      const { viewer } = this;
      const options = this.$_getOptions();
      // 创建WMTS图层对象
      const wmtsLayer = new WMTSLayer({
        url: this.baseUrl,
        ...this.options,
      });
      const vm = this;
      // 获取WMTS图层服务的元信息
      wmtsLayer.load().then((layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        // 构造provider对象
        const provider = new Cesium.WebMapTileServiceImageryProvider(
          cesiumOptions
        );
        vm.$_mount(provider, options);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
