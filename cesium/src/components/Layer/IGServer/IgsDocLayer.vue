<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { IGSMapImageLayer, SpatialReference } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";

export default {
  name: "mapgis-3d-igs-doc-layer",
  mixins: [ServiceLayer],
  props: {
    layers: {
      type: String,
      default: null,
    },
    srs: {
      type: String,
      default: "EPSG:4326",
    },
  },
  watch: {
    layers: {
      handler: function () {
        this.updateLayer();
      },
    },
    renderMode: {
      handler: function () {
        this.updateLayer();
      },
    },
  },
  data() {
    return {
      managerName: "IgsDocLayerManager",
      providerName: "MapGISMapServerImageryProvider",
      checkType: {
        tileWidth: "number",
        tileHeight: "number",
        minimumLevel: "number",
        maximumLevel: "number",
      },
    };
  },
  mounted() {
    this.mount();
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
      const baseUrl = this.$_initUrl("/igs/rest/mrms/docs/");
      let wkid = "4326";
      if (this.srs && this.srs.includes("EPSG")) {
        wkid = this.srs.split("EPSG:")[1];
      }
      const { viewer, layers } = this;
      // 修改说明：目前common层如果没有传组图层id，则不会显示组图层及其子图层，但是一张图的layers中是排除了组图层id的，原因可以看bug(6552)
      // 这里将layers挂到extensionOptions上，不再传sublayers
      // 龚跃健-2026-1-21
      const extensionOptions = JSON.parse(JSON.stringify(this.options?.extensions || {}))
      extensionOptions.layers = layers;
      const igsMapImageLayer = new IGSMapImageLayer({
        url: baseUrl,
        renderMode: this.renderMode === "image-map" ? "image" : "tile",
        extensionOptions,
      });
      const self = this;
      igsMapImageLayer.load().then((layer) => {
        if (!layer.loaded) {
          return;
        }
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        const { rectangle } = cesiumOptions;
        if (rectangle) {
          const { west, south, east, north } = rectangle;
          // 如果范围无效，则不加载
          if (west >= east || south >= north) {
            return;
          }
        }
        self.$_mount(cesiumOptions);
      });
      // 如果是一张图出图，那么providerName为MapGISMapServer一张图出图provider
      if (this.renderMode && this.renderMode === "image-map") {
        this.providerName = "MapGISMapServerSingleImageryProvider";
      } else {
        this.providerName = "MapGISMapServerImageryProvider";
      }
    },
    unmount() {
      this.$_unmount();
    },
  },
  destroyed() {
    this.unmount();
  },
};
</script>
