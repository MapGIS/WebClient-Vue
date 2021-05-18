<template>
  <span></span>
</template>

<script>
import withEvents from "../../../lib/withEvents";

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
      default: "add" // add set
    },
    before: {
      type: String
    }
  },

  watch: {
    mvtStyle: {
      handler(next) {
        this.remove();
        this.$_initStyle(this.mode, next);
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
      this.initial = false;
    },

    async remove() {
      let vm = this;
      let mapStyle = this.map.getStyle();
      const oldStyle = await this.$_getStyleObject(this.mvtStyle);
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

    async compareStyle(mvtStyle) {
      let oldStyle = this.map.getStyle();
      let newStyle = await this.$_getStyleObject(mvtStyle);
      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: oldStyle.glyphs || newStyle.glyphs,
        sources: { ...oldStyle.sources, ...newStyle.sources },
        layers: this.mergeLayers(oldStyle.layers, newStyle.layers)
      };
      return style;
    },

    async $_getStyleObject(mvtStyle) {
      let style = {};
      mvtStyle = mvtStyle || this.mvtStyle;

      if (typeof mvtStyle === "string") {
        let response = await fetch(mvtStyle);
        style = await response.json();
      } else {
        style = mvtStyle;
      }

      return style;
    },

    mergeLayers(olds, news) {
      news = news || [];
      if (!olds) return [].concat(news);
      let filters = olds.filter(layer => {
        let find = news.find(l => l.id === layer.id);
        return find ? false : true;
      });
      return filters.concat(news);
    },

    $_initStyle(mode, style) {
      mode = mode || this.mode;
      if (mode === "add") {
        this.$_addStyle(style);
      } else if (mode == "set") {
        this.$_setStyle(style);
      }
    },

    async $_addStyle(mvtStyle, before) {
      before = before || this.before;
      let newStyle = await this.compareStyle(mvtStyle);
      this.map.setStyle(newStyle, { diff: true });
      this.$_emitEvent("added", this);
    },

    $_setStyle(mvtStyle, before) {
      mvtStyle = mvtStyle || this.mvtStyle;
      before = before || this.before;
      this.map.setStyle(mvtStyle, { diff: true });
      this.$_emitEvent("added", this);
    }
  }
};
</script>
