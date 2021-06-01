# CesiumOgcWmtLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 服务基地址,当请求天地图时，请在 url 后面添加 token
- **示例:** <br/>

```
请求igs时：
http://{ip}:{port}/igs/rest/ogc/doc/{mapName}/WMSServer
请求arcgis时：
http://219.142.81.85/arcgis/services/矿产地数据库2019/ferrous_metal/MapServer/WmsServer
```

### `layers`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** <br/>

```
图层名称或Id，多个值以逗号分隔，不传时不显示地图
igs使用地图名称
arcgis根据版本不同，可使用id或名称，具体请看arcgis的wms服务的xml文档，例如：
http://219.142.81.85/arcgis/services/矿产地数据库2019/ferrous_metal/MapServer/WMSServer?request=GetCapabilities&service=WMS
在此文档中找到Layer下面的<Name>0</Name>属性，这里指定图层名称为0，因此按id来查询，若指定名称为英文或汉字则按名称查询
```

- **示例:** <br/>

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
- **侦听属性**
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
- **侦听属性**
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
- **侦听属性**
- **描述:** 图层样式，多个图层样式以逗号分隔，igs 目前不支持

### `layerStyle`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 图层样式，有如下值：

```
    visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层
    opacity Number 控制图层透明度，会重新加载图层，0 - 1之间的数字，0：隐藏，1：显示
    zIndex Number 控制图层顺序，会重新加载图层，类似css里面的z-index，从1开始的数字
```

### `id`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 图层唯一标识符，如果不传，以 vueIndex 代替

### `options`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** Cesium 的进阶参数，另外不属于 cesium 的如下参数也在 options 中：
  ```
    vueKey String 默认值default 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
    vueIndex String 默认值(Math.random() * 100000000).toFixed(0) 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
  ```
- **参考:** <br>
  `WMTS参数` in [WebMapTileServiceImageryProvider](http://develop.smaryun.com:8899/docs/other/mapgis-cesium/WebMapTileServiceImageryProvider.html?classFilter=web)

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
    <mapgis-3d-ogc-wms-layer :baseUrl="baseUrl" :layers="layers" :srs="srs" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      baseUrl: "http://localhost:6163/igs/rest/ogc/doc/wuhan_t1/WMSServer",
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
    <mapgis-3d-ogc-wms-layer :baseUrl="baseUrl" :layers="layers" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      baseUrl:
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

### 动态投影

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wms-layer :baseUrl="baseUrl" :layers="layers" :srs="srs" />
  </mapgis-web-globe>
  <button @click="changeProjection">动态投影</button>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      baseUrl: "http://localhost:6163/igs/rest/ogc/doc/wuhan_t1/WMSServer",
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
      :baseUrl="baseUrl"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSetID"
      :layerStyle="layerStyle"
    />
    <mapgis-3d-ogc-wms-layer
      v-if="show"
      :baseUrl="baseUrl2"
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
      baseUrl:
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
      baseUrl2: "http://localhost:6163/igs/rest/ogc/doc/wuhan_t1/WMSServer",
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

### 多个 mapgis-web-scene

```vue
<template>
  <mapgis-web-scene :vueKey="vueKey">
    <mapgis-3d-ogc-wms-layer
      :baseUrl="baseUrlWms"
      :wmtsLayer="layersWms"
      :tileMatrixSet="layerStyleWms"
      :vueKey="vueKey"
    />
    <mapgis-3d-igs-doc-layer
      :baseUrl="baseUrlDoc"
      :layers="layers"
      :layerStyle="layerStyleDoc"
      :vueKey="vueKey"
    />
    <button @click="changeIndex">改变图层顺序</button>
  </mapgis-web-scene>
  <mapgis-web-scene :vueKey="vueKey2" />
</template>

<script>
export default {
  data() {
    return {
      //服务地址
      baseUrlWms: "http://localhost:6163/igs/rest/ogc/doc/wuhan_3860/WMSServer",
      //要显示的图层
      layersWms: "武汉市_3857,武汉市_医疗服务_3857",
      layerStyleWms: {
        zIndex: 100
      },
      //要加载的url
      baseUrlDoc: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //要显示的子图层
      layers: "show:1,2",
      //mapgis-web-scene的Id，组件唯一标识，多个图层时用来查找webGlobe
      vueKey: "webSceneOne",
      vueKey2: "webSceneTwo",
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
