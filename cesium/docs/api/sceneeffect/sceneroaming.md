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

### `speed`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `10`
- **描述:** 漫游速度 默认 1m/s(1 米/秒) 特别提醒（漫游场景范围很大的时候，这个一定要设置大，比如飞机可能就是真实的几千米每秒 如果不按真实设置，会导致内部时间点插值过密，造成卡顿）。

### `exHeight`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `1`
- **描述:** 附加高程。

### `heading`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `90`
- **描述:** 航向角 （单位弧度）。

### `pitch`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `0`
- **描述:** 俯仰角 （单位弧度）。

### `range`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `0`
- **描述:** 视角高度。

### `animationType`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `1`
- **描述:** 动画漫游的类型:1 跟随,2 锁定第一视角,3 上帝视角。场景漫游三个视角解释：跟随：相机视角不与漫游模型同时移动，可交互，方位角，俯仰角，距离不可设置，因为这三个参数的值的改变对场景没有影响；锁定第一视角：模拟本人漫游，可设置方位角，俯仰角，距离；上帝视角：从上空俯视漫游，俯仰角默认为-90，方位角默认为 90，方位角和距离可设置。

### `interpolationAlgorithm`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `LagrangePolynomialApproximation`
- **描述:** 插值算法 默认 LagrangePolynomialApproximation 拉格朗日 还有线性插值 LinearApproximation 埃尔米特插值插值 HermitePolynomialApproximation。

### `isLoop`

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `true`
- **描述:** 是否循环。

### `showPath`

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `true`
- **描述:** 是否显示路径

### `showInfo`

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `true`
- **描述:** 是否显示提示信息

### `models`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `./CesiumModels/Cesium_Man.glb`
- **描述:** 模型

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

- **Description:** 在 场景漫游组件 销毁发送该事件
- **Payload** 场景漫游组件对象

## 示例

### 非插槽方式

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
      <mapgis-3d-scene-roaming
        :speed="speed"
        :exHeight="exHeight"
        :heading="heading"
        :pitch="pitch"
        :animationType="animationType"
        :interpolationAlgorithm="interpolationAlgorithm"
        :isLoop="isLoop"
        :showPath="showPath"
        :showInfo="showInfo"
        :models="models"
      />
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  name: "snowczm",
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
      speed: 10,
      exHeight: 1,
      heading: 90,
      pitch: 0,
      animationType: 1,
      interpolationAlgorithm: "LagrangePolynomialApproximation",
      isLoop: true,
      showPath: true,
      showInfo: true,
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
