# CesiumOgcWmtLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `url`

- **类型:** `String`
- **必传**
- **Non-Synced**
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
- **Non-Synced**
- **描述:** 图层名称，多个值以逗号分隔，不传时默认显示全部图层

```
layers = "" 显示全部图层
layers = "武汉,武汉_地铁" 仅显示武汉和武汉_地铁图层
```

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

### `crs`

- **类型:** `String`
- **可选**
- **watch**
- **Non-Synced**
- **描述:** 空间坐标参考系，只在版本 1.3.0 中有效，目前支持如下值：

```
EPSG:4326
EPSG:4490
EPSG:4610
EPSG:4214
EPSG:3857
```

### `tileWidth`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **默认值** `256`
- **描述:** 瓦片宽度

### `tileHeight`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **默认值** `256`
- **描述:** 瓦片高度

### `show`

- **类型:** `Boolean`
- **可选**
- **watch**
- **Non-Synced**
- **默认值** `true`
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
- **描述:** 多线程时使用，该 key 的主要作用是用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `vueIndex`

- **类型:** `String | Number`
- **可选**
- **Non-Synced**
- **描述:** 多线程时使用，该 key 的主要作用是用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

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
    <mapgis-3d-ogc-wms-layer :url="url" :layers="layers" />
  </mapgis-web-globe>
</template>

<script>
import Cesium from "@mapgis/cesium";
import {
  MapgisWebGlobe,
  MapgisOgcWmsLayer
} from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebGlobe,
    MapgisOgcWmsLayer
  },
  data() {
    return {
      //服务基地址
      url:
        "http://localhost:6163/igs/rest/ogc/doc/武汉_专题图_4328_wms/WMSServer",
      //要显示的图层名称
      layers: "武汉市"
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
import Cesium from "@mapgis/cesium";
import {
  MapgisWebGlobe,
  MapgisOgcWmsLayer
} from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebGlobe,
    MapgisOgcWmsLayer
  },
  data() {
    return {
      //服务基地址
      url:
        "http://localhost:6163/igs/rest/ogc/doc/武汉_专题图_4328_wms/WMSServer",
      //要显示的图层名称
      layers: "武汉市",
      srs: "EPSG:4326"
    };
  },
  methods: {
    changeProjection() {
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

### 控制可见性

```vue
<template>
  <mapgis-web-globe>
    <mapgis-3d-ogc-wms-layer :url="url" :layers="layers" :show="show" />
  </mapgis-web-globe>
  <button @click="isShow">是否可见</button>
</template>

<script>
import Cesium from "@mapgis/cesium";
import {
  MapgisWebGlobe,
  MapgisOgcWmsLayer
} from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebGlobe,
    MapgisOgcWmsLayer
  },
  data() {
    return {
      //服务基地址
      url:
        "http://localhost:6163/igs/rest/ogc/doc/武汉_专题图_4328_wms/WMSServer",
      //要显示的图层名称
      layers: "武汉市",
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
