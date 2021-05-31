import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import { newGuid } from "../../util";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-doc-layer",
  mixins: [rasterLayer],
  props: {
    ...igsOptions,
    serverName: {
      type: String,
      require: true
    },
    layers: {
      type: String,
      default: null
    },
    filters: {
      type: String,
      default: null
    },
    igsMapStyle: {
      type: Object,
      default: null
    },
    f: {
      type: String,
      default: "png"
    },
    proj: {
      type: String,
      default: null
    },
    guid: {
      type: String,
      default: newGuid()
    },
    cache: {
      type: Boolean,
      default: false
    },
    isAntialiasing: {
      type: Boolean,
      default: false
    },
    update: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: null
    }
  },
  watch: {
    layers(next) {
      if (this.initial) return;
      this.changelayers();
    }
  },
  methods: {
    changelayers() {
      this.$_deferredUnMount();
      this.$_deferredMount();
    },
    $_init() {
      let { url, domain, baseUrl, protocol, ip, port } = this;
      let { serverName, tileSize, dynamicTile } = this;
      let fixBaseUrl, docParam;
      if (url) {
        let url = this.url;
        if (url.indexOf("?") === -1) {
          url += "?";
          url += "bbox={bbox}";
        } else if (url.indexOf("bbox") === -1) {
          url += "&bbox={bbox}";
        }
        this._url = url;
        return;
      } else if (baseUrl) {
        if (!this.layers) {
          return;
        }
        if (baseUrl.indexOf("?") > -1) {
          fixBaseUrl = this.baseUrl.split("?")[0];
        } else {
          fixBaseUrl = this.baseUrl;
        }
      } else if (domain) {
        fixBaseUrl = `${domain}/igs/rest/mrms/docs/${serverName}`;
      } else {
        domain = `${protocol}://${ip}:${port}`;
        fixBaseUrl = `${domain}/igs/rest/mrms/docs/${serverName}`;
      }

      if (dynamicTile) {
        this._url = `${domain}/igs/rest/mrms/tile/${serverName}/{z}/{y}/{x}?size=${tileSize}`;
      } else {
        docParam = this.$_initAllRequestParams().join("&");
        this._url = encodeURI(fixBaseUrl + "?" + docParam) + "&bbox={bbox}";
      }
    },
    $_initAllRequestParams() {
      let params = [];

      params.push("f=" + this.f);
      params.push("guid=" + this.guid);

      let width, height;
      width = height = this.tileSize;
      params.push("w=" + width);
      params.push("h=" + height);

      if (this.layers) {
        params.push("layers=" + this.layers);
      }
      if (this.filters) {
        params.push("filters=" + this.filters);
      }
      if (this.igsMapStyle) {
        params.push("style=" + JSON.stringify(this.igsMapStyle));
      }
      if (this.proj) {
        params.push("proj=" + this.proj);
      }
      if (this.mode) {
        params.push("mode=" + this.mode);
      }
      if (this.isAntialiasing !== null) {
        params.push("isAntialiasing=" + this.isAntialiasing);
      }
      if (this.cache !== null && this.isAntialiasing !== null) {
        params.push("cache=" + this.cache);
      }
      if (this.update !== null && this.isAntialiasing !== null) {
        params.push("update=" + this.update);
      }
      return params;
    },
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
