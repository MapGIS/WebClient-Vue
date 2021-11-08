# 解决引入本组件前后页面某些文字的font-size被强制设置为固定值14px导致的样式问题（webclient-vue-mapboxgl同样适用）

本组件所引用的Antd中的antd.css文件将**font-size**全局设置为了**14px**。

因此在某些未使用Antd的项目中，引用本组件后有可能会出现字体大小变化的问题。

## 解决方案：在项目的App.vue文件中全局设置font-size


在项目的App.vue文件的style中添加以下内容，将**font-size**强制设置为**unset**或**inherit**：
``` css
body {
  font-size: unset !important;
}
```
