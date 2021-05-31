<template>
  <div></div>
</template>
<script>
import {EchartsLayer} from "./echarts/EchartsLayer";

export default {
  name: "mapgis-3d-echarts-layer",
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          cesium: {
            roam: true
          },
          series: [{
            // 坐标系
            coordinateSystem: 'cesium',
            type: 'lines'
          }]
        }
      }
    }
  },
  inject: ["Cesium", "webGlobe"],
  methods: {
    createCesiumObject() {
      const {webGlobe} = this;
      const viewer = webGlobe.viewer;
      return new EchartsLayer(viewer, this.options);
    },
    watchProp() {
      this.$watch("options", {
        handler(next){
          if (!this.echartsLayer) {
            return;
          }
          // this.echartsLayer.update(next);
        },
        deep:true,
        immediate:true
      })
    },
    mount() {
      const {webGlobe} = this;
      const viewer = webGlobe.viewer;
      this.echartsLayer = this.createCesiumObject();
      this.echartsLayer.addTo(viewer);
    },
    unmount() {
      const {webGlobe, echartsLayer} = this;
      const viewer = webGlobe.viewer;
      return !viewer.isDestroyed() && echartsLayer.remove();
    }
  },
  created() {
    this.mount();
    this.watchProp();
  },
  destroyed() {
    this.unmount();
  }
};
</script>
