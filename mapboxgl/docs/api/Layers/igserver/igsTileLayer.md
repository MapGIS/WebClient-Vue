# Igs 瓦片服务

> mapgis-igs-tile-layer

## 属性

All common [layers props](/api/Layers/README.md#props)

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
- **描述:** 加载瓦片的大小，如果数据瓦片本身是 256 大小的设置 512 大小会被强制拉伸至 512 大小。

| 512                     | 256                     |
| :---------------------- | :---------------------- |
| ![512](../tile/512.png) | ![256](../tile/256.png) |

::: tip 天地图模糊
请传入 tileSize 为 256 即可，2 种方式

```vue
<mapgis-igs-tile-layer :tileSize="256" />
```

```vue
<mapgis-igs-tile-layer :source="{ tileSize: 256 }" />
```

### `minimumLevel`

- **类型:** `Number`
- **默认值:** `0`
- **非侦听属性**
- **描述:** 最小缩放级别

### `maximumLevel`

- **类型:** `Number`
- **默认值:** `22`
- **非侦听属性**
- **描述:** 最大缩放级别

:::

```vue
<template>
  <div class="hello">
    <mapgis-web-map crs="EPSG:4326" :center="[107.19, 26.85]" :zoom="3">
      <mapgis-igs-tile-layer
        layerId="igs_layer_layerid"
        baseUrl="http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市"
        :tileSize="256"
      />
    </mapgis-web-map>
</template>
```

### `zoomOffset`

- **类型:** `Number`
- **默认值:** `0`
- **非侦听属性**
- **描述:** 级数偏差数。igs 经纬度瓦片 zoomOffset 取值为 1，igs 墨卡托瓦片 zoomOffset 取值为 0。以支持非标准裁剪的瓦片（这里的非标准不是指任意裁剪瓦片，而是当前瓦片的 0 级不是 mapbox 定义的瓦片的 0 级，中间相差 zoomOffset 级）

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
    :mapStyle="mapStyle"
    :zoom="mapZoom"
    :center="outerCenter"
    :crs="mapCrs"
  >
    <mapgis-igs-tile-layer :layer-id="layerId" :base-url="baseUrl">
    </mapgis-igs-tile-layer>
  </mapgis-web-map>
</template>

<script>
export default {
  name: "test",
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
      mapZoom: 3, // 地图初始化级数
      outerCenter: [116.39, 40.2], // 地图显示中心
      mapCrs: "EPSG:4326",

      layerId: "igsLayer_layerId",
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市"
    };
  },
  methods: {
    handleMapLoad(payload) {
      this.map = payload.map;
    }
  }
};
</script>

<style scoped></style>
```
