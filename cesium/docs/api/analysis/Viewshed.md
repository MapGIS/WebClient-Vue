> mapgis-3d-viewshed

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

### `horizontAngle`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `60`
- **描述:** 观察点的水平视角

### `verticalAngle`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `60`
- **描述:** 观察点的垂直视角

### `exHeight`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `1.85`
- **描述:** 观察点的附加高度，单位为米

### `unVisibleColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `#ff0000`
- **描述:** 不可视区域颜色，可以传16进制或者rgba任意形式颜色

### `visibleColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `#00ff00`
- **描述:** 可视区域颜色，可以传16进制或者rgba任意形式颜色

### `maskColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgba(37, 218, 169, 0.2)`
- **描述:** 可视遮罩颜色，可以传16进制或者rgba任意形式颜色

## 事件

### `@load`

- **Description:** 在 Viewshed组件 加载完毕后发送该事件
- **Payload** 可视域分析对象

## 示例

```vue

<template>
  <mapgis-web-scene
      libPath="cesium/Cesium.js"
      pluginPath="cesium/webclient-cesium-plugin.min.js"
  >
    <mapgis-3d-raster-layer :url="url"/>
    <mapgis-3d-igs-m3d
        :autoReset="autoReset"
        :maximumScreenSpaceError="maximumScreenSpaceError"
        :url="m3dUrl"
    />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-viewshed
          :horizontAngle="horizontAngle"
          :maskColor="maskColor"
          :visibleColor="visibleColor">
      </mapgis-3d-viewshed>
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url:
          "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,
      horizontAngle: 70,
      maskColor: 'rgba(37, 218, 169, 0.2)',
      visibleColor: '#00ff00',
      unVisibleColor: '#ff0000'
    };
  },
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