import layerEvents from "../../../lib/layerEvents";
import RasterLayer from "../RasterLayer";
import IgsOptions from "./igsOptions";

export default {
  name: "IgsBaseLayer",
  mixins: [RasterLayer],
  props: {
    ...IgsOptions,
    baseUrl: {
      type: String,
      default: null
    }
  },
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
      this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        mapgisOffset: this.zoomOffset,
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
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },
    $_deferredUnMount() {
      this.map.removeLayer(this.layerId);
      this.map.removeSource(this.sourceId);
      this.initial = true;
    }
  }
};
