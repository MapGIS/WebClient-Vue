# 快速上手

## 安装

### ES6 方式

```bash
安装webclient-vue-mapboxgl:
npm install --save @mapgis/webclient-vue-mapboxgl
# 或者
yarn add @mapgis/webclient-vue-mapboxgl

安装webclient-vue-ui:
npm install --save @mapgis/webclient-vue-ui
# 或者
yarn add @mapgis/webclient-vue-ui
```

> - webclient-vue-mapboxgl 依赖于 mapgis 版本的 mapbox-gl。
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

在实际项目中，当操作完以上步骤后，若出现下列报错:
![less未激活](../images/bug/activeLess.png)
是由于 less 依赖未激活导致的，需要在项目的 vue.config.js 文件中配置激活 less

```js
module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {},
          javascriptEnabled: true
        }
      }
    }
  }
};
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

- 首先引入一个地图图层的容器 map 组件 mapgis-web-map

- 在容器 map 内部再放入地图图层组件 mapgis-ogc-wmts-layer

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
      :token="token"
    >
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
  data() {
    return {
      mapStyle: {
        //设置版本号，一定要设置
        version: 8,
        //添加来源
        sources: {},
        //设置加载并显示来源的图层信息
        layers: []
      }, // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [116.39, 40.2], // 地图显示中心
      mapCrs: "EPSG:4326",

      layerTdtId: "igsLayer_layerId",
      sourceTdtId: "igsLayer_sourceId",
      tdturl: "http://t0.tianditu.gov.cn/vec_c/wmts",
      layer: "vec",
      tileMatrixSetTdt: "c",
      format: "tiles",
      token: {
        key: "tk",
        value: "f5347cab4b28410a6e8ba5143e3d5a35"
      },

      layerWmts: "10wanZH",
      layerWmtsId: "ogcwmts_layerId",
      sourceWmtsId: "ogcwmts_sourceId",
      wmtsurl:
        "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer/WMTS",
      tileMatrixSet: "default",
      offset: -1
    };
  }
};
</script>
```

显示如下：

![入门示例](./example.png)
