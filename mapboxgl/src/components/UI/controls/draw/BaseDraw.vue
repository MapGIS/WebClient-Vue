<template>
  <div>
    <!-- slot for toolbar -->
    <slot name="toolbar" />
    <!-- slot for toolbar-item -->
    <slot v-if="drawer" />
  </div>
</template>

<style></style>

<script>
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
// import { CircleMode, DragCircleMode } from "mapbox-gl-draw-circle";
import * as MapboxDrawCom from "@mapbox/mapbox-gl-draw";
import RadiusMode from "@mapgis/mapbox-gl-draw-radius";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode
} from "mapbox-gl-draw-circle";
const modes = MapboxDrawCom.default.modes;
const MapboxDraw = MapboxDrawCom.default;
modes.draw_rectangle = DrawRectangle;
modes.draw_circle = RadiusMode;
modes.draw_radius = CircleMode;
modes.drag_radius = DragCircleMode;
modes.direct_select = DirectMode;
modes.simple_select = SimpleSelectMode;

import drawMixin from "./drawMixin";
import controlMixin from "../withControlEvents";
import DefaultDrawStyle from "./DefaultDrawStyle";

const drawEvents = {
  // es6
  drawCreate: "draw.create",
  drawDelete: "draw.delete",
  drawCombine: "draw.combine",
  drawUncombine: "draw.uncombine",
  drawUpdate: "draw.update",
  drawSelectionChange: "draw.selectionchange",
  drawModeChange: "draw.modechange",
  drawRender: "draw.render",
  drawActionable: "draw.actionable",
  // brower
  drawcreate: "draw.create",
  drawdelete: "draw.delete",
  drawcombine: "draw.combine",
  drawuncombine: "draw.uncombine",
  drawupdate: "draw.update",
  drawselectionchange: "draw.selectionchange",
  drawmodechange: "draw.modechange",
  drawrender: "draw.render",
  drawactionable: "draw.actionable"
};

export default {
  name: "mapgis-draw",
  mixins: [drawMixin, controlMixin],

  //@see https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5
  // inject: ["mapbox", "map"],

  provide() {
    const self = this;
    return {
      get drawer() {
        // 提供markerg给子组件popup或者插槽槽
        return self.drawer;
      }
    };
  },

  props: {
    // mapbox drawer options
    keybindings: {
      type: Boolean,
      default: true
    },
    touchEnabled: {
      type: Boolean,
      default: true
    },
    boxSelect: {
      type: Boolean,
      default: true
    },
    clickBuffer: {
      type: Number,
      default: 2
    },
    touchBuffer: {
      type: Number,
      default: 25
    },
    controls: {
      type: Object,
      default: () => {
        return {
          point: false,
          line_string: false,
          polygon: false,
          trash: false,
          combine_features: false,
          uncombine_features: false
        };
      }
    },
    displayControlsDefault: {
      type: Boolean,
      default: true
    },
    styles: {
      type: Array,
      default: () => DefaultDrawStyle
    },
    modes: {
      type: Object,
      default: () => modes
    },
    defaultMode: {
      type: String,
      default: "simple_select"
    },
    userProperties: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      initial: true,
      drawer: undefined,
      oldStyles: DefaultDrawStyle
    };
  },

  watch: {
    coordinates(lngLat) {
      if (this.initial) return;
      this.drawer.setLngLat(lngLat);
    },
    draggable(next) {
      if (this.initial) return;
      this.drawer.setDraggable(next);
    },
    styles: {
      handler: function(news) {
        this.oldStyles = this.combineStyle(news);
      }
    }
  },

  mounted() {
    this.$_initDraw();
  },

  beforeDestroy() {
    this.remove();
  },

  methods: {
    enableDrawer() {
      this.$_initDraw();
      this.$_compareStyle();
      this.$_unbindMeasureEvents();
      this.$_addDrawControl(this.drawer);
      this.$_emitEvent("added", { drawer: this.drawer });
      const eventNames = Object.keys(drawEvents);
      this.$_unbindDrawEvents();
      this.$_bindSelfEvents(eventNames);
    },

    $_initDraw() {
      const draweroptions = {
        ...this.$props,
        styles: this.oldStyles
      };
      this.drawer = new MapboxDraw(draweroptions);

      this.initial = false;
      return this.drawer;
    },

    $_bindSelfEvents(events) {
      if (events.length === 0) return;
      // asControl 本身是拥有 $_bindSelfEvents 方法的，但是这里的draw组件并不是遵循的mapbox-gl.js的事件机制，
      // 因此我们需要覆盖该方法, 按照对应的业务方式实现
      const vm = this;
      // 使用vue的this.$listeners方式来订阅用户指定的事件
      Object.keys(this.$listeners).forEach(eventName => {
        if (events.includes(eventName)) {
          this.$_bindDrawEvents(
            drawEvents[eventName],
            vm.$_emitDrawEvent.bind(vm, eventName)
          );
        }
      });
    },

    // 按照@mapgis/webclient-vue-mapboxgl的规范 发送事件 ，其实就是用{type：eventName}包装事件名
    $_emitDrawEvent(eventName, eventData) {
      return this.$_emitSelfEvent({ type: eventName }, eventData);
    },

    $_compareStyle() {
      let combines = this.combineStyle();
      this.changeMapStyle(combines);
      this.oldStyles = combines;
    },

    combineStyle(news) {
      let olds = this.oldStyles || DefaultDrawStyle;
      news = news || this.styles;
      let combines = olds.filter(l => {
        return !news.find(f => f.id === l.id);
      });
      combines = combines.concat(news);
      return combines;
    },

    changeMapStyle(layers) {
      let { map } = this;
      layers.forEach(layer => {
        if (map.getLayer(layer)) {
          if (layer.filter) {
            map.setFilter(layer.id, layer.filter);
          }
          if (layer.paint) {
            Object.keys(layer.paint).forEach(key => {
              map.setPaintProperty(layer.id, key, layer.paint[key]);
            });
          }
          if (layer.layout) {
            Object.keys(layer.layout).forEach(key => {
              map.setLayoutProperty(layer.id, key, layer.layout[key]);
            });
          }
        }
      });
    },

    remove() {
      this.$_unbindDrawEvents();
      this.$_removeDrawControl();

      this.$_emitEvent("removed");
    }
  }
};
</script>
