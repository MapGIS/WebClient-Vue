# 安装

### 方式一：npm 安装

```bash
# npm或yarn安装 webclient-vue-cesium webclient-vue-ui
npm install --save @mapgis/webclient-vue-cesium @mapgis/webclient-vue-ui
# 或者
yarn add @mapgis/webclient-vue-cesium @mapgis/webclient-vue-ui
```

::: tip 为什么要安装 webclient-vue-ui
由于 webclient-vue-cesium 使用了大量内置的 webclient-vue-ui，因此需要同步安装 webclient-vue-ui
:::

### 方式二：yarn link`特殊情况下：需要使用组件最新的功能时`

1.通过在 github 路径中：https://github.com/MapGIS/WebClient-Vue 下载最新的 WebClient-Vue 项目。

2.项目下载完成后，分别有：cesium、mapboxgl、ui 工程，执行对应文件中的 package.json 的 yarn/npm install 安装项目依赖。

3.cd 进入 cesium 工程目录下，执行

```bash
yarn link
```

4.再 cd 进入自己的项目工程，执行

```bash
yarn link @mapgis/webclient-vue-cesium
```

5.同理，mapboxgl、ui 工程也执行 3、4 步骤来链接到自己项目中

6.在项目中 main.js 中全局引入组件和样式文件即可使用

```js
import "@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css";
import "@mapgis/webclient-vue-cesium/dist-libs/webclient-vue-cesium.css";

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis3d from "@mapgis/webclient-vue-cesium";

Vue.use(MapgisUi);
Vue.use(Mapgis3d);
```

7.不想使用 link @mapgis/webclient-vue-cesium 时可以执行

```bash
yarn unlink @mapgis/webclient-vue-cesium
```

解除链接。
