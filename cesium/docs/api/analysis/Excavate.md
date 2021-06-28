# Excavete

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

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
```
mapgis-web-scene组件的ID，当使用多个mapgis-web-scene组件时，需要指定该值，来唯一标识mapgis-web-scene组件，
同时mapgis-web-scene插槽中的组件也需要传入相同的vueKey，让组件知道应该作用于哪一个mapgis-web-scene。
```

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```


### `excaveteStyle`
- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 图层样式，有如下值：

```
    material String 控制裁剪面的材质颜色，默认值“rgb(0,0,255)”
    edgeColor String 控制裁剪时边界线颜色，默认值“rgb(0,0,255)”
    edgeWidth Number 控制边界线宽度，默认值 3
```

## 示例

```vue
<template>
  <mapgis-web-scene
      style="height:100vh"
      lib-path="./statics/libs/cdn/cesium/Cesium.js"
      plugin-path="./statics/libs/cdn/zondyclient/webclient-cesium-plugin.min.js">
    <!--    <mapgis-3d-igs-m3d  :url="m3dUrl"  :auto-reset="autoReset"></mapgis-3d-igs-m3d>-->
    <mapgis-3d-igs-m3d :url="m3dUrl2"  :vue-index="vueIndex" :auto-reset="autoReset" :maximum-screen-space-error="maximumScreenSpaceError" :debugShowBoundingVolume="debugShowBoundingVolume"></mapgis-3d-igs-m3d>
    <mapgis-3d-excavate :vue-index="vueIndex" :excaveteStyle="excaveteStyle"></mapgis-3d-excavate>
    <mapgis-3d-statebar> </mapgis-3d-statebar>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "cesiumExcavate.vue",
  data(){
    return{
      m3dUrl:"http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s",
      autoReset:true,
      // m3dUrl2:"http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      m3dUrl2:"http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent",
      maximumScreenSpaceError:1,
      vueIndex:22,
      debugShowBoundingVolume:true,
      excaveteStyle:{
        material:"#DB2B5A",
        edgeColor:"#DB2B5A",
        edgeWidth:5
      }

    }
  }
}

</script>

<style scoped>

</style>
```