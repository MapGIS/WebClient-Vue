<template>
  <div class="cesium-map-wrapper">
    <div
      v-once
      :id="container"
      ref="container"
    />
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
  name: "cesium-web-globe",

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

  provide () {
    const self = this;
    return {
      get Cesium () {
        return self.Cesium;
      },
      get webGlobe () {
        return self.webGlobe;
      },
    };
  },

  data () {
    return {
      initialized: false,
    };
  },

  methods: {
    async loadScript () {
      await this.$_loadScript();
    },
    flyTo (globeView) {
      flyTo(globeView, this.webGlobe);
    },
    flyToEx (globeView) {
      flyToEx(globeView, this.webGlobe);
    },
  },

  created () {
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

  mounted () {
    const { vueKey, vueIndex } = this;
    this.$_loadScript().then((Cesium) => {
      this.Cesium = Cesium;
      const webGlobe = new Cesium.WebSceneControl(this.$refs.container, {
        ...this._props,
      });
      this.webGlobe = webGlobe;
      window.CesiumZondy.GlobesManager.addSource(vueKey, vueIndex, webGlobe,
        { ScreenSpaceEventHandler: undefined }
      );

      window.webGlobe = window.webGlobe || webGlobe;
      /*     const eventNames = Object.keys(mapEvents);
      this.$_bindMapEvents(eventNames);
      this.$_registerAsyncActions(map);
      this.$_bindPropsUpdateEvents(); */
      this.initialized = true;
      // 这里禁止吧cesium示例化后的webGlobe传上去，此处会发生vue劫持操作，导致内存溢出
      this.$emit("load", { component: this, Cesium: Cesium });
      document.getElementById(this.container).style.height = "100%";
    });
  },

  beforeDestroy () {
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