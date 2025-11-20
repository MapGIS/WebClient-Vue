import layerEvents from "../../../lib/layerEvents";
import RasterLayer from "../RasterLayer";
import IgsOptions from "./OgcOptions";

export default {
  name: "OgcBaseLayer",
  mixins: [RasterLayer],
  props: {
    ...IgsOptions,
    baseUrl: {
      type: String,
      default: null,
    },
  },
  methods: {
    // 请联合OgcWmsLayer.js的asyncInit/syncInit查看该处代码
    async $_deferredMount() {
      await this.$_init();
      /*
       * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
       * 修改说明: 使用统一接口获取layerId或sourceId
       * 修改人: 杨琨 2025-11-10
       */
      const sourceObject = this.$_getSource();
      let source = {
        type: "raster",
        tiles: [this._url],
        tileSize: this.tileSize,
        maxzoom: this.maximumLevel,
        minzoom: this.minimumLevel,
        ...sourceObject,
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      const sourceId = this.$_getSourceId();
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
