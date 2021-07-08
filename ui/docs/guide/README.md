# 快速上手

::: demo
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
:::

## ES6 方式

### 中地版本安装 `建议使用`

> 由于 cesium 本身`涉及大量的纹理材质以及多线程Worker`， 公司内部修改版实现`M3D格式`， M3D`不是`3dtile，是中地数码自己独特的格式，与开源的 3dtile 不是一种格式。很多高级分析功能`只能作用于M3D`,而不支持 3d tile.

webclient-vue-cesium 支持一层封装，除了本身需要安装以外，你还需要拷贝@mapgis/cesium

```bash
# 不同时安装@mapgis/cesium的原因在于这个对外的是非高级版本，事业部一般全内部使用高级版本开发
npm install --save @mapgis/webclient-vue-cesium
# 或者
yarn add @mapgis/webclient-vue-cesium
```

在 main.js 中加入样式文件

```js
// 外部全局引入了ant-design-vue库
import Mapgis3d from "@mapgis/webclient-vue-cesium";
Vue.use(Mapgis3d);

// 外部没有引入ant-design-vue库，使用内部封装的组件库
import Mapgis3d from "@mapgis/webclient-vue-cesium";
Vue.use(Mapgis3d， { ui: "ant-design-vue" });
```

::: danger
要实现 cesium 主体的引入，一定要看下面的`文件拷贝`章节, 光是@mapgis/webclient-vue-cesium 是无法正常开发的 Orz...
:::

### 文件拷贝

由于标准的 Cesium 在支持 Webpack 编译的时候也是采取的 copy 插件来执行对应的文件夹拷贝操作。 因此为了统一处理，这里`统一不采取`手动修改 webpack.config 的方式，而是将 cesium 的所有文件放在 public 或者 asset 的某个目录下，自己`手动实现`静态资料的拷贝

::: warning
这样做的本质原因是，MapGIS 的高级版本的 Cesium 是只对内不对外提供，导致不同事业部的 Cesium 版本各不一致
:::

以`@mapgis/cesium`的包结构展示如下：
![代码结构](./cesium_dist.png)

> 请将上述文件统一拷贝到你的 vue 工程对应的 public 文件夹下的某个目录中，记录对应的路径为

```sh
# quasar 的静态资源目录为src/static
# 常见的静态资源目录为 public
# 主Cesium主体路径
path/to/statics/cesium/Cesium.js
# Cesium拓展插件路径
path/to/statics/cesium/webclient-cesium-plugins.js
```

> 如果在浏览器中 访问 `http://localhost:xxxx/path/to/statics/cesium/Cesium.js` 成功则说明整个 Cesium 的环境准备已经完毕。

## 浏览器使用

### 安装

::: warning
~ 纯浏览器端建议还是使用 Cesium 原生的方式，而不是 Vue 组件的方式，真心建议
:::

## 高级版本

1. 由于公司的 cdn 包不在公网上发布，统一在[司马云](http://www.smaryun.com)上获取，`高级收费版本`请联系三维部门内部获取.
   - 针对 m3d 的`性能优化`
   - 针对 m3d 的`调度优化`
   - 针对一些公司平台`C++内核`代码高级空间分析功能
1. webclient-cesium-plugins.js 请联系潘卓然 或者从[司马云](http://develop.smaryun.com:8899/#/total/download)下载
   - 针对常见的`业务开发`进行业务封装
   - 针对`IGServer、DataStore`的服务进行封装
   - 针对一些`高级开源`技术进行封装
