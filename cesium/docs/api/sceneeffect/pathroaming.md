> mapgis-3d-path-roaming

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

### `positions`

- **类型:** `Array`
- **可选**
- **非侦听属性**
- **默认值:** `[{ x: 114.40150642571967, y: 30.46598749322795, z: 7.771843648287394 },{ x: 114.40168198567844, y: 30.46658777743634, z: 7.77844677044535 },{ x: 114.40227628732939, y: 30.467054308914204, z: 7.629952007623256 },{ x: 114.40232362516146, y: 30.467591260922404, z: 7.87974370284682 }]`
- **描述:** 漫游路径坐标集合

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

### `onClickStartOrPauseOrResume`

- **Description:** 开始/暂停/继续漫游事件。

### `onClickStop`

- **Description:** 停止漫游。

### `onCheckBoxChange`

- **Description:** checkbox 勾选事件。（循环，显示路径，显示提示信息）。
- **Param:** `{val,key}`
- `val` checkbox 改变后的值
- `key` checkbox 对应的字段，循环(isLoop)，显示路径(showPath)，显示提示信息(showInfo)

### `onSpeedChange`

- **Description:** 更改速度。
- **Param:** `{val}`
- `val` 变更后的速度值

### `onEffectsChange`

- **Description:** 更改方位角/俯仰角。
- **Param:** `{val,key}`
- `val` 改变后的值
- `key` 修改对应的字段，方位角(heading)，俯仰角(pitch)

### `changeRange`

- **Description:** 更改距离。
- **Param:** `{val}`
- `val` 改变后的值

### `onTypeChange`

- **Description:** 切换插值方法
- **Param:** `{val}`
- `val` 改变后的值

### `onModelChange`

- **Description:** 切换模型
- **Param:** `{val}`
- `val` 改变后的值

## 事件

### `@load`

- **Description:** 在 pathroaming 组件 加载完毕后发送该事件
- **Payload** pathroaming 组件对象

### `@unload`

- **Description:** 在 pathroaming 组件 销毁发送该事件
- **Payload** pathroaming 组件对象

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
      <mapgis-3d-path-roaming
        :positions="positions"
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
      positions: [
        { x: 114.40150642571967, y: 30.46598749322795, z: 7.771843648287394 },
        { x: 114.40168198567844, y: 30.46658777743634, z: 7.77844677044535 },
        { x: 114.40227628732939, y: 30.467054308914204, z: 7.629952007623256 },
        { x: 114.40232362516146, y: 30.467591260922404, z: 7.87974370284682 }
      ],
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

### 插槽方式

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
      <mapgis-3d-path-roaming
        :positions="positions"
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
        @load="load"
      >
        <!--      这里是自定义的界面-->
        <div>
          <button @click="start">开始</button>
          <button @click="stop">停止</button>
        </div>
      </mapgis-3d-path-roaming>
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
      positions: [
        { x: 114.40150642571967, y: 30.46598749322795, z: 7.771843648287394 },
        { x: 114.40168198567844, y: 30.46658777743634, z: 7.77844677044535 },
        { x: 114.40227628732939, y: 30.467054308914204, z: 7.629952007623256 },
        { x: 114.40232362516146, y: 30.467591260922404, z: 7.87974370284682 }
      ],
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
  methods: {
    //坡向分析组件加载完毕事件
    load(pathroaming) {
      this.pathroaming = pathroaming;
    },
    //开始坡向分析
    start() {
      this.pathroaming.onClickStartOrPauseOrResume();
    },
    //移除坡向分析
    stop() {
      this.pathroaming.onClickStop();
    }
  }
};
</script>
```
