# ArcGIS 瓦片

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

### `forceOffset`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **描述:** 是否强制执行层级偏移量，这个地方会导致 4326 无法主动传入 offset=0 的情况，但是默认的 arcgis 测试 10.3 10.5 10.7 后发现 arcigs 默认情况下就是 offset=-1, 因此忽略主动传入 0 的场景. 这种情况只会发生在操作 arcserver 的时候，人为刻意的进行一张 512\*512 的操作导致，这个操作本身是一种错误的操作

::: warn
使用场景，当 arcgis 裁剪出的 4326、4490、4610 服务的初始级正好就对应墨卡托投影的第一级的时候。类似下面的实现形式，在东西半球的下面各补充一个虚拟的空间范围，使得整个地球变成一个矩形

```json
                // [-180, -270, 180, 90]
                // [-180, 90]   |------|------|    [180, 90]
                //              |--lt--|--rt--|
                //              |------|------|
                //              |--lb--|--rb--|
                // [-180, -270] |------|------|    [180, -270]
```

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
