import OgcBaseLayer from "./OgcBaseLayer";

export default {
  name: "mapgis-ogc-wmts-layer",
  mixins: [OgcBaseLayer],
  props: {
    wmtsLayer: {
      type: String,
      default: ""
    },
    tileMatrixSet: {
      type: String,
      default: ""
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
    },
    zoomOffset: {
      type: Number,
      default: 0
    }
  },
  created() {
    //创建tileMatrixSet监听器
    let watchArr = [
      "wmtsLayer",
      "tileMatrixSet",
      "version",
      "wmtsStyle",
      "format"
    ];
    for (let i = 0; i < watchArr.length; i++) {
      this.$watch(watchArr[i], function() {
        if (this.url) {
          //REST方式，目前还是采用KVP的格式
          this.$_initUrl(this[watchArr[i]], watchArr[i]);
        } else if (this.baseUrl) {
          if (!this.tileMatrixSet || this.tileMatrixSet.length === 0) {
            return;
          }
          //KVP方式
          this.$_initBaseUrl();
          //因为OgcBaseLayer只监听了url，因此这里主动调用重绘和绘制方法
          this.$_deferredUnMount();
          this.$_deferredMount();
        }
      });
    }
  },
  methods: {
    $_init() {
      let { url, wmtsLayer, tileMatrixSet, baseUrl, _url } = this;
      if (url) {
        //REST方式，目前还是采用KVP的格式
        this._url = url;
      } else if (baseUrl) {
        if (wmtsLayer.length === 0 || tileMatrixSet.length === 0) {
          return;
        }
        //KVP方式
        this.$_initBaseUrl(wmtsLayer, tileMatrixSet);
      }
    },
    $_initUrl(propValue, propName) {
      let propNameLowerCase = propName.toLowerCase();
      if (propName === "wmtsStyle") {
        propNameLowerCase = "style";
      } else if (propName === "wmtsLayer") {
        propNameLowerCase = "layer";
      }
      let urlStr = this.url,
        urlLowerCase = this.url.toLowerCase();
      let startIndex = urlLowerCase.indexOf(propNameLowerCase);
      if (startIndex > -1) {
        let endIndex = urlLowerCase.indexOf("&", startIndex);
        this.url =
          urlStr.substr(0, startIndex + propNameLowerCase.length + 1) +
          this[propName];
        if (endIndex > 0) {
          this.url += urlStr.substr(endIndex, urlStr.length);
        }
        this._url = this.url;
      }
    },
    $_initBaseUrl() {
      let _baseUrl = this.baseUrl;
      if (this.baseUrl) {
        if (this.baseUrl.indexOf("?") > -1) {
          _baseUrl = this.baseUrl.split("?")[0];
        } else {
          _baseUrl = this.baseUrl;
        }
      }
      if (_baseUrl.toLowerCase().indexOf("ime-cloud") > -1) {
        //吉威的数据
        _baseUrl += "?service=WMTS&REQUEST=GetTile";
      } else {
        _baseUrl += "?service=WMTS&request=GetTile";
      }
      const partUrl = this.$_initAllRequestParams().join("&");
      this._url =
        encodeURI(_baseUrl) +
        "&" +
        partUrl +
        "&tileMatrix={z}&tileRow={y}&tileCol={x}";
    },
    $_initAllRequestParams() {
      let params = [];
      params.push("version=" + this.version);
      params.push("style=" + this.wmtsStyle || "");
      params.push("tileMatrixSet=" + this.tileMatrixSet);
      params.push("format=" + this.format);
      params.push("layer=" + this.wmtsLayer);
      if (this.token) {
        params.push(this.token.key + "=" + this.token.value);
      }
      return params;
    }
  }
};
