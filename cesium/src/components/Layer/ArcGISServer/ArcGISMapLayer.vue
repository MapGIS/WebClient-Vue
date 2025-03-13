<template>
  <span></span>
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { ArcGISMapImageLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";

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
      const { baseUrl } = this;
      let { layers } = this;

      const { viewer } = this;
      const sublayers = [];
      let tempLayers = layers || "";
      if (tempLayers.includes("show:")) {
        tempLayers = tempLayers.split("show:")[1];
      }
      const showLayerIds = tempLayers.split(",");
      for (let i = 0; i < showLayerIds.length; i++) {
        if (showLayerIds[i] && showLayerIds[i] !== "") {
          sublayers.push({
            id: showLayerIds[i],
            visible: true,
          });
        }
      }
      const arcGISMapImageLayer = new ArcGISMapImageLayer({
        url: baseUrl,
        renderMode: "image",
        sublayers,
      });
      const self = this;
      arcGISMapImageLayer.load().then((layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        if (this.renderMode && this.renderMode === "raster") {
          // 不使用瓦片缓存，部分服务可能没有开启瓦片服务，比如IGS转发的ArcGIS服务
          cesiumOptions.usePreCachedTilesIfAvailable = false;
        }
        self.$_mount(cesiumOptions);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>

<style scoped></style>
