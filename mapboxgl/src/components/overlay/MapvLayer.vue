<template>
  <span/>
</template>
<script>
import {DataSet} from "mapv";
import {MapvLayer} from "./mapv/MapvLayer";
import {VFeature} from "../../components/util/geomtry/Feature";

export default {
  name: "mapgis-mapv-layer",
  props: {
    geojson: {
      type: Object,
      required: true
    },
    countField: {
      type: String,
      default: "count"
    },
    options: {
      type: Object,
      default() {
        return {
          context: "2d",
          draw: "heatmap"
        };
      }
    }
  },
  inject: ["mapbox", "map"],
  watch: {
    geojson: {
      deep: true,
      handler() {
        this.dataSet = this.initData(this.geojson);
        if (!this.dataSet && this.mapvLayer) {
          this.mapvLayer.destroy();
          this.mapvLayer = undefined;
        }
        if (!this.mapvLayer) {
          this.mount();
        } else {
          this.mapvLayer.updateData(this.dataSet, this.options);
        }
      }
    },
    options: {
      deep: true,
      handler() {
        if (!this.mapvLayer) {
          return;
        }
        this.mapvLayer.updateData(this.dataSet, this.options);
      }
    }
  },
  methods: {
    createMapboxObject() {
      const {map} = this;
      this.dataset = this.initData();
      if (!this.dataset) {
        return;
      }
      return new MapvLayer(map, this.dataset, this.options);
    },
    initData(geojson) {
      let vm = this;
      let data = [];
      geojson = geojson || this.geojson;
      if (!geojson || geojson.length == 0) return;
      if (!(geojson.hasOwnProperty("features"))){
        geojson = this.$_convertData(geojson);
      };
      // 构造数据
      var features = geojson.features;
      if (!features) {
        return;
      }
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const fType = feature.geometry.type;
        const coordinates = feature.geometry.coordinates;
        let countValue = feature.properties[this.countField];
        if (countValue){
          countValue = vm.isNumber(countValue) ? count : Number(countValue);
        } else {
          countValue = 30 * Math.random()
        }
        let timeValue = feature.properties.time;
        if (timeValue){
          timeValue = vm.isNumber(timeValue) ? timeValue : Number(timeValue);
        } else {
          timeValue = 100 * Math.random()
        }
        if (fType === "Point") {
          let obj = Object.assign(
              {
                geometry: {
                  type: "Point",
                  coordinates: coordinates
                },
                // count: feature.properties[this.countField] || 1,
                // count: vm.isNumber(count) ? count : Number(count) || 1,
                count: countValue,
                time: timeValue
              },
              feature.properties
          );
          data.push(obj);
        } else if (fType === "LineString") {
          let obj = Object.assign(
              {
                geometry: {
                  type: "LineString",
                  coordinates: coordinates
                },
                count: countValue,
                time: timeValue
              }, feature.properties
          );
          data.push(obj);
        } else if (fType === "Polygon") {
          let obj = Object.assign(
              {
                geometry: {
                  type: "Polygon",
                  coordinates: coordinates
                },
                count: countValue,
                time: timeValue
              }, feature.properties
          );
          data.push(obj);
        }
      }
      var dataSet = new DataSet(data);
      return dataSet;
    },
    isNumber(obj){
      typeof obj === "number" && !isNaN(obj)
    },
    $_convertData(geojson){
        let data = VFeature.resultToGeojson(geojson);
        return data;
    },
    mount() {
      this.mapvLayer = this.createMapboxObject();
    },
    unmount() {
      const {map, mapvLayer} = this;
      return map && mapvLayer.destroy();
    }
  },
  beforeDestroy() {
    if (this.mapvLayer) {
      this.mapvLayer.destroy();
      this.mapvLayer = undefined;
    }
  },
  created() {
    this.mount();
    // this.watchProp();
  }
};
</script>
