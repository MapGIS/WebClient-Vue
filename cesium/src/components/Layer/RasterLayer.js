import IgsOptions from "./RasterOptions";

export default {
  props: { ...IgsOptions },
  inject: ["Cesium", "webGlobe"],
  created() {
    this.imageryLayer = this.createCesiumObject();
    this.mount();
    this.watchProp();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      const { $props, provider } = this;
      return new Cesium.ImageryLayer(provider || {}, $props);
    },
    watchProp() {
      let { show, alpha } = this;
      if (show) {
        this.$watch("show", function(next) {
          if (this.initial) return;
          this.imageryLayer.show = next;
        });
      }
      if (alpha) {
        this.$watch("alpha", function(next) {
          if (this.initial) return;
          this.imageryLayer.alpha = next;
        });
      }
    },
    mount() {
      const { webGlobe, imageryLayer, layerIndex } = this;
      const viewer = webGlobe.viewer;
      viewer.imageryLayers.add(imageryLayer, layerIndex);
      return (
        !viewer.isDestroyed() && viewer.imageryLayers.contains(imageryLayer)
      );
    },
    unmount() {
      const { webGlobe, imageryLayer } = this;
      const viewer = webGlobe.viewer;
      return !viewer.isDestroyed() && viewer.imageryLayers.remove(imageryLayer);
    }
  },
  render(createElement) {
    return createElement("span");
  }
};
