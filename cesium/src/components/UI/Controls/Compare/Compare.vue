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
        this.initCompare();
      },
      deep: true
    },
    afterLayers: {
      handler(val) {
        this.initCompare();
      },
      deep: true
    },
    vueKey() {
      this.initCompare();
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
            beforeM3DSet[i].rollerShutterRegion = new Cesium.Cartesian4(
              0.0,
              0.0,
              splitPosition,
              1.0
            );
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
            afterM3DSet[j].rollerShutterRegion = new Cesium.Cartesian4(
              splitPosition,
              0.0,
              1.0,
              1.0
            );
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
      this.slider = document.getElementsByClassName("slider");
      if (this.slider.length === 0) {
        this.slider = document.createElement("div");
        this.slider.className = "slider";
        let swiper = document.createElement("div");
        swiper.className = "compare-swiper";
        this.slider.appendChild(swiper);
      } else {
        this.slider = this.slider[0];
      }
      let container = document.getElementById(viewer.container.id).parentNode;
      container.appendChild(this.slider);

      let layers = viewer.imageryLayers._layers;
      if (this.beforeLayers.length && this.afterLayers.length) {
        for (let i = 1; i < layers.length; i++) {
          layers[i].show = true;
          if (this.beforeLayers.includes(layers[i].id)) {
            layers[i].splitDirection = Cesium.ImagerySplitDirection.LEFT;
          } else if (this.afterLayers.includes(layers[i].id)) {
            layers[i].splitDirection = Cesium.ImagerySplitDirection.RIGHT;
          } else {
            layers[i].show = false;
          }
        }
      } else {
        layers[layers.length - 2].splitDirection =
          Cesium.ImagerySplitDirection.LEFT;
        layers[layers.length - 1].splitDirection =
          Cesium.ImagerySplitDirection.RIGHT;
      }

      viewer.scene.imagerySplitPosition =
        this.slider.offsetLeft / this.slider.parentElement.offsetWidth;

      let handler = new Cesium.ScreenSpaceEventHandler(this.slider);
      this.$_getM3DSet(
        this.slider.offsetLeft / this.slider.parentElement.offsetWidth
      );
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
      let relativeOffset = movement.endPosition.x;
      let splitPosition =
        (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
      slider.style.left = 100.0 * splitPosition + "%";
      viewer.scene.imagerySplitPosition = splitPosition;
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
              beforeM3DSet[i].rollerShutterRegion = new Cesium.Cartesian4(
                0.0,
                0.0,
                splitPosition,
                1.0
              );
            } else {
              beforeM3DSet[i].rollerShutterRegion = undefined;
            }
          }
        }
        if (afterM3DSet) {
          for (let j = 0; j < afterM3DSet.length; j++) {
            if (splitPosition !== undefined) {
              afterM3DSet[j].rollerShutterRegion = new Cesium.Cartesian4(
                splitPosition,
                0.0,
                1.0,
                1.0
              );
            } else {
              afterM3DSet[j].rollerShutterRegion = undefined;
            }
          }
        }
      }
    },
    umount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.CompareManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      vueCesium.CompareManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    remove() {
      const { viewer } = this;
      let layers = viewer.imageryLayers._layers;
      layers.forEach(layer => {
        layer.show = true;
        layer.splitDirection = Cesium.ImagerySplitDirection.NONE;
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
</style>
