<template>
  <span></span>
</template>

<script>
import {Style} from "@mapgis/webclient-es6-service";

const {PointStyle, ModelStyle, MarkerStyle} = Style;
export default {
  name: "mapgis-3d-data-flow-layer",
  inject: ["viewer"],
  props: {
    baseUrl: {
      type: String
    },
    type: {
      type: String,
      default: "point"
    },
    options: {
      type: Object
    },
    layerStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    flyToOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    vueKey: {type: String, default: "default"},
    vueIndex: {
      type: [String, Number],
      default: () => (Math.random() * 100000000).toFixed(0)
    }
  },
  data() {
    return {
      firstAdd: true
    }
  },
  mounted() {
    this.$_addEntityLayer();
  },
  destroyed() {
    let {vueKey, vueIndex} = this;
    let source = window.CesiumZondy.DataFlowManager.findSource(vueKey, vueIndex);
    let points = source.source;
    for (let i = 0; i < points.length; i++) {
      this.viewer.entities.remove(points[i]);
    }
    CesiumZondy.DataFlowManager.deleteSource(vueKey, vueIndex);
  },
  methods: {
    setModelDirection(longitude, latitude, direction) {
      let center = Cesium.Cartesian3.fromDegrees(longitude, latitude, 40);
      let heading = Cesium.Math.toRadians(direction);
      let pitch = 0;
      let roll = 0;
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);

      return orientation;
    },
    $_addEntityLayer() {
      let vm = this;
      const {vueKey, vueIndex} = this;
      //开启长链接
      let ws = new WebSocket(this.baseUrl);
      //接受消息
      ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data);
        let addPoint = true, pointId, points;
        let source = window.CesiumZondy.DataFlowManager.findSource(vueKey, vueIndex);
        if (vm.firstAdd) {
          let flyToOptions = {
            duration: 6
          }, defaultHeight = 1400;
          const {height} = vm.flyToOptions;
          if (height === 0 || height) {
            defaultHeight = Number(height);
          }
          flyToOptions = Object.assign(flyToOptions, vm.flyToOptions);
          vm.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], defaultHeight),
            ...flyToOptions
          });
          vm.firstAdd = false;
        }
        //如果已有points，如果imei相同则更新点，否则添加点
        if (source) {
          points = source.source;
          for (let i = 0; i < points.length; i++) {
            if (points[i].properties.imei._value === data.properties.imei) {
              addPoint = false;
              pointId = i;
              break;
            }
          }
        }
        //添加点
        if (addPoint) {
          if (!points) {
            points = [];
            window.CesiumZondy.DataFlowManager.addSource(vueKey, vueIndex, points);
          }
          let point;
          switch (vm.layerStyle.type) {
            case "point":
              let pStyle = new PointStyle(vm.layerStyle);
              point = vm.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 0),
                point: pStyle.toCesiumStyle(Cesium),
                properties: data.properties
              });
              break;
            case "model":
              let mStyle = new ModelStyle(vm.layerStyle);
              point = vm.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 20),
                model: mStyle.toCesiumStyle(Cesium),
                properties: data.properties,
                positionBack: [data.geometry.coordinates[0], data.geometry.coordinates[1]]
              });
              break;
            case "marker":
              let markerStyle = new MarkerStyle();
              markerStyle = markerStyle.toCesiumStyle(vm.layerStyle, data, Cesium);
              point = vm.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 40),
                billboard: markerStyle.billboard,
                label: markerStyle.label,
                properties: data.properties
              });
              break;
          }
          points.push(point);
        } else {
          //更新点
          // let  r  = Math.atan2((data.geometry.coordinates[1]-points[pointId].positionBack[1]), (data.geometry.coordinates[0]-points[pointId].positionBack[0]))  //弧度  0.6435011087932844
          // let  h  = r*( 180 /Math.PI);  //角度  36.86989764584402
          // let direction = vm.setModelDirection(points[pointId].positionBack[0], points[pointId].positionBack[1], h)
          // points[pointId].orientation = direction;
          points[pointId].properties = data.properties;
          points[pointId].positionBack = [data.geometry.coordinates[0], data.geometry.coordinates[1]];
          points[pointId].position = Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 20);
        }
      };
    }
  }
}
</script>

<style scoped>

</style>