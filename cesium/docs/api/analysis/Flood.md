# Flood

## 属性

### `startHeight`

- **类型:** `Number`
- **默认值:** `0`
- **侦听属性**
- **描述:** 洪水淹没水体起始高度，如果设置了起始高度 startHeight，并且设置了当前淹没高度 currentHeight，则真实淹没高度为(currentHeight - startHeight - minHeight)

### `minHeight`

- **类型:** `Number`
- **默认值:** `0`
- **侦听属性**
- **描述:** 淹没动画高度起始点，如果设置了起始高度 startHeight，并且设置了当前淹没高度 currentHeight，则真实淹没高度为(currentHeight - startHeight - minHeight)

### `currentHeight`

- **类型:** `Number`
- **默认值:** `0`
- **侦听属性**
- **描述:** 当前洪水淹没高度

### `maxHeight`

- **类型:** `Number`
- **默认值:** `200`
- **侦听属性**
- **描述:** 最大淹没高度

### `floodColor`

- **类型:** `String`
- **默认值:** `#4e81bb`
- **侦听属性**
- **描述:** 淹没颜色，十六进制颜色，例如："#4e81bb"

### `floodSpeed`

- **类型:** `Number`
- **默认值:** `30`
- **侦听属性**
- **描述:** 淹没速度

### `specularIntensity`

- **类型:** `Number`
- **默认值:** `1`
- **侦听属性**
- **描述:** 反射光线强度

### `amplitude`

- **类型:** `Number`
- **默认值:** `10`
- **侦听属性**
- **描述:** 水波高度

### `animationSpeed`

- **类型:** `Number`
- **默认值:** `0.01`
- **侦听属性**
- **描述:** 水纹速度

### `frequency`

- **类型:** `Number`
- **默认值:** `1000`
- **侦听属性**
- **描述:** 水纹频率

## 方法

### `startAnalyse`

- **Description:** 开始洪水淹没分析

### `stopAnalyse`

- **Description:** 停止洪水淹没分析

### `up`

- **Description:** 上升洪水水平面，最高为 maxHeight

### `down`

- **Description:** 下降洪水水平面，最低为 minHeight

### `pause`

- **Description:** 暂停降洪水水平面的上升或下降

### `playAnalyse(start,end,forward,rate,timeDiff)`

- **Description:** 自定义水平面上升或下降
- **param:** <br/>
  > start: 上升或下降的起始位置，即最高点的位置
  > end: 上升或下降的结束位置，即最低点的位置
  > forward: 升降的方向，上升为数字 1，下降为数字-1
  > rate: 刷新频率，默认不用传
  > timeDiff: Cesium 与浏览器时间倍数，默认不用传

## 事件

### `@load`

- **Description:** 在 Flood 加载完毕后发送该事件
- **Payload** `{ Flood }`
- `Flood` Flood 对象

## 洪水分析使用方法

```vue
<template>
  <mapgis-web-scene
    libPath="cesium/Cesium.js"
    pluginPath="cesium/webclient-cesium-plugin.min.js"
  >
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="urlT"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSetID"
      :format="format"
      :tilingScheme="srs"
      :token="token"
    />
    <mapgis-3d-igs-terrain :url="url"></mapgis-3d-igs-terrain>
    <mapgis-3d-flood
      :startHeight="startHeight"
      :minHeight="minHeight"
      :currentHeight="currentHeight"
      :maxHeight="maxHeight"
      :floodColor="floodColor"
      :floodSpeed="floodSpeed"
      :specularIntensity="specularIntensity"
      :amplitude="amplitude"
      :animationSpeed="animationSpeed"
      :frequency="frequency"
    >
    </mapgis-3d-flood>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //地形url
      url: "http://localhost:6163/igs/rest/g3d/terrain",
      //天地图参数
      urlT: "http://t0.tianditu.gov.cn/img_c/wmts",
      tileMatrixSetID: "c",
      srs: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "f5347cab4b28410a6e8ba5143e3d5a35"
      },
      //初始淹没高度，淹没总高度为currentHeight - startHeight - minHeight
      startHeight: 0,
      //初始淹没点
      minHeight: 0,
      //当前淹没高度
      currentHeight: 0,
      //最大淹没高度
      maxHeight: 200,
      //淹没颜色
      floodColor: "#FFFF00",
      //洪水上涨速度
      floodSpeed: 30,
      //洪水反射光线强度
      specularIntensity: 1,
      //洪水水波高度
      amplitude: 10,
      //洪水水纹速度
      animationSpeed: 0.01,
      //洪水水纹频率
      frequency: 1000,
      //洪水分析组件对象
      floodAnalyse: undefined
    };
  },
  mounted() {
    //视点跳转
    window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
      let sceneManager = new window.CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      sceneManager.flyToEx(115, 30, {
        height: 100,
        heading: 30,
        pitch: -10,
        roll: 0
      });
    });
  }
};
</script>
```

## 自定义界面-插槽方式

```vue
<template>
  <mapgis-web-scene
    libPath="cesium/Cesium.js"
    pluginPath="cesium/webclient-cesium-plugin.min.js"
  >
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="urlT"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSetID"
      :format="format"
      :tilingScheme="srs"
      :token="token"
    />
    <mapgis-3d-igs-terrain :url="url"></mapgis-3d-igs-terrain>
    <mapgis-3d-flood
      :startHeight="startHeight"
      :minHeight="minHeight"
      :currentHeight="currentHeight"
      :maxHeight="maxHeight"
      :floodColor="floodColor"
      :floodSpeed="floodSpeed"
      :specularIntensity="specularIntensity"
      :amplitude="amplitude"
      :animationSpeed="animationSpeed"
      :frequency="frequency"
      @load="load"
    >
      <!--      这里是自定义的界面-->
      <div>
        <button @click="startAnalyse">开始分析</button>
        <button @click="stopAnalyse">停止分析</button>
      </div>
    </mapgis-3d-flood>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //地形url
      url: "http://localhost:6163/igs/rest/g3d/terrain",
      //天地图参数
      urlT: "http://t0.tianditu.gov.cn/img_c/wmts",
      tileMatrixSetID: "c",
      srs: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "f5347cab4b28410a6e8ba5143e3d5a35"
      },
      //初始淹没高度，淹没总高度为currentHeight - startHeight - minHeight
      startHeight: 0,
      //初始淹没点
      minHeight: 0,
      //当前淹没高度
      currentHeight: 0,
      //最大淹没高度
      maxHeight: 200,
      //淹没颜色
      floodColor: "#FFFF00",
      //洪水上涨速度
      floodSpeed: 30,
      //洪水反射光线强度
      specularIntensity: 1,
      //洪水水波高度
      amplitude: 10,
      //洪水水纹速度
      animationSpeed: 0.01,
      //洪水水纹频率
      frequency: 1000,
      //洪水分析组件对象
      floodAnalyse: undefined
    };
  },
  mounted() {
    //视点跳转
    window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
      let sceneManager = new window.CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      sceneManager.flyToEx(115, 30, {
        height: 100,
        heading: 30,
        pitch: -10,
        roll: 0
      });
    });
  },
  methods: {
    //洪水分析组件加载完毕事件
    load(floodAnalyse) {
      this.floodAnalyse = floodAnalyse;
    },
    //开始洪水分析
    startAnalyse() {
      this.floodAnalyse.startAnalyse();
    },
    //停止洪水分析
    stopAnalyse() {
      this.floodAnalyse.stopAnalyse();
    }
  }
};
</script>
```
