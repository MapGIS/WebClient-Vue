import IgsBaseLayer from "./OgcBaseLayer";
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
    token: {
      type: String,
      default: null
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
    }
  },
  watch: {
    layers() {
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
          _baseUrl = this.baseUrl.split("?")[0];
        } else {
          _baseUrl = this.baseUrl;
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
          "/WMSServer";
      }
      _baseUrl += "?service=WMS&request=GetMap";
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
    }
  }
};
