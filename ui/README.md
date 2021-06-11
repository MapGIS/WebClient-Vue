# Webclient-Vue-MapboxGL

## 组件式风格

通过 Vue 的组件方式调用 layers, markers, popups， 并且使用同步`synchronized props`来控制状态

## Vue 控制

`面向对象编程`：地图元素拥有 Vue 的生命周期，将原生地图事件封装成 Vue 的事件

## 同步的 Promise Actions

原先异步的地图操作变成`同步操作`，并且采取`Promise`的方式进行开发避免大量的地图事件回调导致代码逻辑混乱，能够清晰的知道是什么行为导致地图的变化。

> ~ 快速提示，刚接触一定要看完指南部分和自定义插件部分。 熟悉后可以直接查看 API。

```vue
<template>
  <mapox-map
    container="map-test"
    :center.sync="center"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
  >
    <mapbox-marker :coordinates.sync="markerCoordinates" color="green" />
    <mapbox-geojson-layer
      type="fill"
      :sourceId="sourceId"
      :layerId="layerId"
      :source="geojson"
      @click="handleClick"
    />
  </mapox-map>
</template>

<script>
import {
  MapboxMap,
  MapboxMarker,
  MapboxGeojsonLayer
} from '@mapgis/webclient-vue-mapboxgl'

export default {
  name: 'App',
  data() {
    return {
      accessToken: 'some_token',
      mapStyle: 'mapbox://map_style',
      geojson: { /* … some geojson */}
      layerId: 'firstLayer',
      sourceId: 'firstSource',
      markerCoordinates='[50, 50]'
    }
  }
}
</script>
```

## 依赖

[Vue.js 2.5+](https://github.com/vuejs/vue)  
[MapGIS/Mapbox GL JS 0.54+](https://github.com/mapbox/mapbox-gl-js)  
[MapGIS/WebClient-MapboxGL](https://github.com/mapbox/mapbox-gl-js)
