# CesiumArcgisTileLayer

## Props

### `url`

- **类型:** `String`
- **默认值:** `null`
- **Synced**
- **描述:** 地图请求的基地址路径。

### `srs`

- **类型:** `String`
- **可选**
- **watch**
- **Non-Synced**
- **描述:** 空间坐标参考系，只在版本 1.1.1 中有效，目前支持如下值：

```
EPSG:4326
EPSG:4490
EPSG:4610
EPSG:4214
EPSG:3857
```

### `layerStyle`

- **类型:** `Object`
- **可选**
- **Synced**
- **描述:** 图层样式，有如下值：

```
    visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层
    opacity Number 控制图层透明度，会重新加载图层，0 - 1之间的数字，0：隐藏，1：显示
    zIndex Number 控制图层顺序，会重新加载图层，类似css里面的z-index，从0开始的数字
```

### `options`

- **类型:** `Object`
- **可选**
- **Synced**
- **描述:** Cesium 的进阶参数，另外不属于 cesium 的如下参数也在 options 中：

- **参考:** <br>
  `Arcgis参数` in [ArcGisMapServerImageryProvider](//http://develop.smaryun.com:8899/docs/other/mapgis-cesium/ArcGisMapServerImageryProvider.html?classFilter=ArcGisMapServerImageryProvider)

### `VueOption`

- **类型:** `Object`
- **可选**
- 参数如下：
  - **描述:** 有如下值：
  ```
    vueKey String 默认值default 该 key 的主要作用是用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
    vueIndex String 默认值(Math.random() * 100000000).toFixed(0) 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
  ```

## Example

```vue
<template>
  <mapgis-web-scene class="main">
    <mapgis-3d-arcgis-tile-layer v-bind="$data" />
    <button @click="changeOpacity">改变透明度</button>
    <button @click="changeIndex">改变图层顺序</button>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "arcgisTileLayer",
  data() {
    return {
      url:
        "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      layers: "2,4,6",
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
      },
      srs: "EPSG:4326"
    };
  },
  methods: {
    changeOpacity() {
      if (this.layerStyle.opacity > 1) {
        this.layerStyle.opacity = 0;
      } else {
        this.layerStyle.opacity += 0.1;
      }
    },
    changeIndex() {
      if (this.layerStyle.zIndex === 3) {
        this.layerStyle.zIndex = 5;
      } else {
        this.layerStyle.zIndex = 1;
      }
    }
  }
};
</script>
<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```
