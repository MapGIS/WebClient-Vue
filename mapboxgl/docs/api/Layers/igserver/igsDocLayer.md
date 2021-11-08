# Igs 地图文档

> mapgis-igs-doc-layer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 服务基地址
- **示例:** `http://{ip}:{port}/igs/rest/mrms/docs`

### `layers`

- **类型:** `String`
- **默认值:** `null`
- **侦听属性**
- **描述:** 指定需要被取图的图层序列号数组，以“，”分隔。默认为依据文档原始图层状态进行设置。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
  1、show：仅仅显示指定了图层序号的图层；
  2、hide ：显示除 hide 参数指定图层外所有的图层；
  3、include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层；
  4、exclude: 从默认图层列表里删除这些被指定的图层后，进行显示。
- **示例:** `show:1,2`

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** A raster tile source.
- **参考:** `Raster source` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-raster)

### `tileSize`

- **类型:** `Number`
- **默认值:** `512`
- **非侦听属性**
- **描述:** 输出瓦片大小。

### `filters`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 用户指定的图层过滤条件，它由多个键值对组成，值为过滤条件。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
- **示例:** `1:ID>4,3:ID>1`

### `igsMapStyle`

- **类型:** `Object`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 显示参数，指整个地图文档的显示参数。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
- **示例:** `{SymbleShow:true,ShowElemRect:true}`

### `f`

- **类型:** `String`
- **默认值:** `png`
- **非侦听属性**
- **描述:** 图片的格式。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。jpg|png|gif

### `proj`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 投影参数设置，仅在非动态裁图时有意义，针对整个地图文档进行操作。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
- **示例:** `WGS1984_度`

### `guid`

- **类型:** `String`
- **默认值:** `newGuid()`in [Util](/api/Util/util)
- **非侦听属性**
- **描述:** 唯一 ID，用户标识地图文档。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。

### `cache`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **watched**
- **描述:** 是否使用动态裁图功能。

### `isAntialiasing`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **描述:** 是否高质量显示。

### `update`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **描述:** 是否更新当前瓦片，仅当 cache 为 true 时有效。

### `mode`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** 模式，如果是快显取图（hiRender,fast_display），文档为只读，只有 bbox,w,h 有效。

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
    id="map"
    v-bind:map-style="mapStyle"
    v-bind:zoom="mapZoom"
    v-bind:center="outerCenter"
    v-bind:crs="mapCrs"
    v-on:load="handleMapLoad"
  >
    <mapgis-igs-doc-layer
      v-bind:layers="layers"
      v-bind:layer-id="layerRasterId"
      v-bind:source-id="sourceRasterId"
      v-bind:baseUrl="baseUrl"
    >
    </mapgis-igs-doc-layer>
  </mapgis-web-map>
</template>

<script>
export default {
  data() {
    return {
      mapStyle: {
        //设置版本号，一定要设置
        version: 8,
        //添加来源
        sources: {},
        //设置加载并显示来源的图层信息
        layers: []
      }, // 地图样式
      mapZoom: 8, // 地图初始化级数
      outerCenter: [116.39, 40.2], // 地图显示中心
      mapCrs: "EPSG:4326",
      layers: "show:1,2",
      layerRasterId: "raster_layerId",
      sourceRasterId: "raster_sourceId",
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市"
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
