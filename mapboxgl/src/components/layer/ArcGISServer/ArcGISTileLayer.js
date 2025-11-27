import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import { ServerBaseUrlRegExp } from "@mapgis/webclient-common";

export default {
  name: "mapgis-arcgis-tile-layer",
  mixins: [rasterLayer],
  props: {
    baseUrl: {
      type: String,
      default: null,
    },
    tileSize: {
      type: Number,
      default: 256,
    },
    zoomOffset: {
      type: Number,
      default: 0,
    },
    forceOffset: {
      type: Boolean,
      default: false,
    },
    minimumLevel: {
      type: Number,
      default: 0,
    },
    maximumLevel: {
      type: Number,
      default: 22,
    },
  },
  created() {},
  methods: {
    $_init() {
      const { forceOffset, zoomOffset } = this;
      if (this.baseUrl) {
        this._zoomOffset = zoomOffset;
        this._url = this.baseUrl + "/tile/{z}/{y}/{x}";
        if (this.map.getCRS().epsgCode.includes("4326")) {
          if (
            zoomOffset == 0 &&
            ServerBaseUrlRegExp.testByRegExpNames(this.url, ["ArcGISMapServer"])
          ) {
            // 这个地方会导致4326无法主动传入offset=0的情况，但是默认的arcgis
            // 测试10.3 10.5 10.7后发现arcigs默认情况下就是offset=-1,
            // 因此忽略主动传入0的场景. 这种情况只会发生在操作arcserver的时候
            // 人为刻意的进行一张512*512的操作导致，这个操作本身是一种错误的操作
            this._zoomOffset = forceOffset ? zoomOffset : -1;
          } else {
            this._zoomOffset = zoomOffset;
          }
        }
      }
    },
    $_deferredMount() {
      this.$_init();
      const sourceObject = this.$_getSource();
      const sourceId = this.$_getSourceId();

      if (this.token && this.token.key && this.token.value) {
        const url = new URL(this._url);
        if (url.searchParams.toString().length > 0) {
          this._url += `&${this.token.key}=${this.token.value}`;
        } else {
          this._url += `?${this.token.key}=${this.token.value}`;
        }
      }

      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        mapgisOffset: this._zoomOffset,
        maxzoom: this.maximumLevel,
        minzoom: this.minimumLevel,
        ...sourceObject,
      };
      //this.map.on为指定类型的事件添加侦听器，可以选择限制为指定样式层中的功能。
      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(sourceId);
          this.map.addSource(sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },
  },
};
