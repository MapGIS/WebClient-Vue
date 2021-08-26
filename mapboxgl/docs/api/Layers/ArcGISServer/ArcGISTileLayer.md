# ArcGIS瓦片

> mapgis-arcgis-tile-layer

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 地图请求的基地址路径。

### `tileSize`

- **类型:** `Number`
- **默认值:** `256`
- **非侦听属性**
- **描述:** 若没传递该参数，则默认为地图坐标系。

### `zoomOffset`

- **类型:** `Number`
- **默认值:** `0`
- **非侦听属性**
- **描述:** 层级偏移量

## 示例

```vue
<template>
  <mapgis-web-map
    class="main"
    crs="EPSG:3857"
    :center="[114.299039, 30.594797]"
    :zoom="8"
  >
    <mapgis-arcgis-tile-layer :layerId="layerId" :baseUrl="baseUrl" />
  </mapgis-web-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import {
  MapgisWebMap,
  MapgisArcgisTileLayer
} from "@mapgis/webclient-vue-mapboxgl";
export default {
  components: {
    MapgisWebMap,
    MapgisArcgisTileLayer
  },
  data() {
    return {
      layerId: "arcgis_tile_sourceId",
      baseUrl:
        "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
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
