<template>
  <span />
</template>
<script>
import { DataSet } from 'mapv'
import { MapvLayer } from './mapv/MapvLayer'
export default {
  name: "cesium-heater-layer",
  props: {
    geojson: {
      type: Object,
      required: true,
    },
    countField: {
      type: String,
      default: 'count'
    },
    size: {
      type: Number,
      default: 13,
    },
    gradient: {
      type: Object,
      default: () => {
        return {
          0.25: "rgb(0,0,255)",
          0.55: "rgb(0,255,0)",
          0.85: "yellow",
          1.0: "rgb(255,0,0)"
        }
      }
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  inject: ["Cesium", "webGlobe"],
  methods: {
    createCesiumObject () {
      const { webGlobe } = this;
      const { viewer } = webGlobe;
      const dataset = this.initData();
      const options = this.initOptions();
      return new MapvLayer(viewer, dataset, options);
    },
    initData (geojson) {
      let data = [];
      geojson = geojson || this.geojson;
      // 构造数据
      geojson.features && geojson.features.forEach(f => {
        data.push({
          geometry: {
            type: 'Point',
            coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]]
          },
          count: f.properties[this.countField] || 1,
        });
      });
      var dataSet = new DataSet(data);
      return dataSet;
    },
    initOptions () {
      const { size, gradient, max } = this;
      const options = {
        context: '2d',
        size: size,
        gradient: gradient,
        max: max,
        draw: 'heatmap'
      }
      return options;
    },
    watchProp () {
      let { geojson, heaterLayer } = this;
      if (geojson && heaterLayer) {
        this.$watch("geojson", function (next) {
          if (this.initial) return;
          const data = this.initData(next)
          this.heaterLayer.updateData(data);
        });
      }
    },
    mount () {
      this.heaterLayer = this.createCesiumObject();
    },
    unmount () {
      const { webGlobe, heaterLayer } = this;
      const viewer = webGlobe.viewer;
      return !viewer.isDestroyed() && heaterLayer.destroy();
    },
  },
  created () {
    this.mount();
    this.watchProp();
  }
};
</script>