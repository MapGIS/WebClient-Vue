<template>
  <span></span>
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { ArcGISMapImageLayer } from "@mapgis/webclient-common";

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
      providerName: "ArcGisMapServerImageryProvider",
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
        this.unmount();
        this.mount();
      },
    },
    layers: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    },
  },
  methods: {
    mount() {
      const { baseUrl } = this;
      let { layers } = this;
      if (this.renderMode && this.renderMode === "image-map") {
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
          const options = zondy.cesium.util.initializeOptions(layer, viewer);
          self.$_mount(options);
        });
      } else {
        //先处理相关参数：
        let options = {};
        if (layers) {
          if (layers.indexOf("show") >= 0) {
            layers = this.layers.replace("show:", "");
          }
        }
        //存在srs，则生成tilingScheme对象
        if (this.srs) {
          options.tilingScheme = this.$_setTilingScheme(this.srs);
        }
        // 不使用瓦片缓存，部分服务可能没有开启瓦片服务，比如IGS转发的ArcGIS服务
        options.usePreCachedTilesIfAvailable = false;
        const allOptions = { ...options, layers, baseUrl };

        this.$_mount(allOptions);
      }
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>

<style scoped></style>
