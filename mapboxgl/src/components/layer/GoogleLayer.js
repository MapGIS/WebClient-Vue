import rasterLayer from "./RasterLayer";
import layerEvents from "../../lib/layerEvents";

export default {
  name: "mapbox-google-layer",
  mixins: [rasterLayer],
  props: {
    url: {
      type: String,
      require: true
    },
    layerType: {
      type: String,
      default: ""
    },
    tileSize: {
      type: Number,
      default: 256
    }
  },
  methods: {
    $_init() {
      if (this.url) {
        let url = this.url;
        if (url.indexOf("x={x}&y={y}&z={z}") === -1) {
          url += `/${this.layerType}&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}`;
        }
        this._url = url;
      }
    },
    $_deferredMount() {
      this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
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
    }
  }
};
