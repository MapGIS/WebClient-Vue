// import withRegistration from "../../lib/withRegistration";
import withEvents from "../../lib/withEvents";

const mapgisCustomProps = {
  baseUrl: {
    type: String,
    default: null,
  },
  mapgisOffset: {
    type: Number,
    default: 0,
  },
};

const CommonProps = {
  minZoom: {
    type: Number,
    default: 0,
  },
  zoomOffset: {
    type: Number,
    default: 0,
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  maxZoom: {
    type: Number,
    default: 20,
  },
  tileSize: {
    type: Number,
    default: 256,
  },
  opacity: {
    type: Number,
    default: 1.0,
  },
  zIndex: {
    type: Number,
    default: 1,
  },
};

export default {
  mixins: [withEvents],
  props: {
    ...mapgisCustomProps,
    ...CommonProps,
  },

  inject: ["leaflet", "map"],

  watch: {},

  data() {
    return {
      initial: true,
      layer: undefined,
    };
  },

  computed: {
    mapLayer() {
      return this.layer && this.map.hasLayer(this.layer) ? this.layer : null;
    },
  },

  created() {
    if (this.layerStyle.opacity) {
      this.$watch("layerStyle.opacity", function (next) {
        if (this.initial) return;
        this.layer.setOpacity(next);
      });
    }

    if (this.layerStyle.zIndex) {
      this.$watch("layerStyle.zIndex", function (next) {
        if (this.initial) return;
        this.layer.setZIndex(next);
      });
    }

    if (this.opacity) {
      this.$watch("opacity", function (next) {
        if (this.initial) return;
        this.layer.setOpacity(next);
      });
    }

    if (this.zIndex) {
      this.$watch("zIndex", function (next) {
        if (this.initial) return;
        this.layer.setZIndex(next);
      });
    }
  },

  beforeDestroy() {
    if (this.layer) {
      try {
        this.layer.remove();
      } catch (err) {
        this.$_emitEvent("layer-does-not-exist", {
          error: err,
        });
      }
    }
  },

  methods: {
    $_emitLayerMapEvent(event) {
      return this.$_emitMapEvent(event, { layerId: this.layerId });
    },

    $_bindLayerEvents(events) {
      Object.keys(this.$listeners).forEach((eventName) => {
        if (events.includes(eventName)) {
          this.map.on(eventName, this.layerId, this.$_emitLayerMapEvent);
        }
      });
    },

    $_unbindEvents(events) {
      if (this.map) {
        events.forEach((eventName) => {
          this.map.off(eventName, this.layerId, this.$_emitLayerMapEvent);
        });
      }
    },

    remove() {
      // this.layer.remove();
      // this.$_emitEvent("layer-removed", { layerId: this.layerId });
      this.$destroy();
    },
  },

  render() {},
};
