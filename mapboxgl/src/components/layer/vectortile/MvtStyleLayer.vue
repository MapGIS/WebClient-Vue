<template>
  <span></span>
</template>

<script>
import withEvents from "../../../lib/withEvents";
import { deepEqual } from "../../util/util";

import EventBusMapMixin from "../../../lib/eventbus/EventBusMapMixin";
import {
  emitMapAddLayer,
  emitMapRemoveLayer
} from "../../../lib/eventbus/EmitMap";

export default {
  name: "mapgis-mvt-style-layer",
  mixins: [withEvents, EventBusMapMixin],
  inject: ["mapbox", "map"],

  props: {
    mvtStyle: {
      type: [String, Object],
      default: undefined
    },
    mode: {
      type: String,
      default: "merge" // add set merge
    },
    before: {
      type: String
    }
  },

  data() {
    return {
      lastStyle: undefined
    };
  },

  watch: {
    mvtStyle: {
      handler(next, old) {
        let deleteStyle = old;
        let { lastStyle } = this;
        if (!deepEqual(next, old)) {
          if (old && !lastStyle) {
            lastStyle = old; // mvt第一次外部传入改变
          }
          if (old && lastStyle) {
            // 后期多次外部修改mvt样式,这类情况一般是如下场景，
            // 外部同时使用了MVT组件和其他有修改mapbox样式能力的图层(ThemeLayer)
            // 初始化MVT组件的时候生成了样式StyleA,然后某个操作触发了ThemeLayer修改样式,
            // 导致了其他组件修改了mapbox的图层关系后产生的新的样式StyleB无法告诉mvt组件，
            // 而mvt组件仍然认为当前的样式是StyleA导致再维护的时候出现混乱的情况
            // 这类情况采取事件总线机制来维护协同组件间的样式关系
            if (!deepEqual(old, lastStyle)) {
              
            }
          }
          this.remove(deleteStyle);
          this.$_initStyle(this.mode, next);
        }
      },
      deep: true
    }
  },

  created() {
    this.$_deferredMount();
  },

  beforeDestroy() {
    this.remove();
  },

  methods: {
    $_deferredMount() {
      this.$_initStyle(this.mode, this.mvtStyle);
      this.initStyle = this.mvtStyle;
      this.initial = false;
    },

    async $_initStyle(mode, style) {
      let mvtStyle;
      if (!style) return;
      if (typeof style === "string") {
        mvtStyle = await this.$_getStyleObjectAsync(style);
      } else {
        mvtStyle = style;
      }
      mode = mode || this.mode;
      if (mode === "add" || mode === "merge") {
        this.$_addStyle(mvtStyle);
      } else if (mode == "set") {
        this.$_setStyle(mvtStyle);
      }
    },

    $_addStyle(mvtStyle, before) {
      before = before || this.before;
      let newStyle = this.compareStyle(mvtStyle);
      this.map.setStyle(newStyle, { diff: true });
      this.$_emitEvent("added", this);
    },

    $_setStyle(mvtStyle, before) {
      mvtStyle = mvtStyle || this.mvtStyle;
      before = before || this.before;
      this.map.setStyle(mvtStyle, { diff: true });
      this.$_emitEvent("added", this);
    },

    remove(oldStyle) {
      if (!oldStyle) return;
      let vm = this;
      const { layers, sources } = oldStyle;
      if (!layers) return;
      layers.forEach(layer => {
        if (vm.map.getLayer(layer.id)) {
          vm.map.removeLayer(layer.id);
        }
      });
      if (!sources) return;
      let lefts = this.map.getStyle().layers;
      
      Object.keys(sources).forEach(source => {
        if (vm.map.getSource(source)) {
          let finds = lefts.find(l => l.source == source);
          if (!finds) vm.map.removeSource(source);
        }
      });
    },

    compareStyle(mvtStyle) {
      let currentStyle = this.map.getStyle();
      let oldStyle = currentStyle;

      let newStyle = this.$_getStyleObject(mvtStyle);
      let newLayer = [];

      switch (this.mode) {
        case "add":
          newLayer = this.addLayers(oldStyle.layers, newStyle.layers);
          break;
        case "merge":
          newLayer = this.mergeLayers(oldStyle.layers, newStyle.layers);
          break;
      }

      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: oldStyle.glyphs || newStyle.glyphs,
        sources: { ...oldStyle.sources, ...newStyle.sources },
        layers: newLayer
      };
      return style;
    },

    $_getStyleObject(mvtStyle) {
      return mvtStyle || this.mvtStyle;
    },

    async $_getStyleObjectAsync(mvtStyle) {
      let style = {};
      mvtStyle = mvtStyle || this.mvtStyle;
      let response = await fetch(mvtStyle);
      style = await response.json();
      return style;
    },

    addLayers(olds, news) {
      news = news || [];
      if (!olds) return [].concat(news);
      let filters = olds.filter(layer => {
        let find = news.find(l => l.id === layer.id);
        return find ? false : true;
      });
      return filters.concat(news);
    },

    mergeLayers(olds, news) {
      news = news || [];
      if (!olds) return [].concat(news);
      let merges = olds.map(layer => {
        let find = news.find(l => l.id === layer.id);
        return find ? find : layer;
      });
      let unmerges = news.filter(layer => {
        let find = merges.find(l => l.id === layer.id);
        return find ? false : true;
      });
      return merges.concat(unmerges);
    },

    $_handleMapAddLayer(payload) {
      
    },

    $_handleMapRemoveLayer(payload) {
      
    }
  }
};
</script>
