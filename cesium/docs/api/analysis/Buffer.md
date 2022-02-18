> mapgis-3d-analysis-buffer

## 属性

### `srcType`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `Layer`
- **描述:** 缓冲分析的类型，即图层级缓冲'Layer'和要素级缓冲'Feature'

### `baseUrl`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `http://localhost:6163`
- **描述:** 输入图层的baseUrl

### `srcLayer`

- **类型:** `String`
- **必选**
- **非侦听属性**
- **默认值:** ``
- **描述:** 输入图层的gdbp

### `srcFeature`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **默认值:** `{}`
- **描述:** 输入要素的GeoJSON数据

## 事件

### `@load`

- **Description:** 在 Buffer组件 加载完毕后发送该事件
- **Payload** 缓冲分析对象

### `@listenLayer`

- **Description:** 在图层级缓冲分析完成后发送该事件

### `@listenFeature`

- **Description:** 在要素级缓冲分析完成后发送该事件

### `@listenBufferAdd`

- **Description:** 在缓冲分析结束后发送该事件


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
        <mapgis-3d-analysis-buffer 
          :baseUrl='baseBufferUrl'
          :srcType='srcType'
          :srcLayer='srcLayer'
          :srcFeature='srcFeature'
          @listenLayer="showLayer" 
          @listenFeature="showFeature"
          @listenBufferAdd="showAdd"
        />
      </mapgis-ui-card>
      <mapgis-3d-igs-dynamic-layer 
        v-if="finishedLayer && addResultToLayer" 
        baseUrl="http://localhost:6163/igs/rest/mrms/layers" 
        :gdbps="resultLayer"
      ></mapgis-3d-igs-dynamic-layer>
      <mapgis-3d-geojson-layer 
        v-if="finishedFeature && addResultToLayer" 
        :layerStyle="layerStyle" 
        :baseUrl="resultFeature"
      ></mapgis-3d-geojson-layer >
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseBufferUrl: "http://localhost:6163",
      srcType: "Layer",
      srcLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",
      srcFeature: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "id": "id0",
            "geometry": {
              "type": "Point",
              "coordinates": [114, 45]
            },
          },
          {
            "type": "Feature",
            "properties": {},
            "id": "id0",
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [105, 30], [107, 31], [109, 30], [107, 29]
              ]
            },
          },
          {
            "type": "Feature",
            "properties": {},
            "id": "id1",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [114,30], [114,40], [124,40], [124,30], [114,30]
                ],
                [
                  [110,15] , [120,20] , [125,25] , [130,30] , [110,15]
                ]
              ]
            },
          }
        ]
      },
      finishedLayer: false,
      finishedFeature: false,
      addResultToLayer: false,
      resultLayer: "",
      resultFeature: undefined,
      layerStyle: new FillStyle({
        color: "#ff0000",
        outlineColor: "#ff0000",
        outlineWidth: 2.5,
        opacity: 1,
      })
    };
  },
  methods: {
    showLayer(data) {
      this.finishedLayer = true
      this.resultLayer = data
    },
    showFeature(data) {
      this.finishedFeature = true
      this.resultFeature = data
    },
    showAdd(data) {
      this.addResultToLayer = data
    }
  }
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
