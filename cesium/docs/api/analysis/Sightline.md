> mapgis-3d-sightline

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

[comment]: <> (### `index`)

[comment]: <> (- **类型:** `Number`)

[comment]: <> (- **默认值:** `0`)

[comment]: <> (- **非侦听属性**)

[comment]: <> (- **描述:** 图层的索引值，表示第几个图层)
### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**

```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```

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
- **默认值:** `#008000`
- **描述:** 可视区域颜色，可以传16进制或者rgba任意形式颜色


## 事件

### `@load`

- **Description:** 在 Sightline组件 加载完毕后发送该事件
- **Payload** 通视分析对象

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
      <mapgis-3d-sightline
          :exHeight="exHeight"
          :visibleColor="visibleColor"
          :unVisibleColor="unVisibleColor"
      ></mapgis-3d-sightline>
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
      exHeight: 2.0,
      visibleColor: '#2E8B57',
      unVisibleColor: '#FFA500'
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
