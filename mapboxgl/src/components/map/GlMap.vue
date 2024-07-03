<template>
  <div :class="mapClass" :id="container" ref="container">
    <slot v-if="initialized" />
  </div>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import "@mapgis/mapbox-gl-compare/mapbox-gl-compare.css";
import * as MapboxDrawCom from "@mapgis/mapbox-gl-draw";
import DefaultDrawStyle from "./DefaultDrawStyle";

import withEvents from "../../lib/withEvents";
import mapEvents from "./events";
import options from "./options";
import withWatchers from "./mixins/withWatchers";
import withPrivateMethods from "./mixins/withPrivateMethods";
import withAsyncActions from "./mixins/withAsyncActions";
import { initManager, initVueMap } from "./manager";

import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";

import plot from "@mapgis/webclient-plot";
const {
  PlotLayer2DGroup = Zondy.Plot.PlotLayer2DGroup,
  FabricLayer = Zondy.Plot.FabricLayer,
} = plot;
const MapboxDraw = MapboxDrawCom.default;

export default {
  name: "mapgis-web-map",

  mixins: [withWatchers, withAsyncActions, withPrivateMethods, withEvents],

  props: {
    mapboxGl: {
      type: Object,
      default: null,
    },
    splitScreen: {
      type: Boolean,
      default: false,
    },
    ...options,
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
      },
      get vueMap() {
        return self.vueMap;
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
    },
  },

  created() {
    const { company } = this;
    initManager();
    initVueMap();
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
    this.$_loadMap()
      .then((map) => {
        const { actions, mapbox } = this;
        this.map = map;
        this.map.vueKey = this.vueKey;
        this.map.vueIndex = this.vueIndex;
        this.vueMap = window.vueMap;
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

        let Plot = {
          PlotLayer2DGroup: PlotLayer2DGroup,
          FabricLayer: FabricLayer,
        };
        /*
         * @date 2023-8-30
         * @author 王涵
         * @description 为了解决二维绘制在瓦片未加载成功就无法绘制问题，在初始化地图时实例化draw并将其添加到地图中，同时还可以解决绘制组件和测量组件同时使用冲突问题；
         * */
        let draweroptions = {
          displayControlsDefault: true,
          defaultMode: "static",
          touchEnabled: false,
          boxSelect: false,
          controls: {
            point: false,
            line_string: false,
            polygon: false,
            trash: false,
            combine_features: false,
            uncombine_features: false,
          },
          styles: DefaultDrawStyle,
        };
        this.drawer = new MapboxDraw(draweroptions);
        this.map.addControl(this.drawer);

        this.$emit("load", { map, component: this, actions, mapbox, Plot });

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
        window.vueMap.MapManager.deleteSource(this.vueKey, this.vueIndex);
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
