# 快速上手

![核心框架](../images/framework/webclient-vue-mapboxgl.png)

## ES6 方式

### 中地版本安装 `建议使用`

> 由于 mapbox 本身`不支持 EPSG：4326`， 公司内部修改版实现`支持 EPSG：4326`

@mapgis/webclient-vue-mapboxgl 支持一层封装，除了本身需要安装以外，会内置安装 @mapgis/mapbox-gl 的依赖

```bash
# 支持 4326的坐标系的使用方式
npm install --save @mapgis/webclient-vue-mapboxgl
# 或者
yarn add @mapgis/webclient-vue-mapboxgl
```

在 main.js 中加入样式文件

```js
// 外部全局引入了ant-design-vue库
import Mapgis2d from "@mapgis/webclient-vue-mapboxgl";
Vue.use(Mapgis2d);

// 外部没有引入ant-design-vue库，使用内部封装的组件库
import Mapgis2d from "@mapgis/webclient-vue-mapboxgl";
Vue.use(Mapgis2d， { ui: "ant-design-vue" });
```

## 浏览器使用

### 安装

添加 vue, mapbox-gl, 和 vue-mapbox 脚本到页面中

> 由于公司的 cdn 包不在公网上发布，统一在[司马云](http://www.smaryun.com)上获取，下面展示的是开源的脚本

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
    <!-- Mapbox GL CSS -->
    <link
      href="http://develop.smaryun.com/static/libs/cdn/mapboxgl/mapbox-gl.css"
      rel="stylesheet"
    />
    <!-- Vue-mapbox CSS -->
    <link
      href="http://develop.smaryun.com/static/libs/cdn/zondyclient/vue/webclient-vue-mapboxgl.css"
      rel="stylesheet"
    />
    <!-- Mapbox GL JS -->
    <script src="http://develop.smaryun.com/static/libs/cdn/mapboxgl/mapbox-gl.js"></script>
    <!-- VueJS -->
    <script src="https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.min.js"></script>
    <!-- Vue-mapbox -->
    <script
      type="text/javascript"
      src="http://develop.smaryun.com/static/libs/cdn/zondyclient/vue/webclient-vue-mapboxgl.umd.min.js"
    ></script>
    <!-- ... -->
  </head>
</html>
```

::: tip 目的
所有的组件都是在 既可以全局引入，也可以按需引入。 推荐全局使用。
:::
