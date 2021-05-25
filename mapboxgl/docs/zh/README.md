---
home: true
heroImage: /logo.svg
actionText: 快速上手 →
actionLink: /zh/guide/
features:
  - title: 组件式风格
    details: 通过Vue的组件方式调用layers, markers, popups， 并且使用同步props synchronized props来控制状态

  - title: Vue控制
    details: 面向对象编程：地图元素拥有Vue的生命周期，将原生地图事件封装成Vue的事件

  - title: 同步的Promise Actions
    details: 原先异步的地图操作变成同步操作，并且采取Promise的方式进行开发避免大量的地图事件回调导致代码逻辑混乱，能够清晰的知道是什么行为导致地图的变化。
footer: MIT Licensed
---

![核心框架](./images/framework/webclient-vue-mapboxgl.png)

::: warning
~ 快速提示，刚接触一定要看完指南部分和自定义插件部分。 熟悉后可以直接查看 API。
:::

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

::: tip 依赖
[Vue.js 2.5+](https://github.com/vuejs/vue)  
[MapGIS/Mapbox GL JS 0.54+](https://github.com/mapbox/mapbox-gl-js)  
[MapGIS/WebClient-MapboxGL](https://github.com/mapbox/mapbox-gl-js)  
:::

::: tip 简洁，易于传输
~ 压缩后 15 kB 左右
:::

::: tip 目的

> 用于开发 Vue 版本的一张图 `Vue-OneMap`

> 用于开发 Vue 版本的工作空间 `Vue-WorkSpace`
> :::
