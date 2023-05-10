<template>
  <span />
</template>

<script>
import BaseLayer from "../../../Analysis/BaseLayer";
import { getCesiumBaseObject } from "../../../Utils/util";
import VueOptions from "../../../Base/Vue/VueOptions";
export default {
  name: "mapgis-3d-compare",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    ...VueOptions,
    beforeLayers: {
      type: Array,
      default: function() {
        return [];
      }
    },
    afterLayers: {
      type: Array,
      default: function() {
        return [];
      }
    },
    orientation: {
      type: String,
      default: "horizontal"
    }
  },
  data() {
    return {
      moveActive: false,
      slider: undefined
    };
  },
  watch: {
    beforeLayers: {
      handler(val) {
        this.compare();
      },
      deep: true
    },
    afterLayers: {
      handler(val) {
        this.compare();
      },
      deep: true
    },
    vueKey() {
      this.compare();
    },
    orientation() {
      this.compare();
    }
  },
  mounted() {
    this.mount();
  },
  beforeDestroy() {
    this.umount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        vueCesium.CompareManager.addSource(vueKey, vueIndex, dataSource, {
          beforeM3DSet: null,
          afterM3DSet: null
        });
        vm.compare();
      });
    },
    $_getM3DSet(splitPosition) {
      const beforeLayerId = this.beforeLayers[0];
      const afterLayerId = this.afterLayers[0];
      const { Cesium, vueCesium, vueKey, vueIndex } = this;
      let beforeM3DSet;
      let afterM3DSet;
      this.$_getAll3DTileSetArray(
        function(m3d) {
          beforeM3DSet = m3d;
          for (let i = 0; i < beforeM3DSet.length; i++) {
            beforeM3DSet[i].swipeEnabled = true;
            beforeM3DSet[i].swipeInverse = -1;
          }
          vueCesium.CompareManager.changeOptions(
            vueKey,
            vueIndex,
            "beforeM3DSet",
            beforeM3DSet
          );
        },
        vueKey,
        beforeLayerId,
        ["m3d", "g3d"]
      );
      this.$_getAll3DTileSetArray(
        function(m3d) {
          afterM3DSet = m3d;
          for (let j = 0; j < afterM3DSet.length; j++) {
            afterM3DSet[j].swipeEnabled = true;
            afterM3DSet[j].swipeInverse = 1;
          }
          vueCesium.CompareManager.changeOptions(
            vueKey,
            vueIndex,
            "afterM3DSet",
            afterM3DSet
          );
        },
        vueKey,
        afterLayerId,
        ["m3d", "g3d"]
      );
    },
    compare() {
      const { viewer, Cesium } = this;
      let sliderClassName = "slider";
      let swiperClassName = "compare-swiper";
      if (this.orientation === "vertical") {
        sliderClassName = "slider";
        swiperClassName = "compare-swiper";
      } else if (this.orientation === "horizontal") {
        sliderClassName = "slider slider-horizontal";
        swiperClassName = "compare-swiper compare-swiper-horizontal";
      }
      let container = document.getElementById(viewer.container.id).parentNode;
      this.slider = container.getElementsByClassName("slider");
      let swiper;
      if (this.slider.length === 0) {
        this.slider = document.createElement("div");
        this.slider.className = sliderClassName;
        swiper = document.createElement("div");
        swiper.className = swiperClassName;
        this.slider.appendChild(swiper);
        container.appendChild(this.slider);
      } else {
        this.slider = this.slider[0];
        swiper = document.getElementsByClassName("compare-swiper")[0];
      }
      this.slider.className = sliderClassName;
      this.slider.style.left = "";
      this.slider.style.top = "";
      swiper.className = swiperClassName;

      let layers = viewer.imageryLayers._layers;
      if (this.beforeLayers.length && this.afterLayers.length) {
        for (let i = 1; i < layers.length; i++) {
          layers[i].show = true;
          if (this.beforeLayers.includes(layers[i].id)) {
            layers[i].swipeEnabled = true;
            layers[i].swipeInverse = -1;
          } else if (this.afterLayers.includes(layers[i].id)) {
            layers[i].swipeEnabled = true;
            // 设置后该图层的反转不受scene.swipeController的反转控制
            layers[i].swipeInverse = 1;
          } else {
            layers[i].show = false;
          }
        }
      } else {
        layers[layers.length - 2].swipeEnabled = false;
        layers[layers.length - 1].swipeEnabled = true;
      }
      let splitPosition = 0.5;
      let type = Cesium.SwipeModeType.HORIZONTAL;
      if (this.orientation === "vertical") {
        type = Cesium.SwipeModeType.HORIZONTAL;
        splitPosition =
          this.slider.offsetLeft / this.slider.parentElement.offsetWidth;
      } else if (this.orientation === "horizontal") {
        type = Cesium.SwipeModeType.VERTICAL;
        splitPosition =
          this.slider.offsetTop / this.slider.parentElement.offsetHeight;
      }
      viewer.scene.swipeController = {
        region: splitPosition,
        type,
        inverse: true
      };

      let handler = new Cesium.ScreenSpaceEventHandler(this.slider);
      this.$_getM3DSet(splitPosition);
      const vm = this;
      //鼠标左键按下事件
      handler.setInputAction(function() {
        vm.moveActive = true;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      //鼠标左键抬起事件
      handler.setInputAction(function() {
        vm.moveActive = false;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
      //滑动事件的开始
      handler.setInputAction(function() {
        vm.moveActive = true;
      }, Cesium.ScreenSpaceEventType.PINCH_START);
      //滑动事件的结束
      handler.setInputAction(function() {
        vm.moveActive = false;
      }, Cesium.ScreenSpaceEventType.PINCH_END);
      //鼠标移动事件
      handler.setInputAction(vm.move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //滑动事件
      handler.setInputAction(vm.move, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    },
    move(movement) {
      if (!this.moveActive) {
        return;
      }
      const { viewer, slider } = this;
      let splitPosition;
      if (this.orientation === "vertical") {
        let relativeOffset = movement.endPosition.x;
        splitPosition =
          (slider.offsetLeft + relativeOffset) /
          slider.parentElement.offsetWidth;
        slider.style.left = 100.0 * splitPosition + "%";
      } else if (this.orientation === "horizontal") {
        let relativeOffset = movement.endPosition.y;
        splitPosition =
          (slider.offsetTop + relativeOffset) /
          slider.parentElement.offsetHeight;
        slider.style.top = 100.0 * splitPosition + "%";
      }
      viewer.scene.swipeController.region = splitPosition;
      this.compareM3D(splitPosition);
    },
    compareM3D(splitPosition) {
      let { Cesium, vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.CompareManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        const { beforeM3DSet, afterM3DSet } = find.options;
        if (beforeM3DSet) {
          for (let i = 0; i < beforeM3DSet.length; i++) {
            if (splitPosition !== undefined) {
              beforeM3DSet[i].swipeEnabled = true;
              beforeM3DSet[i].swipeInverse = -1;
            } else {
              beforeM3DSet[i].swipeEnabled = false;
              beforeM3DSet[i].swipeInverse = 0;
            }
          }
        }
        if (afterM3DSet) {
          for (let j = 0; j < afterM3DSet.length; j++) {
            if (splitPosition !== undefined) {
              afterM3DSet[j].swipeEnabled = true;
              afterM3DSet[j].swipeInverse = 1;
            } else {
              afterM3DSet[j].swipeEnabled = false;
              afterM3DSet[j].swipeInverse = 0;
            }
          }
        }
      }
    },
    umount() {
      let { vueCesium, vueKey, vueIndex } = this;
      if (vueCesium && vueCesium.CompareManager) {
        let find = vueCesium.CompareManager.findSource(vueKey, vueIndex);
        if (find) {
          this.remove();
        }
        vueCesium.CompareManager.deleteSource(vueKey, vueIndex);
        this.$emit("unload", this);
      }
    },
    remove() {
      const { viewer } = this;
      let layers = viewer.imageryLayers._layers;
      layers.forEach(layer => {
        layer.show = true;
        layers.swipeEnabled = false;
        layers.swipeInverse = 0;
      });
      let slider = document.getElementsByClassName("slider");
      if (slider.length > 0) {
        let container = document.getElementById(viewer.container.id).parentNode;
        container.removeChild(slider[0]);
      }
      this.compareM3D();
    }
  }
};
</script>

<style>
.cesium-map-wrapper .slider {
  position: absolute;
  left: 50%;
  top: 0;
  background-color: #fff;
  width: 2px;
  height: 100%;
  z-index: 9999;
}

.cesium-map-wrapper .slider-horizontal {
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
}

.cesium-map-wrapper .slider:hover {
  cursor: ew-resize;
}

.cesium-map-wrapper .compare-swiper {
  background-color: #3887be;
  -webkit-box-shadow: inset 0 0 0 2px #fff;
  box-shadow: inset 0 0 0 2px #fff;
  display: inline-block;
  border-radius: 50%;
  position: absolute;
  width: 60px;
  height: 60px;
  top: 50%;
  left: -30px;
  margin: -30px 1px 0;
  color: #fff;
  cursor: ew-resize;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTI1IDI0bC05IDYgOSA2VjI0em0xMCAwdjEybDktNi05LTZ6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=);
}

.cesium-map-wrapper .compare-swiper-horizontal {
  left: 50%;
  top: -30px;
  margin: 1px -30px 1px 0px;
  transform: rotate(90deg);
}
</style>
