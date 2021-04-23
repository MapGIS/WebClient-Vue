<script>
import Compare from "@mapgis/mapbox-gl-compare";

export default {
  name: "mapgis-compare",
  // mixins: [controlMixin],
  props: {
    target: {
      type: String,
      default: "mapgis-compare-default-root"
    },
    default: {
      type: Boolean,
      default: true
    },
    orientation: {
      type: String,
      default: "vertical"
    }
  },
  components: {},

  data() {
    return {
      initial: true,
      control: undefined,
      beforeMap: undefined,
      afterMap: undefined
    };
  },

  created() {},

  mounted() {
    this.bindEvent();
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
    compare(a, b, container, options) {
      console.log("对比", Compare);
      console.log("参数", a, b, container, options);
      this.$compare = new Compare(a, b, container, options);
    },
    bindEvent() {
      if (this.$slots.beforeMap && this.$slots.afterMap) {
        let left = this.$slots.beforeMap[0];
        const beforeListeners = left.componentOptions.listeners;
        left.componentOptions.listeners = Object.assign({}, beforeListeners, {
          load: this.handleBeforeMapLoad
        });
        let right = this.$slots.afterMap[0];
        const afterListeners = right.componentOptions.listeners;
        right.componentOptions.listeners = Object.assign({}, afterListeners, {
          load: this.handleAfterMapLoad
        });
      }
    },
    handleBeforeMapLoad(payload) {
      this.beforeMap = payload.map;
      this.handleMap();
    },
    handleAfterMapLoad(payload) {
      this.afterMap = payload.map;
      this.handleMap();
    },
    handleMap() {
      if (this.beforeMap && this.afterMap) {
        let parent = document.getElementById(this.target);
        this.compare(this.beforeMap, this.afterMap, parent, {
          // Set this to enable comparing two maps by mouse movement:
          // mousemove: true,
          orientation: this.orientation
        });
      }
    }
  },

  render(h) {
    let children;
    if (this.$slots.beforeMap && this.$slots.afterMap) {
      this.bindEvent();
      children = [this.$slots.beforeMap, this.$slots.afterMap];
    }
    return h(
      "div",
      {
        class: "mapgis-compare-bar",
        attrs: {
          id: this.target
        }
      },
      children
    );
  }
};
</script>
<style lang="css">
.mapgis-compare-bar {
  position: relative;
  height: 100vh;
}
.mapgis-compare-bar .mapboxgl-map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
