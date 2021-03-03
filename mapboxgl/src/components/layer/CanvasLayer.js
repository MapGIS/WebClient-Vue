import layerEvents from "../../lib/layerEvents";
import mixin from "./layerMixin";

export default {
  name: "mapgis-canvas-layer",
  mixins: [mixin],

  inject: ["mapbox", "map"],

  props: {
    source: {
      type: Object,
      required: true
    },
    layer: {
      type: Object,
      default: null
    },
    delay: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    canvasElement() {
      return this.mapSource ? this.mapSource.getCanvas() : null;
    }
  },

  watch: {
    coordinates(val) {
      if (this.initial) return;
      this.mapSource.setCoordinates(val);
    },
    delay(val) {
      if (val === true) {
        this.$_delayAddLayer();
      }
    }
  },

  created() {
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      const source = {
        type: "canvas",
        ...this.source
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        }
      }
      if (!this.delay) {
        this.$_addLayer();
        this.$_bindLayerEvents(layerEvents);
        this.initial = false;
      } else {
        this.$_emitEvent("added", {
          component: this
        });
      }
    },

    $_addLayer() {
      const vm = this;
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      let layer = {
        id: this.layerId,
        source: this.sourceId,
        type: "raster",
        ...this.layer
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", {
        layerId: this.layerId,
        canvas: this.canvasElement
      });
    },

    $_delayAddLayer() {
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.initial = false;
    }
  }
};
