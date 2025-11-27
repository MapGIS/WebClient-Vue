<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";
import { IGSTileLayer, SpatialReference } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";

export default {
  name: "mapgis-3d-igs-tile-layer",
  mixins: [ServiceLayer],
  props: {
    tilingScheme: {
      type: String,
      default: "EPSG:4326",
    },
  },
  data() {
    return {
      managerName: "IgsTilecLayerManager",
      providerName: "MapGISTileServerImageryProvider",
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
    mount() {
      // 当commonLayer存在时，使用commonLayer构造图层，否则按照原始逻辑构造图层
      if (this.commonLayer) {
        return
      }
      //处理独有参数
      const { viewer } = this;
      const baseUrl = this.$_initUrl("/igs/rest/mrms/tile");
      const srsCode = this.tilingScheme.split(":")[1];
      // 创建瓦片图层对象
      const igsTileLayer = new IGSTileLayer({
        url: baseUrl,
        extensionOptions: this.options?.extensions
          ? this.options.extensions
          : {},
      });
      const vm = this;
      // 获取瓦片图层服务的元信息
      igsTileLayer.load().then((layer) => {
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
        vm.$_mount(cesiumOptions);
      });
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
