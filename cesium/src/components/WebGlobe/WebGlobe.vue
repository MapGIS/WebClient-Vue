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
      type: String,
    },
    pluginPath: {
      type: String,
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
      get CesiumZondy() {
        return self.CesiumZondy;
      },
      get vueCesium() {
        return self.vueCesium;
      },
      get viewer() {
        return self.viewer;
      },
    };
  },

  data() {
    return {
      initialized: false,
    };
  },
  watch: {
    height: {
      handler: function() {
        //解决分屏时，cesium无限拉长的问题，要给一个固定高度
        let vm = this;
        window.CesiumZondy.getWebGlobeByInterval(function (viewer) {
          vm.$nextTick(function () {
            viewer.container.style.height = this.height + "px";
          })
        },this.vueKey)
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
    this.$_loadScript().then((Cesium) => {
      this.Cesium = Cesium;
      this.CesiumZondy = window.CesiumZondy;
      this.vueCesium = window.vueCesium;
      let container = this.$refs.container
      let viewer = new Cesium.Viewer(container, {
        ...this._props,
      });
      this.viewer = viewer;

      //解决分屏时，cesium无限拉长的问题，要给一个固定高度
      if(this.height){
        this.$nextTick(function () {
          viewer.container.style.height = this.height + "px";
        })
      }

      viewer.vueKey = vueKey;
      if (cameraView) {
        viewer.scene.camera.setView(cameraView);
      }
      window.CesiumZondy.GlobesManager.addSource(vueKey, vueIndex, viewer, {
        ScreenSpaceEventHandler: undefined,
      });
      window.vueCesium.ViewerManager.addSource(vueKey, vueIndex, viewer, {
        // 专门提供给M3D、G3D做查询用处
        ScreenSpaceEventHandler: undefined,
      });

      window.viewer = window.viewer || viewer;
      viewer.cesiumWidget.readyPromise && 
      viewer.cesiumWidget.readyPromise.then(function(globe) {
        vm.$emit("webGlobeLoaded",globe);
      });
      this.initialized = true;
      // 这里禁止吧cesium示例化后的viewer传上去，此处会发生vue劫持操作，导致内存溢出
      this.$emit("load", {
        component: this,
        Cesium: Cesium,
        CesiumZondy: window.CesiumZondy,
      });
      if (this.container) {
        let dom = document.getElementById(this.container);
        if (dom) {
          dom.style.height = "100%";
        }
      }
    });
  },

  beforeDestroy() {
    this.$nextTick(() => {
      if (this.viewer) {
        const {vueKey, vueIndex} = this;
        this.viewer.scene.primitives.removeAll();
        this.viewer.scene.primitives.destroy();
        this.viewer.entities.removeAll();
        this.viewer.destroy();
        window.CesiumZondy.GlobesManager.deleteSource(vueKey, vueIndex)
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
