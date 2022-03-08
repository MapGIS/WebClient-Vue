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
  inject: ["Cesium", "viewer"],
  methods: {
    createCesiumObject() {
      const viewer = this.viewer;
      return new EchartsLayer(viewer, this.options);
    },
    watchProp() {
      this.$watch("options", {
        handler(next){
          if (!this.echartsLayer) {
            return;
          }
          this.update(next);
          // this.unmount();
          // this.mount();
        },
        deep:true,
        immediate:true
      })
    },
    update(options) {
      const {echartsLayer} = this;
      echartsLayer.update(options);
    },
    mount() {
      const {viewer} = this;
      this.echartsLayer = this.createCesiumObject();
      this.echartsLayer.addTo(viewer);
    },
    unmount() {
      const {viewer, echartsLayer} = this;
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
