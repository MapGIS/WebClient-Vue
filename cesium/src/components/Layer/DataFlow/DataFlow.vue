<template>
  <div>
    <mapgis-3d-popup
        v-for="(popup,index) in popups"
        :key="index"
        :position='{"longitude":popup.lng,"latitude":popup.lat,"height":popup.alt}'
        :forceRender="true"
        v-model="popup.show"
        @change="$_toggle"
        :vueIndex="popup.vueIndex"
    >
      <div>
        <slot name="content" :popup="popup">
          <div v-html="popup.container"></div>
        </slot>
      </div>
    </mapgis-3d-popup>
  </div>
</template>

<script>
import {Style} from "@mapgis/webclient-es6-service";
import { getPopupHtml } from "../../UI/Popup/popupUtil";

const {PointStyle, ModelStyle, MarkerStyle} = Style;
export default {
  name: "mapgis-3d-data-flow-layer",
  inject: ["viewer"],
  props: {
    baseUrl: {
      type: String
    },
    UUID: {
      type: String,
      default: "imei"
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
      firstAdd: true,
      popups: [],
    }
  },
  mounted() {
    this.$_addEntityLayer();
  },
  destroyed() {
    let {vueKey, vueIndex} = this;
    let source = window.vueCesium.DataFlowManager.findSource(vueKey, vueIndex);
    let points = source.source;
    for (let i = 0; i < points.length; i++) {
      this.viewer.entities.remove(points[i]);
    }
    vueCesium.DataFlowManager.deleteSource(vueKey, vueIndex);
  },
  methods: {
    $_toggle(flag, vueIndex) {
      for (let i = 0; i < this.popups.length; i++) {
        if (this.popups[i].vueIndex === vueIndex) {
          this.popups[i].show = flag;
          break;
        }
      }
    },
    setModelDirection(longitude, latitude, direction) {
      let center = Cesium.Cartesian3.fromDegrees(longitude, latitude, 20);
      let heading = Cesium.Math.toRadians(direction);
      let pitch = 0;
      let roll = 0;
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);

      return orientation;
    },
    //记得提取到公共函数
    $_cartesian3ToLongLat(cartesian3) {
      let position = {};
      let graphicPosition = Cesium.Cartographic.fromCartesian(cartesian3);
      position.lat = Cesium.Math.toDegrees(graphicPosition.latitude);
      position.lng = Cesium.Math.toDegrees(graphicPosition.longitude);
      position.alt = graphicPosition.height;
      return position;
    },
    $_addEntityLayer() {
      let vm = this;
      const {vueKey, vueIndex} = this;
      //开启长链接
      let ws = new WebSocket(this.baseUrl);
      //设置点击事件
      this.viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        let pickedFeature = vm.viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedFeature)) {
          let hasPopup = false, index;
          for (let i = 0;i<vm.popups.length;i++){
            if(vm.popups[i].properties[vm.UUID] === pickedFeature.id.properties[vm.UUID].getValue()){
              hasPopup = true;
              index = i;
              break;
            }
          }
          if(!hasPopup){
            let popup = vm.$_cartesian3ToLongLat(pickedFeature.id.position.getValue());
            popup.height = 50;
            popup.keys = pickedFeature.id.keys;
            popup.show = true;
            popup.vueIndex = vm.popups.length;
            popup.properties = {};
            for (let i = 0; i < pickedFeature.id.keys.length; i++) {
              let key = pickedFeature.id.keys[i];
              popup.properties[key] = pickedFeature.id.properties[key].getValue();
            }
            popup.container = getPopupHtml("default", {properties: popup.properties}, {
              title: "测试标题",
              fields: popup.keys,
              style: {
                containerStyle: { width: "360px" }
              }
            });
            vm.popups.push(popup);
          }else {
            vm.popups[index].show = true;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //接受消息
      ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data);
        let addPoint = true, pointId, points;
        let source = window.vueCesium.DataFlowManager.findSource(vueKey, vueIndex);
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
            if (points[i].properties[vm.UUID].getValue() === data.properties[vm.UUID]) {
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
            window.vueCesium.DataFlowManager.addSource(vueKey, vueIndex, points);
          }
          let point;
          let keys = Object.keys(data.properties);
          switch (vm.layerStyle.type) {
            case "point":
              let pStyle = new PointStyle(vm.layerStyle);
              point = vm.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 20),
                point: pStyle.toCesiumStyle(Cesium),
                properties: data.properties,
                keys: keys
              });
              break;
            case "model":
              let mStyle = new ModelStyle(vm.layerStyle);
              point = vm.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 20),
                model: mStyle.toCesiumStyle(Cesium),
                properties: data.properties,
                keys: keys
              });
              break;
            case "marker":
              let markerStyle = new MarkerStyle();
              markerStyle = markerStyle.toCesiumStyle(vm.layerStyle, data, Cesium);
              point = vm.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 20),
                billboard: markerStyle.billboard,
                label: markerStyle.label,
                properties: data.properties,
                keys: keys
              });
              break;
          }
          points.push(point);
        } else {
          //更新点
          points[pointId].properties = data.properties;
          points[pointId].position = Cesium.Cartesian3.fromDegrees(data.geometry.coordinates[0], data.geometry.coordinates[1], 20);
          //更新popup
          for (let i = 0; i < vm.popups.length; i++) {
            if (vm.popups[i].properties[vm.UUID] === data.properties[vm.UUID]) {
              vm.popups[i].lng = data.geometry.coordinates[0];
              vm.popups[i].lat = data.geometry.coordinates[1];
              vm.popups[i].alt = 50;
              break;
            }
          }
        }
      };
    }
  }
}
</script>

<style scoped>

</style>