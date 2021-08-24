# 快速上手

![核心框架](../images/framework/webclient-vue-mapboxgl.png)

## 安装

### ES6 方式

mapgis webclient-vue-mapboxgl 的安装：

[comment]: <> (> 由于 mapbox 本身`不支持 EPSG：4326`， 公司内部修改版实现`支持 EPSG：4326`)

[comment]: <> (### 中地版本安装 `建议使用`)

[comment]: <> (@mapgis/webclient-vue-mapboxgl 支持一层封装，除了本身需要安装以外，会内置安装 @mapgis/mapbox-gl 的依赖)

[comment]: <> (# 支持 4326 的坐标系的使用方式)

```bash
npm install --save @mapgis/webclient-vue-mapboxgl
# 或者
yarn add @mapgis/webclient-vue-mapboxgl
```

> - mapbox 本身`不支持 EPSG：4326`，mapgis 的 webclient-vue-mapboxgl 通过修改实现`支持 EPSG：4326`。
> - 此外，webclient-vue-mapboxgl 支持一层封装，除了本身需要安装以外，会内置安装 @mapgis/mapbox-gl 的依赖。

在 main.js 中全局引入组件和样式文件

```js
import "@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css";
import "@mapgis/webclient-vue-mapboxgl/dist-libs/webclient-vue-mapboxgl.css";

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis2d from "@mapgis/webclient-vue-mapboxgl";

Vue.use(MapgisUi);
Vue.use(Mapgis2d);
```

## 入门示例

完成上述安装的步骤之后，我们来通过加载一个地图熟悉使用组件的基本流程。

```vue
<template>
  <mapgis-web-map :accessToken="accessToken">
    <mapgis-igs-tdt-layer
      :token="token"
      :baseURL="baseURL"
      :crs="crs"
      :layerId="layerId"
      :sourceId="sourceId"
    >
    </mapgis-igs-tdt-layer>
  </mapgis-web-map>
</template>

<script>
export default {
  name: "mapbox",
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoibHZ4aW5nZGV0dXppIiwiYSI6ImNrcmJkb3dwMDIycnkycXIyYW96ejQ5czcifQ.RftxemAeBo-0pa-FZqm5vw",
      token: "3af3270f5f558ed33dcf9aacfb7a01b5",
      baseURL: "http://t0.tianditu.gov.cn/img_w/wmts",
      crs: "EPSG:3857",
      layerId: "tdt",
      sourceId: "tdt"
    };
  }
};
</script>
```

- 首先引入一个地图图层的容器 map 组件 mapgis-web-map

- 在容器 map 内部再放入天地图图层组件 mapgis-igs-tdt-layer

显示如下：

![入门示例](./example.png)

[comment]: <> (## 浏览器使用)

[comment]: <> (### 安装)

[comment]: <> (添加 vue, mapbox-gl, 和 vue-mapbox 脚本到页面中)

[comment]: <> (> 由于公司的 cdn 包不在公网上发布，统一在[司马云]&#40;http://www.smaryun.com&#41;上获取，下面展示的是开源的脚本)

[comment]: <> (```html)

[comment]: <> (<!DOCTYPE html>)

[comment]: <> (<html>)

[comment]: <> ( <head>)

[comment]: <> ( <!-- ... -->)

[comment]: <> ( <!-- Mapbox GL CSS -->)

[comment]: <> ( <link)

[comment]: <> ( href="http://develop.smaryun.com/static/libs/cdn/mapboxgl/mapbox-gl.css")

[comment]: <> ( rel="stylesheet")

[comment]: <> ( />)

[comment]: <> ( <!-- Vue-mapbox CSS -->)

[comment]: <> ( <link)

[comment]: <> ( href="http://develop.smaryun.com/static/libs/cdn/zondyclient/vue/webclient-vue-mapboxgl.css")

[comment]: <> ( rel="stylesheet")

[comment]: <> ( />)

[comment]: <> ( <!-- Mapbox GL JS -->)

[comment]: <> ( <script src="http://develop.smaryun.com/static/libs/cdn/mapboxgl/mapbox-gl.js"></script>)

[comment]: <> ( <!-- VueJS -->)

[comment]: <> ( <script src="https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.min.js"></script>)

[comment]: <> ( <!-- Vue-mapbox -->)

[comment]: <> ( <script)

[comment]: <> ( type="text/javascript")

[comment]: <> ( src="http://develop.smaryun.com/static/libs/cdn/zondyclient/vue/webclient-vue-mapboxgl.umd.min.js")

[comment]: <> ( ></script>)

[comment]: <> ( <!-- ... -->)

[comment]: <> ( </head>)

[comment]: <> (</html>)

[comment]: <> (```)

[comment]: <> (::: tip 目的)

[comment]: <> (所有的组件都是在 既可以全局引入，也可以按需引入。 推荐全局使用。)

[comment]: <> (:::)
