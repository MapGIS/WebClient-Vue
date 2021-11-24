# IgsTdtLayer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** A raster tile source.
- **参考:** `Raster source` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-raster)

### `url`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 完整的地图请求路径。当 url 不为空时，除了 tileSize，其他参数无效

### `tileSize`

- **类型:** `Number`
- **默认值:** `512`
- **非侦听属性**
- **描述:** 输出瓦片大小。

### `domain`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** igs 服务域名。(domain 和（protocol，ip，port）二选一)
- **示例:** `http://localhost:6163`

### `protocol`

- **类型:** `String`
- **默认值:** `location.protocol.split(":")[0] || "http"`
- **非侦听属性**
- **描述:** igs 服务网络协议。(domain 和（protocol，ip，port）二选一)

### `ip`

- **类型:** `String`
- **默认值:** `localhost`
- **非侦听属性**
- **描述:** igs 服务 ip。(domain 和（protocol，ip，port）二选一)

### `port`

- **类型:** `String`
- **默认值:** `6163`
- **非侦听属性**
- **描述:** igs 服务 port。(domain 和（protocol，ip，port）二选一)

### `layerType`

- **类型:** `String`
- **默认值:** `vec`
- **非侦听属性**
- **描述:** 图层类型。vec：天地图矢量数据；img：天地图影像数据；cva：天地图矢量注记数据；cia：天地图影像注记数据；vec_igs：天地图矢量数据(通过 IGS)；img_igs：天地图影像数据(通过 IGS)；cva_igs：天地图矢量注记数据(通过 IGS)；cia_igs：天地图影像注记数据(通过 IGS)

### `token`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 请求天地图的 key 值

### `baseURL`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 请求的基地址。

### `crs`

- **类型:** `String`
- **默认值:** `EPSG:4326`
- **非侦听属性**
- **描述:** 空间坐标参考系。

### `isLabel`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **描述:** 是否为标签图层。

### `version`

- **类型:** `String`
- **默认值:** `1.0.0`
- **非侦听属性**
- **描述:** 请求的版本号，支持 1.0.0 版本

### `tdtStyle`

- **类型:** `String`
- **默认值:** `default`
- **非侦听属性**
- **描述:** 天地图样式

### `format`

- **类型:** `String`
- **默认值:** `tiles`
- **非侦听属性**
- **描述:** 输出格式

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

All common layer [events](/api/Layers/#events)

## 示例

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
    <mapbox-igs-tdt-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :baseURL="baseURL"
      :token="token"
      :crs="mapCrs"
    >
    </mapbox-igs-tdt-layer>
  </mapgis-web-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import {
  MapgisWebMap,
  MapboxIgsTdtLayer
} from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapgisWebMap,
    MapboxIgsTdtLayer
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
      baseURL: "http://t2.tianditu.gov.cn/vec_c/wmts", // 请求基地址
      token: "2ddaabf906d4b5418aed0078e1657029" // 请求天地图的key值
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
