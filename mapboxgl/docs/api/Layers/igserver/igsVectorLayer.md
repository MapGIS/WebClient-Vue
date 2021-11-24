# Igs 矢量图层

> mapgis-igs-vector-layer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `layerId`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 待添加的图层的 id，不能与现有的图层冲突.
- **参考:** `layer-id` in [Mapbox Layer Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-id)

### `baseUrl`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 服务基地址。

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

### `gdbps`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **watched**
- **描述:** 图层的 gdbps 地址，允许多个图层，以“,”隔开

### `filters`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **watched**
- **描述:** 用户指定的图层过滤条件，它由多个键值对组成，值为过滤条件。
- **示例:** `1:ID>4,3:ID>1`

### `igsMapStyle`

- **类型:** `Object`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 用户指定的图层显示样式，每个 gdbp 对应一个 style，style 为 CDisplayStyleExtend 的 json 序列化形式，多个 style 之间用“，”隔开。
- **示例:** `[{index:0,symbleshow:true,followscale:true},{index:1,symbleshow:true,FollowScale:true}]`

### `f`

- **类型:** `String`
- **默认值:** `png`
- **非侦听属性**
- **描述:** 矢量图片的格式。

### `guid`

- **类型:** `String`
- **默认值:** `new Date().getTime().toString()`
- **非侦听属性**
- **描述:** 唯一 ID，用户标识地图图层。

### `keepCache`

- **类型:** `Boolean`
- **默认值:** `true`
- **非侦听属性**
- **描述:** 当 keepCache 设置为 true 时，优先从客户端缓存中取瓦片，否则不从客户端缓存中提取

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
    <mapbox-igs-vector-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :ip="igsVectorIp"
      :port="igsVectorPort"
      :gdbps="igsVectorGdbps"
    >
    </mapbox-igs-vector-layer>
  </mapgis-web-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import {
  MapgisWebMap,
  MapboxIgsVectorLayer
} from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapgisWebMap,
    MapboxIgsVectorLayer
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
      igsVectorIp: "localhost", // igs服务ip
      igsVectorPort: "6163", // igs服务port
      igsVectorGdbps: "gdbp://MapGisLocal/专题图数据/sfcls/中国地级县x" // igs地图图层gdbp地址
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
