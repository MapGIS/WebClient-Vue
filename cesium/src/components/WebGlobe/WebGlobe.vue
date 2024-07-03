<template>
  <div class="cesium-map-wrapper">
    <div v-once :id="container" ref="container" />
    <slot v-if="initialized" />
  </div>
</template>

<script>
import "@mapgis/cesium/dist/Widgets/widgets.css";
import withPrivateMethods from "./mixins/withPrivateMethods";
import withEvents from "../../lib/withEvents";
// import mapEvents from "./events";
import { flyTo, flyToEx } from "./util";
import { initManager, initVueCesium } from "./manager";
import options from "./options";

export default {
  name: "mapgis-web-scene",

  mixins: [withEvents, withPrivateMethods],

  props: {
    libPath: {
      type: String
    },
    pluginPath: {
      type: String
    },
    height: {
      type: Number
    },
    ...options
  },

  provide() {
    const self = this;
    return {
      get Cesium() {
        return self.Cesium;
      },
      get vueCesium() {
        return self.vueCesium;
      },
      get viewer() {
        return self.viewer;
      }
    };
  },

  data() {
    return {
      initialized: false
    };
  },
  watch: {
    height: {
      handler: function() {
        //解决分屏时，cesium无限拉长的问题，要给一个固定高度
        let vm = this;
        window.vueCesium.getViewerByInterval(function(viewer) {
          vm.$nextTick(function() {
            viewer.container.style.height = this.height + "px";
          });
        }, this.vueKey);
      }
    }
  },
  methods: {
    async loadScript() {
      await this.$_loadScript();
    },
    flyTo(globeView) {
      flyTo(globeView, this.viewer);
    },
    flyToEx(globeView) {
      flyToEx(globeView, this.viewer);
    },
    /**
     * @description 根据当前层级获取高度
     * @private
     * @return {Number}  高度
     * */
    _getAltitudeByZoom(zoom) {
      const A = 40487.57;
      const B = 0.00007096758;
      const C = 91610.74;
      const D = -40467.74;
      const altitude = C * Math.pow((A - D) / (zoom - D) - 1, 1 / B);
      return altitude;
    },
    /**
     * 根据zoom范围计算相机高度范围
     */
    setCameraHeightRange() {
      if (this.minZoom !== undefined && this.maxZoom !== undefined) {
        const minHeight = this._getAltitudeByZoom(this.maxZoom);
        const maxHeight = this._getAltitudeByZoom(this.minZoom);
        const { viewer } = this;
        const self = this;

        // 在渲染阶段前添加事件监听器
        viewer.scene.preRender.addEventListener(function() {
          const cameraCurrentPosition = viewer.camera.positionCartographic;
          // console.log("当前高度--->：", cameraCurrentPosition.height);
          // 判断相机坐标是否在阈值范围内，若不在阈值范围内，则保持视点方位，修改相机高度
          let height;
          if (cameraCurrentPosition.height < minHeight) {
            height = minHeight;
          } else if (cameraCurrentPosition.height > maxHeight) {
            height = maxHeight;
          }
          // 是否显示地球
          const isShowGlobe = viewer.scene.globe.show;
          // 是否为地下模式,isEnableCollisionDetection为false时，表示为地下模式
          const isEnableCollisionDetection =
            viewer.scene.screenSpaceCameraController.enableCollisionDetection;

          // 如果地球未显示，或者开启地下模式，或者高度未定义，则不修改相机高度
          if (
            !isShowGlobe ||
            !isEnableCollisionDetection ||
            height === undefined
          ) {
            return;
          }

          // 修改相机高度
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
              cameraCurrentPosition.longitude,
              cameraCurrentPosition.latitude,
              height
            ),
            orientation: {
              direction: viewer.camera.direction,
              up: viewer.camera.up
            }
          });
        });
      }
    }
  },

  created() {
    initManager();
    initVueCesium();
    this.viewer = null;
    this.propsIsUpdating = {};
    window.viewer = window.viewer || null;
    this.initialized = false;
  },

  mounted() {
    const { vueKey, vueIndex } = this;
    const { cameraView } = this;
    let vm = this;
    this.$_loadScript().then(Cesium => {
      this.Cesium = Cesium;
      this.CesiumZondy = window.CesiumZondy;
      this.vueCesium = window.vueCesium;
      let container = this.$refs.container;
      let viewer = new Cesium.Viewer(container, {
        ...this._props
      });
      this.viewer = viewer;

      //解决分屏时，cesium无限拉长的问题，要给一个固定高度
      if (this.height) {
        this.$nextTick(function() {
          viewer.container.style.height = this.height + "px";
        });
      }

      viewer.vueKey = vueKey;
      if (cameraView) {
        viewer.scene.camera.setView(cameraView);
      }
      window.vueCesium.GlobesManager.addSource(vueKey, vueIndex, viewer, {
        ScreenSpaceEventHandler: undefined
      });
      window.vueCesium.ViewerManager.addSource(vueKey, vueIndex, viewer, {
        // 专门提供给M3D、G3D做查询用处
        ScreenSpaceEventHandler: undefined
      });

      window.viewer = window.viewer || viewer;
      viewer.cesiumWidget.readyPromise &&
        viewer.cesiumWidget.readyPromise.then(function(globe) {
          vm.$emit("webGlobeLoaded", globe);
        });
      this.initialized = true;
      // 这里禁止吧cesium示例化后的viewer传上去，此处会发生vue劫持操作，导致内存溢出
      this.$emit("load", {
        component: this,
        Cesium: Cesium,
        CesiumZondy: window.CesiumZondy,
        vueCesium: window.vueCesium
      });
      if (this.container) {
        let dom = document.getElementById(this.container);
        if (dom) {
          dom.style.height = "100%";
        }
      }
      console.log("setCameraHeightRange");
      this.setCameraHeightRange();
    });
  },

  beforeDestroy() {
    this.$nextTick(() => {
      if (this.viewer) {
        const { vueKey, vueIndex } = this;
        this.viewer.scene.primitives.removeAll();
        this.viewer.scene.primitives.destroy();
        this.viewer.entities.removeAll();
        // this.viewer.destroy();
        window.vueCesium.GlobesManager.deleteSource(vueKey, vueIndex);
        window.vueCesium.ViewerManager.deleteSource(vueKey, vueIndex);
        // this.viewer = null;
        this.initialized = false;
      }
    });
  }
};
</script>

<style>
.cesium-map-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
