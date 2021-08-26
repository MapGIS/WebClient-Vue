# Fill

## 属性

### `height`

- **类型:** `Number`
- **默认值:** `100`
- **侦听属性**
- **描述:** 填方或挖方的起始高度，挖方从下往上挖，填方从上往下填

### `xPaneNum`

- **类型:** `Number`
- **默认值:** `16`
- **侦听属性**
- **描述:** x方向采样个数，数值越大，计算的值越准确

### `yPaneNum`

- **类型:** `Number`
- **默认值:** `16`
- **侦听属性**
- **描述:** y方向采样个数，数值越大，计算的值越准确

### `color`

- **类型:** `String`
- **默认值:** `#398167`
- **侦听属性**
- **描述:** 填挖方墙体颜色，与css的color属性一致，使用16进制颜色

### `opacity`

- **类型:** `Number`
- **默认值:** `0.7`
- **侦听属性**
- **描述:** 填挖方墙体透明度，与css的opacity属性一致

##方法

### `startAnalyse`
- **Description:** 开始填挖方分析
- **Param:** `{type,height,xPaneNum,yPaneNum}`
- `type` 可选，分析类型，cut：开挖分析，fill：填方分析
- `height` 可选，填方或挖方的起始高度，挖方从下往上挖，填方从上往下填
- `xPaneNum` 可选，x方向采样个数，数值越大，计算的值越准确
- `yPaneNum` 可选，y方向采样个数，数值越大，计算的值越准确

### `stopAnalyse`
- **Description:** 清除填挖方分析

## 事件

### `@loaded`

- **Description:** 填挖方组件加载完毕事件
- **Payload** `{ Fill }`
- `Fill` 填挖方组件对象

### `@analysed`

- **Description:** 在填挖方分析完毕后发送该事件
- **Payload** `{ result }`
- `result` 分析结果

### `@analyseStoped`

- **Description:** 在清除填挖方分析后发送该事件

## 填挖方分析使用方法

```vue
<template>
  <mapgis-web-scene
    libPath="cesium/Cesium.js"
    pluginPath="cesium/webclient-cesium-plugin.min.js"
    v-on:load="handleLoad"
  >
    <mapgis-3d-ogc-wmts-layer
            :baseUrl="url"
            :wmtsLayer="layer"
            :tileMatrixSet="tileMatrixSet"
            :format="format"
            :tilingScheme="tilingScheme"
            :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-terrain-provider :url="terrainUrl" :v-if="showTerrain"></mapgis-3d-terrain-provider>
    <mapgis-3d-cut-fill></mapgis-3d-cut-fill>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      terrainUrl: '',
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer:"img",
      format: "tiles",
      token:{
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      },
      showTerrain: false
    };
  },
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE';
      const { webGlobe } = component;
      webGlobe.viewer.camera.setView({
        direction: { x: 0.4680575394156845, y: -0.8267033643312148, z: 0.31222377744109403 },
        position: { x: -674271.5790185562, y: 5530042.656916835, z: 3232882.3357299212 }
      });
      //构造视图功能管理对象（视图）
      var sceneManager = new CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      sceneManager.flyToEx(94.73761648879076, 29.44177452960854, {
        height: 5900,
        heading: 60,
        pitch: -16,
        roll: 0
      });
      this.terrainUrl = new Cesium.IonResource.fromAssetId(1);
      this.showTerrain = true;
    }
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
            :baseUrl="url"
            :wmtsLayer="layer"
            :tileMatrixSet="tileMatrixSet"
            :format="format"
            :tilingScheme="tilingScheme"
            :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-terrain-provider :url="terrainUrl" :v-if="showTerrain"></mapgis-3d-terrain-provider>
    <mapgis-3d-cut-fill
      @loaded="loaded"
    >
      <div>
        <button @click="startAnalyse">开始分析</button>
        <button @click="stopAnalyse">结束分析</button>
      </div>
    </mapgis-3d-cut-fill>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      terrainUrl: '',
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer:"img",
      format: "tiles",
      token:{
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      },
      showTerrain: false,
      analyse: undefined
    };
  },
  methods: {
    loaded(analyse){
      this.analyse = analyse;
    },
    startAnalyse(){
      //这里可自己指定分析类型、高度以及分析精度，如果不指定，则取prop中传入的，最后取默认值
      this.analyse.startAnalyse("cut",100,16,16);
    },
    stopAnalyse(){
      this.analyse.stopAnalyse();
    },
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE';
      const { webGlobe } = component;
      webGlobe.viewer.camera.setView({
        direction: { x: 0.4680575394156845, y: -0.8267033643312148, z: 0.31222377744109403 },
        position: { x: -674271.5790185562, y: 5530042.656916835, z: 3232882.3357299212 }
      });
      //构造视图功能管理对象（视图）
      var sceneManager = new CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer
      });
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      sceneManager.flyToEx(94.73761648879076, 29.44177452960854, {
        height: 5900,
        heading: 60,
        pitch: -16,
        roll: 0
      });
      this.terrainUrl = new Cesium.IonResource.fromAssetId(1);
      this.showTerrain = true;
    }
  }
};
</script>
```
