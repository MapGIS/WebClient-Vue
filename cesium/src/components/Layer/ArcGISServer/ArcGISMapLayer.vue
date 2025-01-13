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
        // 防止初始化的时候，图层被多次加载，图层未加载成功时，不执行
        const { vueIndex, vueKey, vueCesium } = this;
        const find = vueCesium[this.managerName].findSource(vueKey, vueIndex);
        if (!find) {
          return;
        }
        this.unmount();
        this.mount();
      },
    },
    layers: {
      handler: function () {
        // 防止初始化的时候，图层被多次加载，图层未加载成功时，不执行
        const { vueIndex, vueKey, vueCesium } = this;
        const find = vueCesium[this.managerName].findSource(vueKey, vueIndex);
        if (!find) {
          return;
        }
        this.unmount();
        this.mount();
      },
    },
  },
  methods: {
    mount() {
      const { viewer } = this;

      let { layers } = this;
      if (layers) {
        if (layers.indexOf("show") >= 0) {
          layers = this.layers.replace("show:", "");
        }
      }

      const options = this.$_getOptions();
      // 创建ArcGIS地图图层对象
      const arcgisMapImageLayer = new ArcGISMapImageLayer({
        url: this.baseUrl,
        ...this.options,
      });
      const vm = this;
      // 获取ArcGIS地图服务的元信息
      arcgisMapImageLayer.load().then(async (layer) => {
        // 获取provider的初始化参数
        const cesiumOptions = initializeOptions(layer, viewer);
        if (layers) {
          cesiumOptions.layers = layers;
        }
        // 不使用瓦片缓存，部分服务可能没有开启瓦片服务，比如IGS转发的ArcGIS服务
        cesiumOptions.usePreCachedTilesIfAvailable = false;
        // 构造provider对象
        const provider =
          await zondy.cesium.ArcGISMapServerImageryProvider.fromUrl(
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
