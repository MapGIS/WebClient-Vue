> mapgis-3d-locate

## 属性

### `mapSheetBoundaryStyle`

- **类型:** `Object`
- **侦听属性**
- **默认值:** `{ color: "#FFA500", opacity: 0.5 }`
- **描述:** 图幅号定位时的图幅边界样式设置

## 事件

### `@located`

- **描述** 在图幅号定位结束后返回该函数
- **Payload** `Rectangle` 图幅号定位后的图幅边界坐标

## 示例

```vue
<template>
  <div id="app">
    <mapgis-web-scene style="height:100vh">
      <mapgis-3d-ogc-wmts-layer
        :baseUrl="url"
        :wmtsLayer="layer"
        :tileMatrixSet="tileMatrixSet"
        :format="format"
        :tilingScheme="tilingScheme"
        :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-igs-doc-layer :baseUrl="baseUrl"></mapgis-3d-igs-doc-layer>
      <mapgis-ui-card class="ui-card">
        <mapgis-3d-locate></mapgis-3d-locate>
      </mapgis-ui-card>
      <mapgis-3d-statebar></mapgis-3d-statebar>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  name: "cesiumLocate",
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      },
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市"
    };
  }
};
</script>
<style scoped>
.ui-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  width: 320px;
}
::v-deep .mapgis-ui-card-body {
  padding: 6px;
}
</style>
```
