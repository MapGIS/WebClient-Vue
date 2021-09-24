> mapgis-3d-analysis-cut-fill

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

### `xPaneNum`

- **类型:** `Number`
- **可选**
- **默认值:** `16`
- **侦听属性**
- **描述:** X 坐标方向采样点的个数

### `yPaneNum`

- **类型:** `Number`
- **可选**
- **默认值:** `16`
- **侦听属性**
- **描述:** Y 坐标方向采样点的个数

### `height`

- **类型:** `Number`
- **可选**
- **默认值:** `2000`
- **侦听属性**
- **描述:** 平整高程

### `lineColor`

- **类型:** `String`
- **可选**
- **默认值:** `rgba(0,255,0,1)`
- **侦听属性**
- **描述:** 分析区域边界颜色

### `fillColor`

- **类型:** `String`
- **可选**
- **默认值:** `rgba(0,0,255,0.3)`
- **侦听属性**
- **描述:** 分析区域面颜色

### `dataType`

- **类型:** `Number`
- **可选**
- **默认值:** `2.0`
- **非侦听属性**
- **描述:** 数据类型,0.0：地形，1.0：模型，2.0：通用

## 方法

### `analysis`

- **Description:** 填挖方分析

### `remove`

- **Description:** 移除填挖方分析对象，移除填挖方分析结果。

### `refresh`

- **Description:** 重新计算，分析区域不变，修改设置参数后，重新进行分析。

## 事件

### `@load`

- **Description:** 在 CutFill 加载完毕后发送该事件
- **Payload** 填挖方分析对象

### `@start`

- **Description:** 在绘制结束后，开始分析前发送该事件

### `@success`

- **Description:** 在分析结束后发送该事件
- **Payload** 分析结果{minHeight,maxHeight,surfaceArea,cutVolume,fillVolume}

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
      <mapgis-3d-analysis-cut-fill
        :xPaneNum="xPaneNum"
        :yPaneNum="yPaneNum"
        :height="height"
        :lineColor="lineColor"
        :fillColor="fillColor"
        :dataType="dataType"
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
      xPaneNum: 16,
      yPaneNum: 16,
      height: 2000,
      lineColor: "rgba(0,255,0,1)",
      fillColor: "rgba(0,0,255,0.3)",
      dataType: 2.0
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
      <mapgis-3d-analysis-cut-fill
        :xPaneNum="xPaneNum"
        :yPaneNum="yPaneNum"
        :height="height"
        :lineColor="lineColor"
        :fillColor="fillColor"
        :dataType="dataType"
        @load="load"
        @success="success"
      >
        <!--      这里是自定义的界面-->
        <div>
          <button @click="analysis">分析</button>
          <button @click="remove">清除</button>
        </div>
      </mapgis-3d-analysis-cut-fill>
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
      xPaneNum: 16,
      yPaneNum: 16,
      height: 2000,
      lineColor: "rgba(0,255,0,1)",
      fillColor: "rgba(0,0,255,0.3)",
      dataType: 2.0,
      cutfillAnalyse: null
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
    //填挖方分析组件加载完毕事件
    load(cutfillAnalyse) {
      this.cutfillAnalyse = cutfillAnalyse;
    },
    //开始填挖方分析
    analysis() {
      this.cutfillAnalyse.analysis();
    },
    //移除填挖方分析
    remove() {
      this.cutfillAnalyse.remove();
    },
    //分析结束事件
    success(result) {
      console.log(result);
    }
  }
};
</script>
```
