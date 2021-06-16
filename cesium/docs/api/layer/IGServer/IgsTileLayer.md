# IgsTileLayer

## 属性

### `id`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **描述:** 图层 id

### `baseUrl`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **描述:** Igsever 发布的瓦片服务基地址
- **示例**
  ```
  http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市
  ```

### `tilingScheme`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** 地图参考系，目前支持如下值：

```
EPSG:4326
EPSG:4490
EPSG:4610
EPSG:4214
EPSG:3857
```

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

### `options` Cesium 原生高级参数

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **描述:** Cesium 的进阶参数
- **参考:** <br>
  `MapGISTile参数` in [appendMapGISTile](http://develop.smaryun.com/docs/cesium/module-%25E5%25AE%25A2%25E6%2588%25B7%25E7%25AB%25AF%25E6%2595%25B0%25E6%258D%25AE%25E6%259C%258D%25E5%258A%25A1.TilesLayer.html#appendMapGISTile)

  1. `tileWidth`

     - **类型:** `Number`
     - **可选**
     - **非侦听属性**
     - **默认值** `256`
     - **描述:** 瓦片宽度

  2. `tileHeight`

     - **类型:** `Number`
     - **可选**
     - **非侦听属性**
     - **默认值** `256`
     - **描述:** 瓦片高度

  3. `minimumLevel`

     - **类型:** `Number`
     - **可选**
     - **非侦听属性**
     - **默认值** `0`
     - **描述:** 瓦片最小级别,目前 ceisum 本身的机制不支持设置大于 0 的值，否则会触发渲染错误
     - ![渲染错误](../../../images/layer/minzoom-error.png)

  4. `maximumLevel`
     - **类型:** `Number`
     - **可选**
     - **非侦听属性**
     - **默认值** `20`
     - **描述:** 瓦片最大级别

## 示例

```vue
<template>
  <mapgis-web-scene
    libPath="cesium/Cesium.js"
    pluginPath="cesium/webclient-cesium-plugin.min.js"
  >
    <mapgis-3d-igs-tile-layer :id="id" :baseUrl="baseUrl" :srs="srs" />
  </mapgis-web-scene>
</template>

<script>
export default {
    data() {
        return {
            id: "IGServer-瓦片图层"
            baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
            srs: "EPSG:4326",
        };
    },
};
</script>
```
