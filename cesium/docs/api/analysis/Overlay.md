> mapgis-3d-overlay-analysis

## 属性

### `srcType`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `Layer`
- **描述:** 叠加分析的类型，即图层-图层级叠加'Layer'和图层-要素级叠加'Feature'

### `baseUrl`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `http://localhost:6163`
- **描述:** 输入图层的baseUrl

### `srcALayer`

- **类型:** `String`
- **必选**
- **非侦听属性**
- **默认值:** ``
- **描述:** 输入被叠加图层的gdbp

### `srcBLayer`

- **类型:** `String`
- **必选**
- **非侦听属性**
- **默认值:** ``
- **描述:** 输入叠加图层的gdbp

### `srcAFeature`
- **类型:** `Object`
- **可选**
- **非侦听属性**
- **默认值:** `{}`
- **描述:** 输入叠加要素的GeoJSON数据

## 事件

### `@load`

- **Description:** 在 Overlay组件 加载完毕后发送该事件
- **Payload** 叠加分析对象

### `@listenLayer`

- **Description:** 在图层-图层级或图层-要素级叠加分析完成后发送该事件

### `@listenOverlayAdd`

- **Description:** 在叠加分析结束后发送该事件


## 示例

```vue
<template>
  <div style="width: 1200px;height: 800px;">
    <mapgis-web-scene
      style="height:90vh"
      lib-path="statics/libs/cdn/cesium/Cesium.js"
      plugin-path="statics/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
    >
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-overlay-analysis 
          :baseUrl='baseOverlayUrl'
          :srcType='srcType'
          :srcALayer='srcALayer'
          :srcBLayer='srcBLayer'
          :srcAFeature='srcAFeature'
          @listenLayer="showLayer" 
          @listenOverlayAdd="showAdd"
        />
      </mapgis-ui-card>
      <mapgis-3d-igs-dynamic-layer 
        v-if="finishedResult && addResultToLayer" 
        baseUrl="http://localhost:6163/igs/rest/mrms/layers" 
        :gdbps="resultLayer"
      ></mapgis-3d-igs-dynamic-layer>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseOverlayUrl: "http://localhost:6163",
      srcType: "Layer",
      srcALayer: "gdbp://MapGISLocalPlus/sample/sfcls/湖北省路网",
      srcBLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",
      srcAFeature: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "id": "id1",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [ [114,30], [114,31], [115,31], [115,30], [114,30] ]
              ]
            },
          },
          {
            "type": "Feature",
            "properties": {},
            "id": "id2",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [ [115,30] , [115,31] , [116,31] , [116,30] , [115,30] ]
              ]
            },
          },
        ]
      },
      finishedResult: false,
      resultLayer: "",
      addResultToLayer: false
    };
  },
  methods: {
    showLayer(data) {
      this.finishedResult = true
      this.resultLayer = data
    },
    showAdd(data) {
      this.addResultToLayer = data
    },
  },
};
</script>

<style scoped>
.storybook-ui-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
```
