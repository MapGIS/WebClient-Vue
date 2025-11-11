// import withRegistration from "../../lib/withRegistration";
import withEvents from "../../lib/withEvents";

const mapgisCustomProps = {
  url: {
    type: String,
    default: null,
  },
  mapgisOffset: {
    type: Number,
    default: 0,
  },
};

const mapboxSourceProps = {
  sourceId: {
    type: String,
    default: undefined,
  },
  source: {
    type: [Object, String],
    default: undefined,
  },
};

const mapboxLayerStyleProps = {
  layerId: {
    type: String
  },
  layer: {
    type: Object,
    default: () => {
      return {};
    },
  },
  before: {
    type: String,
    default: undefined,
  },
};

const componentProps = {
  clearSource: {
    type: Boolean,
    default: true,
  },
  replaceSource: {
    type: Boolean,
    default: false,
  },
  replace: {
    type: Boolean,
    default: false,
  },
  token: {
    type: Object,
  },
};

export default {
  mixins: [withEvents],
  props: {
    ...mapboxSourceProps,
    ...mapboxLayerStyleProps,
    ...componentProps,
    ...mapgisCustomProps,
  },

  inject: ["mapbox", "map"],

  watch: {
    before(val) {
      // 特别声明，这个before的监听行为必须在replaceSource=false
      // &&replace=false 的前提下才能成立，这是先决条件
      this.move(val);
    },
  },

  data() {
    return {
      initial: true,
    };
  },

  computed: {
    sourceLoaded() {
      return this.map
        ? this.map.isSourceLoaded(this.sourceId || this.layerId)
        : false;
    },
    mapLayer() {
      return this.map ? this.map.getLayer(this.layerId) : null;
    },
    mapSource() {
      return this.map
        ? this.map.getSource(this.sourceId || this.layerId)
        : null;
    },
  },

  created() {
    if (this.layer.minzoom) {
      this.$watch("layer.minzoom", function (next) {
        if (this.initial) return;
        this.map.setLayerZoomRange(this.layerId, next, this.layer.maxzoom);
      });
    }

    if (this.layer.maxzoom) {
      this.$watch("layer.maxzoom", function (next) {
        if (this.initial) return;
        this.map.setLayerZoomRange(this.layerId, this.layer.minzoom, next);
      });
    }

    if (this.layer.paint) {
      this.$watch(
        "layer.paint",
        function (next) {
          if (this.initial) return;
          if (next) {
            for (let prop of Object.keys(next)) {
              if (this.customLayer) {
                if (prop === "raster-opacity") {
                  this.customLayer.setOpacity(next[prop]);
                }
              } else {
                this.map.setPaintProperty(this.layerId, prop, next[prop]);
              }
            }
          }
        },
        { deep: true }
      );
    }

    if (this.layer.layout) {
      this.$watch(
        "layer.layout",
        function (next) {
          if (this.initial) return;
          if (next) {
            for (let prop of Object.keys(next)) {
              this.map.setLayoutProperty(this.layerId, prop, next[prop]);
            }
          }
        },
        { deep: true }
      );
    }

    if (this.layer.filter) {
      this.$watch(
        "layer.filter",
        function (next) {
          if (this.initial) return;
          this.map.setFilter(this.layerId, next);
        },
        { deep: true }
      );
    }
  },

  beforeDestroy() {
    const { $_beforeDestroy } = this;
    /*
     * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
     * 修改说明: 使用统一接口获取layerId或sourceId
     * 修改人: 杨琨 2025-11-10
     */
    let layerId = this.$_getLayerId();
    let sourceId = this.$_getSourceId();
    if (this.map) {
      try {
        $_beforeDestroy && $_beforeDestroy(); // geojson-layer
        this.map.removeLayer(layerId);
      } catch (err) {
        this.$_emitEvent("layer-does-not-exist", {
          layerId: sourceId || layerId,
          error: err,
        });
      }
      if (this.clearSource) {
        try {
          this.map.removeSource(sourceId);
        } catch (err) {
          this.$_emitEvent("source-does-not-exist", {
            sourceId: sourceId || layerId,
            error: err,
          });
        }
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

    $_watchSourceLoading(data) {
      const sourceId = this.sourceId || this.layerId;
      if (data.dataType === "source" && data.sourceId === sourceId) {
        this.$_emitEvent("layer-source-loading", { sourceId: sourceId });
        this.map.off("dataloading", this.$_watchSourceLoading);
      }
    },

    move(beforeId) {
      this.map.moveLayer(this.layerId, beforeId);
      this.$_emitEvent("layer-moved", {
        layerId: this.layerId,
        beforeId: beforeId,
      });
    },

    remove() {
      this.map.removeLayer(this.layerId);
      this.map.removeSource(this.sourceId || this.layerId);
      this.$_emitEvent("layer-removed", { layerId: this.layerId });
      this.$destroy();
    },
    /**
     * 获取Source对象
     * @returns {Object} Source对象
    */
    $_getSource() {
      return this.source || this.sourceBack
    },
    /**
     * 获取sourceId
     * @returns {String} sourceId
    */
    $_getSourceId() {
      return this.sourceId || this.sourceIdBack || this.layerId
    },
    /**
     * 获取layerId
     * @returns {String} sourceId
    */
    $_getLayerId() {
      return this.layerId || this.layerIdBack
    }
  },

  render() {},
};
