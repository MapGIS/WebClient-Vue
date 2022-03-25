# 快速上手

本节将介绍如何在项目中使用，使用前请先确认是否 npm 安装，没有安装请先参考安装章节。

## 使用之前

高效的开发，离不开基础工程的搭建。在开始使用 webclient-vue-cesium 之前，有必要先了解以下基础知识，我们默认开发者已经写过 Vue，并掌握了下面的内容。

- [Vue 组件](https://cn.vuejs.org/v2/guide/components.html)
- [单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)

以下概念贯穿 webclient-vue-cesium 前后，建议开发者花点时间来了解。

- prop 传递数据
- slot 内容分发
- events $emit @click 事件

## 引入 webclient-vue-cesium

在 main.js 中全局引入组件，注意：下列四个文件缺一不可。

```js
import "@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css";
import "@mapgis/webclient-vue-cesium/dist-libs/webclient-vue-cesium.css";

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis3d from "@mapgis/webclient-vue-cesium";

Vue.use(MapgisUi);
Vue.use(Mapgis3d);
```

### 示例：

通过在 main.js 全局引入组件和样式文件的方式，可以快速使用 webclient-vue-cesium 写出一个 vue 示例：

```vue
<template>
  <div id="app">
    <mapgis-web-scene @load="handleLoad">
      <div>地图显示内容</div>
    </mapgis-web-scene>
  </div>
</template>
<style>
#app {
  height: 80px;
  width: 100%;
}
</style>
<script type="module">
export default {
  data() {
    return {};
  },
  methods: {
    handleMapLoad(payload) {},
  },
};
</script>
```
