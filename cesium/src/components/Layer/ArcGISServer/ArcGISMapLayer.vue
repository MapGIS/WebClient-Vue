<template>
  <span></span>
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { ArcGISMapImageLayer } from "@mapgis/webclient-common";

export default {
  name: "mapgis-3d-arcgis-map-layer",
  props: {
    srs: {
      type: String,
      defalut: "EPSG:4326",
    },
    layers: {
      type: String,
    },
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
      providerName: "ArcGISMapServerImageryProvider",
    };
  },
  mixins: [ServiceLayer],
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    srs: {
      handler: function () {
        this.updateLayer();
      },
    },
    layers: {
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
      const { baseUrl, options, token } = this;
      let { layers } = this;

      const { viewer } = this;
      // 如果是一张图出图，那么providerName为ArcGISMapServer一张图出图provider
      if (this.renderMode && this.renderMode === "image-map") {
        this.providerName = "ArcGISMapServerSingleImageryProvider";
      }

      const extensionOptions = JSON.parse(
        JSON.stringify(this.options?.extensions || {})
      );

      if (layers && layers !== "") {
        extensionOptions.layers = layers;
      }

      if (this.renderMode && this.renderMode === "raster") {
        // 不使用瓦片缓存，部分服务可能没有开启瓦片服务，比如IGS转发的ArcGIS服务
        extensionOptions.usePreCachedTilesIfAvailable = false;
      }

      const paramOptions = {
        url: baseUrl,
        renderMode: "image",
        extent: options.rectangle || null,
        extensionOptions,
      };

      if (token.key && token.value) {
        paramOptions.tokenKey = token.key;
        paramOptions.tokenValue = token.value;
      }

      const arcGISMapImageLayer = new ArcGISMapImageLayer(paramOptions);
      this.$_loadCommonLayer(arcGISMapImageLayer);
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>

<style scoped></style>
