# ArcGIS地图

> mapgis-arcgis-map-layer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **默认值:** `null`
- **侦听属性**
- **描述:** 地图请求的基地址路径。

### `bboxsr`

- **类型:** `Number`
- **默认值:** `地图坐标系`
- **非侦听属性**
- **描述:** 若没传递该参数，则默认为地图坐标系。

### `imagesr`

- **类型:** `Number`
- **默认值:** `地图坐标系`
- **非侦听属性**
- **描述:** 若没传递该参数，则默认为地图坐标系。

### `layers`

- **类型:** `String`
- **默认值:** `null`
- **侦听属性**
- **描述:** 指定需要被取图的图层序列号数组，以“，”分隔。默认为依据文档原始图层状态进行设置。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。
  1、show：仅仅显示指定了图层序号的图层；
  2、hide ：显示除 hide 参数指定图层外所有的图层；
  3、include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层；
  4、exclude: 从默认图层列表里删除这些被指定的图层后，进行显示。
- **示例:** `"show:1,2,3"`
- **注意:** `若不传入开头的[show|hide|include|exclude],则默认是显示所有图层，eg:"1,2,3"，显示的是所有图层,并非图层1、2、3`

### `width`

- **类型:** `Number`
- **默认值:** `256`
- **非侦听属性**
- **描述:** 导出图像的大小（宽度），以像素为单位，若没传递该参数，则默认为 256。

### `height`

- **类型:** `Number`
- **默认值:** `256`
- **非侦听属性**
- **描述:** 导出图像的大小（高度），以像素为单位，若没传递该参数，则默认为 256。

### `format`

- **类型:** `String`
- **默认值:** `png`
- **非侦听属性**
- **描述:** 返回图片格式。默认 png。
  可选值：png | png8 | png24 | jpg | pdf | bmp | gif | svg | svgz | emf | ps | png32

### `f`

- **类型:** `String`
- **默认值:** `image`
- **非侦听属性**
- **描述:** 返回信息的格式，html | json | image | kmz，默认为 image

### `dpi`

- **类型:** `Number`
- **默认值:** `96`
- **非侦听属性**
- **描述:** 屏幕分辨率。默认 96

### `transparent`

- **类型:** `Boolean`
- **默认值:** `false`
- **非侦听属性**
- **描述:** 背景是否透明；默认 false，只有当 format 为 png||gif
  生效。
  可选值：true | false。

## 示例

```vue
<template>
  <mapgis-web-map
    class="main"
    crs="EPSG:3857"
    :center="[114.299039, 30.594797]"
    :zoom="8"
  >
    <mapgis-arcgis-maplayer
      :layers="layers"
      :baseUrl="baseUrl"
      :layerId="layerId"
    />
  </mapgis-web-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import {
  MapgisWebMap,
  MapgisArcgisMapLayer
} from "@mapgis/webclient-vue-mapboxgl";
export default {
  components: {
    MapgisWebMap,
    MapgisArcgisMapLayer
  },
  data() {
    return {
      layers: "show:0,2,4,7,9,10,11,12",
      baseUrl:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
      layerId: "arcgismap_layerid"
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
