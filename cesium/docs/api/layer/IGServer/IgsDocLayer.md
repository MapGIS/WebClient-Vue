# IGServer 地图文档

> mapgis-3d-igs-doc-layer

## 属性

### `baseUrl`

- **类型:** `String`
- **必填**
- **非侦听属性**
- **描述:** 服务基地址。
  > http://{ip}:{port}/igs/rest/mrms/docs

### `srs`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** 坐标参考系，可通过改变 srs 的值(4326 与 3857 切换)，来实现动态投影，目前支持如下值：
  > 经纬度方式请填写:EPSG:4326 <br/>
  > web 墨卡托方式请填写:EPSG:3857

### `layers`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 指定需要被取图的图层序列号数组，编号从 0 开始，多个图层以“，”分隔
  > 1、show：仅仅显示指定了图层序号的图层 <br/>
  > 2、hide ：显示除 hide 参数指定图层外所有的图层 <br/>
  > 3、include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层。
  > 4、exclude: 从默认图层列表里删除这些被指定的图层后，进行显示 <br/>
  > 例如：layers = show:1,2//仅显示第 1、2 个图层

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
  > token:{ <br/>
  > key: "token", <br/>
  > value: "9c157e9585486c02edf817d2ecbc7752" <br/>
  > }

## 示例

### 加载 4326 地图

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328"
    };
  }
};
</script>
```

### 动态投影

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" :srs="srs" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //动态投影
      srs: "EPSG: 3857"
    };
  }
};
</script>
```

### 设置样式 - 透明度、可见性、zIndex

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" :layerStyle="layerStyle" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
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

### 设置子图层

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" :layers="layers" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
      //要显示的子图层
      layers: "show:1,2"
    };
  }
};
</script>
```

### 多个 mapgis-web-scene

```vue
<template>
  <mapgis-web-scene :vueKey="vueKey">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="baseUrlWmts"
      :wmtsLayer="layerWmts"
      :tileMatrixSet="tileMatrixSetIDWmts"
      :srs="srsWmts"
      :layerStyle="layerStyleWmts"
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
      baseUrlWmts:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
      layerWmts: "",
      tileMatrixSetIDWmts: "",
      srsWmts: "EPSG:4326",
      layerStyleWmts: {
        zIndex: 100
      },
      //要加载的url
      baseUrlDoc: "http://localhost:6163/igs/rest/mrms/docs/武汉_专题图_4328",
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
