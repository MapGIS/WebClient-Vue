# CesiumOgcWmtsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `url`

- **类型:** `String`
- **必传**
- **Non-Synced**
- **watch**
- **描述:** 基地址.
- **示例:**

```
    KVP模式：
    http://{ip}:{port}/igs/rest/ogc/WMTSServer
    REST模式
    http://{host}:{port}/igs/rest/ogc/WMTSServer?service=WMTS&request=GetTile&version={version}&layer={layer}&format={format}&TileMatrixSet={TileMatrixSet}&TileMatrix={级数}&TileRow={行号}&TileCol={列号}
```

### `wmtsLayer`

- **类型:** `String`
- **必传**
- **watch**
- **Non-Synced**
- **描述:** 地图文档名称，根据发布的 WMTS 服务信息设置

### `tileMatrixSet`

- **类型:** `String`
- **必传:**
- **watch**
- **Non-Synced**
- **描述:** 地图参考系，目前支持如下值：

```
EPSG:4326
EPSG:4490
EPSG:4610
EPSG:4214
EPSG:3857
```

### `wmtsStyle`

- **类型:** `String`
- **默认值:** `default`
- **可选**
- **watch**
- **Non-Synced**
- **描述:** 地图样式

### `tileMatrixLabels`

- **类型:** `Number`
- **可选**
- **默认值:** ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
- **Non-Synced**
- **描述:** 图层的矩阵级别

### `show`

- **类型:** `Boolean`
- **可选**
- **watch**
- **Non-Synced**
- **默认值** true
- **描述:** 图层的显示或隐藏，true：显示，false：隐藏

### `layerIndex`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **描述:** 图层的堆叠顺序

### `options`

- **类型:** `Object`
- **可选**
- **Non-Synced**
- **描述:** Cesium 的进阶参数
- **参考:** <br>
  `WMTS参数` in [WebMapTileServiceImageryProvider](http://develop.smaryun.com:8899/docs/other/mapgis-cesium/WebMapTileServiceImageryProvider.html?classFilter=web)

### `vueKey`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **描述:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `vueIndex`

- **类型:** `String | Number`
- **可选**
- **Non-Synced**
- **描述:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

## Events

All common layer [events](/zh/api/Layers/#events)

### `@load`

- **描述:** 图层加载完成事件
- **返回值** `{ layer,vue }` <br>
  `layer` 图层对象 <br>
  `vue` vue 对象 <br>

### `@unload`

- **描述:** 图层注销事件
- **返回值** `{ vue }` <br>
  `vue` vue 对象 <br>

## Example

### KVP 格式，请求地图

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wmts-layer
      :url="url"
      :layer="layer"
      :tileMatrixSet="tileMatrixSet"
    />
  </mapgis-web-globe>
</template>

<script>
import Cesium from "@mapgis/cesium";
import {
  MapgisWebGlobe,
  MapgisOgcWmtsLayer
} from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebGlobe,
    MapgisOgcWmtsLayer
  },
  data() {
    return {
      //服务基地址
      url: "http://localhost:6163/igs/rest/ogc/WMTSServer",
      //地图文档名称
      layer: "武汉_专题图_4327",
      //空间参考系
      tileMatrixSet: "EPSG:4326"
    };
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

### 控制可见性

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wmts-layer
      :url="url"
      :layer="layer"
      :tileMatrixSet="tileMatrixSet"
    />
  </mapgis-web-globe>
  <button @click="isShow">是否可见</button>
</template>

<script>
import Cesium from "@mapgis/cesium";
import {
  MapgisWebGlobe,
  MapgisOgcWmtsLayer
} from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebGlobe,
    MapgisOgcWmtsLayer
  },
  data() {
    return {
      //服务基地址
      url: "http://localhost:6163/igs/rest/ogc/WMTSServer",
      //地图文档名称
      layer: "武汉_专题图_4327",
      //空间参考系
      tileMatrixSet: "EPSG:4326",
      show: true
    };
  },
  methods: {
    isShow() {
      this.show = !this.show;
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
