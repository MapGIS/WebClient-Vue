<template>
  <div></div>
</template>

<script>
import rasterTileLayer from "./rasterTileLayer.js";

export default {
  name: "mapgis-custom-rastertile-layer",
  props: {
    layerId: {
      type: String,
      required: true,
    },
    layerType: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
    },
  },
  inject: ["mapbox", "map"],
  data() {
    return {
      features: [],
    };
  },
  watch: {},
  mounted() {
    this.$_init();
  },
  beforeDestroy() {
    this.$_destory();
  },
  methods: {
    $_init() {
      const { map, layerId, layerType, options } = this;
      if (!map) return;
      map.addLayer(rasterTileLayer(layerId, layerType, options));
    },
    $_destory() {
      const { map, layerId } = this;
      if (!map) return;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }

      if (map.getSource(layerId)) {
        map.removeSource(layerId);
      }
    },
  },
};
</script>