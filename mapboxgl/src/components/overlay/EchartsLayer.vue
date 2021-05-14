<template>
  <div></div>
</template>
<script>
import {EchartsLayer} from "./echarts/EchartsLayer";

export default {
  name: "mapgis-echarts",
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          mapboxgl: {
            roam: true
          },
          series: [{
            // 坐标系
            coordinateSystem: 'mapboxgl',
            type: 'lines'
          }]
        }
      }
    }
  },
  inject: ["mapbox", "map"],
  methods: {
    createMapboxObject() {
      const {map} = this;
      return new EchartsLayer(map, this.options);
    },
    watchProp() {
      this.$watch("options", {
        handler(next){
          if (!this.echartsLayer) {
            return;
          }
          this.echartsLayer.update(next);
        },
        deep:true,
        immediate:true
      })
    },
    mount() {
      this.echartsLayer = this.createMapboxObject();
      this.echartsLayer.addTo(this.map);
    },
    unmount() {
      const {webGlobe, echartsLayer} = this;
      const viewer = webGlobe.viewer;
      return !viewer.isDestroyed() && echartsLayer.destroy();
    }
  },
  created() {
    this.mount();
    this.watchProp();
  }
};
</script>
