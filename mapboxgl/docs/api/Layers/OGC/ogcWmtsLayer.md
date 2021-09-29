# OGC-WMTS

> mapgis-ogc-wmts-layer

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **非侦听属性**
- **描述:** KVP 模式的基地址.
- **示例:** "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer"

### `wmtsLayer`

- **类型:** `String`
- **默认值:** ``
- **watch**
- **非侦听属性**
- **描述:** wmts 标准中的 layer 属性，即图层名称
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。<br/>
  > ... <br/> > \<Layer\> <br/> > \<ows:Title\>beijing\</ows:Title\> <br/> > \<ows:Identifier\>beijing</ows:Identifier\>//这个值 beijing 就是 wmtsLayer 属性所需要的值 <br/>
  > ... <br/> > \</Layer\> <br/>
  > ... <br/>
  > 全文搜索\<Layer\>关键字，在 Layer 下找到\<ows:Identifier\>属性，里面的值"beijing"就是 wmtsLayer 属性所需要的

### `tileMatrixSet`

- **类型:** `String`
- **默认值:** ``
- **watch**
- **非侦听属性**
- **描述:** wmts 标准中的 TileMatrixSet 属性，即地图矩阵集合
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。<br/>
  > ... <br/> > \<TileMatrixSet\> <br/> > \<ows:Title\>采用 arcgis 计算方式的瓦片块阵集\</ows:Title\> <br/> > \<ows:Abstract\>该块阵集使用 arcgis 标准计算的比例尺\</ows:Abstract\> <br/> > \<ows:Identifier\>EPSG:4326*北京市\_arcgis_GB\</ows:Identifier\>//这个值 EPSG:4326*北京市*arcgis_GB 就是 TileMatrixSet 属性所需要的值 <br/> > \<ows:SupportedCRS\>urn:ogc:def:crs:EPSG::4326\</ows:SupportedCRS\> <br/> > \<WellKnownScaleSet\>urn:ogc:def:wkss:OGC:1.0:GoogleCRS84Quad\</WellKnownScaleSet\> <br/>
  > ... <br/> > \<TileMatrixSet\> <br/>
  > ... <br/>
  > 全文搜索\<TileMatrixSet\>关键字，在\<TileMatrixSet\>下找到\<ows:Identifier\>属性，里面的值"EPSG:4326*北京市\_arcgis_GB"就是 tileMatrixSet 属性所需要的

### `version`

- **类型:** `String`
- **默认值:** `1.0.0`
- **watch**
- **非侦听属性**
- **描述:** wmts 服务版本号。

### `wmtsStyle`

- **类型:** `String`
- **默认值:** `default`
- **watch**
- **非侦听属性**
- **描述:** wmts 标准中的 style 属性，即地图样式
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。 <br/>
  > ... <br/> > \<Style isDefault="true"\> <br/> > \<ows:Title\>Default Style\</ows:Title\> <br/> > \<ows:Identifier\>default\</ows:Identifier\>//里面的"default"就是 wmtsStyle 的值 <br/> > \</Style\> <br/>
  > ... <br/>
  > 全文搜索 Style 关键字，地图可以有多个 style，这里以 default，默认值为例，在\<Style isDefault="true"\>下找到\<ows:Identifier\>属性，里面的"default"就是 wmtsStyle 的值

### `format`

- **类型:** `String`
- **默认值:** `image/png`
- **watch**
- **非侦听属性**
- **描述:** wmts 标准中的 format 属性，即请求的图片的返回格式
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。 <br/>
  > ... <br/> > \<Format\>image/png\</Format\> <br/>
  > ... <br/>
  > 全文搜索\<Format\>关键字，里面的值"image/png"就是 format 属性所需要的

### `zoomOffset`

- **类型:** `Number`
- **watch**
- **非侦听属性**
- **默认值** 0
- **描述:** 地图偏移级数，老版本的 Igserver 会使用到

### `layer`

- **类型:** `Object`
- **默认值:** `null`
- **侦听属性**
- **描述:**
  栅格瓦片图层可通过 layer 参数中的 paint、filter、layout 来修改图层样式属性，
  更多 raster 的属性参考官网

  > paint：
  > https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#raster）

  > layout：
  > https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#layout-property

  > filter：
  > https://docs.mapbox.com/help/glossary/filter/
  >
  > https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#filter

- **示例:**
  ```
  layer:{
           paint:{
             raster-opacity:0.5
           }
         }
  layer:{
           filter:["all", ["==", "mpginf_id", "1"]]
        }
  layer:{
           layout:{
             visibility:'visible'
           }
        }
  ```

## 事件

All common layer [events](/zh/api/Layers/#events)

## 示例

### KVP 格式

```vue
<template>
  <mapgis-web-map
    class="main"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :zoom="mapZoom"
    :center="outerCenter"
    :crs="mapCrs"
  >
    <mapgis-ogc-wmts-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :ip="igsWmtsIp"
      :port="igsWmtsPort"
      :tileMatrixSet="igsWmtsTilematrixSet"
      :wmtsLayer="igsWmtsLayer"
      :zoomOffset="zoomOffset"
    >
    </mapgis-ogc-wmts-layer>
  </mapgis-web-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import {
  MapgisWebMap,
  MapgisOgcWmtsLayer
} from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapgisWebMap,
    MapgisOgcWmtsLayer
  },
  data() {
    return {
      mapStyle: {
        //设置版本号，一定要设置
        version: 8,
        //添加来源
        sources: {},
        //设置加载并显示来源的图层信息
        layers: []
      }, // 地图样式
      mapZoom: 8, // 地图初始化级数
      outerCenter: [116.39, 40.2], // 地图显示中心
      mapCrs: "EPSG:4326",
      layer: "beijing",
      layerWmtsId: "ogcwmts_layerId",
      sourceWmtsId: "ogcwmts_sourceId",
      tileMatrixSet: "EPSG:4326_北京市_arcgis_GB",
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/ogc/WMTSServer",
      //因为司马云是用的老版本的igs服务，因此offset必须传-1
      offset: -1
    };
  },

  created() {
    // 在组件中使用mapbox-gl.js的脚本库功能
    this.mapbox = Mapbox;
  }
};
</script>

<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```
