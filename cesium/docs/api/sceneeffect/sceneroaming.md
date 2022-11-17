> mapgis-3d-scene-roaming

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

### `setting`

- **可选**
- **非侦听属性**
- 默认值

```json
{
  "speed": 10,
  "exHeight": 1,
  "heading": 90,
  "pitch": 0,
  "range": 1,
  "animationType": 1,
  "interpolationAlgorithm": "LagrangePolynomialApproximation",
  "isLoop": true,
  "showPath": true,
  "showInfo": true,
  "modelUrl": ""
}
```

- **描述:** 漫游参数设置

  | 参数                   | 类型    | 描述                                                                                                                                                                                                                                                                                                                                                      |
  | ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | speed                  | Number  | 漫游速度。默认 10m/s(10 米/秒) 特别提醒（漫游场景范围很大的时候，这个一定要设置大，比如飞机可能就是真实的几千米每秒 如果不按真实设置，会导致内部时间点插值过密，造成卡顿）。                                                                                                                                                                              |
  | exHeight               | Number  | 附加高程。默认 1                                                                                                                                                                                                                                                                                                                                          |
  | heading                | Number  | 航向角 （单位弧度）。默认 90                                                                                                                                                                                                                                                                                                                              |
  | pitch                  | Number  | 俯仰角 （单位弧度）。默认 0                                                                                                                                                                                                                                                                                                                               |
  | range                  | Number  | 视角高度。默认 0                                                                                                                                                                                                                                                                                                                                          |
  | animationType          | Number  | 动画漫游的类型。默认 1。动画漫游的类型:1 跟随,2 锁定第一视角,3 上帝视角。场景漫游三个视角解释：跟随：相机视角不与漫游模型同时移动，可交互，方位角，俯仰角，距离不可设置，因为这三个参数的值的改变对场景没有影响；锁定第一视角：模拟本人漫游，可设置方位角，俯仰角，距离；上帝视角：从上空俯视漫游，俯仰角默认为-90，方位角默认为 90，方位角和距离可设置。 |
  | interpolationAlgorithm | String  | 插值算法 默认 LagrangePolynomialApproximation 拉格朗日 还有线性插值 LinearApproximation 埃尔米特插值插值 HermitePolynomialApproximation。                                                                                                                                                                                                                 |
  | isLoop                 | Boolean | 是否循环。 默认 true                                                                                                                                                                                                                                                                                                                                      |
  |                        |
  | showPath               | Boolean | 是否显示路径。默认 true                                                                                                                                                                                                                                                                                                                                   |
  | showInfo               | Boolean | 是否显示提示信息。默认 true                                                                                                                                                                                                                                                                                                                               |
  | modelUrl               | String  | 模型资源路径。默认"",可通过配置界面设置                                                                                                                                                                                                                                                                                                                   |

### `models`

- **类型:** `Array`
- **可选**
- **非侦听属性**
- **默认值:** []
- **描述:** 模型数组， 示例：[{label: "人",value: "./CesiumModels/Cesium_Man.glb",},{label: "卡车",value: "./CesiumModels/CesiumMilkTruck.glb",},{label: "飞机",value: "./CesiumModels/Cesium_Air.gltf",}]

### `paths`

- **类型:** `Array`
- **可选**
- **非侦听属性**
- **默认值:** []
- **描述:** 路径数据数组

## 方法

### `onAddPathStart`

- **Description:** 新增路线

### `onAddPathComplete`

- **Description:** 新路线增加完成。

### `onAddPathCancel`

- **Description:** 取消新路线增加。

### `onGotoPath`

- **Description:** 进入指定路径设置界面。
- **Param:** `{path}`
- `path` 路径对象

### `onDeletePath`

- **Description:** 删除指定路径。
- **Param:** `{path}`
- `path` 路径对象

### `onGotoHome`

- **Description:** 返回主页。

### `onGetPathRoaming`

- **Description:** 获取单个路径漫游组件对象。
- **Payload** 单个路径漫游组件对象

## 事件

### `@load`

- **Description:** 在 场景漫游组件 加载完毕后发送该事件
- **Payload** 场景漫游组件对象

### `@unload`

- **Description:** 在 场景漫游组件 销毁时发送该事件
- **Payload** 场景漫游组件对象

### `@save-paths`

- **Description:** 点击保存按钮发送该事件
- **Payload** paths 路径数据对象

## 示例

```vue
<template>
  <mapgis-web-scene style="{height: '100vh'}">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-igs-m3d
      :autoReset="autoReset"
      :maximumScreenSpaceError="maximumScreenSpaceError"
      :url="m3dUrl"
    />
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-scene-roaming :setting="setting" :models="models" />
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "sceneroaming",
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029"
      },
      setting: {
        speed: 10,
        exHeight: 1,
        heading: 90,
        pitch: 0,
        range: 1,
        animationType: 1,
        interpolationAlgorithm: "LagrangePolynomialApproximation",
        isLoop: true,
        showPath: true,
        showInfo: true,
        modelUrl: ""
      },
      models: [
        {
          label: "人",
          value: "./CesiumModels/Cesium_Man.glb"
        },
        {
          label: "卡车",
          value: "./CesiumModels/CesiumMilkTruck.glb"
        },
        {
          label: "飞机",
          value: "./CesiumModels/Cesium_Air.gltf"
        }
      ]
    };
  },
  methods: {}
};
</script>
```
