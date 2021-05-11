import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";

export default {
  name: "mapgis-arcgis-maplayer",
  mixins: [rasterLayer],
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    bboxsr: {
      type: Number
    },
    imagesr: {
      type: Number
    },
    layers: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 256
    },
    height: {
      type: Number,
      default: 256
    },
    format: {
      type: String,
      default: "png"
    },
    f: {
      type: String,
      default: "image"
    },
    dpi: {
      type: Number,
      default: 96
    },
    transparent: {
      type: Boolean,
      default: false
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
      return params;
    },

    $_deferredMount() {
      this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        ...this.source
      };
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
    }
  }
};
