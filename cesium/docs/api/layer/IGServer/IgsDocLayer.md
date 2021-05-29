# IgsDocLayer

## Props

### `url`

- **类型:** `String`
- **可选**
- **描述:** 服务基地址。【url，domain 和（protocol，ip，port）三选一】

```
http://{ip}:{port}/igs/rest/mrms/docs
```

### `domain`

- **类型:** `String`
- **可选**
- **描述:** 域名。【url，domain 和（protocol，ip，port）三选一】

### `protocol`

- **类型:** `String`
- **可选**
- **默认值** `http://`
- **描述:** 网络协议。【url，domain 和（protocol，ip，port）三选一】

### `ip`

- **类型:** `String`
- **可选**
- **默认值** `localhost`
- **描述:** 地图服务 ip。【url，domain 和（protocol，ip，port）三选一】

### `port`

- **类型:** `String`
- **可选**
- **默认值** `6163`
- **描述:** 地图服务端口。【url，domain 和（protocol，ip，port）三选一】

### `serverName`

- **类型:** `String`
- **可选**
- **描述:** 地图文档名称。【domain 和（protocol，ip，port）使用】

### `layers`

- **类型:** `String`
- **可选**
- **watch**
- **描述:** 指定需要被取图的图层序列号数组，编号从 0 开始，多个图层以“，”分隔

```
    1、show：仅仅显示指定了图层序号的图层
    2、hide ：显示除hide参数指定图层外所有的图层
    3、include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层。
    4、exclude: 从默认图层列表里删除这些被指定的图层后，进行显示
```

- **例如:**

```
   layers = show:1,2//仅显示第1、2个图层
```

## 加载 4326 地图

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :url="url" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      url: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328"
    };
  }
};
</script>
```

## 加载 3857 地图 -- 目前不支持

## 设置样式 - 透明度、可见性、zIndex

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :url="url" :layerStyle="layerStyle" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      url: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //图层样式
      layerStyle: {
        opacity: 0.5,
        visible: true,
        zIndex: 115
      }
    };
  }
};
</script>
```

## 设置子图层

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :url="url" :layers="layers" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      url: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //要显示的子图层
      layers: "show:1,2"
    };
  }
};
</script>
```

## 当有多个 mapgis-web-scene，例如使用分屏以及卷帘组件时，请设置 mapgis-web-scene 的 vueIndex，并将此 vueIndex 传给此组件的 webSceneIndex

```vue
<template>
  <mapgis-web-scene
    libPath="cesium/Cesium.js"
    pluginPath="cesium/webclient-cesium-plugin.min.js"
    :vueIndex="index"
  >
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
      urlWmts:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
      layerWmts: "",
      tileMatrixSetIDWmts: "",
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
