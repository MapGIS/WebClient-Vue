# Webclient-Vue-Ui

[![npm version][npm-img]][npm-url]
[![apache licensed](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](https://github.com/MapGIS/WebClient-JavaScript/blob/master/LICENSE)
-------------
[![less version][less]][less]
[![less loader][less-loader]][less-loader]
[![sass version][sass]][sass]
[![sass loader][sass]][sass-loader]

[npm-img]: https://img.shields.io/badge/npm-10.5.5-brightgreen
[npm-url]: https://www.npmjs.com/package/@mapgis/webclient
[less]: https://img.shields.io/badge/less-^3.12.2-blue
[less-loader]: https://img.shields.io/badge/lessloader-^7.0.2-blue
[sass]: https://img.shields.io/badge/sass-^4.11.0-red
[sass-loader]: https://img.shields.io/badge/sassloader-^10.1.1-red

## 使用
```javascript
// main.js
import '@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css';
import mapgisui from "@mapgis/webclient-vue-ui";

Vue.use(mapgisui);
```

```vue
<template>
<mapgis-ui-layout>
  <mapgis-ui-layout-header>Header</mapgis-ui-layout-header>
  <mapgis-ui-layout-content>Content</mapgis-ui-layout-content>
  <mapgis-ui-layout-footer>Footer</mapgis-ui-layout-footer>
</mapgis-ui-layout>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  }
};
</script>
```
## 样式冲突
> 将你的工程下的样式依赖版本强行设置成下面依赖，再重新安装环境一般能够解决大部分的样式冲突问题
``` json
"less": "3.12.2",
"less-loader": "7.0.2",
"node-sass": "^4.11.0",
"sass-loader": "10.1.1",
```


## 目的
> 用于开发 Vue 版本的 MapGIS-UI 组件

## 组件增强说明

1、Select、Input 组件添加属性：`autoWidth`，设置为 true 时可实现宽度 100% 自适应。

2、Card 组件已添加属性：`customPosition`，可控制卡片显示的绝对位置：

```javascript
customPosition: {
  type: String,
  default: '',
  validator: v =>
    [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left'
    ].includes(v)
},
```
3、基于List组件增加无限加载列表组件：`mapgis-ui-infinite-list`，详情可查看StoryBook。
