# IgsTileLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **Non-Synced**
- **描述:** A raster tile source.
- **参考:** `Raster source` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-raster)

### `url`

- **类型:** `String`
- **默认值:** `null`
- **Non-Synced**
- **描述:** 完整的地图请求路径。当 url 不为空时，除了 tileSize 和 zoomOffset，其他参数无效

### `tileSize`

- **类型:** `Number`
- **默认值:** `512`
- **Non-Synced**
- **描述:** 输出瓦片大小。

### `domain`

- **类型:** `String`
- **默认值:** `null`
- **Non-Synced**
- **描述:** igs 服务域名。(domain 和（protocol，ip，port）二选一)
- **示例:** `http://localhost:6163`

### `protocol`

- **类型:** `String`
- **默认值:** `location.protocol.split(":")[0] || "http"`
- **Non-Synced**
- **描述:** igs 服务网络协议。(domain 和（protocol，ip，port）二选一)

### `ip`

- **类型:** `String`
- **默认值:** `localhost`
- **Non-Synced**
- **描述:** igs 服务 ip。(domain 和（protocol，ip，port）二选一)

### `port`

- **类型:** `String`
- **默认值:** `6163`
- **Non-Synced**
- **描述:** igs 服务 port。(domain 和（protocol，ip，port）二选一)

### `serverName`

- **类型:** `String`
- **Required**
- **Non-Synced**
- **描述:** 地图服务名。

### `zoomOffset`

- **类型:** `Number`
- **默认值:** `0`
- **Non-Synced**
- **描述:** 级数偏差数。igs 经纬度瓦片 zoomOffset 取值为 1，igs 墨卡托瓦片 zoomOffset 取值为 0。以支持非标准裁剪的瓦片（这里的非标准不是指任意裁剪瓦片，而是当前瓦片的 0 级不是 mapbox 定义的瓦片的 0 级，中间相差 zoomOffset 级）

## Events

All common layer [events](/zh/api/Layers/#events)

## Example

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
