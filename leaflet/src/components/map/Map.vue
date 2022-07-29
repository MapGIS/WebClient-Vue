<template>
  <div :class="mapClass" :id="container" ref="container">
    <slot v-if="initialized" />
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";

import withEvents from "../../lib/withEvents";
import mapEvents from "./events";
import options from "./options";
import withWatchers from "./mixins/withWatchers";
import withPrivateMethods from "./mixins/withPrivateMethods";

import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";

export default {
  name: "mapgis-web-lightmap",

  mixins: [withWatchers, withPrivateMethods, withEvents],

  props: {
    ...options,
  },

  provide() {
    const self = this;
    return {
      get leaflet() {
        return self.leaflet;
      },
      get map() {
        return self.map;
      },
      get resize() {
        return this.resizeEvent;
      },
    };
  },

  data() {
    return {
      initialized: false,
      resizeEvent: undefined,
    };
  },

  computed: {
    loaded() {
      return this.map ? this.map.loaded() : false;
    },
  },

  created() {
    this.map = null;
  },

  mounted() {
    this.$_loadMap()
      .then((map) => {
        this.map = map;

        // const eventNames = Object.keys(mapEvents);
        // this.$_bindMapEvents(eventNames);

        this.initialized = true;
        this.$emit("load", { map, component: this, leaflet });
        this.bindSize();
      })
      .catch(function onRejected(error) {
        document.write("错误：" + error);
      });
  },

  beforeDestroy() {
    this.$nextTick(() => {
      if (this.map) {
        this.unbindSize();
        this.map.remove();
        this.initialized = false;
        this.map = null;
      }
    });
  },

  methods: {
    bindSize() {
      this.resizeEvent = debounce(
        () => {
          this.resize();
        },
        100,
        { leading: true }
      );
      addListener(this.$el, this.resizeEvent);
    },
    unbindSize() {
      removeListener(this.$el, this.resizeEvent);
    },
    resize() {
      const { autoResize, map } = this;
      if (autoResize && map) {
        map.resize();
      }
    },
  },
};
</script>

<style>
.leaflet-default-map {
  height: 100vh;
  width: 100vw;
}
.leaflet-control-attribution {
  display: none !important;
}
</style>
