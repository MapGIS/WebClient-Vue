import IgsBaseLayer from "./IgsBaseLayer";

export default {
  name: "IgsWmsLayer",
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
      type: Array
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
    wmtsStyle: {
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
      this.$_init();
      this.mapSource.tiles = [this._url];
    },
    $_init() {
      if (this.url) {
        this._url = this.url;
      } else if (this.baseUrl) {
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
      }
    },
    $_initAllRequestParams() {
      let params = [];
      params.push("version=" + this.version);
      params.push("layers=" + this.layers);
      params.push("format=" + this.format);
      params.push("width=" + this.tileSize);
      params.push("height=" + this.tileSize);
      if (this.version === "1.1.1") {
        params.push("srs=" + this.crs);
      } else if (this.version === "1.3.0") {
        params.push("crs=" + this.crs);
      }
      params.push("styles=" + this.wmtsStyle);
      if (this.token) {
        params.push("token=" + this.token);
      }
      params.push("transparent=true");
      return params;
    }
  }
};
