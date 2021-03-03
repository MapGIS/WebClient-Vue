import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-tile-layer",
  mixins: [rasterLayer],
  props: {
    ...igsOptions,
    serverName: {
      type: String,
      require: true
    }
  },
  methods: {
    $_init() {
      if (this.url) {
        this._url = this.url;
        if (this.url.indexOf("{z}") < 0) {
          this._url += "/{z}/{y}/{x}";
        }
        this._zoomOffset = this.zoomOffset;
        if (this.map.getCRS().epsgCode.includes("4326")) {
          this._zoomOffset = -1;
        }
        return;
      }
      let domain = this.domain;
      if (!domain) {
        domain = this.protocol + "://" + this.ip + ":" + this.port;
      }
      this._url =
        encodeURI(domain + "/igs/rest/mrms/tile/" + this.serverName) +
        "/{z}/{y}/{x}";
      this._zoomOffset = this.zoomOffset;
      if (this.map.getCRS().epsgCode.includes("4326")) {
        this._zoomOffset = -1;
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
