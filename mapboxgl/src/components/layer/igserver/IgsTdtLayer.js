import mixin from "../layerMixin";
import layerEvents from "../../../lib/layerEvents";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-tdt-layer",
  mixins: [mixin],
  props: {
    ...igsOptions,
    layerType: {
      type: String,
      default: "vec"
    },
    token: {
      type: String,
      require: true
    },
    baseURL: {
      type: String,
      default: null
    },
    crs: {
      type: String,
      default: "EPSG:4326"
    },
    isLabel: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: "1.0.0"
    },
    tdtStyle: {
      type: String,
      default: "default"
    },
    format: {
      type: String,
      default: "tiles"
    }
  },
  data() {
    return {
      layerLabelMap: {
        vec: "cva",
        ter: "cta",
        img: "cia"
      },
      layerZoomMap: {
        vec: 18,
        ter: 14,
        img: 18
      },
      maxZoom: 18
    };
  },
  created() {
    this.$_deferredMount();
  },
  methods: {
    $_init() {
      if (this.url) {
        this._url = this.url;
        return;
      }
      let layerType = this.layerType;
      let layer =
        this.isLabel && this.layerLabelMap[layerType]
          ? this.layerLabelMap[layerType]
          : layerType;
      let tilematrixSet = this.crs === "EPSG:4326" ? "c" : "w";
      if (this.baseURL) {
        let str = this.baseURL.split("gov.cn/")[1];
        if (this.baseURL.indexOf("?") > 0) {
          str = str.split("?")[0];
        }
        layerType = str.substring(0, str.length - 7);
        layer =
          this.isLabel && this.layerLabelMap[layerType]
            ? this.layerLabelMap[layerType]
            : layerType;
        this._url = this.baseURL;
        if (this.baseURL.indexOf("?") < 0) {
          this._url += "?";
        }
      } else if (layerType.indexOf("igs") > 0) {
        let domain = this.domain;
        if (!domain) {
          domain = this.protocol + "://" + this.ip + ":" + this.port;
        }
        let tempUrl =
          domain + "/igs/rest/cts/tianditu/{layerType}/{x}/{y}/{z}?";
        switch (layerType) {
          case "vec_igs":
            layerType = "vector";
            break;
          case "img_igs":
            layerType = "raster";
            break;
          case "cva_igs":
            layerType = "vectorAnno";
            break;
          case "cia_igs":
            layerType = "rasterAnno";
            break;
          default:
            layerType = "vector";
            break;
        }
        this._url = tempUrl.replace("{layerType}", layerType);
      } else {
        let tempUrl =
          "http://t" +
          Math.round(Math.random() * 7) +
          ".tianditu.gov.cn/{layer}_{proj}/wmts?";
        this._url = tempUrl
          .replace("{layer}", layer)
          .replace("{proj}", tilematrixSet);
      }

      let params = [];
      if (this.layerType.indexOf("igs") < 0) {
        params.push("request=GetTile");
        if (this.version) {
          params.push("version=" + this.version);
        }
        if (this.tdtStyle) {
          params.push("style=" + this.tdtStyle);
        }
        params.push("tilematrixSet=" + tilematrixSet);
        params.push("format=" + this.format);
        if (this.tileSize) {
          params.push("width=" + this.tileSize);
          params.push("height=" + this.tileSize);
        }
        params.push("layer=" + layer);
        params.push("tilematrix={z}");
        params.push("tilerow={y}");
        params.push("tilecol={x}");
      }

      if (layerType === "ter") {
        this.maxZoom = 14;
      } else {
        this.maxZoom = 18;
      }
      if (this.token) {
        params.push("tk=" + this.token);
      }
      params.push("service=WMTS");
      this._url += params.join("&");
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
        id: this.layerId,
        type: "raster",
        source: this.sourceId,
        maxZoom: this.maxZoom,
        ...this.layer
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    }
  }
};
