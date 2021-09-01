# OGC WMTS

> mapgis-3d-ogc-wmts-layer

## 属性

### `baseUrl`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 服务基地址
  > igs 服务：
  > http://{ip}:{port}/igs/rest/ogc/WMTSServer <br/>
  > arcgis 服务：
  > http://219.142.81.85/arcgis/rest/services/20wanHT/MapServer/WMTS <br/>
  > 天地图：
  > http://t0.tianditu.gov.cn/vec_c/wmts

### `wmtsLayer`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** wmts 标准中的 layer 属性，即图层名称
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。<br/>
  > ... <br/>
  > \<Layer\> <br/>
  > \<ows:Title\>beijing\</ows:Title\> <br/>
  > \<ows:Identifier\>beijing</ows:Identifier\>//这个值 beijing 就是 wmtsLayer 属性所需要的值 <br/>
  > ... <br/>
  > \</Layer\> <br/>
  > ... <br/>
  > 全文搜索\<Layer\>关键字，在 Layer 下找到\<ows:Identifier\>属性，里面的值"beijing"就是 wmtsLayer 属性所需要的

### `tileMatrixSet`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** wmts 标准中的 TileMatrixSet 属性，即地图矩阵集合
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。<br/>
  > ... <br/>
  > \<TileMatrixSet\> <br/>
  > \<ows:Title\>采用 arcgis 计算方式的瓦片块阵集\</ows:Title\> <br/>
  > \<ows:Abstract\>该块阵集使用 arcgis 标准计算的比例尺\</ows:Abstract\> <br/>
  > \<ows:Identifier\>EPSG:4326*北京市\_arcgis_GB\</ows:Identifier\>//这个值 EPSG:4326*北京市*arcgis_GB 就是 TileMatrixSet 属性所需要的值 <br/>
  > \<ows:SupportedCRS\>urn:ogc:def:crs:EPSG::4326\</ows:SupportedCRS\> <br/>
  > \<WellKnownScaleSet\>urn:ogc:def:wkss:OGC:1.0:GoogleCRS84Quad\</WellKnownScaleSet\> <br/>
  > ... <br/>
  > \<TileMatrixSet\> <br/>
  > ... <br/>
  > 全文搜索\<TileMatrixSet\>关键字，在\<TileMatrixSet\>下找到\<ows:Identifier\>属性，里面的值"EPSG:4326*北京市\_arcgis_GB"就是 tileMatrixSet 属性所需要的

### `format`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** wmts 标准中的 format 属性，即请求的图片的返回格式
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。 <br/>
  > ... <br/>
  > \<Format\>image/png\</Format\> <br/>
  > ... <br/>
  > 全文搜索\<Format\>关键字，里面的值"image/png"就是 format 属性所需要的

### `tilingScheme`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** Cesium 的瓦片切图方式，目前支持如下值：
  > 经纬度方式请填写:EPSG:4326 <br/>
  > web 墨卡托方式请填写:EPSG:3857

### `wmtsStyle`

- **类型:** `String`
- **默认值:** `default`
- **必传**
- **侦听属性**
- **描述:** wmts 标准中的 style 属性，即地图样式
  > 这里以司马云上发布的 WMTS 服务为例，ArcGis 同理，访问http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer?service=WMTS&request=GetCapabilities，获取地图元信息
  > 这里得到的是一个 XML 文档。 <br/>
  > ... <br/>
  > \<Style isDefault="true"\> <br/>
  > \<ows:Title\>Default Style\</ows:Title\> <br/>
  > \<ows:Identifier\>default\</ows:Identifier\>//里面的"default"就是 wmtsStyle 的值 <br/>
  > \</Style\> <br/>
  > ... <br/>
  > 全文搜索 Style 关键字，地图可以有多个 style，这里以 default，默认值为例，在\<Style isDefault="true"\>下找到\<ows:Identifier\>属性，里面的"default"就是 wmtsStyle 的值

### `layerStyle`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 控制地图的显隐、透明度以及顺序，有如下值：
  > visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层 <br/>
  > opacity Number 控制图层透明度，会重新加载图层，0 - 1 之间的数字，0：隐藏，1：显示 <br/>
  > zIndex Number 控制图层顺序，会重新加载图层，类似 css 里面的 z-index，从 1 开始的数字 <br/>

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
  > vueKey String 默认值 default 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持 <br/>
  > vueIndex String 默认值(Math.random() \* 100000000).toFixed(0) 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
