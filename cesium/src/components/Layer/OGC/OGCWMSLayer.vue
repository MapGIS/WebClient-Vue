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
      providerName: "WebMapServiceImageryProvider",
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
        this.updateLayer();
      },
      deep: true,
    },
  },
  methods: {
    // 防止初始化的时候，图层被多次加载，图层未加载成功时，不执行
    updateLayer() {
      const { vueKey, vueIndex } = this;
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
    mount() {
      const { viewer, baseUrl, layers, styles, transparent, version } = this;
      const sublayers = [];
      if (layers) {
        const showLayerIds = layers.split(",");
        for (let i = 0; i < showLayerIds.length; i++) {
          if (showLayerIds[i] && showLayerIds[i] !== "") {
            sublayers.push({
              id: showLayerIds[i],
              visible: true,
            });
          }
        }
      }
      const wmsLayer = new WMSLayer({
        url: baseUrl,
        renderMode: this.renderMode == "map-image" ? "image" : "tile",
        // 设置子图层属性，可选项
        sublayers,
        styles: styles,
        imageTransparency: transparent,
        version,
      });
      const self = this;
      wmsLayer.load().then((layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        this.$_mount(cesiumOptions);
      });
      // 如果是一张图出图，那么providerName为wms一张图出图provider
      if (this.renderMode && this.renderMode === "image-map") {
        this.providerName = "WebMapServiceSingleImageryProvider";
      }
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
