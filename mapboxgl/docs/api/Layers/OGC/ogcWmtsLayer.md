# IgsWmtsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **Non-Synced**
- **描述:** KVP模式的基地址.
- **示例:** "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer"

### `wmtsLayer`

- **类型:** `String`
- **默认值:** ``
- **watch**
- **Non-Synced**
- **描述:** 地图文档名称。

### `tileMatrixSet`

- **类型:** `String`
- **默认值:** ``
- **watch**
- **Non-Synced**
- **描述:** 缩放等级

### `version`

- **类型:** `String`
- **默认值:** `1.0.0`
- **watch**
- **Non-Synced**
- **描述:** wmts服务版本号。

### `wmtsStyle`

- **类型:** `String`
- **默认值:** `default`
- **watch**
- **Non-Synced**
- **描述:** 地图样式

### `format`

- **类型:** `String`
- **默认值:** `image/png`
- **watch**
- **Non-Synced**
- **描述:** 返回格式

### `zoomOffset`

- **类型:** `Number`
- **watch**
- **Non-Synced**
- **默认值** 0
- **描述:** 地图偏移级数，老版本的Igserver会使用到

## Events

All common layer [events](/zh/api/Layers/#events)

## Example

### KVP格式

```vue
<template>
  <mapbox-map
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
  </mapbox-map>
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
      layer: 'beijing',
      layerWmtsId: 'ogcwmts_layerId',
      sourceWmtsId: 'ogcwmts_sourceId',
      tileMatrixSet:"EPSG:4326_北京市_arcgis_GB",
      baseUrl:'http://develop.smaryun.com:6163/igs/rest/ogc/WMTSServer',
      //因为司马云是用的老版本的igs服务，因此offset必须传-1
      offset: -1
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
