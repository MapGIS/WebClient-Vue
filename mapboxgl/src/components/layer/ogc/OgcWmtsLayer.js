import OgcBaseLayer from "./OgcBaseLayer";
import { initializeOptions } from "@mapgis/webclient-mapboxgl-plugin";
import { WMTSLayer } from "@mapgis/webclient-common";

export default {
  name: "mapgis-ogc-wmts-layer",
  mixins: [OgcBaseLayer],
  props: {
    wmtsLayer: {
      type: String,
      default: "",
    },
    tileMatrixSet: {
      type: String | Object,
      default: "",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    wmtsStyle: {
      type: String,
      default: "default",
    },
    format: {
      type: String,
      default: "image/png",
    },
    zoomOffset: {
      type: Number,
      default: 0,
    },
    // bug(24809)JC-webclient-vue封装插件调用geoserver发布的wmts地图服务出图失败，不支持level为字符串类型
    // 龚跃健-20250328
    // 出图地址tileMatrix参数中z的前缀
    tileMatrixPrefix: {
      type: String,
      default: "",
    },
  },
  computed: {
    watchList() {
      const { wmtsLayer, tileMatrixSet, wmtsStyle } = this;
      return { wmtsLayer, tileMatrixSet, wmtsStyle };
    },
  },
  watch: {
    watchList: {
      handler: function (next, old) {
        if (JSON.stringify(next) === JSON.stringify(old)) {
          return;
        }
        if (this.url) {
          //REST方式，目前还是采用KVP的格式
          this.$_initUrl(this[watchArr[i]], watchArr[i]);
        } else if (this.baseUrl) {
          if (this.wmtsLayer.length === 0 || !this.tileMatrixSet) {
            return;
          }
          //KVP方式
          this.$_initBaseUrl();
          if (!this.source || !this.source.crs) {
            this.$_initSource();
          }
          //因为OgcBaseLayer只监听了url，因此这里主动调用重绘和绘制方法
          this.$_deferredUnMount();
          this.$_deferredMount();
        }
      },
      deep: true,
    },
  },
  methods: {
    $_init() {
      let { url, wmtsLayer, baseUrl } = this;
      if (url) {
        //REST方式，目前还是采用KVP的格式
        this._url = url;
      } else if (baseUrl) {
        if (wmtsLayer.length === 0 || !this.tileMatrixSet) {
          return;
        }
        //KVP方式
        this.$_initBaseUrl();
        if (!this.source || !this.source.crs) {
          this.$_initSource();
        }
      }
    },
    async $_initSource() {
      // 创建WMTS图层对象
      const wmtsLayer = new WMTSLayer({
        url: this.baseUrl,
      });
      // 获取WMTS图层服务的元信息
      const layer = await wmtsLayer.load();
      // 获取provider的初始化参数
      const mapboxglOptions = initializeOptions(layer, viewer);
      const { layers, sources } = mapboxglOptions;
      const sourceId = layers[0].source;
      this.source = sources[sourceId];
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
          _baseUrl = `${this.baseUrl}&`;
        } else {
          _baseUrl = `${this.baseUrl}?`;
        }
      }
      if (_baseUrl.toLowerCase().indexOf("ime-cloud") > -1) {
        // 吉威的数据
        _baseUrl += "service=WMTS&REQUEST=GetTile";
      } else {
        _baseUrl += "service=WMTS&request=GetTile";
      }
      const { tileMatrixPrefix } = this;
      const partUrl = this.$_initAllRequestParams().join("&");
      this._url = `${_baseUrl}&${partUrl}&tileMatrix=${tileMatrixPrefix}{z}&tileRow={y}&tileCol={x}`;
    },
    $_initAllRequestParams() {
      let params = [];
      params.push("version=" + this.version);
      params.push("style=" + this.wmtsStyle || "");
      if (this.tileMatrixSet.id) {
        params.push("tileMatrixSet=" + this.tileMatrixSet.id);
      } else {
        params.push("tileMatrixSet=" + this.tileMatrixSet);
      }
      params.push("format=" + this.format);
      params.push("layer=" + this.wmtsLayer);
      if (this.token) {
        params.push(this.token.key + "=" + this.token.value);
      }
      return params;
    },
  },
};
