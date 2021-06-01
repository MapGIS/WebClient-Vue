# IgsVectorLayer

## Props

### `baseUrl`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **描述:** 服务基地址

```
http://{ip}:{port}/igs/rest/mrms/layers
```

### `id`

- **类型:** `String`
- **默认值:** `""`
- **侦听属性**
- **描述:** 图层id，区别不同图层

### `layerStyle`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 图层样式，有如下值：

```
    visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层
    opacity Number 控制图层透明度，会重新加载图层，0 - 1之间的数字，0：隐藏，1：显示
    zIndex Number 控制图层顺序，会重新加载图层，类似css里面的z-index，从0开始的数字
```

### `options`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** Cesium 的进阶参数，另外不属于 cesium 的如下参数也在 options 中：
  ```
    vueKey String 默认值default 该 key 的主要作用是用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
    vueIndex String 默认值(Math.random() * 100000000).toFixed(0) 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
  ```
- **参考:** <br>
  `Arcgis参数` in [ArcGisMapServerImageryProvider](//http://develop.smaryun.com:8899/docs/other/mapgis-cesium/ArcGisMapServerImageryProvider.html?classFilter=ArcGisMapServerImageryProvider)

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

### `gdbps`

- **类型:** `Array | String`
- **必传**
- **侦听属性**
- **描述:** gdbp地址，允许多个图层

```
gdbps: ["layer1","layer2","layer3"]
```

```
gdbps: "layer1,layer2,layer3"
```

## Example

```vue
<template>
    <mapgis-web-scene
        libPath="cesium/Cesium.js"
        pluginPath="cesium/webclient-cesium-plugin.min.js"
    >
        <mapgis-3d-igs-vector-layer
            :gdbps="gdbps"
            :baseUrl="baseUrl"
        ></mapgis-3d-igs-vector-layer>
    </mapgis-web-scene>
</template>

<script>
export default {
    data() {
        return {
            gdbps: [
                "gdbp://MapGisLocal/OpenLayerVecterMap/sfcls/武汉市",
                "gdbp://MapGisLocal/OpenLayerVecterMap/sfcls/overLayByLayerAnalysisResultLayer2021-04-22-165404",
            ],
            baseUrl: "http://localhost:6163/igs/rest/mrms/layers",
        };
    },
};
</script>
```