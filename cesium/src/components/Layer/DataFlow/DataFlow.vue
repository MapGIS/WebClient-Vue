<template>
  <div>
    <template v-for="(popup, index) in popups">
      <mapgis-3d-popup
        v-if="enablePopup"
        :key="index"
        :position="{
          longitude: popup.lng,
          latitude: popup.lat,
          height: popup.alt
        }"
        :forceRender="true"
        v-model="popup.show"
        @change="$_toggle"
        :vueIndex="popup.vueIndex"
      >
        <mapgis-ui-popup-content :feature="popup.properties" :width="260">
          <mapgis-3d-popup-iot :properties="popup.properties" />
        </mapgis-ui-popup-content>
      </mapgis-3d-popup>
      <!-- <mapgis-3d-popup
        v-if="enablePopup"
        :key="index"
        :position="{
          longitude: popup.lng,
          latitude: popup.lat,
          height: popup.alt
        }"
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
      </mapgis-3d-popup> -->
    </template>
  </div>
</template>

<script>
import { Style } from "@mapgis/webclient-es6-service";
// import { getPopupHtml } from "../../UI/Popup/popupUtil";

const { PointStyle, ModelStyle, MarkerStyle } = Style;
export default {
  name: "mapgis-3d-data-flow-layer",
  inject: ["viewer", "Cesium"],
  props: {
    baseUrl: {
      type: String
    },
    UUID: {
      type: String,
      default: "imei"
    },
    updateInterval: {
      type: Number,
      default: 300
    },
    options: {
      type: Object
    },
    layerStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    enableFlyTo: {
      type: Boolean,
      default: false
    },
    showPosition: {
      type: Boolean,
      default: true
    },
    flyToOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    vueKey: { type: String, default: "default" },
    vueIndex: {
      type: [String, Number],
      default: () => (Math.random() * 100000000).toFixed(0)
    },
    enablePopup: {
      type: Boolean,
      default: false
    },
    popupOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    enableDirect: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    layerStyle: {
      handler: function() {
        this.layerStyleCopy = Object.assign(
          this.layerStyleCopy,
          this.layerStyle
        );
        let source = window.vueCesium.DataFlowManager.findSource(
          this.vueKey,
          this.vueIndex
        );
        if (!source || !source.source) {
          return;
        }
        let points = source.source;
        let point,
          vm = this,
          newPoints = [];
        if (this.currentType !== this.layerStyleCopy.type) {
          this.websocket.close();
          clearInterval(this.interval);
          for (let i = 0; i < points.length; i++) {
            this.viewer.entities.remove(points[i]);
            switch (this.layerStyleCopy.type) {
              case "point":
                let pStyle = new PointStyle(this.layerStyleCopy);
                point = this.viewer.entities.add({
                  id: this.features[i].properties[this.UUID],
                  position: Cesium.Cartesian3.fromDegrees(
                    this.features[i].geometry.coordinates[0],
                    this.features[i].geometry.coordinates[1],
                    20
                  ),
                  point: pStyle.toCesiumStyle(Cesium),
                  properties: this.features[i].properties,
                  keys: Object.keys(this.features[i].properties)
                });
                break;
              case "model":
                let mStyle = new ModelStyle(this.layerStyleCopy);
                point = this.viewer.entities.add({
                  id: this.features[i].properties[this.UUID],
                  position: Cesium.Cartesian3.fromDegrees(
                    this.features[i].geometry.coordinates[0],
                    this.features[i].geometry.coordinates[1],
                    20
                  ),
                  model: mStyle.toCesiumStyle(Cesium),
                  properties: this.features[i].properties,
                  keys: Object.keys(this.features[i].properties)
                });
                break;
              case "marker":
                let markerStyle = new MarkerStyle();
                markerStyle = markerStyle.toCesiumStyle(
                  this.layerStyleCopy,
                  this.features[i],
                  Cesium
                );
                point = this.viewer.entities.add({
                  id: this.features[i].properties[this.UUID],
                  position: Cesium.Cartesian3.fromDegrees(
                    this.features[i].geometry.coordinates[0],
                    this.features[i].geometry.coordinates[1],
                    20
                  ),
                  billboard: markerStyle.billboard,
                  label: markerStyle.label,
                  properties: this.features[i].properties,
                  keys: Object.keys(this.features[i].properties)
                });
                break;
            }
            newPoints.push(point);
          }
          window.vueCesium.DataFlowManager.deleteSource(
            this.vueKey,
            this.vueIndex
          );
          window.vueCesium.DataFlowManager.addSource(
            this.vueKey,
            this.vueIndex,
            newPoints
          );
          this.currentType = this.layerStyleCopy.type;
          //开启长链接
          this.websocket = new WebSocket(this.baseUrl);
          //接受消息
          this.websocket.onmessage = function(evt) {
            vm.$_webSocketCallBack(evt, vm);
          };
          this.$_setUpdatedEvent();
        } else {
          switch (this.layerStyleCopy.type) {
            case "point":
              for (let i = 0; i < points.length; i++) {
                let pointStyle = new Style.PointStyle(this.layerStyleCopy);
                points[i]["point"] = points[i]["point"] || {};
                points[i]["point"] = Object.assign(
                  points[i][this.layerStyleCopy.type],
                  pointStyle.toCesiumStyle(Cesium)
                );
              }
              break;
            case "marker":
              for (let i = 0; i < points.length; i++) {
                let markerStyle = new Style.MarkerStyle();
                markerStyle = markerStyle.toCesiumStyle(
                  this.layerStyleCopy,
                  {},
                  Cesium
                );
                points[i]["billboard"] = points[i]["billboard"] || {};
                points[i]["billboard"] = Object.assign(
                  points[i]["billboard"],
                  markerStyle.billboard
                );
                points[i]["label"] = points[i]["label"] || { text: "" };
                markerStyle.label.text = points[i]["label"].text;
                points[i]["label"] = Object.assign(
                  points[i]["label"],
                  markerStyle.label
                );
              }
              break;
            case "model":
              for (let i = 0; i < points.length; i++) {
                let modelStyle = new Style.ModelStyle(this.layerStyleCopy);
                points[i]["model"] = points[i]["model"] || {};
                points[i]["model"] = Object.assign(
                  points[i][this.layerStyleCopy.type],
                  modelStyle.toCesiumStyle(Cesium)
                );
              }
              break;
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      //保存所有的取得的要素信息（已去重）
      features: [],
      firstAdd: true,
      popups: [],
      websocket: undefined,
      currentType: undefined,
      interval: undefined,
      layerStyleCopy: {
        fixNum: 10
      }
    };
  },
  mounted() {
    this.layerStyleCopy = Object.assign(this.layerStyleCopy, this.layerStyle);
    this.$_addEntityLayer();
  },
  destroyed() {
    let { vueKey, vueIndex } = this;
    let source = window.vueCesium.DataFlowManager.findSource(vueKey, vueIndex);
    if (!source || !source.source) {
      return;
    }
    let points = source.source;
    this.websocket.close();

    this.handler &&
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    for (let i = 0; i < points.length; i++) {
      this.viewer.entities.remove(points[i]);
    }
    for (let i = 0; i < this.popups.length; i++) {
      let pop = window.vueCesium.PopupManager.findSource(
        this.vueKey,
        this.popups[i].vueIndex
      );
      pop?.source?.remove();
      window.vueCesium.PopupManager.deleteSource(
        this.vueKey,
        this.popups[i].vueIndex
      );
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
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        center,
        hpr
      );

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
    $_webSocketCallBack(evt, vm) {
      const { vueKey, vueIndex } = vm;
      let data = JSON.parse(evt.data);
      let addPoint = true,
        pointId,
        points;
      let source = window.vueCesium.DataFlowManager.findSource(
        vueKey,
        vueIndex
      );
      if (vm.firstAdd && vm.enableFlyTo) {
        let flyToOptions = {
            duration: 6
          },
          defaultHeight = 1400;
        const { height } = vm.flyToOptions;
        if (height === 0 || height) {
          defaultHeight = Number(height);
        }
        flyToOptions = Object.assign(flyToOptions, vm.flyToOptions);
        vm.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            data.geometry.coordinates[0],
            data.geometry.coordinates[1],
            defaultHeight
          ),
          ...flyToOptions
        });
        vm.firstAdd = false;
      }
      //如果已有points，如果imei相同则更新点，否则添加点
      if (source && source.source) {
        points = source.source;
        for (let i = 0; i < points.length; i++) {
          if (
            points[i].properties[vm.UUID].getValue() ===
            data.properties[vm.UUID]
          ) {
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
        vm.features.push({
          type: "point",
          geometry: data.geometry,
          properties: data.properties
        });
        switch (vm.layerStyleCopy.type) {
          case "point":
            let pStyle = new PointStyle(vm.layerStyleCopy);
            point = vm.viewer.entities.add({
              id: data.properties[vm.UUID],
              position: Cesium.Cartesian3.fromDegrees(
                data.geometry.coordinates[0],
                data.geometry.coordinates[1],
                20
              ),
              point: pStyle.toCesiumStyle(Cesium),
              properties: data.properties,
              keys: keys
            });
            break;
          case "model":
            let mStyle = new ModelStyle(vm.layerStyleCopy);
            let hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
            //必须用一个当前的魔性的经纬度新生成一个笛卡尔坐标，不能用自带的position，否则地图会卡主
            let orientation = Cesium.Transforms.headingPitchRollQuaternion(
              Cesium.Cartesian3.fromDegrees(
                data.geometry.coordinates[0],
                data.geometry.coordinates[1]
              ),
              hpr
            );
            point = vm.viewer.entities.add({
              id: data.properties[vm.UUID],
              orientation: orientation,
              position: Cesium.Cartesian3.fromDegrees(
                data.geometry.coordinates[0],
                data.geometry.coordinates[1],
                20
              ),
              model: mStyle.toCesiumStyle(Cesium),
              properties: data.properties,
              keys: keys
            });
            break;
          case "marker":
            let markerStyle = new MarkerStyle();
            markerStyle = markerStyle.toCesiumStyle(
              vm.layerStyleCopy,
              data,
              Cesium
            );
            if (
              vm.layerStyleCopy &&
              vm.layerStyleCopy.fixNum &&
              markerStyle.label.text &&
              markerStyle.label.text.length > vm.layerStyleCopy.fixNum
            ) {
              markerStyle.label.text = markerStyle.label.text.substring(
                0,
                vm.layerStyleCopy.fixNum
              );
            }
            point = vm.viewer.entities.add({
              id: data.properties[vm.UUID],
              position: Cesium.Cartesian3.fromDegrees(
                data.geometry.coordinates[0],
                data.geometry.coordinates[1],
                20
              ),
              billboard: markerStyle.billboard,
              label: markerStyle.label,
              properties: data.properties,
              keys: keys
            });
            break;
        }
        points.push(point);
      } else {
        let heading, x1, x2, y1, y2;
        for (let i = 0; i < vm.features.length; i++) {
          if (vm.features[i].properties[vm.UUID] === data.properties[vm.UUID]) {
            if (vm.layerStyleCopy.type === "model" && vm.enableDirect) {
              x1 = vm.features[i].geometry.coordinates[0];
              y1 = vm.features[i].geometry.coordinates[1];
              x2 = data.geometry.coordinates[0];
              y2 = data.geometry.coordinates[1];
              heading = Math.atan2(y2 - y1, x2 - x1);
            }
            vm.features[i].geometry.coordinates = data.geometry.coordinates;
            vm.features[i].properties = data.properties;
            break;
          }
        }

        //更新点
        points[pointId].properties = data.properties;
        points[pointId].position = Cesium.Cartesian3.fromDegrees(
          data.geometry.coordinates[0],
          data.geometry.coordinates[1],
          20
        );
        //更新方向
        if (vm.layerStyleCopy.type === "model" && vm.enableDirect) {
          let hpr = new Cesium.HeadingPitchRoll(heading * -1, 0, 0);
          //必须用一个当前的魔性的经纬度新生成一个笛卡尔坐标，不能用自带的position，否则地图会卡主
          points[
            pointId
          ].orientation = Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(x1, y1),
            hpr
          );
        }
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
    },
    $_setUpdatedEvent() {
      let vm = this;
      //定时发送updated事件
      this.interval = setInterval(function() {
        vm.$emit("updated", vm.features);
      }, this.updateInterval);
    },
    $_addEntityLayer() {
      let vm = this;
      this.currentType = this.layerStyleCopy.type;
      //开启长链接
      this.websocket = new WebSocket(this.baseUrl);
      //设置点击事件
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      this.handler.setInputAction(function onLeftClick(movement) {
        let pickedFeature = vm.viewer.scene.pick(movement.position);
        if (
          Cesium.defined(pickedFeature) &&
          vm.featureInCurrentLayer(pickedFeature)
        ) {
          let hasPopup = false,
            index;
          for (let i = 0; i < vm.popups.length; i++) {
            if (
              vm.popups[i].properties[vm.UUID] ===
              pickedFeature.id.properties[vm.UUID].getValue()
            ) {
              hasPopup = true;
              index = i;
              break;
            }
          }
          for (let i = 0; i < vm.popups.length; i++) {
            vm.popups[i].show = false;
          }
          if (!hasPopup) {
            let popup = vm.$_cartesian3ToLongLat(
              pickedFeature.primitive.position ||
                pickedFeature.primitive.id.position
            );
            popup.height = 50;
            popup.keys = pickedFeature.id.keys;
            popup.show = true;
            popup.vueIndex = Math.ceil(Math.random() * 10000000);
            popup.properties = {};
            for (let i = 0; i < pickedFeature.id.keys.length; i++) {
              let key = pickedFeature.id.keys[i];
              popup.properties[key] = pickedFeature.id.properties[
                key
              ].getValue();
            }
            let { type } = vm.popupOptions;
            type = type || "default";
            let defaultOptions = {
              fields: popup.keys,
              style: {
                containerStyle: { width: "360px" }
              }
            };
            defaultOptions = Object.assign(defaultOptions, vm.popupOptions);
            if (vm.showPosition) {
              popup.keys.push("经度", "纬度", "高程");
              popup.properties["经度"] = popup.lng;
              popup.properties["纬度"] = popup.lat;
              popup.properties["高程"] = popup.alt;
            }
            // popup.container = getPopupHtml(
            //   type,
            //   { properties: popup.properties },
            //   defaultOptions
            // );
            vm.popups.push(popup);
          } else {
            vm.popups[index].show = true;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //接受消息
      this.websocket.onmessage = function(evt) {
        vm.$_webSocketCallBack(evt, vm);
      };
      vm.$emit("updated", vm.features);
      this.$_setUpdatedEvent();
    },
    featureInCurrentLayer(feature) {
      const { vueKey, vueIndex } = this;
      const layer = window.vueCesium.DataFlowManager.findSource(
        vueKey,
        vueIndex
      );
      if (layer) {
        const { source } = layer;
        const id = feature?.id?.id;
        return source.find(item => item.id === id);
      }
      return false;
    }
  }
};
</script>

<style scoped></style>
