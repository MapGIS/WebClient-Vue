import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import { newGuid } from "../../util";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-doc-layer",
  mixins: [rasterLayer],
  props: {
    ...igsOptions,
    serverName: {
      type: String,
      require: true
    },
    layers: {
      type: String,
      default: null
    },
    filters: {
      type: String,
      default: null
    },
    igsMapStyle: {
      type: Object,
      default: null
    },
    f: {
      type: String,
      default: "png"
    },
    proj: {
      type: String,
      default: null
    },
    guid: {
      type: String,
      default: newGuid()
    },
    cache: {
      type: Boolean,
      default: false
    },
    isAntialiasing: {
      type: Boolean,
      default: false
    },
    update: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: null
    }
  },
  created() {
    this.$watch("layers",function () {
      this.$_updateLayer();
    })
    this.$watch("cache",function () {
      this.$_updateLayer();
    })
    this.$watch("filters",function () {
      console.log("dasdasdsa")
      this.$_updateLayer();
    })
  },
  data(){
    return {
      newGuid: undefined
    }
  },
  methods: {
    $_updateLayer(){
      this.newGuid = newGuid();
      this.$_init();
      //因为OgcBaseLayer只监听了url，因此这里主动调用重绘和绘制方法
      this.$_deferredUnMount();
      this.$_deferredMount();
    },
    $_init() {
      if (this.url) {
        let url = this.url;
        if (url.indexOf("?") === -1) {
          url += "?";
          url += "bbox={bbox}";
        } else if (url.indexOf("bbox") === -1) {
          url += "&bbox={bbox}";
        }
        this._url = url;
        return;
      }
      let domain = this.domain;
      if (!domain) {
        domain = this.protocol + "://" + this.ip + ":" + this.port;
      }
      let baseUrl = domain + "/igs/rest/mrms/docs/" + this.serverName;
      let partUrl = this.$_initAllRequestParams().join("&");
      this._url = encodeURI(baseUrl + "?" + partUrl) + "&bbox={bbox}";
    },
    $_initAllRequestParams() {
      let params = [];

      params.push("f=" + this.f);
      if(this.newGuid){
        params.push("guid=" + this.newGuid);
      }else{
        params.push("guid=" + this.guid);
      }

      let width, height;
      width = height = this.tileSize;
      params.push("w=" + width);
      params.push("h=" + height);

      if (this.layers) {
        params.push("layers=" + this.layers);
      }
      if (this.filters) {
        params.push("filters=" + this.filters);
      }
      if (this.igsMapStyle) {
        params.push("style=" + JSON.stringify(this.igsMapStyle));
      }
      if (this.proj) {
        params.push("proj=" + this.proj);
      }
      if (this.mode) {
        params.push("mode=" + this.mode);
      }
      if (this.isAntialiasing !== null) {
        params.push("isAntialiasing=" + this.isAntialiasing);
      }
      if (this.cache !== null && this.isAntialiasing !== null) {
        params.push("cache=" + this.cache);
      }
      if (this.update !== null && this.isAntialiasing !== null) {
        params.push("update=" + this.update);
      }
      return params;
    },
    $_deferredMount() {
      this.$_init();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        mapgisOffset: this.zoomOffset,
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
