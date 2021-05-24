# 插件组件

本框架实现了@mapgis/cesium.js 和 @mapgis/webclient-cesium-plugin.jse 的内核包装。
其他的三方插件功能，类似[Cesium plugins](https://cesium.com/blog/2014/01/16/introducing-cesium-plugins/)没有被封装。但是这些三方的插件也可以被封装成 Vue 组件的形式。

## 使用插件组件

使用插件组件相当简单。只需要和正常的组件一样放到`<mapgis-web-scene>`的内部并传递必要的属性就可以使用了。
以矢量瓦片为例[Vue-Cesium-VectorTile](http://develop.smaryun.com/#/demo/vue-cesium/vvectortile/vectortile).

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-vectortile-layer :styleUrl="mvtStyleUrl" />
  </mapgis-web-scene>
</template>

<script>
import {
  MapgisWebScene,
  Mapgis3dVectortileLayer
} from "@mapgis/webclient-vue-cesium";

export default {
  name: "App",

  components: {
    MapgisWebScene,
    Mapgis3dVectortileLayer
  },
  data() {
    return {
      mvtStyleUrl:
        "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/蓝色-墨卡托.json"
    };
  },
  methods: {}
};
</script>
```

如果中地&开源届封装的组件还是满足不了项目需求，那么下一章自己封装一个组件，相当简单[自定义封装组件](/plugin_components/plugin_components_development.md).

## 目前开源组件

暂无，待补充

## 目前中地内置组件

- [mapv](https://github.com/soal/vue-mapbox-geocoder)
- [echarts](https://github.com/soal/vue-mapbox-geocoder)
