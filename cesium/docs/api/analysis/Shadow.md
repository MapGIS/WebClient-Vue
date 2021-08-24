# mapgis-3d-shadow

## 属性

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
      <mapgis-3d-shadow :vue-index="vueIndex"></mapgis-3d-shadow>
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
      vueIndex: 22
    };
  },
  methods: {}
};
</script>

<style scoped></style>
```
