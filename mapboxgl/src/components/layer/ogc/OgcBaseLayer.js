import layerEvents from "../../../lib/layerEvents";
import RasterLayer from "../RasterLayer";
import IgsOptions from "./OgcOptions";

export default {
  name: "OgcBaseLayer",
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
    async $_deferredMount() {
      await this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        mapgisOffset: this.zoomOffset,
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
    $_deferredUnMount() {
      this.map.removeLayer(this.layerId);
      this.map.removeSource(this.sourceId || this.layerId);
      this.initial = true;
    }
  }
};
