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
      const { viewer } = this;
      const { tileMatrixSet, wmtsStyle, format } = this;
      const activeWMTSLayer = this.wmtsLayer;
      // 创建WMTS图层对象
      const wmtsLayer = new WMTSLayer({
        url: this.baseUrl,
      });
      const vm = this;
      // 获取WMTS图层服务的元信息
      wmtsLayer.load().then((layer) => {
        const { sublayers, tileMatrixSets, activeLayer } = layer;
        // 判断当前activeLayer的identifier是否与传入的wmtsLayer一致
        const isSameIdentifier = activeLayer.identifier === activeWMTSLayer;
        // 找到与传入的tileMatrixSetId一致的tileMatrixSet，若不存在则不处理
        const targetTileMatrixSet = tileMatrixSets.find(
          (item) => item.identifier === tileMatrixSet
        );
        // 当前activeLayer的identifier是否与传入的wmtsLayer不一致则查找sublayers中对应的activeLayer
        if (!isSameIdentifier) {
          // 查找与传入的wmtsLayer一致的sublayer
          const targetActiveLayer = sublayers.items.find(
            (item) => item.identifier === activeWMTSLayer
          );
          // 找到目标sublayer则使用targetActiveLayer作为activeLayer
          if (targetActiveLayer) {
            // 判断传入的tileMatrixSetId是否存在对应的tileMatrixSet
            if (targetTileMatrixSet) {
              targetActiveLayer.tileMatrixSetId =
                targetTileMatrixSet.identifier;
            }
            // 设置targetActiveLayer的imageFormat
            targetActiveLayer.imageFormat = format;
            // 找到与传入的wmtsStyle一致的styleId，若不存在则不处理
            const targetStyle = targetActiveLayer.styles.find(
              (item) => item.id === wmtsStyle
            );
            if (targetStyle) {
              targetActiveLayer.styleId = wmtsStyle;
            }
            layer.activeLayer = targetActiveLayer;
          } else {
            // 如果不存在与传入的wmtsLayer一致的sublayer则使用默认的activeLayer，即sublayers[0]
            if (targetTileMatrixSet) {
              activeLayer.tileMatrixSetId = targetTileMatrixSet.identifier;
            }
            // 设置activeLayer的imageFormat
            activeLayer.imageFormat = format;
            // 找到与传入的wmtsStyle一致的styleId，若不存在则不处理
            const targetStyle = activeLayer.styles.find(
              (item) => item.id === wmtsStyle
            );
            if (targetStyle) {
              activeLayer.styleId = wmtsStyle;
            }
          }
        } else {
          // activeLayer的identifier与传入的wmtsLayer一致则直接修改activeLayer
          // 设置activeLayer的tileMatrixSetId
          if (targetTileMatrixSet) {
            activeLayer.tileMatrixSetId = targetTileMatrixSet.identifier;
          }
          // 设置activeLayer的imageFormat
          activeLayer.imageFormat = format;
          // 找到与传入的wmtsStyle一致的styleId，若不存在则不处理
          const targetStyle = activeLayer.styles.find(
            (item) => item.id === wmtsStyle
          );
          if (targetStyle) {
            activeLayer.styleId = wmtsStyle;
          }
        }
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        vm.$_mount(cesiumOptions);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
