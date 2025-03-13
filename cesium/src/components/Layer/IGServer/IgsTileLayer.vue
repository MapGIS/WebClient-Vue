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
      //处理独有参数
      const { viewer } = this;
      const baseUrl = this.$_initUrl("/igs/rest/mrms/tile");
      const srsCode = this.tilingScheme.split(":")[1];
      // 创建瓦片图层对象
      const igsTileLayer = new IGSTileLayer({
        url: baseUrl,
        // IGS1.0暂时无法从元信息中获取坐标系，需自行指定图层坐标系
        spatialReference: new SpatialReference({
          wkid: srsCode,
        }),
      });
      const vm = this;
      // 获取瓦片图层服务的元信息
      igsTileLayer.load().then((layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
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
