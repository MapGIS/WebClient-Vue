# MapGIS UI
这里是 MapGIS UI 的 Vue 实现，开发和服务于企业级后台产品。

## 特性 
1. 提炼自企业级中后台产品的交互语言和视觉风格。
1. 开箱即用的高质量 Vue 组件。
1. 共享Ant Design of React设计工具体系。

## 支持环境
1. 现代浏览器
2. 支持服务端渲染。
3. Electron
4. Cordova

## ES6 方式
使用 npm 或 yarn 安装 #
我们推荐使用 npm 或 yarn 的方式进行开发，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

``` sh
npm install @mapgis/webclient-vue-ui --save
```

``` sh
yarn add @mapgis/webclient-vue-ui
```

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。


## 全局引入
```javascript
// main.js
import '@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css';

import mapgisui from "@mapgis/webclient-vue-ui";
```