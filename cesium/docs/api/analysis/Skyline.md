# 天际线分析

> mapgis-3d-skyline

## 属性

### `index`

- **类型:** `Number`
- **默认值:** `0`
- **非侦听属性**
- **描述:** 图层的索引值，表示第几个图层

### `position`

- **类型:** `String`
- **默认值:** `right`
- **非侦听属性**
- **描述:** 分析面板的位置（right:右边 | left: 左边）

## 示例

```vue
<template>
  <mapgis-web-scene
      style="height:90vh"
      lib-path="statics/libs/cdn/cesium/Cesium.js"
      plugin-path="statics/libs/cdn/zondyclient/webclient-cesium-plugin.min.js">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"></mapgis-3d-raster-layer>
    <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl" />
    <mapgis-3d-skyline></mapgis-3d-skyline>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "cesiumSkyline.vue",
  data(){
    return{
      m3dUrl:"http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset:true,
      maximumScreenSpaceError:6,
      vueIndex:22
    }
  }
}

</script>

<style scoped>

</style>
```