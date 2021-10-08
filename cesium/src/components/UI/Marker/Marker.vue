<template>
  <div style="display: none">
    <!-- slot for custom marker -->
    <slot name="marker" />
    <!-- slot for popup -->
    <slot v-if="marker" />
  </div>
</template>

<script>
import { Manager } from "@mapgis/webclient-es6-service";

export default {
  name: "mapgis-3d-Marker",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    text: {
      type: String,
      default: ""
    },
    fontSize: {
      type: String,
      default: "16px"
    },
    fontFamily: {
      type: String,
      default: "宋体"
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: "#000000"
    },
    iconUrl: {
      type: String,
      required: true
    },
    iconHeight: {
      type: Number,
      default: 50
    },
    iconWidth: {
      type: Number,
      default: 50
    },
    farDist: {
      type: Number,
      default: 10000000
    },
    nearDist: {
      type: Number,
      default: 1
    },
    iconPos: {
      type: String,
      default: "center"
    },
    heightReference: {
      type: String,
      default: "clamped"
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },
  data() {
    return {
      marker: undefined,
      isMoveIn: false,
      isMoveOut: true
    }
  },
  provide () {
    const self = this;
    return {
      get marker () {
        // 提供marker给子组件popup或者插槽槽
        return self.marker;
      }
    };
  },
  mounted() {
    let vm = this;
    Object.keys(this.$props).forEach(function(key) {
      if (key !== "vueKey" && key !== "vueIndex") {
        vm.$watch(key, function() {
          vm.$_unmount();
          vm.$_mount();
        });
      }
    });
    this.$_mount();
  },
  destroyed() {
    this.$_unmount();
  },
  methods: {
    $_mount() {
      let vm = this;
      window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
        vm.$_init(webGlobe);
      }, this.vueKey);
    },
    $_unmount() {
      const { vueKey, vueIndex } = this;
      const vm = this;
      let CesiumZondy = this.CesiumZondy || window.CesiumZondy;
      window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
        let MarkerManager = CesiumZondy.MarkerManager.findSource(
          vueKey,
          vueIndex
        );
        let webGlobeMarker = vm.webGlobe || webGlobe;
        webGlobeMarker.viewer.entities.remove(MarkerManager.source);
        CesiumZondy.MarkerManager.deleteSource(vueKey, vueIndex);
      }, vueKey);
    },
    $_init(webGlobe) {
      let vm = this;
      let Cesium = this.Cesium || window.Cesium;
      let webGlobeMarker = this.webGlobe || webGlobe;
      let labelLayer = new CesiumZondy.Manager.LabelLayer({
        viewer: webGlobeMarker.viewer
      });
      let heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      switch (this.heightReference) {
        case "clamped":
          heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
          break;
        case "absolute":
          heightReference = Cesium.HeightReference.NONE;
          break;
        case "above":
          heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
          break;
      }
      if (this.height > 0) {
        heightReference = Cesium.HeightReference.NONE;
      }
      this.$_append(labelLayer, heightReference);
      let handler = new Cesium.ScreenSpaceEventHandler(webGlobeMarker.viewer.scene.canvas);
      let scene = webGlobeMarker.viewer.scene;
      let label = {
        //文本内容
        text: this.text,
        //经度、纬度、高度
        longitude: this.longitude,
        latitude: this.latitude,
        height: this.height,
        //文字大小、字体
        font: this.fontSize + " " + this.fontFamily,
        //文字颜色
        fontColor: Cesium.Color.fromCssColorString(this.color),
        // "data/picture/icon.png",
        iconUrl: this.iconUrl,
        iconWidth: this.iconWidth,
        iconHeight: this.iconHeight,
        //最远显示距离：相机到注记的距离大于该值 注记不显示
        farDist: this.farDist,
        //最近显示距离：相机到注记的距离小于该值 注记不显示
        nearDist: this.nearDist,
        //图片位置：'center','top','bottom'
        iconPos: this.iconPos,
        //相对位置
        heightReference: heightReference
      }
      handler.setInputAction(function(movement) {
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          let pickedObject = scene.pick(movement.endPosition);
          if(Cesium.defined(pickedObject) && pickedObject.hasOwnProperty("id") && pickedObject.id.label) {
            if(!vm.isMoveIn){
              vm.isMoveIn = true;
              vm.isMoveOut = false;
              vm.$emit("mouseOver",label, vm.longitude, vm.latitude, vm.height);
            }
          }
          if(!Cesium.defined(pickedObject)) {
            if(!vm.isMoveOut){
              vm.isMoveIn = false;
              vm.isMoveOut = true;
              vm.$emit("mouseOut",label, vm.longitude, vm.latitude, vm.height);
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    $_append(labelLayer, heightReference) {
      let icon = labelLayer.appendLabelIcon(
        //文本内容
        this.text,
        //经度、纬度、高度
        this.longitude,
        this.latitude,
        this.height,
        //文字大小、字体
        this.fontSize + " " + this.fontFamily,
        //文字颜色
        Cesium.Color.fromCssColorString(this.color),
        // "data/picture/icon.png",
        this.iconUrl,
        this.iconWidth,
        this.iconHeight,
        //最远显示距离：相机到注记的距离大于该值 注记不显示
        this.farDist,
        //最近显示距离：相机到注记的距离小于该值 注记不显示
        this.nearDist,
        //图片位置：'center','top','bottom'
        this.iconPos,
        "",
        //相对位置
        heightReference
      );
      this.$_addIcon(icon);
    },
    $_addIcon(icon) {
      const { vueKey, vueIndex } = this;
      let CesiumZondy = this.CesiumZondy || window.CesiumZondy;
      CesiumZondy.MarkerManager.addSource(vueKey, vueIndex, icon);
    }
  }
};
</script>

<style scoped></style>
