import IgsBaseLayer from "./OgcBaseLayer";
import layerEvents from "../../../lib/layerEvents";
// import { OGC } from "@mapgis/webclient-es6-service";

export default {
  name: "mapgis-ogc-wms-layer",
  mixins: [IgsBaseLayer],
  props: {
    serverType: {
      type: String
      // require: true
    },
    serverName: {
      type: String
      // require: true
    },
    layers: {
      type: String
      // require: true
    },
    version: {
      type: String,
      default: "1.1.1"
    },
    crs: {
      type: String,
      default: "EPSG:4326"
    },
    styles: {
      type: String,
      default: ""
    },
    format: {
      type: String,
      default: "image/png"
    },
    height: {
      type: Number,
      default: 512
    },
    width: {
      type: Number,
      default: 512
    },
    reversebbox: {
      type: Boolean,
      default: false
    },
    renderMode: {
      type: String,
      default: "raster"
    },
  },
  watch: {
    layers() {
      if (this.initial) return;
      this.changelayers();
    },
    renderMode(next) {
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
      if (this.url) {
        this.asyncInit();
      } else if (this.baseUrl) {
        this.syncInit();
      }
    },
    // 这段逻辑还是放在上层的地图文档层处理合适，如果此处开启的了同步等待则无法控制该图层的顺序
    /* async */ asyncInit() {
      this._url = this.url;
      /* let wms = new OGC.WMS(this.$props);
      if (wms.isBaseUrl()) {
        let url = await wms.makeFullUrl();
        this._url = url + "&bbox={bbox}";
      } */
      if (this._url.indexOf("reversebbox") < 0) {
        this._url += `&reversebbox=${this.reversebbox}`;
      }
    },
    syncInit() {
      if (!this.layers) {
        return;
      }
      let _baseUrl = this.baseUrl;
      if (this.baseUrl) {
        if (this.baseUrl.indexOf("?") > -1) {
          _baseUrl = `${this.baseUrl}&`;
        } else {
          _baseUrl = `${this.baseUrl}?`;
        }
      } else {
        let domain = this.domain;
        if (!domain) {
          domain = this.protocol + "://" + this.ip + ":" + this.port;
        }
        // 兼容中地特有规则
        _baseUrl =
          domain +
          "/igs/rest/ogc/" +
          this.serverType +
          "/" +
          this.serverName +
          "/WMSServer?";
      }
      _baseUrl += "service=WMS&request=GetMap";
      const partUrl = this.$_initAllRequestParams().join("&");
      this._url = encodeURI(_baseUrl + "&" + partUrl) + "&bbox={bbox}";
      if (this._url.indexOf("reversebbox") < 0) {
        this._url += `&reversebbox=${this.reversebbox}`;
      }
    },
    $_initAllRequestParams() {
      let params = [];
      params.push("version=" + this.version);
      params.push("layers=" + this.layers);
      params.push("format=" + this.format);
      params.push("styles=" + this.styles);
      params.push("width=" + this.tileSize);
      params.push("height=" + this.tileSize);
      if (this.version === "1.1.1") {
        params.push("srs=" + this.crs);
      } else if (this.version === "1.3.0") {
        params.push("crs=" + this.crs);
      }
      if (this.token) {
        params.push(this.token.key + "=" + this.token.value);
      }
      params.push("transparent=true");
      return params;
    },
    $_deferredMount() {
      this.$_init();
      let source;

      let renderMode = this.renderMode;

      if (renderMode === "image-map") {
        // image-map类型
        source = {
          url: this._url,
          ...this.source,
          rebaseRequestUrl: function (url, params) {
            let bbox;
            const code = this.map.getCRS().epsgCode.split(":")[1];
            let bound;
            if (code === "3857") {
              bound = params.mercatorBound;
            } else if (code === "4326") {
              bound = params.latlngBounds;
            } else {
              throw new Error(`不支持EPSG:${code}的投影`);
            }
            bbox = bound.toString();
            const [imageWidth, imageHeight] = params.imageSize;
            const split =
              url.split("?").length > 1
                ? url.split("?")[1].split("&")
                : url.split("&");
            split.forEach((part) => {
              // igs2.0 出一张图模式
              if (part.includes("size=")) {
                url = url.replace(part, `size=${imageWidth},${imageHeight}`);
              }
              // wms 出一张图模式
              if (part.includes("width=")) {
                url = url.replace(part, `width=${imageWidth}`);
              }
              if (part.includes("height=")) {
                url = url.replace(part, `height=${imageHeight}`);
              }
              // 动态计算bbox
              if (
                part.includes("bbox=") &&
                !part.includes("reversebbox=false")
              ) {
                url = url.replace(part, `bbox=${bbox}`);
              }
            });
            return url;
          },
          type: "image-map",
        };
      } else {
        // 瓦片类型
        source = {
          type: "raster",
          tiles: [this._url],
          tileSize: this.tileSize,
          ...this.source,
        };
      }

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
  },
};
