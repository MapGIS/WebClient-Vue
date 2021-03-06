<template>
  <div
    :class="mapClass"
    :id="container"
    ref="container"
  >
    <slot v-if="initialized" />
  </div>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import '@mapgis/mapbox-gl-compare/mapbox-gl-compare.css'

import withEvents from "../../lib/withEvents";
import mapEvents from "./events";
import options from "./options";
import withWatchers from "./mixins/withWatchers";
import withPrivateMethods from "./mixins/withPrivateMethods";
// import withAsyncActions from "./mixins/withAsyncActions";

export default {
  name: "mapgis-web-map",

  mixins: [withWatchers, /* withAsyncActions, */ withPrivateMethods, withEvents],

  props: {
    mapboxGl: {
      type: Object,
      default: null
    },
    ...options
  },

  provide () {
    const self = this;
    return {
      get mapbox () {
        return self.mapbox;
      },
      get map () {
        return self.map;
      },
      get actions () {
        return self.actions;
      },
      get theme () {
        return self.theme;
      },
      get color () {
        return self.color;
      }
    };
  },

  data () {
    return {
      initialized: false
    };
  },

  computed: {
    loaded () {
      return this.map ? this.map.loaded() : false;
    },
    version () {
      return this.map ? this.map.version : null;
    },
    isStyleLoaded () {
      return this.map ? this.map.isStyleLoaded() : false;
    },
    areTilesLoaded () {
      return this.map ? this.map.areTilesLoaded() : false;
    },
    isMoving () {
      return this.map ? this.map.isMoving() : false;
    },
    canvas () {
      return this.map ? this.map.getCanvas() : null;
    },
    canvasContainer () {
      return this.map ? this.map.getCanvasContainer() : null;
    },
    images () {
      return this.map ? this.map.listImages() : null;
    }
  },

  created () {
    this.map = null;
    this.propsIsUpdating = {};
    this.mapboxPromise = this.mapboxGl
      ? Promise.resolve(this.mapboxGl)
      : import("@mapgis/mapbox-gl");
  },

  mounted () {
    this.$_loadMap().then(map => {
      const { actions, mapbox } = this;
      this.map = map;
      if (this.RTLTextPluginUrl !== undefined) {
        this.mapbox.setRTLTextPlugin(
          this.RTLTextPluginUrl,
          this.$_RTLTextPluginError
        );
      }
      const eventNames = Object.keys(mapEvents);
      this.$_bindMapEvents(eventNames);
      // this.$_registerAsyncActions(map);
      this.$_bindPropsUpdateEvents();
      this.initialized = true;
      this.$emit("load", { map, component: this, actions, mapbox });
    });
  },

  beforeDestroy () {
    this.$nextTick(() => {
      if (this.map) {
        this.map.remove();
        this.initialized = false;
        this.map = null;
      }
    });
  }
};
</script>

<style>
.mapboxgl-map-wrapper {
  height: 100%;
  position: relative;
  width: 100%;
}

.mapboxgl-map-wrapper .mapboxgl-map {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.mapbox-default-map .mapboxgl-canvas-container {
  width: 100% !important;
  height: 100vh !important;
}
</style>
