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
      handler: async function (next, old) {
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
            await this.$_initSource();
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
    async $_init() {
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
          await this.$_initSource();
        }
      }
    },
    async $_initSource() {
      const { wmtsStyle, format, options, token } = this;
      const tileMatrixSet = this.tileMatrixSet.id || this.tileMatrixSet;
      const activeWMTSLayer = this.wmtsLayer;
      // 创建WMTS图层对象
      const paramOptions = {
        url: this.baseUrl,
        extent: null,
      };
      if (token.key && token.value) {
        paramOptions.tokenKey = token.key;
        paramOptions.tokenValue = token.value;
      }
      // 创建WMTS图层对象
      const wmtsLayer = new WMTSLayer(paramOptions);
      // 获取WMTS图层服务的元信息
      const layer = await wmtsLayer.load();
      const { sublayers, tileMatrixSets, activeLayer } = layer;
      // 判断当前activeLayer的identifier是否与传入的wmtsLayer一致
      const isSameIdentifier = activeLayer.identifier === activeWMTSLayer;
      // 找到与传入的tileMatrixSetId一致的tileMatrixSet，若不存在则不处理
      const targetTileMatrixSet = tileMatrixSets.find(
        (item) => item.identifier === tileMatrixSet
      );
      // 当前activeLayer的identifier是否与传入的wmtsLayer不一致则查找sublayers中对应的activeLayer
      if (!isSameIdentifier) {
        // 查找与传入的wmtsLayer一致的sublayer
        const targetActiveLayer = sublayers.items.find(
          (item) => item.identifier === activeWMTSLayer
        );
        // 找到目标sublayer则使用targetActiveLayer作为activeLayer
        if (targetActiveLayer) {
          // 判断传入的tileMatrixSetId是否存在对应的tileMatrixSet
          if (targetTileMatrixSet) {
            targetActiveLayer.tileMatrixSetId = targetTileMatrixSet.identifier;
          }
          // 设置targetActiveLayer的imageFormat
          targetActiveLayer.imageFormat = format;
          // 找到与传入的wmtsStyle一致的styleId，若不存在则不处理
          const targetStyle = targetActiveLayer.styles.find(
            (item) => item.id === wmtsStyle
          );
          if (targetStyle) {
            targetActiveLayer.styleId = wmtsStyle;
          }
          layer.activeLayer = targetActiveLayer;
        } else {
          // 如果不存在与传入的wmtsLayer一致的sublayer则使用默认的activeLayer，即sublayers[0]
          if (targetTileMatrixSet) {
            activeLayer.tileMatrixSetId = targetTileMatrixSet.identifier;
          }
          // 设置activeLayer的imageFormat
          activeLayer.imageFormat = format;
          // 找到与传入的wmtsStyle一致的styleId，若不存在则不处理
          const targetStyle = activeLayer.styles.find(
            (item) => item.id === wmtsStyle
          );
          if (targetStyle) {
            activeLayer.styleId = wmtsStyle;
          }
        }
      } else {
        // activeLayer的identifier与传入的wmtsLayer一致则直接修改activeLayer
        // 设置activeLayer的tileMatrixSetId
        if (targetTileMatrixSet) {
          activeLayer.tileMatrixSetId = targetTileMatrixSet.identifier;
        }
        // 设置activeLayer的imageFormat
        activeLayer.imageFormat = format;
        // 找到与传入的wmtsStyle一致的styleId，若不存在则不处理
        const targetStyle = activeLayer.styles.find(
          (item) => item.id === wmtsStyle
        );
        if (targetStyle) {
          activeLayer.styleId = wmtsStyle;
        }
      }
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
