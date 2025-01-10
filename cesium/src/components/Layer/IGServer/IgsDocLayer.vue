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
    },
  },
  data() {
    return {
      managerName: "IgsDocLayerManager",
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
      const { viewer } = this;
      const options = this.$_getOptions();
      const baseUrl = this.$_initUrl("/igs/rest/mrms/docs/");
      const srsCode = this.srs.split(":")[1];
      // 创建地图图片图层对象
      const igsMapImageLayer = new IGSMapImageLayer({
        url: baseUrl,
        // IGS1.0暂时无法从元信息中获取坐标系，需自行指定图层坐标系
        spatialReference: new SpatialReference({
          wkid: srsCode,
        }),
        ...this.options,
      });
      const vm = this;
      // 获取地图图片图层服务的元信息
      igsMapImageLayer.load().then((layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        if (vm.layers) {
          cesiumOptions.layers = vm.layers;
        }
        if (vm.options.extensions) {
          cesiumOptions.extensions = vm.options.extensions;
        }
        // 构造provider对象
        const provider = new zondy.cesium.MapGISMapServerImageryProvider(
          cesiumOptions
        );
        vm.$_mount(provider, options);
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
