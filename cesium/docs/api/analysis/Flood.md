> mapgis-3d-analysis-flood

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:** mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `(Math.random() * 100000000).toFixed(0)`随机计算值
- **描述:** 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `startHeight`

- **类型:** `Number`
- **可选**
- **默认值:** `0`
- **侦听属性**
- **描述:** 洪水淹没水体起始高度

### `minHeight`

- **类型:** `Number`
- **可选**
- **默认值:** `0`
- **非侦听属性**
- **描述:** 淹没动画高度起始点

### `maxHeight`

- **类型:** `Number`
- **可选**
- **默认值:** `2000`
- **侦听属性**
- **描述:** 最大淹没高度，淹没动画高度终止点

### `floodColor`

- **类型:** `String`
- **可选**
- **默认值:** `rgba(149,232,249,0.5)`
- **侦听属性**
- **描述:** 洪水颜色

### `floodSpeed`

- **类型:** `Number`
- **可选**
- **默认值:** `500`
- **侦听属性**
- **描述:** 洪水淹没速度，单位 米/秒

### `specularIntensity`

- **类型:** `Number`
- **可选**
- **默认值:** `2`
- **非侦听属性**
- **描述:** 反射光线强度

### `amplitude`

- **类型:** `Number`
- **可选**
- **默认值:** `10`
- **非侦听属性**
- **描述:** 水波高度

### `animationSpeed`

- **类型:** `Number`
- **可选**
- **默认值:** `0.01`
- **非侦听属性**
- **描述:** 水纹速度

### `frequency`

- **类型:** `Number`
- **可选**
- **默认值:** `500`
- **非侦听属性**
- **描述:** 水纹频率

## 方法

### `analysis`

- **Description:** 洪水淹没分析

### `remove`

- **Description:** 移除洪水淹没分析对象，移除洪水淹没分析结果。

### `refresh`

- **Description:** 重新计算，分析区域不变，修改设置参数后，重新进行分析。

## 事件

### `@load`

- **Description:** 在 Flood 加载完毕后发送该事件
- **Payload** 洪水淹没分析对象

## 示例

### 非插槽方式

```vue
<template>
  <mapgis-web-scene style="{height: '100vh'}" v-on:load="handleLoad">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true" />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-analysis-flood
        :startHeight="startHeight"
        :minHeight="minHeight"
        :maxHeight="maxHeight"
        :floodColor="floodColor"
        :floodSpeed="floodSpeed"
        :specularIntensity="specularIntensity"
        :amplitude="amplitude"
        :animationSpeed="animationSpeed"
        :frequency="frequency"
      />
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      //地形url TODO这里地址打包的时候改一下
      terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029"
      },
      startHeight: 0,
      minHeight: 0,
      maxHeight: 2000,
      floodColor: "rgba(149,232,249,0.5)",
      floodSpeed: 500,
      specularIntensity: 2,
      amplitude: 10,
      animationSpeed: 0.01,
      frequency: 500
    };
  },
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
      const { webGlobe } = component;
      webGlobe.viewer.camera.setView({
        direction: {
          x: 0.4680575394156845,
          y: -0.8267033643312148,
          z: 0.31222377744109403
        },
        position: {
          x: -674271.5790185562,
          y: 5530042.656916835,
          z: 3232882.3357299212
        }
      });
      //构造视图功能管理对象（视图）
      var sceneManager = new CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      sceneManager.flyToEx(121, 24, {
        height: 5900,
        heading: 60,
        pitch: -16,
        roll: 0
      });
    }
  }
};
</script>
```

## 自定义界面-插槽方式

```vue
<template>
  <mapgis-web-scene style="{height: '100vh'}" v-on:load="handleLoad">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true" />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-analysis-flood
        :startHeight="startHeight"
        :minHeight="minHeight"
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
          <button @click="analysis">分析</button>
          <button @click="remove">清除</button>
        </div>
      </mapgis-3d-analysis-flood>
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      //地形url TODO这里地址打包的时候改一下
      terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029"
      },
      startHeight: 0,
      minHeight: 0,
      maxHeight: 2000,
      floodColor: "rgba(149,232,249,0.5)",
      floodSpeed: 500,
      specularIntensity: 2,
      amplitude: 10,
      animationSpeed: 0.01,
      frequency: 500,
      floodAnalysis: null
    };
  },
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
      const { webGlobe } = component;
      webGlobe.viewer.camera.setView({
        direction: {
          x: 0.4680575394156845,
          y: -0.8267033643312148,
          z: 0.31222377744109403
        },
        position: {
          x: -674271.5790185562,
          y: 5530042.656916835,
          z: 3232882.3357299212
        }
      });
      //构造视图功能管理对象（视图）
      var sceneManager = new CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      sceneManager.flyToEx(121, 24, {
        height: 5900,
        heading: 60,
        pitch: -16,
        roll: 0
      });
    },
    //洪水分析组件加载完毕事件
    load(floodAnalysis) {
      this.floodAnalysis = floodAnalysis;
    },
    //开始洪水淹没分析
    analysis() {
      this.floodAnalysis.analysis();
    },
    //移除洪水淹没分析
    remove() {
      this.floodAnalysis.remove();
    }
  }
};
</script>
```
