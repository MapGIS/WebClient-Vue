# CesiumOgcWmtsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `url`

- **类型:** `String`
- **必传**
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

### `tileMatrixSetID`

- **类型:** `String`
- **必传**
- **watch**
- **描述:** 地图比例尺名称

### `srs`

- **类型:** `String`
- **可选**
- **watch**
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
- **必传**
- **watch**
- **描述:** 地图样式,style 为 vue 关键字，因此改名

### `layerStyle`

- **类型:** `Object`
- **可选**
- **watch**
- **描述:** 图层样式，有如下值：

```
    visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层
    opacity Number 控制图层透明度，会重新加载图层，0 - 1之间的数字，0：隐藏，1：显示
    zIndex Number 控制图层顺序，会重新加载图层，类似css里面的z-index，从1开始的数字
```

### `id`

- **类型:** `String`
- **可选**
- **watch**
- **描述:** 图层唯一标识符，如果不传，以 vueIndex 代替

### `webSceneKey`

- **类型:** `String`
- **可选**
- **默认值** `default`
- **描述:** Cesiumd 多线程的标识符

### `webSceneIndex`

- **类型:** `Number`
- **可选**
- **描述:** 当页面同时拥有多个 webScene 时，webScene 的唯一标识符，
  使用时请先设置 mapgis-web-scene 的 vueIndex，之后将 mapgis-web-scene 的
  vueIndex 传给 mapgis-3d-ogc-wmts-layer 的 webSceneIndex
- **示例:**

```
  <mapgis-web-scene
    :vueIndex="vueIndexWebScene">
    <mapgis-3d-ogc-wmts-layer
      :webSceneIndex="vueIndexWebScene">
    </mapgis-3d-ogc-wmts-layer>
  </mapgis-web-scene>
```

### `options`

- **类型:** `Object`
- **可选**
- **watch**
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

### 加载 WMTS 地图 - IGS - 4326

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wmts-layer
      :url="url"
      :layer="layer"
      :tileMatrixSetID="tileMatrixSetID"
      :srs="srs"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url: "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
      //地图文档名称
      layer: "beijing",
      //地图比例尺名称
      tileMatrixSetID: "EPSG:4326_北京市_028mm_GB",
      //空间参考系
      srs: "EPSG:4326"
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

### 加载 WMTS 地图 - ArcGis - 3857

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wmts-layer
      :url="url"
      :layer="layer"
      :tileMatrixSetID="tileMatrixSetID"
      :srs="srs"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url:
        "http://219.142.81.85/arcgis/rest/services/矿产地数据库2019/ferrous_metal/MapServer/WMTS",
      //地图文档名称
      layer: "矿产地数据库2019_ferrous_metal",
      //地图比例尺名称
      tileMatrixSetID: "default028mm",
      //空间参考系
      srs: "EPSG:3857"
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
  <mapgis-web-scene>
    <mapgis-3d-ogc-wmts-layer
      :url="url"
      :layer="layer"
      :tileMatrixSetID="tileMatrixSetID"
      :layerStyle="layerStyle"
    />
    <mapgis-3d-ogc-wms-layer
      v-if="show"
      :url="url2"
      :layers="layers"
      :srs="srs2"
      :layerStyle="layerStyle2"
    />
  </mapgis-web-scene>
  <button @click="add">添加地图</button>
  <button @click="isShow">是否可见</button>
  <button @click="changeOpacity">改变透明度</button>
  <button @click="changeIndex">改变图层顺序</button>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url:
        "http://develop.smaryun.com:6163/igs/rest/ogc/WORLDMKTTILE2/WMTSServer",
      //地图文档名称
      layer: "WORLDMKTTILE2",
      //地图比例尺
      tileMatrixSetID: "GoogleMapsCompatible_GB",
      //样式信息
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 105
      },
      //服务基地址
      url2: "http://localhost:6163/igs/rest/ogc/doc/wuhan_t1/WMSServer",
      //要显示的图层名称
      layers: "武汉市,武汉市_行人道路",
      //空间参考系
      srs2: "EPSG:4326",
      //样式信息
      layerStyle2: {
        zIndex: 50
      },
      show: false
    };
  },
  methods: {
    add() {
      //通过v-if方式添加一个地图
      this.show = !this.show;
    },
    isShow() {
      //地图的显示或隐藏，会重新加载地图
      this.layerStyle.visible = !this.layerStyle.visible;
    },
    changeOpacity() {
      //地图的透明度选项，不会重新加载地图
      this.layerStyle.opacity = 0.5;
    },
    changeIndex() {
      //更改地图顺序
      if (this.layerStyle.zIndex === 105) {
        this.layerStyle.zIndex = 10;
      } else {
        this.layerStyle.zIndex = 105;
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

### 加载天地图，请在 url 地址后面加 token

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wmts-layer :url="url" :srs="srs" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //天地图地址，请在url地址后面加token
      url:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
      //地图空间坐标系,4326必传
      srs: "EPSG:4326"
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

## 当有多个 mapgis-web-scene，例如使用分屏以及卷帘组件时，请设置 mapgis-web-scene 的 vueIndex，并将此 vueIndex 传给此组件的 webSceneIndex

```vue
<template>
  <mapgis-web-scene :vueIndex="index">
    <mapgis-3d-ogc-wmts-layer
      :url="urlWmts"
      :layer="layerWmts"
      :tileMatrixSetID="tileMatrixSetIDWmts"
      :srs="srsWmts"
      :layerStyle="layerStyleWmts"
      :webSceneIndex="index"
    />
    <mapgis-3d-igs-doc-layer
      :url="urlDoc"
      :layers="layers"
      :layerStyle="layerStyleDoc"
      :webSceneIndex="index"
    />
    <button @click="changeIndex">改变图层顺序</button>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      urlWmts:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
      //天地图就传空值
      layerWmts: "",
      tileMatrixSetIDWmts: "",
      //空间参考系
      srsWmts: "EPSG:4326",
      layerStyleWmts: {
        zIndex: 100
      },
      //要加载的url
      urlDoc: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //要显示的子图层
      layers: "show:1,2",
      //mapgis-web-scene的Id，组件唯一标识，多个图层时用来查找webGlobe
      vueIndex: 2001245,
      layerStyleDoc: {
        zIndex: 1000
      }
    };
  },
  methods: {
    changeIndex() {
      if (this.layerStyleDoc.zIndex === 1000) {
        this.layerStyleDoc.zIndex = 50;
      } else {
        this.layerStyleDoc.zIndex = 1000;
      }
    }
  }
};
</script>
```
