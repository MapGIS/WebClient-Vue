# 绕点旋转

> mapgis-3d-rotate

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件， <br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-statebar 组件，用来区分组件的标识符。

## 事件

### `@loaded`

- **描述** 返回当前组件对象
- **Payload** 可通过抛出的对象调用组件中的方法

## 示例

```vue
<template>
  <mapgis-web-scene style="height:100vh">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-scene-layer :url="m3dUrl1" :autoReset="autoReset" />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-rotate @loaded="loaded"></mapgis-3d-rotate>
    </mapgis-ui-card>
    <mapgis-3d-statebar></mapgis-3d-statebar>
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752",
      },
      baseUrl:
        "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/docs/北京市",
      boundaryStyle: {
        color: "#1E90FF",
        opacity: 0.5,
        outlineColor: "rgba(0,191,255,0.5)",
      },
      autoReset: true,
      m3dUrl1: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
    };
  },
  methods: {
    loaded(e) {
      // 获取旋转组件对象
      this.rotate = e;
    },
  },
};
</script>
```
