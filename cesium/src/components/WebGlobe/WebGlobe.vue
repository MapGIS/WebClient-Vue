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
import mapEvents from "./events";
import { flyTo, flyToEx } from "./util";
import { initManager } from "./manager";
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
    ...options,
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
      get webGlobe() {
        return self.webGlobe;
      },
    };
  },

  data() {
    return {
      initialized: false,
    };
  },

  methods: {
    async loadScript() {
      await this.$_loadScript();
    },
    flyTo(globeView) {
      flyTo(globeView, this.webGlobe);
    },
    flyToEx(globeView) {
      flyToEx(globeView, this.webGlobe);
    },
  },

  created() {
    initManager();
    this.webGlobe = null;
    this.propsIsUpdating = {};

    window.webGlobe = window.webGlobe || null;
    /*     const eventNames = Object.keys(mapEvents);
    this.$_bindMapEvents(eventNames);
    this.$_registerAsyncActions(map);
    this.$_bindPropsUpdateEvents(); */
    this.initialized = false;

    // const cesiumLib = import("@mapgis/cesium");
    // Cesium.buildModuleUrl.setBaseUrl('./cesium/');

    /* console.log("cesium created", this.cesium);
    this.cesiumPromise = this.cesium
      ? Promise.resolve(this.cesium)
      : this.loadScript(); */
  },

  mounted() {
    const { vueKey, vueIndex } = this;
    const { cameraView } = this;
    this.$_loadScript().then((Cesium) => {
      this.Cesium = Cesium;
      this.CesiumZondy = window.CesiumZondy;
      let container = this.$refs.container
      const webGlobe = new Cesium.WebSceneControl(container, {
        ...this._props,
      });
      this.webGlobe = webGlobe;
      if (cameraView) {
        webGlobe.viewer.scene.camera.setView(cameraView);
      }
      window.CesiumZondy.GlobesManager.addSource(vueKey, vueIndex, webGlobe, {
        ScreenSpaceEventHandler: undefined,
      });

      window.webGlobe = window.webGlobe || webGlobe;
      // window.webGlobe = webGlobe;
      /*     const eventNames = Object.keys(mapEvents);
      this.$_bindMapEvents(eventNames);
      this.$_registerAsyncActions(map);
      this.$_bindPropsUpdateEvents(); */
      this.initialized = true;
      // 这里禁止吧cesium示例化后的webGlobe传上去，此处会发生vue劫持操作，导致内存溢出
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
      if (this.webGlobe) {
        this.webGlobe.viewer.scene.primitives.removeAll();
        this.webGlobe.viewer.scene.primitives.destroy();
        this.webGlobe.viewer.entities.removeAll();
        this.webGlobe.viewer.destroy();
        // this.webGlobe = null;
        // this.viewer = null;
        this.initialized = false;
      }
    });
  },
};
</script>

<style>
.cesium-map-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
