# 快速上手

``` vue
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
        return { };
    },
    methods: {
        handleMapLoad(payload) {
        }
    }
}
</script>
```

## 安装

### ES6 方式

```bash
安装webclient-vue-cesium:
npm install --save @mapgis/webclient-vue-cesium
# 或者
yarn add @mapgis/webclient-vue-cesium

安装webclient-vue-ui:
npm install --save @mapgis/webclient-vue-ui
# 或者
yarn add @mapgis/webclient-vue-ui
```

在 main.js 中全局引入组件

```js
import '@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css';
import '@mapgis/webclient-vue-cesium/dist-libs/webclient-vue-cesium.css';

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis3d from "@mapgis/webclient-vue-cesium";

Vue.use(MapgisUi);
Vue.use(Mapgis3d);
```

### Ceisum 库引入

webclient-vue-cesium 只是一层封装，底层依赖 `@mapgis/cesium`。 除了本身需要安装以外，你还需要拷贝@mapgis/cesium

::: tip 为什么要使用@mapgis/cesium
由于 cesium 本身`涉及大量的纹理材质以及多线程Worker`， 公司内部修改版实现`M3D格式`， M3D`不是`3dtile，是中地数码自己独特的格式，与开源的 3dtile 不是一种格式。很多高级分析功能`只能作用于M3D`,而不支持 3d tile.
:::

安装`@mapgis/webclient-vue-cesium`的时候会自动安装依赖`@mapgis/cesium`，`@mapgis/cesium`的包结构展示如下：

![代码结构](./cesium_dist.png)

请将上述 cesium 文件夹统一拷贝到你的 vue 工程对应的 public 文件夹下的某个目录中，记录对应的路径为

```sh
# quasar 的静态资源目录为src/static
# 常见的静态资源目录为 public
# 主Cesium主体路径
$path/cesium/dist/Cesium.js # public/cesium/dist/Cesium.js
# Cesium拓展插件路径
$path/cesium/dist/webclient-cesium-plugins.js # public/cesium/dist/webclient-cesium-plugins.js
```

WebClient-Vue-Cesium 组件使用以上两个文件的方式如下所示:

```vue
<template>
  <mapgis-web-scene
    ref="webgloberef"
    libPath="$path/cesium/dist/Cesium.js"
    pluginPath="$path/cesium/dist/webclient-cesium-plugins.js"
  >
    <mapgis-3d-igs-tile-layer />
  </mapgis-web-scene>
</template>
```

> 如果在浏览器中 访问 `http://localhost:xxxx/$path/cesium/dist/Cesium.js` 成功则说明整个 Cesium 的环境准备已经完毕。

::: tip 为什么要拷贝@mapgis/cesium
由于原生的 Cesium 在支持 Webpack 编译的时候也是采取的 copy 插件来执行对应的文件夹拷贝操作。 因此为了统一处理，这里`统一不采取`手动修改 webpack.config 的方式，而是将 cesium 的所有文件放在 public 或者 asset 的某个目录下，自己`手动实现`静态资料的拷贝
:::

### yarn link 方式`特殊情况下：需要使用组件最新的功能时`

mapgis webclient-vue-cesium 的安装：

> 通过在 github 路径中：https://github.com/MapGIS/WebClient-Vue 下载最新的 WebClient-Vue 项目。

1.项目安装完成后，分别有：cesium、mapboxgl、ui 工程，执行相对应文件中的 package.json 的 yarn/npm install 安装项目依赖。

2.cd 进入 cesium 工程目录下，执行

```bash
yarn link
```

3.再 cd 进入自己的项目工程，执行

```bash
yarn link @mapgis/webclient-vue-cesium
```

4.同理，mapboxgl、ui 工程也执行 2、3 步骤来链接到自己项目中

5.在项目中 main.js 中全局引入组件和样式文件即可使用

```js
import '@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css';
import '@mapgis/webclient-vue-cesium/dist-libs/webclient-vue-cesium.css';

import MapgisUi from "@mapgis/webclient-vue-ui";
import Mapgis3d from "@mapgis/webclient-vue-cesium";

Vue.use(MapgisUi);
Vue.use(Mapgis3d);
```

6.不想使用 link @mapgis/webclient-vue-cesium 时可以执行

```bash
yarn unlink @mapgis/webclient-vue-cesium
```

解除链接。

::: warning
~ 纯浏览器端建议还是使用 Cesium 原生的方式，而不是 Vue 组件的方式，真心建议
:::
