# ArcGIS 地图

> mapgis-3d-arcgis-map-layer

## 属性

### `baseUrl`

- **类型:** `String`
- **默认值:** `null`
- **非侦听属性**
- **描述:** arcgis 地图请求的基地址路径。

### `srs`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** WMS 标准中的 srs(1.1.0 版本)或 crs(1.3.0 版本)，即坐标参考系，可通过改变 srs 的值(4326 与 3857 切换)，来实现动态投影，目前支持如下值：

  > 经纬度方式请填写:EPSG:4326 <br/>
  > web 墨卡托方式请填写:EPSG:3857

### `layers`

- **类型:** `String`
- **默认值:** `null`
- **侦听属性**
- **描述:** 指定需要被取图的图层序列号数组，以“，”分隔。默认为依据文档原始图层状态进行设置。
  show：仅仅显示指定了图层序号的图层；
- **示例:** `"show:1,2,3"`
- **注意:** 若不传该参数,则默认显示所有图层。
  > layers:"" //显示全部图层 <br/>
  > layers:"show:1,2,3"

### `layerStyle`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 控制地图的显隐、透明度以及顺序，有如下值：
  > visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层 <br/>
  > opacity Number 控制图层透明度，会重新加载图层，0 - 1 之间的数字，0：隐藏，1：显示 <br/>
  > zIndex Number 控制图层顺序，会重新加载图层，类似 css 里面的 z-index，从 1 开始的数字 <br/>

### `options`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** Cesium 的进阶参数，另外不属于 cesium 的如下参数也在 options 中：
- **参考:** <br>
  `Arcgis参数` in [ArcGisMapServerImageryProvider](http://develop.smaryun.com:8899/docs/other/mapgis-cesium/ArcGisMapServerImageryProvider.html?classFilter=ArcGisMapServerImageryProvider)

### `id`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 图层唯一标识符，如果不传，以 vueIndex 代替

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

## 示例

```vue
<template>
  <mapgis-web-scene class="main">
    <mapgis-3d-arcgis-map-layer v-bind="$data" />
    <button @click="changeOpacity">改变透明度</button>
    <button @click="changeIndex">改变图层顺序</button>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "arcgisMapLayer",
  data() {
    return {
      baseUrl:
        "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      layers: "show:0",
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2,
      },
      options: {
        tileWidth: 216,
        tileHeight: 216,
      },
      srs: "EPSG:4326",
    };
  },
  methods: {
    changeOpacity() {
      this.layerStyle.opacity = 0.5;
    },
    changeIndex() {
      if (this.layerStyle.zIndex === 3) {
        this.layerStyle.zIndex = 5;
      } else {
        this.layerStyle.zIndex = 1;
      }
    },
  },
};
</script>
<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```

### 控制多张地图显示的 zIndex

```vue
<template>
  <mapgis-web-scene class="main">
    <mapgis-3d-arcgis-map-layer :baseUrl="url" :layerStyle="layerStyle" />
    <mapgis-3d-arcgis-tile-layer
      v-if="show"
      :baseUrl="url2"
      :layerStyle="layerStyle2"
    ></mapgis-3d-arcgis-tile-layer>
    <button @click="changeOpacity">改变透明度</button>
    <button @click="changeIndex">改变图层顺序</button>
    <button @click="changeLayers">改变图层顺序</button>
    <button @click="addMap">新增地图</button>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "arcgisMapLayer",
  data() {
    return {
      url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      url2: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
      layers: "",
      layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2000,
      },
      layerStyle2: {
        visible: true,
        opacity: 1,
        zIndex: 2001,
      },
      options: {
        tileWidth: 256,
        tileHeight: 256,
      },
      id: "2",
      show: false,

      // srs: "EPSG:4326"
    };
  },
  methods: {
    addMap() {
      this.show = !this.show;
    },
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
    },
    changeLayers() {
      this.layers = "1,2,4,6,7,8,10";
    },
  },
};
</script>
<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```
