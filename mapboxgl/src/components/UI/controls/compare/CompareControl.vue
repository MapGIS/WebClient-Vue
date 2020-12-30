<template>
  <div class="mapgis-compare-bar">
    <slot v-if="control" />
  </div>
</template>

<script>
import Compare from '@mapgis/mapbox-gl-compare';
// const Compare = require('mapbox-gl-compare');
import controlMixin from "../controlMixin";

const StateEvents = {
  update: "update"
};

export default {
  name: "mapbox-compare",
  mixins: [controlMixin],
  props: {
    default: {
      type: Boolean,
      default: true
    },
  },

  data () {
    return {
      initial: true,
      control: undefined,
      enable: false
    };
  },

  created () {
    this.control = new CompareControl(this.$props);
    this.$_addControl();
    let events = Object.keys(StateEvents);
    this.$_bindSelfEvents(events, this.control);
  },

  methods: {
    /**
    * @param {Object} a The first Mapbox GL Map
    * @param {Object} b The second Mapbox GL Map
    * @param {string|HTMLElement} container An HTML Element, or an element selector string for the compare container. It should be a wrapper around the two map Elements.
    * @param {Object} options
    * @param {string} [options.orientation=vertical] The orientation of the compare slider. `vertical` creates a vertical slider bar to compare one map on the left (map A) with another map on the right (map B). `horizontal` creates a horizontal slider bar to compare on mop on the top (map A) and another map on the bottom (map B).
    * @param {boolean} [options.mousemove=false] If `true` the compare slider will move with the cursor, otherwise the slider will need to be dragged to move.
    * @example
    * var compare = new mapboxgl.Compare(beforeMap, afterMap, '#wrapper', {
    *   orientation: 'vertical',
    *   mousemove: true
    * });
    * @see [Swipe between maps](https://www.mapbox.com/mapbox-gl-js/example/mapbox-gl-compare/)
    */
    compare (a, b, container, options) {
      console.log('对比', Compare);
      console.log('参数', a, b, container, options);
      this.$compare = new Compare(a, b, container, options);
      this.enable = true
    },
    remove () {
      if (this.enable) {
        this.$compare && this.$compare.remove();
        this.$compare = undefined;
      }
      this.enable = false;
    }
  }
};

class CompareControl {
  constructor(option) {
    this.option = option || {};
  }

  initDom (dom) {
    dom.className = "mapboxgl-ctrl mapboxgl-compare-bar";
    dom.style.display = "flex";

    const controls = [""];
  }

  bindEvent () {
  }

  unbindEvent () {
  }

  onAdd (map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl";
    this.initDom(this._container);
    this.bindEvent();
    return this._container;
  }

  onRemove () {
    this.unbindEvent();
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

</script>
<style>
.mapgis-compare-bar {
}
</style>