<template>
  <span />
</template>

<script>
export default {
  name: "mapgis-3d-link",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    enable: { type: Boolean, default: false },
    vueKey: {
      type: String,
      default: "default",
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      },
    },
  },
  watch: {
    enable: function (news) {
      if (news) {
        this.addHandler();
      } else {
        this.deleteHandler();
      }
    },
  },
  mounted() {
    if (this.enable) {
      this.addHandler();
    }
  },
  methods: {
    getInstanceOptions() {
      let instanceOptions;
      const { vueKey, CesiumZondy } = this;
      if (vueKey !== "default") {
        instanceOptions = CesiumZondy.GlobesManager[vueKey][0].options;
      }
      return instanceOptions;
    },
    addHandler() {
      const { CesiumZondy } = this;
      let sources = CesiumZondy.GlobesManager.findAllSource();
      let _self = this;

      sources.forEach((s, i) => {
        s.options.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
          s.source.viewer.scene.canvas
        );
        s.options.ScreenSpaceEventHandler.setInputAction(function (movement) {
          let _camerca = s.source.viewer.camera;
          sources.forEach((other, j) => {
            if (i != j) {
              other.source.viewer.camera.setView({
                destination: _camerca.position,
                orientation: {
                  direction: _camerca._direction,
                  up: _camerca.up,
                  heading: _camerca.heading,
                  pitch: _camerca.pitch,
                  roll: _camerca.roll,
                },
              });
            }
          });
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        s.options.ScreenSpaceEventHandler.setInputAction(function (movement) {
          let _camerca = s.source.viewer.camera;
          sources.forEach((other, j) => {
            if (i != j) {
              other.source.viewer.camera.setView({
                destination: _camerca.position,
                orientation: {
                  direction: _camerca._direction,
                  up: _camerca.up,
                  heading: _camerca.heading,
                  pitch: _camerca.pitch,
                  roll: _camerca.roll,
                },
              });
            }
          });
        }, Cesium.ScreenSpaceEventType.WHEEL);
      });
    },
    deleteHandler() {
      const { CesiumZondy } = this;
      /* 这段代码要结合WebGlobe里面的如下代码才能明白
      window.CesiumZondy.GlobesManager.addSource(vueKey, vueIndex, webGlobe, {
        ScreenSpaceEventHandler: undefined,
      }); */
      const instance = this.getInstanceOptions();
      if (instance) {
        const handler = instance.ScreenSpaceEventHandler;
        if (handler) {
          handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
          handler.destroy();
        }
      }

      let sources = CesiumZondy.GlobesManager.findAllSource();
      sources.forEach((s, i) => {
        if (s.options.ScreenSpaceEventHandler) {
          s.options.ScreenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          s.options.ScreenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.WHEEL
          );
          s.options.ScreenSpaceEventHandler.setInputAction(function (
            movement
          ) {},
          Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          // s.options.ScreenSpaceEventHandler.destroy();
        }
      });
    },
  },
};
</script>

<style></style>
