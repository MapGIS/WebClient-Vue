# CesiumOgcWmtLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `url`

- **类型:** `String`
- **必传**
- **watch**
- **描述:** 服务基地址,因为 REST 模式填写非常繁琐，因此推荐使用 KVP 模式,
  当请求天地图时，请在 url 后面添加 token，例如：

```
http://{ip}:{port}/igs/rest/ogc/WMTSServer&tk=您的token值
```

- **示例:**

```
    版本1.1.1
    KVP模式：
    http://{host}:{port}/igs/rest/ogc/layer/{地图名称}/WMSServer
    REST模式
    http://{host}:{port}/igs/rest/ogc/layer/{服务名}/WMSServer?service=WMS&REQUEST=GetMap&version=1.1.1&layers={服务名称}：{图层名}[1] &srs={srs}&bbox={minx,miny,maxx,maxy}&width={imgwidth}&height={imgheight}&format={imgformat}&sld_Body={sld_Body}&sld={sld}
    版本1.3.0
    KVP模式：
    http://{host}:{port}/igs/rest/ ogc/layer/{服务名}/WMSServer
    REST模式
    http://{host}:{port}/igs/rest/ ogc/layer/{服务名}/WMSServer?service=WMS&version=1.3.0&REQUEST=GetMap&format={imgformat}&layers={layernames}&bbox={miny,minx,maxy,maxx}&width={imgwidth}&height={imgheight}&crs={crs}
```

### `layers`

- **类型:** `String`
- **必传**
- **watch**
- **描述:** 图层名称或 Id，igs 使用地图名称，arcgis 使用 id，从 0 开始，多个值以逗号分隔，不传时默认显示全部图层

```
layers = "" 显示全部图层
igs使用名称
layers = "武汉,武汉_地铁" 仅显示武汉和武汉_地铁图层
arcgis使用id
layers =  “0,1,2”
```

### `srs`

- **类型:** `String`
- **必传**
- **watch**
- **描述:** 空间坐标参考系，只在版本 1.1.1 中有效，目前支持如下值：

```
EPSG:4326
EPSG:4490
EPSG:4610
EPSG:4214
EPSG:3857
```

### `crs`

- **类型:** `String`
- **必传**
- **watch**
- **描述:** 空间坐标参考系，只在版本 1.3.0 中有效，目前支持如下值：

```
EPSG:4326
EPSG:4490
EPSG:4610
EPSG:4214
EPSG:3857
```

### `styles`

- **类型:** `Number`
- **可选**
- **watch**
- **描述:** 图层样式，多个图层样式以逗号分隔，igs 目前不支持

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
  vueIndex 传给 mapgis-3d-ogc-wms-layer 的 webSceneIndex
- **示例:**

```
  <mapgis-web-scene
    :vueIndex="vueIndexWebScene">
    <mapgis-3d-ogc-wms-layer
      :webSceneIndex="vueIndexWebScene">
    </mapgis-3d-ogc-wms-layer>
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

### 加载 WMS 地图 - IGS - 4326

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wms-layer :url="url" :layers="layers" :srs="srs" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url: "http://localhost:6163/igs/rest/ogc/doc/wuhan_t1/WMSServer",
      //要显示的图层名称
      layers: "武汉市,武汉市_行人道路",
      //地图坐标系
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

### 加载 WMS 地图 - ArcGis - 3857

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wms-layer :url="url" :layers="layers" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url:
        "http://219.142.81.85/arcgis/services/矿产地数据库2019/ferrous_metal/MapServer/WmsServer",
      //要显示的图层Id,arcgis要传Id而不是名称
      layers: "0"
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

### 动态投影,wms 服务版本为 1.1.1 时请使用 srs，版本为 1.3.0 时请使用 crs

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wms-layer :url="url" :layers="layers" :srs="srs" />
  </mapgis-web-globe>
  <button @click="changeProjection">动态投影</button>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      url: "http://localhost:6163/igs/rest/ogc/doc/wuhan_t1/WMSServer",
      //要显示的图层名称
      layers: "武汉市,武汉市_行人道路",
      srs: "EPSG:4326"
    };
  },
  methods: {
    changeProjection() {
      //动态投影功能
      if (this.srs === "EPSG:4326") {
        this.srs = "EPSG:3857";
      } else {
        this.srs = "EPSG:4326";
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

## 当有多个 mapgis-web-scene，例如使用分屏以及卷帘组件时，请设置 mapgis-web-scene 的 vueIndex，并将此 vueIndex 传给此组件的 webSceneIndex

```vue
<template>
  <mapgis-web-scene :vueIndex="index">
    <mapgis-3d-ogc-wms-layer
      :url="urlWms"
      :layer="layersWms"
      :tileMatrixSetID="layerStyleWms"
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
      //服务地址
      urlWms: "http://localhost:6163/igs/rest/ogc/doc/wuhan_3860/WMSServer",
      //要显示的图层
      layersWms: "武汉市_3857,武汉市_医疗服务_3857",
      layerStyleWms: {
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
