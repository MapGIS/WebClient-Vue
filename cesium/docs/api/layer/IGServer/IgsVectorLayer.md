# IGS二维矢量

> mapgis-3d-igs-vector-layer

## 属性

### `baseUrl`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **描述:** 服务基地址
  > 例如：http://{ip}:{port}/igs/rest/mrms/layers

### `gdbps`

- **类型:** `Array | String`
- **必传**
- **侦听属性**
- **描述:** gdbp 地址，允许多个图层
  > 例如：gdbps: ["layer1","layer2","layer3"]

### `layerStyle`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 控制地图的显隐、透明度以及顺序，有如下值：
  > visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层 <br/>
  > opacity Number 控制图层透明度，会重新加载图层，0 - 1 之间的数字，0：隐藏，1：显示 <br/>
  > zIndex Number 控制图层顺序，会重新加载图层，类似 css 里面的 z-index，从 1 开始的数字 <br/>

### `options`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** Cesium 的进阶参数
- **参考:** <br>
  `Arcgis参数` in [ArcGisMapServerImageryProvider](//http://develop.smaryun.com:8899/docs/other/mapgis-cesium/ArcGisMapServerImageryProvider.html?classFilter=ArcGisMapServerImageryProvider)

### `id`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 图层唯一标识符，如果不传，以 vueIndex 代替

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
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

## 示例

::: demo

```vue
<template>
  <mapgis-web-scene
    @load="handleLoad"
  >
    <mapgis-3d-igs-vector-layer
      :gdbps="gdbps"
      :baseUrl="baseUrl"
    >
    </mapgis-3d-igs-vector-layer>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      gdbps: [
        "GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/北京市",
      ],
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/layers"
    };
  },
  methods: {
    handleLoad(e) {
      const webGlobe = e.component.webGlobe;
      var sceneManager = new CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      //视点跳转（经度，纬度，视角高度，跳转持续时间）
      sceneManager.flyTo(116.348, 40.236, 300000);
    }
  }
};
</script>
```

:::