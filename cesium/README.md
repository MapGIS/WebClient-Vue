---
home: true
heroImage: /logo.svg
actionText: 快速上手 →
actionLink: /guide/
features:
  - title: 组件式风格
    details: 通过Vue的组件方式调用layers, markers, popups， 并且使用同步props synchronized props来控制状态
  
  - title: Vue控制
    details: 面向对象编程：地图元素拥有Vue的生命周期，将原生地图事件封装成Vue的事件

footer: MIT Licensed
---

::: warning 
~ 快速提示，刚接触一定要看完指南部分和自定义插件部分。 熟悉后可以直接查看API。
:::

```vue
<template>
  <cesium-web-globe
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugins.js"
    class="onemap-cesium-map"
  >
    <cesium-igs-tile-layer
      :url="layer.url"
    />
    <cesium-igs-doc-layer
      :show="l.show"
      :url="layer.url"
    />
  </cesium-web-globe>
</temaplate>

<script>
import {
  CesiumWebGlobe,
  CesiumIgsDocLayer,
  CesiumIgsTileLayer,
} from '@mapgis/webclient-vue-cesium';

export default {
  name: 'App',
  data() {
    return {
      layer: {
        url: "http://localhost:6163/igs/rest/mrms/docs/EPSG_4326_WORLD",
        show: true,
      }
    }
  },
  components: {
    CesiumWebGlobe,
    CesiumIgsDocLayer,
    CesiumIgsTileLayer,
  },
}
</script>
```

::: tip 依赖
[Vue.js 2.5+](https://github.com/vuejs/vue)  
[MapGIS/Cesium 1.0+](https://www.npmjs.com/package/@mapgis/cesium)  
:::

::: tip 目的
> 用于开发Vue版本的一张图 `Vue-OneMap`

> 用于开发Vue版本的工作空间 `Vue-WorkSpace`
:::
