<template></template>

<script>
export default {
  name: "mapgis-3d-compare",
  // inject: ["Cesium", "webGlobe"],
  props: {
    beforeLayers: {
      type: Array,
      default: function () {
        return [];
      },
    },
    afterLayers: {
      type: Array,
      default: function () {
        return [];
      },
    },
    vueKey: {
      type: String,
      default: "default",
    },
  },
  data() {
    return {
    };
  },
  watch: {
    beforeLayers: {
      handler(val) {
        this.initCompare();
      },
      deep: true,
    },
    afterLayers: {
      handler(val) {
        this.initCompare();
      },
      deep: true,
    },
    vueKey() {
      this.initCompare();
    }
  },
  mounted() {
    this.initCompare();
  },
  methods: {
    initCompare() {
      let vm = this;
      window.CesiumZondy.getWebGlobeByInterval(function (webGlobe) {
        let slider = document.getElementsByClassName("slider");
        if(slider.length === 0){
          slider = document.createElement("div");
          slider.className = "slider";
          let swiper = document.createElement("div");
          swiper.className = "compare-swiper";
          slider.appendChild(swiper);
        }else {
          slider = slider[0];
        }
        let container = webGlobe.elementID.parentNode;
        container.appendChild(slider);
        let layers = webGlobe.layers._layers;

        if (vm.beforeLayers.length && vm.afterLayers.length) {
          for (let i = 1; i < layers.length; i++) {
            layers[i].show = true;
            if (vm.beforeLayers.includes(layers[i].id)) {
              layers[i].splitDirection =
                  Cesium.ImagerySplitDirection.LEFT;
            } else if (vm.afterLayers.includes(layers[i].id)) {
              layers[i].splitDirection =
                  Cesium.ImagerySplitDirection.RIGHT;
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

        webGlobe.scene.imagerySplitPosition =
            slider.offsetLeft / slider.parentElement.offsetWidth;

        let handler = new Cesium.ScreenSpaceEventHandler(slider);
        let moveActive = false;

        function move(movement) {
          if (!moveActive) {
            return;
          }
          let relativeOffset = movement.endPosition.x;
          let splitPosition =
              (slider.offsetLeft + relativeOffset) /
              slider.parentElement.offsetWidth;
          slider.style.left = 100.0 * splitPosition + "%";
          webGlobe.scene.imagerySplitPosition = splitPosition;
        }

        //鼠标左键按下事件
        handler.setInputAction(function () {
          moveActive = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        //鼠标左键抬起事件
        handler.setInputAction(function () {
          moveActive = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        //滑动事件的开始
        handler.setInputAction(function () {
          moveActive = true;
        }, Cesium.ScreenSpaceEventType.PINCH_START);
        //滑动事件的结束
        handler.setInputAction(function () {
          moveActive = false;
        }, Cesium.ScreenSpaceEventType.PINCH_END);
        //鼠标移动事件
        handler.setInputAction(
            move,
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        //滑动事件
        handler.setInputAction(
            move,
            Cesium.ScreenSpaceEventType.PINCH_MOVE
        );
      },vm.vueKey);
    },
  },
  destroyed() {
    let webGlobe = window.CesiumZondy.getWebGlobe(this.vueKey);
    if(webGlobe){
      let layers = webGlobe.layers._layers;
      layers.forEach((layer) => {
        layer.show = true;
        layer.splitDirection = Cesium.ImagerySplitDirection.NONE;
      });
      let slider = document.getElementsByClassName("slider");
      if(slider.length > 0){
        let container = webGlobe.elementID.parentNode;
        container.removeChild(slider[0]);
      }
    }
  },
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

.cesium-map-wrapper .compare-swiper{
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
