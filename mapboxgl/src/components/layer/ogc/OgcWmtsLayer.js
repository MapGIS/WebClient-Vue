import OgcBaseLayer from "./OgcBaseLayer";

export default {
  name: "mapbox-ogc-wmts-layer",
  mixins: [OgcBaseLayer],
  props: {
    wmtsLayer: {
      type: String
    },
    tileMatrixSet: {
      type: String
    },
    version: {
      type: String,
      default: "1.0.0"
    },
    wmtsStyle: {
      type: String,
      default: "default"
    },
    format: {
      type: String,
      default: "image/png"
    }
  },
  methods: {
    $_init() {
      let { url, wmtsLayer, tileMatrixSet } = this;
      if (url) {
        this._url = url;
      } else if (this.baseUrl) {
        if (!wmtsLayer || !tileMatrixSet) {
          return;
        }
        let _baseUrl = this.baseUrl;
        if (this.baseUrl) {
          if (this.baseUrl.indexOf("?") > -1) {
            _baseUrl = this.baseUrl.split("?")[0];
          } else {
            _baseUrl = this.baseUrl;
          }
        }
        this._zoomOffset = this.zoomOffset;
        if (_baseUrl.toLowerCase().indexOf("ime-cloud") > -1) {
          //吉威的数据
          _baseUrl += "?service=WMTS&REQUEST=GetTile";
        } else {
          _baseUrl += "?service=WMTS&request=GetTile";
          if (this.map.getCRS().epsgCode.includes("4326")) {
            this._zoomOffset = -1;
          }
        }
        const partUrl = this.$_initAllRequestParams().join("&");
        this._url =
          encodeURI(_baseUrl) +
          "&" +
          partUrl +
          "&tileMatrix={z}&tileRow={y}&tileCol={x}";
      }
    },
    $_initAllRequestParams() {
      let params = [];
      params.push("version=" + this.version);
      params.push("style=" + this.wmtsStyle || "");
      params.push("tileMatrixSet=" + this.tileMatrixSet);
      params.push("format=" + this.format);
      params.push("layer=" + this.wmtsLayer);
      if (this.token) {
        params.push("token=" + this.token);
      }
      return params;
    }
  }
};
