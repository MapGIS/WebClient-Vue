<template>
  <div :class="mapClass" :id="container" ref="container">
    <slot v-if="initialized" />
  </div>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import "@mapgis/mapbox-gl-compare/mapbox-gl-compare.css";

import withEvents from "../../lib/withEvents";
import mapEvents from "./events";
import options from "./options";
import withWatchers from "./mixins/withWatchers";
import withPrivateMethods from "./mixins/withPrivateMethods";
import withAsyncActions from "./mixins/withAsyncActions";

import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";

export default {
  name: "mapgis-web-map",

  mixins: [
    withWatchers,
    withAsyncActions,
    withPrivateMethods,
    withEvents
  ],

  props: {
    mapboxGl: {
      type: Object,
      default: null
    },
    ...options
  },

  provide() {
    const self = this;
    return {
      get mapbox() {
        return self.mapbox || self.mapboxPromise._value;
      },
      get map() {
        return self.map;
      },
      get actions() {
        return self.actions;
      },
      get theme() {
        return self.theme;
      },
      get color() {
        return self.color;
      },
      get resize() {
        return this.resizeEvent;
      }
    };
  },

  data() {
    return {
      initialized: false,
      resizeEvent: undefined
    };
  },

  computed: {
    loaded() {
      return this.map ? this.map.loaded() : false;
    },
    version() {
      return this.map ? this.map.version : null;
    },
    isStyleLoaded() {
      return this.map ? this.map.isStyleLoaded() : false;
    },
    areTilesLoaded() {
      return this.map ? this.map.areTilesLoaded() : false;
    },
    isMoving() {
      return this.map ? this.map.isMoving() : false;
    },
    canvas() {
      return this.map ? this.map.getCanvas() : null;
    },
    canvasContainer() {
      return this.map ? this.map.getCanvasContainer() : null;
    },
    images() {
      return this.map ? this.map.listImages() : null;
    }
  },

  created() {
    const { company } = this;    
    this.map = null;
    this.propsIsUpdating = {};
    if (company.indexOf("mapgis") >= 0) {
      this.mapboxPromise = this.mapboxGl
        ? Promise.resolve(this.mapboxGl)
        : import("@mapgis/mapbox-gl");
    } else {
      this.mapboxPromise = this.mapboxGl
        ? Promise.resolve(this.mapboxGl)
        : import("mapbox-gl");
    }
  },

  mounted() {
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
      /*
      * @date 2021-9-21
      * @author 廖欣迪
      * @description 为了使用异步的地图方法
      * */
      this.$_registerAsyncActions(map);
      this.$_bindPropsUpdateEvents();
      this.initialized = true;
      this.$emit("load", { map, component: this, actions, mapbox });
      this.bindSize();
    }).catch(function onRejected(error){
      document.write('错误：' + error);
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
    }
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

/*popup样式*/
.popup-content {
  width: auto;
}

.mapboxgl-popup-content {
  width: 330px !important;
}

.mapgis-popup-container {
  padding: 10px 12px 20px 12px;
}

.mapgis-popup-row-container{
  height: 130px;
  overflow: auto;
}

.mapgis-popup-row:nth-child(2n) {
  background-color: rgb(231, 232, 233);
}

.mapgis-popup-row:nth-child(2n + 1) {
  background-color: rgb(244, 244, 244);
}

.mapgis-popup-row:hover {
  background-color: rgb(220, 235, 254);
  border-left: 2px solid rgb(115, 176, 251);
}

.mapgis-popup-row {
  text-align: left;
  white-space: nowrap;
  padding: 6px 12px;
  height: 32px;
  line-height: 11px;
  min-width: 240px;
  border-left: 2px solid rgba(115, 176, 251, 0);
}

.mapgis-popup-title {
  color: rgb(178, 178, 178);
  font-weight: bold;
  border-bottom: 2px solid rgb(232, 232, 232);
  padding: 6px 0;
  line-height: 11px;
  margin-bottom: 3px;
  text-align: left;
  white-space: nowrap;
  height: 32px;
  min-width: 240px;
  border-left: 2px solid rgba(115, 176, 251, 0);
}

.mapgis-popup-item {
  display: inline-block;
  line-height: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.mapgis-popup-field {
  width: 30%;
}

.mapgis-popup-value {
  width: 70%;
  text-align: right;
}

/*第二种popup样式*/
.mapgis-popup-left-row {
  height: 56px;
}

.mapgis-popup-row-left-container{
  height: 224px;
}

.mapgis-popup-left-item {
  line-height: 22px;
}

.mapgis-popup-left-field {
  color: rgb(152, 152, 152);
  font-size: 12px;
}

.mapgis-popup-left-value {
  font-size: 15px;
}

.mapgis-popup-ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

/*第三种popup样式*/
.mapgis-popup-underline-row {
  text-align: left;
  white-space: nowrap;
  padding: 6px 12px;
  height: 32px;
  line-height: 11px;
  min-width: 240px;
  border-left: 2px solid rgba(115, 176, 251, 0);
  border-bottom: 1px solid rgb(246, 246, 246);
}

.mapgis-popup-underline-row:hover {
  background-color: rgb(220, 235, 254);
  border-left: 2px solid rgb(115, 176, 251);
}

.mapgis-popup-underline-item, .mapgis-popup-point-item{
  line-height: 22px;
}

.mapgis-popup-table-item{
  line-height: 30px;
}

.mapgis-popup-underline-field {
  font-weight: bold;
  color: rgb(152, 152, 152);
}

/*第四种popup样式*/
.mapgis-popup-point-row {
  text-align: left;
  white-space: nowrap;
  padding: 6px 12px;
  height: 32px;
  line-height: 11px;
  min-width: 240px;
  border-left: 2px solid rgba(115, 176, 251, 0);
}

.mapgis-popup-point-row:hover {
  background-color: rgb(220, 235, 254);
  border-left: 2px solid rgb(115, 176, 251);
}

.mapgis-popup-point-field {
  margin-left: 7px;
}

.mapgis-popup-point {
  display: inline-block;
  width: 3px;
  height: 3px;
  border: 1px solid black;
  border-radius: 50%;
  background: black;
  margin-bottom: 10px;
}

.mapgis-popup-point-value{
  padding-right: 10px;
}

/*第五种popup样式*/
.mapgis-popup-table-row {
  text-align: left;
  white-space: nowrap;
  padding: 0;
  height: 32px;
  line-height: 11px;
  min-width: 240px;
  border-bottom: 2px solid rgb(235, 235, 235);
}

.mapgis-popup-table-field {
  background: rgb(240, 241, 241);
  padding-left: 14px;
}
.mapgis-popup-table-value{
  padding-right: 10px;
}

</style>
