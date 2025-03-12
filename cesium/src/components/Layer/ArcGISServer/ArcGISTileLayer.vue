<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { ArcGISTileLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
  props: {
    srs: {
      type: String,
      default: "EPSG:4326",
    },
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      managerName: "ArcgisManager",
    };
  },
  inject: ["Cesium", "vueCesium"],
  mixins: [ServiceLayer],
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      const { viewer } = this;

      const options = this.$_getOptions();
      // 创建ArcGIS瓦片图层对象
      const arcgisTileLayer = new ArcGISTileLayer({
        url: this.baseUrl,
        ...options,
      });
      const vm = this;
      // 获取ArcGIS瓦片服务的元信息
      arcgisTileLayer.load().then(async (layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        // 构造provider对象
        const provider =
          await zondy.cesium.ArcGISTileServerImageryProvider.fromUrl(
            vm.baseUrl,
            cesiumOptions
          );
        vm.$_mount(provider, options);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>

<style scoped></style>
