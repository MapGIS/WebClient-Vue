<template>
  <span />
</template>
<script>
import rasterTileLayer from "../customtile/rasterTileLayer.js";
import rasterLayer from "../RasterLayer.js";
import { newGuid } from "../../util";

export default {
  name: "mapgis-web-tile-layer",
  mixins: [rasterLayer],
  props: {
    layerId: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      default: ""
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
    srs: {
      type: String,
      default: "EPSG:4326"
    }
  },
  inject: ["mapbox", "map"],
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        vueKey: "string",
        vueIndex: "string | Number"
      },
      managerName: "WebTileManager",
      // providerName: "BaiduImageryProvider", //cesium调用的类名
      providerName: "UrlTemplateImageryProvider"
    };
  },
  created() {
    console.log('this.map: ', this.map);
    debugger
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      this.layerId = this.layerId?this.layerId:newGuid()
      const wkid = Number(this.spatialReference.wkid)
      if (wkid === 20020902) {
        // 百度bd09墨卡托
        // this.map.addLayer(rasterTileLayer('bdsl', 'Baidu.Normal.Map'));
        const bdLayerId = 'bd'+ this.layerId
        rasterTileLayer.providers.Baidu[bdLayerId] = {
            Map: this.baseUrl,
        }
        this.map.addLayer(rasterTileLayer(bdLayerId, `Baidu.${bdLayerId}.Map`));
      } else if (wkid === 20010202) {
        // 高德gcj02墨卡托
        const gcjLayerId = 'gcj'+ this.layerId
        rasterTileLayer.providers.GaoDe[gcjLayerId] = {
            Map: this.baseUrl,
        }
        this.map.addLayer(rasterTileLayer(gcjLayerId, `GaoDe.${gcjLayerId}.Map`));
      } 
      else {
        // this.map.addLayer(rasterTileLayer(layerId, layerType, options));
        this.addTile({
          url: this.baseUrl,
          id: this.layerId,
          tileSize: this.tileSize[0],
          tileSliceType: this.tileSliceType,
          opacity: 1,
          visible: "visible"
        })
      }
    },
    addTile(layer){
      const sourceID = `source_${layer.id}`
      const layerID = `layer_${layer.id}`
      const mapSource = this._getRasterSource(
        layer.url,
        layer.tileSize,
        layer.renderMode,
        layer.subDomains,
        layer.requestParams,
        layer.clippingArea,
        layer.tileSliceType
      )
      if (layer.tileSliceType === 'tms') {
        mapSource.scheme = 'tms'
      }
      const mapLayer = this._getRasterLayer(layerID, sourceID, layer)
    
      // 添加source和layer
      this.map.addSource(sourceID, mapSource)
      this.map.addLayer(mapLayer)
    },
    _getRasterSource(url, tileSize, renderMode, subDomains, requestParams, clippingArea) {
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
      return rasterSource
    },
    _getRasterLayer(layerID, sourceID, layer){
        return {
        id: layerID,
        type: 'raster',
        source: sourceID,
        // 初始化时设置图层透明度
        paint: {
          'raster-opacity': layer.opacity
        },
        // 初始化时设置图层可见性
        layout: {
          visibility: layer.visible
        }
      }
    },
    addWebTile() {
      let options = {};
      if (this.$props.spatialReference) {
        const wkid = Number(this.$props.spatialReference.wkid)
        // 构造TileInfo
        const tileInfo = this.$_getTileInfoByWKID(wkid);
        // 根据TileInfo构造mapbox-gl引擎所需的crs对象
        const resolutions = []
        tileInfo.lods.forEach((lod)=>{
          resolutions.push(lod.resolution)
        })
        const origin = tileInfo.origin
        const tileSize = tileInfo.size[0]
        const extent = this.$_getExtentByWKID(wkid)
        const bounds = [extent.xmin,extent.ymin,extent.xmax,extent.ymax]
        // this.test = this.mapbox
        // this.test1 = this.map
        // const map = new this.mapbox.Map({
        //   //地图容器div的id
        //   container: 'map',
        //   // 构建自定义CRS
        //   crs: new CRS(`EPSG:${wkid}`, '', {
        //       resolutions,
        //       origin,
        //       tileSize,
        //       bounds,
        //       tileSliceType: 'tms'
        //   }),
        //   style: {
        //         //设置版本号，一定要设置
        //         "version": 8,
        //         //添加来源
        //         "sources": {
        //             "baidu": {
        //                 type: 'raster',
        //                 tiles: ['http://api1.map.bdimg.com/customimage/tile?&udt=20180601&scale=1&x={x}&y={y}&z={z}&styles=midnight','http://api2.map.bdimg.com/customimage/tile?&udt=20180601&scale=1&x={x}&y={y}&z={z}&styles=midnight'],
        //                 tileSize:256,
        //                 scheme:'tms'
        //             }
        //         },
        //         //设置加载并显示来源的图层信息
        //         "layers": [
        //             {
        //                 //图层id，要保证唯一性
        //                 "id": "baidu-tile",
        //                 //图层类型
        //                 "type": "raster",
        //                 //连接图层来源
        //                 "source": "baidu",
        //                 //图层最小缩放级数
        //                 "minzoom": 0,
        //                 //图层最大缩放级数
        //                 "maxzoom": 22
        //             }
        //         ]
        //   }
        // });
      }
      this.$_mount(options);
    },
    unmount() {
      this.$_unmount();
    },
    $_getExtentByWKID(wkid){
      let extent = undefined
      if (wkid === 20020902) {
        // 构建 自定义Wkid 百度09墨卡托的默认extent
        extent = {
          xmin: -20037726.37,
          ymin: -12474104.17,
          xmax: 20037726.37,
          ymax: 12474104.17,
        }
      } else if ([3857, 20010202].indexOf(wkid)) {
        // 是Web墨卡托坐标系或者高德墨卡托
        extent = {
          xmin: -20037508.3427892,
          ymin: -20037508.3427892,
          xmax: 20037508.3427892,
          ymax: 20037508.3427892,
          spatialReference: SpatialReference.fromJSON(this.spatialReference)
        }
      } else if ([4326, 4490, 4610, 4214, 20020901, 20010201].indexOf(wkid)) {
        // 是经纬度坐标系 或者 百度经纬度、高德经纬度
         extent = {
          xmin: -180,
          ymin: -90,
          xmax: 180,
          ymax: 90
        };
      } 
      return extent
    },
    /*
     * 根据wkid构造瓦片信息
     * @param wkid 参考系的wkid号
     * **/
    $_getTileInfoByWKID(wkid) {
      let tileInfo = {};
      if (wkid === 20020902) {
        // 构建自定义Wkid 百度09墨卡托的默认TileInfo
        const lods = [];
        const tileSize = [256, 256];
        for (let i = 0; i < 19; i++) {
          const resolution = Math.pow(2, 18 - i);
          lods[i] = { level: i, resolution: resolution, scale: null };
        }
        tileInfo = {
          dpi: 0,
          format: "PNG",
          size: tileSize, // 瓦片宽高的像素大小
          origin: {
            coordinates: [0, 0], // 裁图原点
            type: "Point" // 裁图原点类型
          },
          lods: lods
        };
      } else if (wkid === 20010202) {
        // 构建自定义Wkid 国测局02墨卡托的默认TileInfo
        const lods = [];
        const tileSize = [256, 256];
        const maxLength = 20037508.3427892;
        const resolution0 = (maxLength + maxLength) / tileSize[0];
        // 总共20级
        for (let i = 0; i < 19; i++) {
          const resolution = resolution0 / Math.pow(2, i);
          lods[i] = { level: i, resolution: resolution, scale: null };
        }
        tileInfo = {
          dpi: 0,
          format: "PNG",
          size: tileSize, // 瓦片宽高的像素大小
          origin: {
            coordinates: [-maxLength, maxLength], // 裁图原点
            type: "Point" // 裁图原点类型
          },
          lods: lods
        };
      } else if ([4326, 4490, 4610, 4214, 20020901, 20010201].indexOf(wkid)) {
        const extent = this.$_getExtentByWKID(wkid)
        const numberOfMinLevelTilesX = 2;
        const tileSize = 256;
        const mapUnitToMeters = 111319490.79327358;
        // 最大(第0级)分辨率
        const resolution0 =
          (extent.xmax - extent.xmin) / numberOfMinLevelTilesX / tileSize;
        // 开始计算分辨率
        const lods = [];
        // 默认构造20级分辨率
        for (let i = 0; i < 19; i++) {
          const resolutions = resolutions0 / Math.pow(2,i)
          const lod = {
            level: i,
            resolution: resolutions[i] / 2,
            scale: (mapUnitToMeters * (resolution * 96)) / 0.0254
          };
          lods.push(lod);
        }
        tileInfo = {
          dpi: 96,
          format: "PNG",
          size: tileSize, // 瓦片宽高的像素大小
          origin: {
            coordinates: [180, -90], // 裁图原点
            type: "Point", 
          },
          lods: lods
        };
      } else if ([3857].indexOf(wkid)) {
        const extent = this.$_getExtentByWKID(wkid)
        const numberOfMinLevelTilesX = 1;
        const tileSize = 256;
        // 最大(第0级)分辨率
        const resolution0 =
          (extent.xmax - extent.xmin) / numberOfMinLevelTilesX / tileSize;
        // 开始计算分辨率
        const lods = [];
        // 默认构造20级分辨率
        for (let i = 0; i < 19; i++) {
          const resolutions = resolutions0 / Math.pow(2,i)
          const lod = {
            level: i,
            resolution: resolutions[i] / 2,
            scale: (resolution * 96) / 0.0254
          };
          lods.push(lod);
        }
        tileInfo = {
          dpi: 96,
          format: "PNG",
          size: tileSize, // 瓦片宽高的像素大小
          origin: {
            coordinates: [20037508.3427892, -20037508.3427892], // 裁图原点
            type: "Point", 
          },
          lods: lods
        };
      }
      return tileInfo;
    }
  }
};
</script>

<style scoped></style>
