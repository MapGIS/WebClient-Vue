import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";

export default {
  name: "mapgis-arcgis-tile-layer",
  mixins: [rasterLayer],
  props: {
    baseUrl: {
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
  created() {},
  methods: {
    $_init() {
      if (this.baseUrl) {
        this._zoomOffset = this.zoomOffset;
        this._url = this.baseUrl + "/tile/{z}/{y}/{x}";
        if (this.map.getCRS().epsgCode.includes("4326")) {
          this._zoomOffset = -1;
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
      //this.map.on为指定类型的事件添加侦听器，可以选择限制为指定样式层中的功能。
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
    }
  }
};
