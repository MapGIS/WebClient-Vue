<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { ArcGISTileLayer } from "@mapgis/webclient-common";
import {
  getTilingScheme,
  initializeOptions,
} from "@mapgis/webclient-cesium-plugin";

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
      providerName: "UrlTemplateImageryProvider",
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
      const { viewer, token } = this;
      const { options } = this;

      const paramOptions = {
        url: this.baseUrl,
        extent: options.rectangle || null,
        extensionOptions: this.options?.extensions
          ? this.options.extensions
          : {},
      };

      if (token?.key && token?.value) {
        paramOptions.tokenKey = token.key;
        paramOptions.tokenValue = token.value;
      }

      /*
       * fix(29802): JJ-PTSYB-.net IGS发布的WMTS服务加载失败
       * 修改说明: 加载ArcGIS瓦片，使用common的ArcGISTileLayer计算tilingScheme和url，providerName由ArcGisMapServerImageryProvider改为UrlTemplateImageryProvider
       * 版权所有: 武汉中地数码科技有限公司
       * 修改人: 龚跃健 2025-11-21
       */

      // 创建ArcGIS瓦片图层对象
      const arcgisTileLayer = new ArcGISTileLayer(paramOptions);
      const vm = this;
      // 获取ArcGIS瓦片服务的元信息
      arcgisTileLayer.load().then((layer) => {
        if (!layer.loaded) {
          return;
        }
        const cesiumOptions = initializeOptions(layer);
        options.tilingScheme = cesiumOptions.tilingScheme;
        options.url = cesiumOptions.url;
        this.$_mount(options);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>

<style scoped></style>
