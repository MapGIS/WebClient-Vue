<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { IGSMapImageLayer, SpatialReference } from "@mapgis/webclient-common";

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
        this.unmount();
        this.mount();
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
    mount() {
      const baseUrl = this.$_initUrl("/igs/rest/mrms/docs/");
      if (this.renderMode && this.renderMode === "image-map") {
        let wkid = "4326";
        if (this.srs && this.srs.includes("EPSG")) {
          wkid = this.srs.split("EPSG:")[1];
        }
        const { viewer, layers } = this;
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
        const igsMapImageLayer = new IGSMapImageLayer({
          url: baseUrl,
          renderMode: "image",
          spatialReference: new SpatialReference({ wkid }),
          sublayers,
        });
        const self = this;
        igsMapImageLayer.load().then((layer) => {
          // 获取provider的初始化参数
          const options = zondy.cesium.util.initializeOptions(layer, viewer);
          self.$_mount(options);
        });
      } else {
        //处理独有参数
        const tilingScheme = this.$_setTilingScheme(this.srs);
        this.$_mount({
          baseUrl: baseUrl,
          tilingScheme: tilingScheme,
          layers: this.layers,
        });
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
