import OgcBaseLayer from "./OgcBaseLayer";

export default {
  name: "mapgis-ogc-wmts-layer",
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
  created() {
    //创建tileMatrixSet监听器
    let me = this,watchArr = ["wmtsLayer","tileMatrixSet","version","wmtsStyle","format"];
    for (let i = 0;i < watchArr.length; i++){
      this.$watch(watchArr[i], function() {
        if(me.url){
          //REST方式，目前还是采用KVP的格式
          me.$_initUrl(me[watchArr[i]],watchArr[i]);
        }else  if (me.baseUrl){
          //KVP方式
          this.$_initBaseUrl(me.wmtsLayer, me[watchArr[i]]);
        }
      });
    }
  },
  methods: {
    $_init() {
      let { url, wmtsLayer, tileMatrixSet } = this;
      if (url) {
        //REST方式，目前还是采用KVP的格式
        this._url = url;
      } else if (this.baseUrl) {
        //KVP方式
        this.$_initBaseUrl(wmtsLayer, tileMatrixSet);
      }
    },
    $_initUrl(propValue,propName){
      let propNameLowerCase = propName.toLowerCase();
      if(propName === "wmtsStyle"){
        propNameLowerCase = "style";
      }else if(propName === "wmtsLayer"){
        propNameLowerCase = "layer"
      }
      let urlStr = this.url,urlLowerCase = this.url.toLowerCase();
      let startIndex = urlLowerCase.indexOf(propNameLowerCase);
      if(startIndex > -1){
        let endIndex = urlLowerCase.indexOf("&",startIndex);
        this.url = urlStr.substr(0,startIndex + propNameLowerCase.length + 1) + this[propName];
        if(endIndex > 0){
          this.url += urlStr.substr(endIndex,urlStr.length);
        }
        this._url = this.url;
      }
    },
    $_initBaseUrl(wmtsLayer,tileMatrixSet){
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
