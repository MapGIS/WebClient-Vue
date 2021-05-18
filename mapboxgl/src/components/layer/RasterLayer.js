import layerEvents from "../../lib/layerEvents";
import mixin from "./layerMixin";

export default {
  name: "mapgis-rastertile-layer",
  mixins: [mixin],

  created() {
    this.$_deferredMount();

    if (this.url) {
      this.$watch("url", function(next) {
        if (this.initial) return;
        this.$_deferredUnMount();
        this.$_deferredMount();
      });
    }
  },

  methods: {
    $_deferredMount() {
      let source = {
        type: "raster",
        tiles: [this.url],
        mapgisOffset: this.mapgisOffset,
        ...this.source
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId || this.layerId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId || this.layerId);
          this.map.addSource(this.sourceId || this.layerId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },

    $_addLayer() {
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
        ...this.layer,
        id: this.layerId,
        type: "raster",
        source: this.sourceId || this.layerId
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    },
    $_deferredUnMount() {
      this.map.removeLayer(this.layerId);
      this.map.removeSource(this.sourceId || this.layerId);
      this.initial = true;
    }
  }
};
