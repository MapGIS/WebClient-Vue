---
home: true
heroImage: /logo.svg
actionText: 快速上手 →
actionLink: /guide/
features:
  - title: 组件式风格
    details: 通过Vue的组件方式调用Layer, Provider, Source, M3D

  - title: Vue控制
    details: 面向对象编程：地图元素拥有Vue的生命周期，将部分地图事件封装成Vue的事件

footer: MIT Licensed
---

::: warning
~ 快速提示，刚接触一定要看完指南部分和自定义插件部分。 熟悉后可以直接查看 API。
:::

```javascript
// main.js
import "@mapgis/webclient-vue-cesium/dist-libs/webclient-vue-cesium.css";
import Mapgis3d from "@mapgis/webclient-vue-cesium";
Vue.use(Mapgis3d);
```

```vue
<template>
  <mapgis-web-scene
    ref="webgloberef"
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
    @load="handleLoad"
  >
    <mapgis-3d-igs-tile-layer
      :id="id"
      :baseUrl="baseUrl"
      :layerStyle="layerStyle"
      :tilingScheme="tilingScheme"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      webgloberef: "webgloberef" + Math.random(),
      id: "IGServer-Tle-Layer",
      baseUrl: `http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市`,
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2,
      },
      tilingScheme: "EPSG:4326",
    };
  },
  methods: {
    handleLoad(e) {
      console.log("地图加初始化完毕！", e);
    },
  },
};
</script>
```

::: tip 依赖
[Vue.js 2.5+](https://github.com/vuejs/vue)  
[MapGIS/Cesium 1.0+](https://www.npmjs.com/package/@mapgis/cesium)  
:::

::: tip 目的

> 用于开发 Vue 版本的 Cesium 组件
