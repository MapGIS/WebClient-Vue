# IgsDocLayer

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
- **描述:** 完整的地图请求路径。当 url 不为空时，除了 tileSize，其他参数无效

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

### `layers`

- **类型:** `Array`
- **默认值:** `null`
- **Non-Synced**
- **watched**
- **描述:** 指定需要被取图的图层序列号数组，以“，”分隔。默认为依据文档原始图层状态进行设置。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
  1、show：仅仅显示指定了图层序号的图层；
  2、hide ：显示除 hide 参数指定图层外所有的图层；
  3、include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层；
  4、exclude: 从默认图层列表里删除这些被指定的图层后，进行显示。
- **示例:** `show:1,2`

### `filters`

- **类型:** `String`
- **默认值:** `null`
- **Non-Synced**
- **watched**
- **描述:** 用户指定的图层过滤条件，它由多个键值对组成，值为过滤条件。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
- **示例:** `1:ID>4,3:ID>1`

### `igsMapStyle`

- **类型:** `Object`
- **默认值:** `null`
- **Non-Synced**
- **描述:** 显示参数，指整个地图文档的显示参数。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
- **示例:** `{SymbleShow:true,ShowElemRect:true}`

### `f`

- **类型:** `String`
- **默认值:** `png`
- **Non-Synced**
- **描述:** 图片的格式。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。jpg|png|gif

### `proj`

- **类型:** `String`
- **默认值:** `null`
- **Non-Synced**
- **描述:** 投影参数设置，仅在非动态裁图时有意义，针对整个地图文档进行操作。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
- **示例:** `WGS1984_度`

### `guid`

- **类型:** `String`
- **默认值:** `newGuid()`in [Util](/zh/api/Util/util)
- **Non-Synced**
- **描述:** 唯一 ID，用户标识地图文档。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。

### `cache`

- **类型:** `Boolean`
- **默认值:** `false`
- **Non-Synced**
- **watched**
- **描述:** 是否使用动态裁图功能。

### `isAntialiasing`

- **类型:** `Boolean`
- **默认值:** `false`
- **Non-Synced**
- **描述:** 是否高质量显示。

### `update`

- **类型:** `Boolean`
- **默认值:** `false`
- **Non-Synced**
- **描述:** 是否更新当前瓦片，仅当 cache 为 true 时有效。

### `mode`

- **类型:** `String`
- **默认值:** `null`
- **Non-Synced**
- **描述:** 模式，如果是快显取图（hiRender,fast_display），文档为只读，只有 bbox,w,h 有效。

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
    <mapbox-igs-doc-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :ip="igsDocIp"
      :port="igsDocPort"
      :serverName="igsDocName"
    >
    </mapbox-igs-doc-layer>
  </mapbox-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import { MapboxMap, MapboxIgsDocLayer } from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap,
    MapboxIgsDocLayer
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
      igsDocIp: "localhost", // igs服务ip
      igsDocPort: "6163", // igs服务port
      igsDocName: "省级行政区3857" // igs地图服务名
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
