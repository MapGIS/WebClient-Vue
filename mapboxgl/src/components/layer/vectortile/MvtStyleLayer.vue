<template>
  <span></span>
</template>

<script>
import withEvents from "../../../lib/withEvents";
import { deepEqual } from "../../util/util";

export default {
  name: "mapgis-mvt-style-layer",
  mixins: [withEvents],
  inject: ["mapbox", "map"],

  props: {
    mvtStyle: {
      type: [String, Object]
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
    return {};
  },

  watch: {
    mvtStyle: {
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.remove(old);
          this.$_initStyle(this.mode, next);
        }
      }
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
      let vm = this;
      let mapStyle = this.map.getStyle();
      const { layers, sources } = oldStyle;
      if (!layers) return;
      layers.forEach(layer => {
        if (vm.map.getLayer(layer.id)) {
          vm.map.removeLayer(layer.id);
        }
      });
      if (!sources) return;
      Object.keys(sources).forEach(source => {
        if (vm.map.getSource(source)) {
          vm.map.removeSource(source);
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
    }
  }
};
</script>
