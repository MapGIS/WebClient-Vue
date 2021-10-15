# 控高分析

> mapgis-3d-heightlimited

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
- **必传**
- **非侦听属性**
- **描述:**

```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```

### `color`

- **类型:** `String`
- **默认值:** `#ff0000`
- **非侦听属性**
- **描述:** 控高分析颜色，与 css 的 color 属性一致，使用 16 进制颜色

### `opacity`

- **类型:** `Number`
- **默认值:** `0.5`
- **非侦听属性**
- **描述:** 控高分析墙体透明度，与 css 的 opacity 属性一致

### `maxSliderHeight`

- **类型:** `Number`
- **默认值:** `50`
- **非侦听属性**
- **描述:** 控高分析面板滑动条控制高度的最大值

## 示例

```vue
<template>
  <div style="width: 1200px;height: 800px;">
    <mapgis-web-scene style="height:90vh">
      <mapgis-3d-igs-m3d
        :autoReset="autoReset"
        :maximumScreenSpaceError="maximumScreenSpaceError"
        :url="m3dUrl"
        :vue-index="vueIndex"
        :debugShowBoundingVolume="debugShowBoundingVolume"
      />
      <mapgis-3d-heightlimited :vue-index="vueIndex"></mapgis-3d-heightlimited>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  name: "cesiumHeightLimited",
  data() {
    return {
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      // m3dUrl: "http://localhost:6163/igs/rest/g3d/BIM模型",
      autoReset: true,
      maximumScreenSpaceError: 6,
      debugShowBoundingVolume: true,
      vueIndex: 22,
      baseUrl:
        "http://t6.tianditu.gov.cn/vec_c/wmts?tk=9c157e9585486c02edf817d2ecbc7752",
      wmtsLayer: "vec",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      format: "tiles",
      layerStyle: {
        zIndex: 1
      }
    };
  }
};
</script>

<style scoped>
.ant-btn-primary {
  margin-left: 10px;
}
</style>
```
