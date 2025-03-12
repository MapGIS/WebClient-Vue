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
  watch: {
    layers: {
      handler: function () {
        this.updateLayer();
      },
    },
    styles: {
      handler: function () {
        this.updateLayer();
      },
    },
    srs: {
      handler: function () {
        this.updateLayer();
      },
    },
  },
  methods: {
    // 防止图层被多次添加
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
      if (this.renderMode && this.renderMode === "image-map") {
        const { viewer, baseUrl, layers, styles, transparent } = this;
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
          renderMode: "image",
          // 设置子图层属性，可选项
          sublayers,
          styles: styles,
          imageTransparency: transparent,
        });
        const self = this;
        wmsLayer.load().then((layer) => {
          // 获取provider的初始化参数
          const options = initializeOptions(layer, viewer);
          self.$_mount(options);
        });
      } else {
        let { srs } = this;
        let opt = {};
        //处理独有参数
        //如果srs或crs存在，则生成tilingScheme对象，动态投影会用到
        if (srs) {
          opt.tilingScheme = this.$_setTilingScheme(srs);
        }
        opt.parameters = {
          transparent: this.transparent,
          format: this.format,
          version: this.version,
          styles: this.styles,
          layers: this.layers,
        };
        this.$_mount(opt);
      }
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
