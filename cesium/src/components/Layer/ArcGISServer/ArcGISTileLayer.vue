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
      providerName: "ArcGISTileServerImageryProvider",
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
      // 当commonLayer存在时，使用commonLayer构造图层，否则按照原始逻辑构造图层
      if (this.commonLayer) {
        return
      }
      const { viewer, options, token } = this;

      const paramOptions = {
        url: this.baseUrl,
        extent: options.rectangle || null,
        extensionOptions: this.options?.extensions
          ? this.options.extensions
          : {},
      };

      if (token.key && token.value) {
        paramOptions.tokenKey = token.key;
        paramOptions.tokenValue = token.value;
      }

      // 创建ArcGIS瓦片图层对象
      const arcgisTileLayer = new ArcGISTileLayer(paramOptions);
      const vm = this;
      // 获取ArcGIS瓦片服务的元信息
      arcgisTileLayer.load().then((layer) => {
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
};
</script>

<style scoped></style>
