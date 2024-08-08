import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";

export default {
  name: "mapgis-arcgis-map-layer",
  mixins: [rasterLayer],
  props: {
    baseUrl: {
      type: String,
      default: null,
    },
    renderMode: {
      type: String,
      default: "raster",
    },
    bboxsr: {
      type: Number,
    },
    imagesr: {
      type: Number,
    },
    layers: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: 256,
    },
    height: {
      type: Number,
      default: 256,
    },
    format: {
      type: String,
      default: "png",
    },
    f: {
      type: String,
      default: "image",
    },
    dpi: {
      type: Number,
      default: 96,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.$_deferredMount();

    if (this.baseUrl) {
      this.$watch("baseUrl", function (next) {
        if (this.initial) return;
        if (next !== "") {
          this.$_deferredUnMount();
          this.$_deferredMount();
        }
      });
    }
    if (this.layers) {
      this.$watch("layers", function (next) {
        if (this.initial) return;
        if (next !== "") {
          this.$_deferredUnMount();
          this.$_deferredMount();
        }
      });

      if (this.renderMode) {
        this.$watch("renderMode", function (next) {
          if (this.initial) return;
          if (next !== "") {
            this.$_deferredUnMount();
            this.$_deferredMount();
          }
        });
      }
    }
  },
  methods: {
    $_init() {
      if (this.baseUrl) {
        let baseUrl = this.baseUrl;
        let partUrl = this.$_initAllRequestParams().join("&");
        this._url = encodeURI(baseUrl + "/export?" + partUrl) + "&bbox={bbox}";
      }
    },
    $_initAllRequestParams() {
      let params = [];
      const code = this.map.getCRS().epsgCode.split(":")[1];
      if (this.f) {
        params.push("f=" + this.f);
      }
      if (this.format) {
        params.push("format=" + this.format);
      }
      if (this.format.indexOf("png") >= 0 || this.format === "gif") {
        params.push("transparent=" + this.transparent);
      }
      if (this.width && this.height) {
        params.push("size=" + this.width + "," + this.height);
        this.tileSize = this.width;
      }
      if (this.bboxsr) {
        params.push("bboxsr=" + this.bboxsr);
      } else {
        params.push("bboxsr=" + code);
      }
      if (this.imagesr) {
        params.push("imagesr=" + this.imagesr);
      } else {
        params.push("imagesr=" + code);
      }
      if (this.dpi) {
        params.push("dpi=" + this.dpi);
      }
      if (this.layers) {
        params.push("layers=" + this.layers);
      }
      if (this.token) {
        params.push(this.token.key + "=" + this.token.value);
      }
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
            const split = url.split("&");
            split.forEach((part) => {
              if (part.includes("size=")) {
                url = url.replace(part, `size=${imageWidth},${imageHeight}`);
              }
              if (part.includes("bbox=")) {
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
