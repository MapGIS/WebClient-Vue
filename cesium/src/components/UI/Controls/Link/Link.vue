<template>
  <span />
</template>

<script>
import { deepCopy } from "../../../Utils/deepequal";

export default {
  name: "mapgis-3d-link",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    enable: { type: Boolean, default: false },
    includes: { type: Array, default: () => [] },
    excludes: { type: Array, default: () => [] },
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
  model: {
    prop: "view",
    event: "change"
  },
  data() {
    return {
      time: 0,
      timestep: 60
    };
  },
  watch: {
    enable: function(news) {
      if (news) {
        this.addHandler();
      } else {
        this.deleteHandler();
      }
    }
  },
  mounted() {
    if (this.enable) {
      this.addHandler();
    }
  },
  destroyed() {
    this.deleteHandler();
  },
  methods: {
    getInstanceOptions() {
      let instanceOptions;
      let { vueKey, CesiumZondy } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      if (vueKey !== "default") {
        instanceOptions = CesiumZondy.GlobesManager[vueKey][0].options;
      }
      return instanceOptions;
    },
    checkValid(viewer, camera, parent) {
      const { includes, excludes } = this;
      if (includes.length === 0 && excludes.length === 0) {
        this.setView(viewer, camera);
      } else if (
        includes &&
        excludes &&
        includes.length > 0 &&
        excludes.length >= 0 &&
        includes.indexOf(parent) >= 0
      ) {
        this.setView(viewer, camera);
      } else if (
        includes &&
        excludes &&
        includes.length === 0 &&
        excludes.length > 0 &&
        excludes.indexOf(parent) < 0
      ) {
        this.setView(viewer, camera);
      }
    },
    setView(viewer, camera) {
      let { time, timestep } = this;
      let view3d = {
        destination: deepCopy(camera.position),
        orientation: {
          direction: deepCopy(camera._direction),
          up: deepCopy(camera.up),
          heading: deepCopy(camera.heading),
          pitch: deepCopy(camera.pitch),
          roll: deepCopy(camera.roll)
        }
      };
      viewer.camera.setView(view3d);
      // 一秒60帧，每秒更新一次，减少无效更新
      if (++this.time % timestep === 0) {
        let rect = camera.computeViewRectangle();
        let rect2d = { west: 0, east: 0, north: 0, south: 0 };
        rect2d.west = Cesium.Math.toDegrees(rect.west);
        rect2d.east = Cesium.Math.toDegrees(rect.east);
        rect2d.north = Cesium.Math.toDegrees(rect.north);
        rect2d.south = Cesium.Math.toDegrees(rect.south);
        this.$emit("change", {
          "3d": view3d,
          "2d": rect2d
        });
      }
      if (this.time > 1000000) this.time = 0;
    },
    addHandler() {
      let { CesiumZondy, includes, excludes } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      let sources = CesiumZondy.GlobesManager.flatAllSource();
      let vm = this;

      for (let i = 0; i < sources.length; i++) {
        let s = sources[i];
        if (includes && includes.length > 0 && includes.indexOf(s.parent) < 0) {
          continue;
        }
        if (
          (!includes || includes.length == 0) &&
          excludes &&
          excludes.length > 0 &&
          excludes.indexOf(s.parent) >= 0
        ) {
          continue;
        }

        s.options.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
          s.source.viewer.scene.canvas
        );
        s.options.ScreenSpaceEventHandler.setInputAction(function(movement) {
          let _camerca = s.source.viewer.camera;
          sources.forEach((other, j) => {
            if (i != j) {
              vm.checkValid(other.source.viewer, _camerca, other.parent);
            }
          });
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        s.options.ScreenSpaceEventHandler.setInputAction(function(movement) {
          let _camerca = s.source.viewer.camera;
          sources.forEach((other, j) => {
            if (i != j) {
              vm.checkValid(other.source.viewer, _camerca, other.parent);
            }
          });
        }, Cesium.ScreenSpaceEventType.WHEEL);
      }
    },
    deleteHandler() {
      let { CesiumZondy } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
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

      let sources = CesiumZondy.GlobesManager.flatAllSource();
      sources.forEach((s, i) => {
        if (s.options.ScreenSpaceEventHandler) {
          s.options.ScreenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          s.options.ScreenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.WHEEL
          );
          s.options.ScreenSpaceEventHandler.setInputAction(function(
            movement
          ) {},
          Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          // s.options.ScreenSpaceEventHandler.destroy();
        }
      });
    }
  }
};
</script>

<style></style>
