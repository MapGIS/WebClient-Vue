import rasterLayer from "./RasterLayer";
import layerEvents from "../../lib/layerEvents";

export default {
  name: "mapbox-arcgis-layer",
  mixins: [rasterLayer],
  props: {
    url: {
      type: String,
      default:
        "http://services.arcgisonline.com/ArcGIS/rest/services/{layerType}/MapServer/tile/{z}/{y}/{x}.jpg"
    },
    layerType: {
      type: String,
      default: null
    },
    tileSize: {
      type: Number,
      default: 256
    },
    zoomOffset: {
      type: Number,
      default: 0
    }
  },
  methods: {
    $_init() {
      if (this.url) {
        this._zoomOffset = this.zoomOffset;
        let url = this.url;
        if (url.indexOf("MapServer/tile/{z}/{y}/{x}") > 0) {
          this._url = url;
          if (this.layerType && url.indexOf("{layerType}") > 0) {
            this._url = url.replace("{layerType}", this.layerType);
          }
          if (this.map.getCRS().epsgCode.includes("4326")) {
            this._zoomOffset = -1;
          }
        } else {
          const code = this.map.getCRS().epsgCode.split(":")[1];
          this._url =
            url +
            "/export?" +
            `bbox={bbox}&f=image&format=png&transparent=true&size=${this.tileSize},${this.tileSize}&bboxsr=${code}&imagesr=${code}&dpi=96`;
        }
      }
    },
    $_deferredMount() {
      this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        mapgisOffset: this._zoomOffset,
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
