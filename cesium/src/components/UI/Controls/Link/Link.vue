<template>
  <span />
</template>

<script>
export default {
  name: 'mapgis-3d-link',
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    enable: { type: Boolean, default: false },
    index: { type: String | Number },
    vueKey: { type: String | Number }
  },
  watch: {
    enable: function (news) {
      // this.deleteHandler();
      if (news) {
        this.addHandler();
      } else {
        this.deleteHandler();
      }
    }
  },
  mounted () {
    if (this.enable) {
      this.addHandler();
    }
  },
  methods: {
    initHandler () {
      const { vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.GlobesManager.findSource(vueKey, vueIndex);
      if (find) {
        return find.options.ScreenSpaceEventHandler
      }
      return undefined;
    },
    addHandler () {
      const { CesiumZondy } = this;
      let sources = CesiumZondy.GlobesManager.findAllSource();
      let _self = this;

      sources.forEach((s, i) => {
        s.options.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(s.source.viewer.scene.canvas);
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
                  roll: _camerca.roll
                }
              });
            }
          });
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      });

    },
    deleteHandler () {
      const { CesiumZondy } = this;
      let handler = this.initHandler();
      if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
        handler.destroy();
      }
      let sources = CesiumZondy.GlobesManager.findAllSource();
      sources.forEach((s, i) => {
        if (s.options.ScreenSpaceEventHandler) {
          s.options.ScreenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          s.options.ScreenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
          s.options.ScreenSpaceEventHandler.setInputAction(function (movement) {
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          // s.options.ScreenSpaceEventHandler.destroy();
        }
      });
    }
  }

}
</script>

<style>
</style>