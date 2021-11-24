> mapgis-3d-heightlimited

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
- **默认值:** `(Math.random() * 100000000).toFixed(0)`随机计算值
- **描述:**

```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```

### `color`

- **类型:** `String`
- **默认值:** `#ff0000`
- **侦听属性**
- **描述:** 控高分析颜色，与 css 的 color 属性一致，使用 16 进制颜色或者 rba/rgba(包含透明度)

### `models`

- **类型:** `Array`
- **默认值:** `[]`
- **侦听属性**
- **描述:** 控高分析颜色，与 css 的 color 属性一致，使用 16 进制颜色或者 rba/rgba(包含透明度)

## 示例

```vue
<template>
  <div style="width: 1200px;height: 800px;">
    <mapgis-web-scene style="height:90vh">
      <mapgis-3d-raster-layer
        url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
      ></mapgis-3d-raster-layer>
      <mapgis-3d-m3d-layer :vueIndex="models[0].vueIndex" :url="m3dUrl1" />
      <mapgis-3d-m3d-layer :vueIndex="models[1].vueIndex" :url="m3dUrl2" />
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-heightlimited :models="models"></mapgis-3d-heightlimited>
      </mapgis-ui-card>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  name: "cesiumHeightLimited",
  data() {
    return {
      m3dUrl1: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      m3dUrl2: "http://192.168.21.191:6163/igs/rest/g3d/school",
      autoReset: true,
      models: [
        {
          vueIndex: 1,
          title: "中地大楼模型"
        },
        {
          vueIndex: 2,
          title: "学校模型"
        }
      ],
      color: "rgba(123,104,238,0.5)"
    };
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
