<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";
import { WMSLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";

export default {
  name: "mapgis-3d-ogc-wms-layer",
  inject: ["Cesium", "viewer"],
  mixins: [ServiceLayer],
  props: {
    layers: { type: String, required: true },
    styles: { type: String, default: "" },
    // crs: { type: String },
    srs: { type: String },
    format: { type: String, default: "image/png" },
    transparent: { type: Boolean, default: true },
    version: { type: String, default: "1.1.1" },
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
        enablePickFeatures: "boolean",
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
      const { layers, styles, srs } = this;
      return { layers, styles, srs };
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
      // 创建WMS图层对象
      const wmsLayer = new WMSLayer({
        url: this.baseUrl,
        ...this.options,
      });
      const vm = this;
      // 获取WMS图层服务的元信息
      wmsLayer.load().then((layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        if (vm.layers) {
          cesiumOptions.layers = vm.layers;
        }
        // 构造provider对象
        const provider = new Cesium.WebMapServiceImageryProvider(cesiumOptions);
        vm.$_mount(provider, options);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
