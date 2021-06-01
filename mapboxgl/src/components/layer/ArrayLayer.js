import MapboxRasterLayer from "./RasterLayer";
/**
 * @author 潘卓然
 * @description 本身是想实现图层间的拖拽，后面还是发现无法摆脱Vue的数组渲染机制
 */
export default {
  name: "mapgis-array-layer",
  components: {
    MapboxRasterLayer
  },
  props: {
    layers: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      sorts: []
    };
  },

  watch: {
    layers() {
      // this.updateSorts()
    }
  },

  created() {
    // this.updateSorts()
  },

  render: function(createElement) {
    return createElement(
      "div",
      this.layers.map(function(layer) {
        return createElement(layer.ComponentName, {
          props: layer.ComponentProps
        });
      })
    );
  },

  methods: {
    updateSorts() {
      let before;
      this.sorts = this.layers.reverse().map(l => {
        l.ComponentProps.before = before;
        before = l.id;
        return l;
      });
    }
  }
};
