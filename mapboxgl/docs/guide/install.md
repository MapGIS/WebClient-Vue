# 安装

### 方式一：npm 安装

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

### 方式二： yarn link 方式`特殊情况下：需要使用组件最新的功能时`

1. 通过在 github 路径中:https://github.com/MapGIS/WebClient-Vue 下载最新的 WebClient-Vue 项目。

2.项目安装完成后，分别有：cesium、mapboxgl、ui 工程，执行相对应文件中的 package.json 的 yarn/npm install 安装项目依赖。

3.cd 进入 mapboxgl 工程目录下，执行

```bash
yarn link
```

4.再 cd 进入自己的项目工程，执行

```bash
yarn link @mapgis/webclient-vue-mapboxgl
```

5.同理，cesium、ui 工程也执行 3、4 步骤来链接到自己项目中

6.在项目中 main.js 中全局引入组件和样式文件即可使用

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