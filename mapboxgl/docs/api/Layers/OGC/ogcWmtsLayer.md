# IgsWmtsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **Non-Synced**
- **描述:** KVP模式的基地址.
- **示例:** "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer"

### `url`

- **类型:** `String`
- **Non-Synced**
- **描述:** REST方式的完整的地图请求路径。

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
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA", // 使用mapbox样式需要的秘钥
      mapStyle: "mapbox://styles/mapbox/light-v9", // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [130, 30], // 地图显示中心
      mapCrs: "EPSG:3857",

      layerId: "igsLayer_layerId",
      sourceId: "igsLayer_sourceId",
      layer: {}, // 图层配置信息
      igsWmtsIp: "localhost", // igs服务ip
      igsWmtsPort: "6163", // igs服务port
      igsWmtsTilematrixSet: "EPSG:3857_省级行政区墨卡托_dpi96_GB", // 块阵集
      igsWmtsLayer: "shengjixingzhengqumokat", // 瓦片数据名称
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

### 标准 URL 传参

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
    <mapbox-igs-wmts-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :url="url"
      :zoomOffset="zoomOffset"
    >
    </mapbox-igs-wmts-layer>
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
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA", // 使用mapbox样式需要的秘钥
      mapStyle: "mapbox://styles/mapbox/light-v9", // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [130, 30], // 地图显示中心
      mapCrs: "EPSG:4326",

      layerId: "igsLayer_layerId",
      sourceId: "igsLayer_sourceId",
      layer: {}, // 图层配置信息
      url:
        "http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
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
