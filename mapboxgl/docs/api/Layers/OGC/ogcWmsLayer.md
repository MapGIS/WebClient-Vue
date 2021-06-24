# IgsWmsLayer

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **非侦听属性**
- **描述:** WMS 请求基地址.
- **示例:** "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMSServer"

### `layers`

- **类型:** `String`
- **默认值:** `null`
- **侦听属性**
- **描述:** 图层名称或 Id
  > 图层名称或 Id，多个值以逗号分隔，不传时不显示地图 <br/>
  > igs 使用地图名称 <br/>
  > arcgis 根据版本不同，可使用 id 或名称，具体请看 arcgis 的 wms 服务的 xml 文档，例如： <br/>
  > http://219.142.81.85/arcgis/services/矿产地数据库2019/ferrous_metal/MapServer/WMSServer?request=GetCapabilities&service=WMS <br/>
  > ... <br/>
  > \<Layer queryable="1"\> <br/>
  > \<Name>0\</Name> <br/>
  > ... <br/>
  > \</Layer\> <br/>
  > ... <br/>
  > 在此文档中找到 Layer 下面的\<Name\>0\</Name\>属性，这里指定图层名称为 0，因此按 id 来查询，若指定名称为英文或汉字则按名称查询

### `version`

- **类型:** `String`
- **默认值:** `1.0.0`
- **非侦听属性**
- **描述:** wmts 服务版本号。

### `format`

- **类型:** `String`
- **默认值:** `image/png`
- **非侦听属性**
- **描述:** 返回格式

### `token`

- **类型:** `String`
- **非侦听属性**
- **描述:** 瓦片请求的 token

### `height`

- **类型:** `Number`
- **默认值:** `512`
- **非侦听属性**
- **描述:** 瓦片的高度

### `width`

- **类型:** `Number`
- **默认值:** `512`
- **非侦听属性**
- **描述:** 瓦片的宽度

### `reversebbox`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **描述:** 这个参数专门针对特定版本的 arcserver，在一些特定的 arcserve 版本其 bbox 的传入方式是[miny, minx, maxy, maxx],而不是[minx, miny, maxx, maxy]

## 事件

All common layer [events](/zh/api/Layers/#events)

## 示例

```vue
<template>
  <mapgis-web-map
    id="map"
    v-bind:map-style="mapStyle"
    v-bind:zoom="mapZoom"
    v-bind:center="outerCenter"
    v-bind:crs="mapCrs"
    v-on:load="handleMapLoad"
  >
    <mapgis-ogc-wms-layer
      v-bind:layers="layers"
      v-bind:layer-id="layerRasterId"
      v-bind:source-id="sourceRasterId"
      v-bind:baseUrl="baseUrl"
    >
    </mapgis-ogc-wms-layer>
  </mapgis-web-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import { MapboxMap, MapboxIgsWmtsLayer } from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap,
    MapboxIgsWmtsLayer
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
      layers:
        "北京市,绿地_1,绿地_2,绿地_3,绿地_4,水域_3,水域_2,水域_1,大学,学校,动物园,高尔夫,观光胜地,果园,住宅用地,医院",
      layerRasterId: "raster_layerId",
      sourceRasterId: "raster_sourceId",
      baseUrl:
        "http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer"
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
