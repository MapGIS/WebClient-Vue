<template>
  <span />
</template>
<script>
import rasterTileLayer from "../customtile/rasterTileLayer.js";
import rasterLayer from "../RasterLayer.js";
import layerEvents from "../../../lib/layerEvents";
import { newGuid } from "../../util";
import { TileInfoUtil } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-mapboxgl-plugin";

export default {
  name: "mapgis-web-tile-layer",
  mixins: [rasterLayer],
  props: {
    layerId: {
      type: String,
    },
    sourceId: {
      type: String,
    },
    baseUrl: {
      type: String,
      default: ""
    },
    // 子域名集
    subDomains: {
      type: Array,
      default: () => []
    },
    tileSize:{
      type: Array,
      default: () => [256, 256]
    },
    tileSliceType:{
      type: String,
      default: ""
    },
    spatialReference: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  inject: ["mapbox", "map"],
  methods: {
    $_deferredMount() {
      this.layerId = this.layerId ? this.layerId : newGuid()
      this.sourceId = this.sourceId ? this.sourceId : this.layerId
      const wkid = Number(this.spatialReference.wkid)
      // 支持子域名模式，统一子域名关键字
      const subDomainKeys = ['{s}','{subDomain}','{subDomains}']
      subDomainKeys.forEach(key => {
        if (this.baseUrl && this.baseUrl.includes(key)) {
          this.baseUrl = this.baseUrl.replace(key, '{s}')
        }
      })

      if (wkid === 20020902) {
        // 百度bd09墨卡托
        const bdLayerId = this.layerId
        rasterTileLayer.providers.Baidu[bdLayerId] = {
            Map: this.baseUrl,
            Subdomains: this.subDomains.toString(),
        }
        this.customLayer = rasterTileLayer(
          bdLayerId,
          `Baidu.${bdLayerId}.Map`
        );
        this.map.addLayer(this.customLayer, this.before);
      } else if (wkid === 20010202) {
        // 高德gcj02墨卡托
        const gcjLayerId = this.layerId
        rasterTileLayer.providers.GaoDe[gcjLayerId] = {
            Map: this.baseUrl,
            Subdomains: this.subDomains.toString(),
        }
        this.customLayer = rasterTileLayer(
          gcjLayerId,
          `GaoDe.${gcjLayerId}.Map`
        );
        this.map.addLayer(this.customLayer, this.before);
      } else {
        if (!this.baseUrl.includes("{z}") && this.baseUrl.includes("{") && this.baseUrl.includes("}/")) {
          const urlStrs = this.baseUrl.split("{");
          const tag = urlStrs[1].split("}/")[0];
          this.baseUrl = this.baseUrl.replace(`{${tag}}`, "{z}");
        }
        const optMinimumLevel = this.options.minimumLevel || 0;
        const optMaximumLevel = this.options.maximumLevel || 22;
        this.$_addWebTile({
          // url: 'http://192.168.82.91:8089/igs/rest/mrms/tile/Tile:HuBei_4326/{z}/{y}/{x}',
          url: this.baseUrl,
          layerId: this.layerId,
          sourceId: this.sourceId,
          tileSize: this.tileSize[0],
          tileSliceType: this.tileSliceType,
          opacity: 1,
          visible: "visible",
          zoomOffset: -this.options.offset,
          minimumLevel: optMinimumLevel,
          maximumLevel: optMaximumLevel
        })
      }
      this.$_emitEvent("added", { layerId: this.layerId });
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },
    $_addWebTile(layer){
      // 获取并添加rasterSource
      const mapSource = this.$_getRasterSource(layer)
      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(layer.sourceId, mapSource)
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId || this.layerId);
          this.map.addSource(this.sourceId || this.layerId, source);
        }
      }
      // 获取并添加rasterLayer
      const rasterLayer = this.$_getRasterLayer(layer.layerId, layer.sourceId, layer)
      this.map.addLayer(rasterLayer, this.before);
    },
    $_getRasterSource(options) {
      const {url, tileSize, renderMode, subDomains, requestParams, clippingArea, zoomOffset, minimumLevel, maximumLevel, tileSliceType} = options
      let rasterSource
      let urls = [url]
      // 支持子域名模式
      if (url && url.includes('{s}') && Array.isArray(subDomains)) {
        urls = subDomains.map((v) => {
          return url.replace('{s}', v)
        })
      }
    
      if (renderMode === 'image') {
        rasterSource = {
          url,
          rebaseRequestUrl(url, params) {
            const _sw = this.map
              .getCRS()
              .projection.project(this.map.getBounds()._sw)
            const _ne = this.map
              .getCRS()
              .projection.project(this.map.getBounds()._ne)
            const bound = [..._sw, ..._ne]
            const bbox = bound.toString()
            const [imageWidth, imageHeight] = params.imageSize
            const split =
              url.split('?').length > 1
                ? url.split('?')[1].split('&')
                : url.split('&')
            split.forEach((part) => {
              // igs2.0 出一张图模式
              if (part.includes('size=')) {
                url = url.replace(part, `size=${imageWidth},${imageHeight}`)
              }
              // igs1.0 出一张图模式
              if (part.includes('w=')) {
                url = url.replace(part, `w=${imageWidth}`)
              }
              if (part.includes('h=')) {
                url = url.replace(part, `h=${imageHeight}`)
              }
              // 动态计算bbox
              if (part.includes('bbox=')) {
                url = url.replace(part, `bbox=${bbox}`)
              }
            })
            return url
          },
          requestParams,
          type: 'image-map',
          clippingArea:clippingArea
        }
      } else {
        rasterSource = {
          type: 'raster',
          tiles: urls,
          requestParams,
          tileSize,
          clippingArea:clippingArea
        }
      }
      // 解析zoomOffset
      let _zoomOffset = zoomOffset;
      if (this.map.getCRS().epsgCode.includes("4326")) {
        if (url.includes('tianditu.com') || url.includes('tianditu.gov.cn')) {
          // 天地图第0级1.4062499999782967
          _zoomOffset = _zoomOffset === undefined ? 0 : _zoomOffset;
        } else {
          // 标准的4326缺裁图方式，第0级分辨率0.7031249999891483，和mapboxgl引擎默认的4326 crs第0级分辨率1.4062499999782967相比，缺少一级
          _zoomOffset = _zoomOffset === undefined ? -1 : _zoomOffset - 1;
        }
      }
      rasterSource.mapgisOffset = _zoomOffset

      rasterSource.minzoom = minimumLevel
      rasterSource.maxzoom = maximumLevel
      if (tileSliceType === 'tms') {
        rasterSource.scheme = 'tms'
      }

      return rasterSource
    },
    $_getRasterLayer(layerId, sourceId, options){
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      let layer = {
        id: layerId,
        type: 'raster',
        source: sourceId,
        // 初始化时设置图层透明度
        paint: {
          'raster-opacity': options.opacity
        },
        // 初始化时设置图层可见性
        layout: {
          visibility: options.visible
        }
      }
      return layer
    },
    /**
     * 通过webclient-common的layer来构造并添加mapboxgl的图层
     */
    $_deferredMountByCommonLayer() {
      const { commonLayer } = this;
      if (commonLayer) {
        this.$_deferredUnMount();
        const mapboxglOptions = initializeOptions(commonLayer, viewer);
        const { layers = [], sources = [] } = mapboxglOptions;
        this.layerIdBack = commonLayer.id;
        if (layers[0]) {
          if (layers[0].type === "custom") {
            this.customLayer = layers[0];
            this.customLayer.id = this.layerIdBack
            this.map.addLayer(this.customLayer, this.before);
          } else {
            layers[0].id = commonLayer.id;
            this.layerIdBack = layers[0].id;
            this.sourceIdBack = layers[0].source;
            this.sourceBack = sources[this.sourceIdBack];
            this.map.on("dataloading", this.$_watchSourceLoading);
            try {
              this.map.addSource(this.sourceIdBack, this.sourceBack)
            } catch (err) {
              if (this.replaceSource) {
                this.map.removeSource(this.sourceIdBack);
                this.map.addSource(this.sourceIdBack, this.sourceBack);
              }
            }
            this.map.addLayer(layers[0], this.before);
          }
        }
      }
    },
  }
};
</script>

<style scoped></style>
