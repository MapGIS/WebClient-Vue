<template>
  <span />
</template>

<script>
import { ScreenSpaceEventType } from "../../../../lib/Event/ScreenSpaceEventType";
import { deepCopy } from "../../../Utils/deepequal";

export default {
  name: "mapgis-3d-link",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    enable: { type: Boolean, default: false },
    includes: { type: Array, default: () => [] },
    excludes: { type: Array, default: () => [] },
    screenSpaceEventType: {
      type: Array,
      default: () => [
        ScreenSpaceEventType.WHEEL,
        ScreenSpaceEventType.MOUSE_MOVE,
        ScreenSpaceEventType.LEFT_UP,
        ScreenSpaceEventType.LEFT_DOWN,
        ScreenSpaceEventType.RIGHT_UP,
        ScreenSpaceEventType.RIGHT_DOWN
      ]
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
    },
    timestamp: {
      type: Number,
      default: 0 // 毫秒
    },
    interval: {
      type: Number,
      default: 60
    },
    enableWheel: {
      type: Boolean,
      default: false
    },
    enableRight: {
      type: Boolean,
      default: true
    },
    // 是否全部三维屏
    isAll3d: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "view",
    event: "change"
  },
  data() {
    return {
      time: 0,
      stamp: -1,
      active: false
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
      let { vueKey, vueCesium } = this;
      vueCesium = vueCesium || window.vueCesium;
      if (vueKey !== "default") {
        instanceOptions = vueCesium.ViewerManager[vueKey][0].options;
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
    updateView(camera) {
      let { interval, timestamp } = this;
      // 针对按帧刷新或者按照时间戳刷新走不同的分支
      if (timestamp > 0) {
        let curstamp = new Date().getTime();
        if (curstamp - this.stamp > timestamp) {
          this.updateRect(camera);
          this.stamp = curstamp;
        }
      } else {
        // 一秒60帧，每秒更新一次，减少无效更新
        if (++this.time % interval === 0) {
          this.updateRect(camera);
        }
        if (this.time > 1000000) this.time = 0;
      }
    },
    updateRect(camera) {
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
    },
    setView(viewer, camera) {
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
    },
    addHandler() {
      let { vueCesium, includes, excludes, screenSpaceEventType } = this;
      vueCesium = vueCesium || window.vueCesium;
      let sources = vueCesium.ViewerManager.flatAllSource();
      let vm = this;
      const that = this;

      this.stamp = new Date().getTime();

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
          s.source.scene.canvas
        );

        // s.source.camera.changed.addEventListener(() => {
        //   vm.updateView(s.source.camera);
        // });

        screenSpaceEventType.forEach(item => {
          s.options.ScreenSpaceEventHandler.setInputAction(function(movement) {
            if (vm.enableWheel && item.type == "WHEEL") {
              vm.active = true;
            }
            if (item.type == "LEFT_DOWN") {
              vm.active = true;
            } else if (
              item.type == "LEFT_UP" ||
              item.type == "RIGHT_UP" ||
              item.type == "RIGHT_DOWN"
            ) {
              vm.active = false;
            } else if (item.type == "MOUSE_MOVE") {
              if (!vm.active) return;
            }

            if (
              !vm.enableRight &&
              (item.type == "RIGHT_UP" || item.type == "RIGHT_DOWN")
            ) {
              return;
            }

            if (
              Cesium.Math.toDegrees(s.source.camera.pitch) < -120 &&
              !that.isAll3d
            ) {
              return;
            }
            if (
              Cesium.Math.toDegrees(s.source.camera.pitch) > -70 &&
              !that.isAll3d
            ) {
              return;
            }

            vm.updateView(s.source.camera);
            let _camerca = s.source.camera;
            sources.forEach((other, j) => {
              if (i != j) {
                vm.checkValid(other.source, _camerca, other.parent);
              }
            });
          }, Cesium.ScreenSpaceEventType[item.type]);
        });
      }
    },
    deleteHandler() {
      let vm = this;
      let { vueCesium, screenSpaceEventType } = this;
      vueCesium = vueCesium || window.vueCesium;
      /* 这段代码要结合WebGlobe里面的如下代码才能明白
      window.vueCesium.ViewerManager.addSource(vueKey, vueIndex, webGlobe, {
        ScreenSpaceEventHandler: undefined,
      }); */
      const instance = this.getInstanceOptions();
      if (instance) {
        const handler = instance.ScreenSpaceEventHandler;
        if (handler) {
          screenSpaceEventType.forEach(item => {
            handler.removeInputAction(Cesium.ScreenSpaceEventType[item.type]);
          });
          handler.destroy();
        }
      }

      let sources = vueCesium.ViewerManager.flatAllSource();
      sources.forEach((s, i) => {
        if (s.options.ScreenSpaceEventHandler) {
          screenSpaceEventType.forEach(item => {
            s.options.ScreenSpaceEventHandler.removeInputAction(
              Cesium.ScreenSpaceEventType[item.type]
            );
          });
          s.source.camera.changed.removeEventListener(() => {
            // vm.updateView(s.source.camera);
          });
          // s.options.ScreenSpaceEventHandler.destroy();
        }
      });
    }
  }
};
</script>

<style></style>
