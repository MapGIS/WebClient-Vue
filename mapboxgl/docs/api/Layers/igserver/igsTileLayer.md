# IgsTileLayer

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** A raster tile source.
- **参考:** `Raster source` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-raster)

### `baseUrl`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 地图请求路径基地址。
- **示例**
  ```
  http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市
  ```

### `tileSize`

- **类型:** `Number`
- **默认值:** `512`
- **非侦听属性**
- **描述:** 输出瓦片大小。

### `zoomOffset`

- **类型:** `Number`
- **默认值:** `0`
- **非侦听属性**
- **描述:** 级数偏差数。igs 经纬度瓦片 zoomOffset 取值为 1，igs 墨卡托瓦片 zoomOffset 取值为 0。以支持非标准裁剪的瓦片（这里的非标准不是指任意裁剪瓦片，而是当前瓦片的 0 级不是 mapbox 定义的瓦片的 0 级，中间相差 zoomOffset 级）

## 事件

All common layer [events](/zh/api/Layers/#events)

## 示例

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
    <mapbox-igs-tile-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :ip="igsTileIp"
      :port="igsTilePort"
      :serverName="igsTileName"
      :zoomOffset="zoomOffset"
    >
    </mapbox-igs-tile-layer>
  </mapbox-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import { MapboxMap, MapboxIgsTileLayer } from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap,
    MapboxIgsTileLayer
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA", // 使用mapbox样式需要的秘钥
      mapStyle: "mapbox://styles/mapbox/light-v9", // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [130, 30], // 地图显示中心
      mapCrs: "EPSG:3857",

      layerId: "igsLayer_layerId",
      sourceId: "igsLayer_sourceId",
      layer: {}, // 图层配置信息
      igsTileIp: "localhost", // igs服务ip
      igsTilePort: "6163", // igs服务port
      igsTileName: "省级行政区墨卡托", // igs地图服务名
      zoomOffset: 0 // 级数偏差
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