- **参考:** <br>
  `Cesium的WMTS参数` in [WebMapTileServiceImageryProvider](http://develop.smaryun.com:8899/docs/other/mapgis-cesium/WebMapTileServiceImageryProvider.html?classFilter=web)

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

### `token`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **描述:** token 信息
  > 要传 token 时，请以如下方式传递 <br/>
  > 天地图: <br/>
  > token:{ <br/>
  > key: "tk", <br/>
  > value: "9c157e9585486c02edf817d2ecbc7752" <br/>
  > } <br/>
  > igs 以及其他: <br/>
  > token:{ <br/>
  > key: "token", <br/>
  > value: "9c157e9585486c02edf817d2ecbc7752" <br/>
  > }

## 事件

### `@load`

- **描述:** 图层加载完成事件
- **返回值** `{ layer,vue }` <br>
  `layer` 图层对象 <br>
  `vue` vue 对象 <br>

### `@unload`

- **描述:** 图层注销事件
- **返回值** `{ vue }` <br>
  `vue` vue 对象 <br>

## 示例

### 加载天地图

::: demo

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="baseUrl"
      :wmtsLayer="wmtsLayer"
      :tileMatrixSet="tileMatrixSet"
      :tilingScheme="tilingScheme"
      :format="format"
      :token="token"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //天地图地址
      baseUrl: "http://t0.tianditu.gov.cn/vec_c/wmts",
      //Cesium的瓦片切图方式
      tilingScheme: "EPSG:4326",
      //地图的瓦片矩阵集合
      tileMatrixSet: "c",
      //图层名称
      wmtsLayer: "vec",
      //返回格式
      format: "tiles",
      //token信息
      token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      }
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

:::

### 加载 WMTS 地图 - IGS - 4326

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="baseUrl"
      :wmtsLayer="wmtsLayer"
      :tileMatrixSet="tileMatrixSet"
      :tilingScheme="tilingScheme"
      :format="format"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      baseUrl:
        "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
      //图层名称
      wmtsLayer: "beijing",
      //地图的瓦片矩阵集合
      tileMatrixSet: "EPSG:4326_北京市_028mm_GB",
      //Cesium的瓦片切图方式
      tilingScheme: "EPSG:4326",
      //返回格式
      format: "image/png"
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
      :baseUrl="baseUrl"
      :wmtsLayer="wmtsLayer"
      :tileMatrixSet="tileMatrixSet"
      :tilingScheme="tilingScheme"
      :format="format"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      baseUrl:
        "http://219.142.81.85/arcgis/rest/services/矿产地数据库2019/ferrous_metal/MapServer/WMTS",
      //图层名称
      wmtsLayer: "矿产地数据库2019_ferrous_metal",
      //地图的瓦片矩阵集合
      tileMatrixSet: "default028mm",
      //Cesium的瓦片切图方式
      tilingScheme: "EPSG:4326",
      //返回格式
      format: "image/png"
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
      :baseUrl="baseUrl"
      :wmtsLayer="wmtsLayer"
      :tileMatrixSet="tileMatrixSet"
      :tilingScheme="tilingScheme"
      :format="format"
    />
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="baseUrl2"
      :wmtsLayer="wmtsLayer2"
      :tileMatrixSet="tileMatrixSet2"
      :tilingScheme="tilingScheme2"
      :format="format"
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
      //图层名称
      wmtsLayer: "WORLDMKTTILE2",
      //地图的瓦片矩阵集合
      tileMatrixSet: "GoogleMapsCompatible_GB",
      //返回格式
      format: "image/png",
      //样式信息
      layerStyle: {
        visible: true, //是否显示图层
        opacity: 1, //图层透明度
        zIndex: 105 //图层zIndex，与css里的zIndex类似
      },
      //服务基地址
      baseUrl2:
        "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
      //图层名称
      wmtsLayer2: "beijing",
      //地图的瓦片矩阵集合
      tileMatrixSet2: "EPSG:4326_北京市_028mm_GB",
      //Cesium的瓦片切图方式
      tilingScheme: "EPSG:4326",
      //样式信息
      layerStyle2: {
        zIndex: 50
      },
      //是否显示图层
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
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="urlWmts"
      :wmtsLayer="layerWmts"
      :tileMatrixSet="tileMatrixSetWmts"
      :tilingScheme="tilingSchemeWmts"
      :format="format"
      :token="token"
      :layerStyle="layerStyleWmts"
      :vueKey="vueKey"
    />
    <mapgis-3d-igs-doc-layer
      :baseUrl="urlDoc"
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
      //要加载的url
      urlWmts: "http://t0.tianditu.gov.cn/vec_c/wmts",
      //天地图就传空值
      layerWmts: "vec",
      tileMatrixSetWmts: "c",
      //空间参考系
      tilingSchemeWmts: "EPSG:4326",
      //返回格式
      format: "tiles",
      //token信息
      token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      },
      layerStyleWmts: {
        zIndex: 100
      },
      //要加载的url
      urlDoc: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //要显示的子图层
      layers: "show:1,2",
      //mapgis-web-scene的Id，组件唯一标识，多个图层时用来查找webGlobe
      vueKey: "vueKeyOne",
      vueKey2: "vueKeyTwo",
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
