<template>
  <span />
</template>
<script>
import { DataSet } from 'mapv'
import { MapvLayer } from './mapv/MapvLayer'
export default {
  name: "cesium-mapv-layer",
  props: {
    geojson: {
      type: Object,
      required: true,
    },
    countField: {
      type: String,
      default: 'count'
    },
    options:{
      type:Object,
      default(){
        return {
          context: '2d',
          draw: 'heatmap'
        }
      }
    }
  },
  inject: ["Cesium", "viewer"],
  watch:{
    geojson: {
      deep: true,
      handler() {
        const data = this.initData(this.geojson)
        if(!data&&this.mapvLayer){
          this.mapvLayer.destroy()
          this.mapvLayer = undefined
        }
        if(!this.mapvLayer){
          this.mount()
        }else {
          this.mapvLayer.updateData(data, this.options);
        }
      }
    },
    options:{
      deep:true,
      handler(){
        if(!this.mapvLayer){
          return
        }
        this.mapvLayer.updateData(this.dataSet, this.options);
      }
    }
  },
  methods: {
    createCesiumObject () {
      const { viewer } = this;
      const dataset = this.initData();
      if(!dataset){
        return
      }
      return new MapvLayer(viewer, dataset, this.options);
    },
    initData (geojson) {
      let data = [];
      geojson = geojson || this.geojson;
      // 构造数据
      var features = geojson.features;
      if(!features){
        return
      }
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        const fType = feature.geometry.type
        const coordinates = feature.geometry.coordinates
        if (fType === 'Point') {
          data.push({
            geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            count:  feature.properties[this.countField] || 1
          })
        } else if (fType === 'LineString') {
          for (let j = 0; j < coordinates.length; j++) {
            data.push({
              geometry: {
                type: 'Point',
                coordinates: coordinates[j]
              },
              count: feature.properties[this.countField] || 1
            })
          }
        } else if (fType === 'Polygon') {
          for (let j = 0; j < coordinates[0].length; j++) {
            data.push({
              geometry: {
                type: 'Point',
                coordinates: coordinates[0][j]
              },
              count: feature.properties[this.countField] || 1
            })
          }
        }
      }
      var dataSet = new DataSet(data);
      return dataSet;
    },
    // watchProp () { //?这个函数未生效改成了vue的watch
    //   let { geojson, mapvLayer } = this;
    //   if (geojson && mapvLayer) {
    //     this.$watch("geojson", function (next) {
    //       if (this.initial) return;
    //       console.log(this.geojson)
    //       const data = this.initData(next)
    //       console.log(data)
    //       this.mapvLayer.updateData(data,this.options);
    //     });
    //   }
    // },
    mount () {
      this.mapvLayer = this.createCesiumObject();
    },
    unmount () {
      const { viewer, mapvLayer } = this;
      return !viewer.isDestroyed() && mapvLayer.destroy();
    },
  },
  beforeDestroy(){
    if(this.mapvLayer){
      this.mapvLayer.destroy()
      this.mapvLayer = undefined
    }
  },
  created () {
    this.mount();
    // this.watchProp();
  }
};
</script>
