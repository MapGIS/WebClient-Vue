# CesiumOgcWmtsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `url`

- **类型:** `String`
- **必传**
- **Non-Synced**
- **watch**
- **描述:** 基地址，当请求天地图时，请在 url 后面添加 token，例如：

```
http://{ip}:{port}/igs/rest/ogc/WMTSServer&tk=您的token值
```

- **示例:**

```
    KVP模式：
    http://{ip}:{port}/igs/rest/ogc/WMTSServer
    REST模式
    http://{host}:{port}/igs/rest/ogc/WMTSServer?service=WMTS&request=GetTile&version={version}&layer={layer}&format={format}&TileMatrixSet={TileMatrixSet}&TileMatrix={级数}&TileRow={行号}&TileCol={列号}
```

### `layer`

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
- **描述:** 地图样式,style 为 vue 关键字，因此改名

### `layerStyle`

- **类型:** `Object`
- **可选**
- **watch**
- **Non-Synced**
- **描述:** 图层样式，有如下值：

```
    visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层
    opacity Number 控制图层透明度，会重新加载图层，0 - 1之间的数字，0：隐藏，1：显示
    zIndex Number 控制图层顺序，会重新加载图层，类似css里面的z-index，从0开始的数字
```

### `options`

- **类型:** `Object`
- **可选**
- **Non-Synced**
- **描述:** Cesium 的进阶参数，另外不属于 cesium 的如下参数也在 options 中：
  ```
    vueKey String 默认值default 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
    vueIndex String 默认值(Math.random() * 100000000).toFixed(0) 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
  ```
- **参考:** <br>
  `WMTS参数` in [WebMapTileServiceImageryProvider](http://develop.smaryun.com:8899/docs/other/mapgis-cesium/WebMapTileServiceImageryProvider.html?classFilter=web)

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
export default {
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

### 控制可见性，控制透明度，以及改变图层顺序

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wmts-layer
      :url="url"
      :layer="layer"
      :tileMatrixSet="tileMatrixSet"
      :layerStyle="layerStyle"
    />
  </mapgis-web-globe>
  <button @click="isShow">是否可见</button>
  <button @click="changeOpacity">改变透明度</button>
  <button @click="changeIndex">改变图层顺序</button>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url: "http://localhost:6163/igs/rest/ogc/WMTSServer",
      //地图文档名称
      layer: "武汉_专题图_4327",
      //空间参考系
      tileMatrixSet: "EPSG:4326",
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 0
      }
    };
  },
  methods: {
    isShow() {
      this.layerStyle.visible = !this.visible;
    },
    changeOpacity() {
      this.layerStyle.opacity = 0.5;
    },
    changeIndex() {
      this.layerStyle.zIndex = 2;
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

### 加载天地图，请在 url 地址后面加 token

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wmts-layer :url="url" :tileMatrixSet="tileMatrixSet" />
  </mapgis-web-globe>
</template>

<script>
export default {
  data() {
    return {
      //天地图地址，请在url地址后面加token
      url:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
      //参考系
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
