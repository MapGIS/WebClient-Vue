> mapgis-3d-dynamic-section

## 属性

### `models`

- **类型:** `Array`
- **可选**
- **默认值:** []
- **侦听属性**
- **描述:** 模型集合，一个模型对象包含三个字段：range，vueIndex 和 title

```javaScript
   [{
     range: {        // 模型包围盒范围
       xmin: -10000,
       xmax: 10000,
       ymin: -10000,
       ymax: 10000,
       zmin: -10000,
       zmax: 10000,
     },
     vueIndex: 1,   // 模型加载对应的vueIndex
     title: "钻孔_2_钻孔模型s", // 模型名
   }]
```

### `axis`

- **类型:** `String`
- **可选**
- **默认值:** `X`
- **侦听属性**
- **描述:** 坐标轴，可设置为 X，Y，Z

### `color`

- **类型:** `String`
- **可选**
- **默认值:** `rgba(200,200,200,0.5)`
- **侦听属性**
- **描述:** 剖切面颜色

### `time`

- **类型:** `Number`
- **可选**
- **默认值:** `10`
- **侦听属性**
- **描述:** 自动播放时间，单位秒

### `distance`

- **类型:** `Number`
- **可选**
- **默认值:** `0`
- **侦听属性**
- **描述:** 剖切距离，剖切面距离剖切对象包围盒中心点的距离

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

## 事件

### `@load`

- **Description:** 剖切分析组件对象加载完毕事件
- **Param:** `{DynamicSection}`
- `DynamicSection` 剖切分析组件对象

### `@unload`

- **Description:** 剖切分析组件对象移除事件
- **Param:** `{DynamicSection}`
- `DynamicSection` 剖切分析组件对象

### `@startClipping`

- **Description:** 开始剖切分析事件

### `@animation`

- **Description:** 开启动态剖切事件

### `@setDistance`

- **Description:** 设置剖切距离
- **Param:** `{distance}`
- `distance` 设置剖切距离，剖切面距离剖切对象包围盒中心点的距离

### `@stopClipping`

- **Description:** 停止剖切分析事件

## 插槽

### `default`

- **Description:** 覆盖插槽即可重写界面

## 剖切分析使用方法

```vue
<template>
  <mapgis-web-scene style="height: 95vh" v-on:load="handleLoad">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true" />
    <mapgis-3d-m3d-layer :vueIndex="$props.models[0].vueIndex" :url="m3dUrl1" />
    <mapgis-3d-m3d-layer :vueIndex="$props.models[1].vueIndex" :url="m3dUrl2" />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-dynamic-section
        :models="models"
        :axis="axis"
        :color="color"
        :time="time"
        :distance="distance"
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
      //terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
      terrainUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/terrain",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      },
      m3dUrl1: "http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s",
      m3dUrl2:
        "http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent",
      models: [
        {
          range: {
            xmin: -10000,
            xmax: 10000,
            ymin: -10000,
            ymax: 10000,
            zmin: -10000,
            zmax: 10000
          },
          vueIndex: 1,
          title: "钻孔_2_钻孔模型s"
        },
        {
          range: {
            xmin: -10000,
            xmax: 10000,
            ymin: -10000,
            ymax: 10000,
            zmin: -10000,
            zmax: 10000
          },
          vueIndex: 2,
          title: "钻孔分层点"
        }
      ],
      axis: "X",
      color: "rgb(200,200,200,0.5)",
      time: 10,
      distance: 0
    };
  },
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
    }
  }
};
</script>
```

## 自定义界面-插槽方式

```vue
<template>
  <mapgis-web-scene style="height: 95vh" v-on:load="handleLoad">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true" />
    <mapgis-3d-m3d-layer :vueIndex="$props.models[0].vueIndex" :url="m3dUrl1" />
    <mapgis-3d-m3d-layer :vueIndex="$props.models[1].vueIndex" :url="m3dUrl2" />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-dynamic-section
        :models="models"
        :axis="axis"
        :color="color"
        :time="time"
        :distance="distance"
        @loaded="loaded"
      >
        <div>
          <!--自定义您的界面-->
          自定义您的界面
          <button @click="start">开始剖切</button>
        </div>
      </mapgis-3d-dynamic-section>
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      //地形url TODO这里地址打包的时候改一下
      //terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
      terrainUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/terrain",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "9c157e9585486c02edf817d2ecbc7752"
      },
      m3dUrl1: "http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s",
      m3dUrl2:
        "http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent",
      dynamicSection: undefined,
      models: [
        {
          range: {
            xmin: -10000,
            xmax: 10000,
            ymin: -10000,
            ymax: 10000,
            zmin: -10000,
            zmax: 10000
          },
          vueIndex: 1,
          title: "钻孔_2_钻孔模型s"
        },
        {
          range: {
            xmin: -10000,
            xmax: 10000,
            ymin: -10000,
            ymax: 10000,
            zmin: -10000,
            zmax: 10000
          },
          vueIndex: 2,
          title: "钻孔分层点"
        }
      ],
      axis: "X",
      color: "rgb(200,200,200,0.5)",
      time: 10,
      distance: 0
    };
  },
  methods: {
    load(dynamicSection) {
      this.dynamicSection = dynamicSection;
    },
    start() {
      this.dynamicSection.startClipping();
    },
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
    }
  }
};
</script>
```
