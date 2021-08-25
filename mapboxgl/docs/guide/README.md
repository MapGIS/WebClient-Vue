# 快速上手

![核心框架](../images/framework/webclient-vue-mapboxgl.png)

## 安装

### ES6 方式

[comment]: <> (> 由于 mapbox 本身`不支持 EPSG：4326`， 公司内部修改版实现`支持 EPSG：4326`)

[comment]: <> (### 中地版本安装 `建议使用`)

[comment]: <> (@mapgis/webclient-vue-mapboxgl 支持一层封装，除了本身需要安装以外，会内置安装 @mapgis/mapbox-gl 的依赖)

[comment]: <> (# 支持 4326 的坐标系的使用方式)

```bash
npm install --save @mapgis/webclient-vue-mapboxgl
# 或者
yarn add @mapgis/webclient-vue-mapboxgl
```

> - webclient-vue-mapboxgl依赖于mapgis版本的mapbox-gl。
> - mapbox 本身`不支持 EPSG：4326`，mapgis 的 mapbox-gl 通过修改实现`支持 EPSG：4326`。


在 main.js 中全局引入组件和样式文件

```js
import "@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css";
import "@mapgis/webclient-vue-mapboxgl/dist-libs/webclient-vue-mapboxgl.css";

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis2d from "@mapgis/webclient-vue-mapboxgl";

Vue.use(MapgisUi);
Vue.use(Mapgis2d);
```

### yarn link 方式`特殊情况下：需要使用组件最新的功能时`

mapgis webclient-vue-mapboxgl 的安装：

> 通过在 github 路径中:https://github.com/MapGIS/WebClient-Vue 下载最新的 WebClient-Vue 项目。

1.项目安装完成后，分别有：cesium、mapboxgl、ui 工程，执行相对应文件中的 package.json 的 yarn/npm install 安装项目依赖。

2.cd 进入 mapboxgl 工程目录下，执行

```bash
yarn link
```

3.再 cd 进入自己的项目工程，执行

```bash
yarn link @mapgis/webclient-vue-mapboxgl
```

4.同理，cesium、ui 工程也执行 2、3 步骤来链接到自己项目中

5.在项目中 main.js 中全局引入组件和样式文件即可使用

```js
import "@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css";
import "@mapgis/webclient-vue-mapboxgl/dist-libs/webclient-vue-mapboxgl.css";

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis2d from "@mapgis/webclient-vue-mapboxgl";

Vue.use(MapgisUi);
Vue.use(Mapgis2d);
```

6.不想使用 link @mapgis/webclient-vue-mapboxgl 时可以执行

```bash
yarn unlink @mapgis/webclient-vue-mapboxgl
```

解除链接。

## 入门示例

完成上述安装的步骤之后，我们来通过加载一个地图熟悉使用组件的基本流程。

```vue
<template>
  <mapgis-web-map
      :map-style="mapStyle"
      :zoom="mapZoom"
      :center="outerCenter"
      :crs="mapCrs"
  >
    <mapgis-ogc-wmts-layer
        :layer-id="layerTdtId"
        :source-id="sourceTdtId"
        :base-url="tdturl"
        :tile-matrix-set="tileMatrixSetTdt"
        :wmts-layer="layer"
        :format="format"
        :token="token">
    </mapgis-ogc-wmts-layer>
    <mapgis-ogc-wmts-layer
        :wmts-layer="layerWmts"
        :layer-id="layerWmtsId"
        :source-id="sourceWmtsId"
        :base-url="wmtsurl"
        :zoom-offset="offset"
        :tile-matrix-set="tileMatrixSet"
    >
    </mapgis-ogc-wmts-layer>
  </mapgis-web-map>
</template>

<script>
export default {
  name: "mapbox",
  data(){
    return {
      mapStyle: {
        //设置版本号，一定要设置
        version: 8,
        //添加来源
        sources: {},
        //设置加载并显示来源的图层信息
        layers: [],
      }, // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [116.39, 40.20], // 地图显示中心
      mapCrs: 'EPSG:4326',

      layerTdtId: 'igsLayer_layerId',
      sourceTdtId: 'igsLayer_sourceId',
      tdturl: 'http://t0.tianditu.gov.cn/vec_c/wmts',
      layer:"vec",
      tileMatrixSetTdt:"c",
      format:"tiles",
      token: {
        key: 'tk',
        value: 'f5347cab4b28410a6e8ba5143e3d5a35'
      },

      layerWmts: '10wanZH',
      layerWmtsId: 'ogcwmts_layerId',
      sourceWmtsId: 'ogcwmts_sourceId',
      wmtsurl: 'http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer/WMTS',
      tileMatrixSet:"default",
      offset: -1,
    }
  }
}
</script>
```

- 首先引入一个地图图层的容器 map 组件 mapgis-web-map

- 在容器 map 内部再放入地图图层组件 mapgis-ogc-wmts-layer

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
