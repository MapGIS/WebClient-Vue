# IgsWmsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **Non-Synced**
- **描述:** WMS请求基地址.
- **示例:** "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMSServer"

### `layers`

- **类型:** `String`
- **默认值:** `null`
- **Synced**
- **描述:** 指定需要被取图的图层序列号/图层名数组，以“，”分隔。默认为依据文档原始图层状态进行设置。特别注意如果是对接 mapgis 的 wms 服务，这个地方只能是"图层名字,图层名字" 而不是 "图层顺序,图层顺序"。
- **示例:** `1,2`

### `version`

- **类型:** `String`
- **默认值:** `1.0.0`
- **Non-Synced**
- **描述:** wmts 服务版本号。

### `format`

- **类型:** `String`
- **默认值:** `image/png`
- **Non-Synced**
- **描述:** 返回格式

### `token`

- **类型:** `String`
- **Non-Synced**
- **描述:** 瓦片请求的 token

### `height`

- **类型:** `Number`
- **默认值:** `512`
- **Non-Synced**
- **描述:** 瓦片的高度

### `width`

- **类型:** `Number`
- **默认值:** `512`
- **Non-Synced**
- **描述:** 瓦片的宽度

### `reversebbox`

- **类型:** `Boolean`
- **默认值:** `false`
- **Non-Synced**
- **描述:** 这个参数专门针对特定版本的 arcserver，在一些特定的 arcserve 版本其 bbox 的传入方式是[miny, minx, maxy, maxx],而不是[minx, miny, maxx, maxy]

## Events

All common layer [events](/zh/api/Layers/#events)

## Example

```vue
<template>
  <mapgis-web-map
      id="map"
      v-bind:map-style="mapStyle"
      v-bind:zoom="mapZoom"
      v-bind:center="outerCenter"
      v-bind:crs="mapCrs"
      v-on:load="handleMapLoad">
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
        layers: [],
      }, // 地图样式
      mapZoom: 8, // 地图初始化级数
      outerCenter: [116.39, 40.20], // 地图显示中心
      mapCrs: 'EPSG:4326',
      layers: '北京市,绿地_1,绿地_2,绿地_3,绿地_4,水域_3,水域_2,水域_1,大学,学校,动物园,高尔夫,观光胜地,果园,住宅用地,医院',
      layerRasterId: 'raster_layerId',
      sourceRasterId: 'raster_sourceId',
      baseUrl:'http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer'
    }
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
