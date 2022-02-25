<template>
  <span />
</template>

<script>
import RasterLayer from "../RasterLayer";
export default {
  name: "mapgis-3d-raster-layer",
  mixins: [RasterLayer],
  props: {
    baseUrl: {
      type: String,
      default: null
    }
  },
  methods: {
    createCesiumObject() {
      const { $props, baseUrl } = this;
      let opt = $props;
      if (baseUrl) {
        opt = { ...$props, url: baseUrl };
      }
      const provider = new Cesium.UrlTemplateImageryProvider(opt);
      return new Cesium.ImageryLayer(provider);
    }
  }
};
</script>
