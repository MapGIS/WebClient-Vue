# 基本地图

## 添加地图组件

> 强烈建议使用前了解基本的 cesium 引导[Cesium - 向导](https://cesium.com/docs/) 以及 cesium 的开发方式[cesium - API](https://cesium.com/docs/cesiumjs-ref-doc/)

如果你使用的地形是 cesium 提供的地形, 需要设置[Cesium ion](https://cesium.com/docs/oauth/). 更多细节请查看[Ion](https://cesium.com/ion).

如果你使用`MapGIS-IGServer`提供的地形数据，你可以忽略该参数

::: tip
上一章节文件`拷贝目录`中的 2 个路径，这里初始化的时候就需要传入`libPath`以及`pluginPath` 如果不传入则从司马云上自动下载对应的网络地址，没有互联网则无法下载

```sh
# quasar 的静态资源目录为src/static
# 常见的静态资源目录为 public
# 主Cesium主体路径 对应 libPath
path/to/statics/cesium/Cesium.js
# Cesium拓展插件路径 对应 pluginPath
path/to/statics/cesium/webclient-cesium-plugins.js
```

:::

```vue
<template>
  <mapgis-web-scene
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
    @load="handleLoad"
  />
</template>

<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>

<script>
import { MapgisWebScene } from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebScene
  },
  methods: {
    handleLoad(payload) {
      const { Cesium, CesiumZondy, component } = payload;
      this.Cesium = Cesium;
      this.CesiumZondy = CesiumZondy;
    }
  }
};
</script>
```
