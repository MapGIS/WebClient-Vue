> mapgis-3d-shadow

## 属性

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

### `shadowColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgba(0,255,0,255)`
- **描述:** 阴影部分颜色

### `sunColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgba(255,0,0,255)`
- **描述:** 非阴影部分颜色

### `minHeight`
- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `0`
- **描述:** 底部高程，单位为米

### `stretchHeight`
- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `0`
- **描述:** 拉伸高度，单位为米

## 方法

### `removeAll` 

- **Description:** 移除阴影分析对象，移除阴影分析结果和日照分析结果。

## 事件

### `@load`

- **Description:** 在 Shadow组件 加载完毕后发送该事件
- **Payload** 阴影分析对象

### `@analysisBegin`

- **Description:** 在阴影分析绘制完后,开始分析前发送该事件

### `@success`

- **Description:** 在阴影分析结束后发送该事件


## 示例

```vue
<template>
  <div style="width: 1200px;height: 800px;">
    <mapgis-web-scene
      style="height:90vh"
      lib-path="statics/libs/cdn/cesium/Cesium.js"
      plugin-path="statics/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
    >
      <mapgis-3d-igs-m3d
        :autoReset="autoReset"
        :maximumScreenSpaceError="maximumScreenSpaceError"
        :url="m3dUrl"
        :vue-index="vueIndex"
      />
      <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-shadow 
          :vue-index="vueIndex" 
          :shadowColor="shadowColor" 
          :sunColor="sunColor"
          @load="load"></mapgis-3d-shadow>
      </mapgis-ui-card>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  name: "cesiumWmtsLayer",
  data() {
    return {
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      // m3dUrl:"http://develop.smaryun.com:6163/igs/rest/g3d/DaYanTa",
      autoReset: true,
      maximumScreenSpaceError: 6,
      vueIndex: 22,
      shadowColor:'#2E8B57',
      sunColor:'#FFA500',
      shadowAnalysis:undefined
    };
  },
  methods: {
    load(shadowAnalysis){
      this.shadowAnalysis = shadowAnalysis;
    }
  }
};
</script>

<style scoped>
.storybook-ui-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
```
