> mapgis-3d-analysis-profile

<font style="color:red;fontsize=5px;">注意：必须在外部定义一个 div，并通过 echartsDivId 参数将 div 的 id 传入组件，用于显示剖面信息(echarts 图表)</font>

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

### `profileType`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `0`
- **描述:** 分析类型，0 代表地形，1 代表地形和模型兼容

### `polylineGroundColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgb(255,0,0)`
- **描述:** 剖切线颜色

### `samplePrecision`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `2`
- **描述:** 采样精度(采样间隔，平面距离，单位米，模型推荐为 0.2，地形推荐为 2)

### `showPolygon`

- **类型:** `Boolean`
- **可选**
- **侦听属性**
- **默认值:** `false`
- **描述:** 是否显示剖面

### `pointColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgb(0,255,0)`
- **描述:** 交互点颜色(关闭剖面的时候生效)

### `polyLineColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgb(0,255,0)`
- **描述:** 交互线颜色(开启剖面的时候生效)

### `polygonColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `rgb(0,0,255)`
- **描述:** 剖面颜色

### `polygonHeight`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `100`
- **描述:** 剖面高度

### `useMask`

- **类型:** `Boolean`
- **可选**
- **默认值:** `true`
- **非侦听属性**
- **描述:** 是否使用内置的遮罩层

### `echartsDivId`

- **类型:** `String`
- **必选**
- **非侦听属性**
- **描述:** 剖面信息显示容器的 id

### `echartsOptions`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **描述:** 二维剖面显示样式
- **默认值:**

```
 {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "line",
      lineStyle: {
        color: "#41aeff",
        type: "solid"
      }
    },
    confine: true, // 是否将 tooltip 框限制在图表的区域内。
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  title: {
    show: false
  },
  grid: {
    top: 25,
    left: 60,
    right: 20,
    bottom: 20,
    contentLabel: false
  },
  calculable: true,
  xAxis: [
    {
      show: false,
      type: "value",
      max: "dataMax"
    }
  ],
  yAxis: [
    {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#d9d9d9",
          type: "dotted"
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        formatter: value => {
          const texts = [];
          if (value > 999) {
            const text = (Number(value) / 1000).toFixed(2);
            texts.push(`${text}km`);
          } else {
            texts.push(`${parseInt(value)}m`);
          }
          return texts;
        }
      }
    }
  ],
  series: [
    {
      type: "line",
      smooth: true, // 建议地形平滑显示二维剖面，模型取消平滑
      itemStyle: {
        color: "#40a9ff"
      },
      markPoint: {
        symbol: "circle",
        symbolSize: 15,
        label: { position: "top" },
        data: [
          { type: "max", name: "最高点" },
          { type: "min", name: "最低点" }
        ]
      },
      areaStyle: {}
    }
  ]
}
```

## 方法

### `analysis`

- **Description:** 剖面分析

### `remove`

- **Description:** 移除剖面分析对象，移除剖面分析结果，关闭二维剖面显示

## 事件

### `@load`

- **Description:** 在 Profile 加载完毕后发送该事件
- **Payload** 剖面分析对象

### `@start`

- **Description:** 在剖面分析绘制完后,开始分析前发送该事件

### `@success`

- **Description:** 在剖面分析结束后发送该事件

### `@remove`

- **Description:** 在移除分析对象和分析结果后，发送该事件

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
    <mapgis-ui-card customPosition="top-right">
      <mapgis-3d-analysis-profile
        :profileType="profileType"
        :polygonHeight="polygonHeight"
        :polygonColor="polygonColor"
        :polyLineColor="polyLineColor"
        :pointColor="pointColor"
        :polylineGroundColor="polylineGroundColor"
        :showPolygon="showPolygon"
        :samplePrecision="samplePrecision"
        @success="success"
        @remove="remove"
      />
    </mapgis-ui-card>
    <mapgis-ui-window
      :visible.sync="profile2dVisible"
      :min-width="400"
      :max-height="250"
      anchor="bottom-left"
      title="剖面信息"
    >
      <div
        id="profileChart"
        style="width: 380px; height: 180px; float: right"
      ></div>
    </mapgis-ui-window>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "profile-example.vue",
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
      profileType: 0,
      polygonHeight: 100,
      polygonColor: "rgb(0,0,255)",
      polyLineColor: "rgb(0,255,0)",
      pointColor: "rgb(0,255,0)",
      polylineGroundColor: "rgb(255,0,0)",
      showPolygon: false,
      samplePrecision: 2,
      profile2dVisible: false
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
    success() {
      this.profile2dVisible = true;
    },
    remove() {
      this.profile2dVisible = false;
    }
  }
};
</script>
```

### 自定义界面-插槽方式

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
    <mapgis-3d-analysis-profile
      :profileType="profileType"
      :position="position"
      :polygonHeight="polygonHeight"
      :polygonColor="polygonColor"
      :polyLineColor="polyLineColor"
      :pointColor="pointColor"
      :polylineGroundColor="polylineGroundColor"
      :showPolygon="showPolygon"
      :samplePrecision="samplePrecision"
      @success="success"
      @load="load"
    >
      <!--      这里是自定义的界面-->
      <div>
        <button @click="analysis">分析</button>
        <button @click="remove">清除</button>
      </div>
    </mapgis-3d-analysis-profile>
    </mapgis-ui-card>
    <mapgis-ui-window
      :visible.sync="profile2dVisible"
      :min-width="400"
      :max-height="250"
      anchor="bottom-left"
      title="剖面信息"
    >
      <div
        id="profileChart"
        style="width: 380px; height: 180px; float: right"
      ></div>
    </mapgis-ui-window>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "profile-example.vue",
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
      position: "left",
      profileType: 0,
      polygonHeight: 100,
      polygonColor: "rgb(0,0,255)",
      polyLineColor: "rgb(0,255,0)",
      pointColor: "rgb(0,255,0)",
      polylineGroundColor: "rgb(255,0,0)",
      showPolygon: false,
      samplePrecision: 2,
      profileAnalysis: null,//剖面分析组件对象
      profile2dVisible:false //显示剖面信息
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
    //剖面分析组件加载完毕事件
    load(profileAnalysis) {
      this.profileAnalysis = profileAnalysis;
    },
    //开始剖面分析
    analysis() {
      this.profileAnalysis.analysis();
    },
    //移除剖面分析
    remove() {
      this.profileAnalysis.remove();
      this.profile2dVisible = false;
    },
    success() {
      this.profile2dVisible = true;
    }
  }
};
</script>
```
