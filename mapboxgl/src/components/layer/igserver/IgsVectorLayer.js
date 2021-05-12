import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import { newGuid } from "../../util";
import igsOptions from "./igsOptions";

export default {
  name: "mapgis-igs-vector-layer",
  mixins: [rasterLayer],
  props: {
    ...igsOptions,
    gdbps: {
      type: String | Array,
      require: true
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
    guid: {
      type: String,
      default: new Date().getTime().toString()
    },
    keepCache: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      newGuid: undefined
    }
  },
  created() {
    this.$watch("gdbps",function () {
      this.$_updateLayer();
    })
    this.$watch("filters",function () {
      this.$_updateLayer();
    })
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
          url += "bbox={bbox}&";
        } else if (url.indexOf("bbox") === -1) {
          url += "&bbox={bbox}&";
        }
        let partUrl = this.$_initAllRequestParams().join("&");
        url += partUrl;
        this._url = url;
        return;
      }
      let domain = this.domain;
      if (!domain) {
        domain = this.protocol + "://" + this.ip + ":" + this.port;
      }
      let tempUrl = domain + "/igs/rest/mrms/layers";
      let partUrl = this.$_initAllRequestParams().join("&");
      this._url = encodeURI(tempUrl + "?" + partUrl) + "&bbox={bbox}";
    },
    $_initAllRequestParams() {
      let params = [];
      let gdbps;
      if (typeof this.gdbps === "string") {
        gdbps = this.gdbps;
      } else {
        gdbps = this.gdbps.toString();
      }
      params.push("gdbps=" + gdbps);
      params.push("f=" + this.f);

      if(this.newGuid){
        params.push("guid=" + this.newGuid);
      }else{
        params.push("guid=" + this.guid);
      }


      let width, height;
      width = height = this.tileSize;
      params.push("width=" + width);
      params.push("height=" + height);

      if (this.filters) {
        params.push("filters=" + this.filters);
      }
      if (this.igsMapStyle) {
        params.push("style=" + JSON.stringify(this.igsMapStyle));
      }
      if (!this.keepCache) {
        params.push("temp=" + Math.random());
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
