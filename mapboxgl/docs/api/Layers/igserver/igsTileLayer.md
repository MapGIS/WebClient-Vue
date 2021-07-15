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
