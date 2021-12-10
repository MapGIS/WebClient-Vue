# 城市生长
> mapgis-3d-city-grow

<font style="color:red;fontsize=5px;"> 注意：</font>由于三维底层支持原因，目前仅支持矢量文档形式的数据。

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

### `width`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:** 播放条的宽度
- **默认值:** 500

### `baseUrl`
- **类型:** `String`
- **非侦听属性**
- **描述:** 二维矢量文档形式的url
- **默认值:** ''

### `displayWithTile`
- **类型:** `Boolean`
- **非侦听属性**
- **描述:** Line|Tile 根据时间线性加载(false)或网格动态加载(true)，适用不同的数据量展示，默认为线性加载。
           Line：线性加载，是指依照时间段进行加载，每个时间段的加载量由buildingLimit来限制；
           Tile：网格动态加载，是指内部逻辑实现根据当前视角距离计算满足显示精度的瓦片，并请求加载数据渲染城市建筑。
- **默认值:** false

### `buildingsLimit`
- **类型:** `Number`
- **非侦听属性**
- **描述:** 线性加载时每一时段的矢量要素数量限制
- **默认值:** 400

### `tileFeaturesCount`
- **类型:** `Number`
- **非侦听属性**
- **描述:** 网格加载时请求的矢量要素数量
- **默认值:** 400

### `updateInterval`
- **类型:** `Number`
- **非侦听属性**
- **描述:** 城市生长过程中建筑物颜色和高度更新间隔，默认1s更新一次
- **默认值:** 1

### `growTime`
- **类型:** `Number`
- **非侦听属性**
- **描述:** 城市生长的总播放时长
- **默认值:** 60

### `startTime`
- **类型:** `Number`
- **必传**
- **非侦听属性**
- **描述:** 城市建筑生长的起始时间

### `endTime`
- **类型:** `Number`
- **必传**
- **非侦听属性**
- **描述:** 城市建筑生长的截止时间

### `startTimeField`
- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 矢量文档数据中的建筑开始时间字段名

### `heightField`
- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 矢量文档数据中的建筑用作高程的属性字段名称，不设置则高程为零

### `heightRatio`
- **类型:** `Number`
- **必传**
- **非侦听属性**
- **描述:** 矢量文档数据中的建筑用作高程的高程放缩比例，默认 1.0


### `endTimeField`
- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 矢量文档数据中的建筑结束时间字段名

### `buildingcolors`
- **类型:** `Array`
- **非侦听属性**
- **描述:** 城市生长的颜色设置
- **默认值:** ["#fff0f6", "#ff85c0", "#eb2f96"]

## 方法

### `startGrow`

- **Description:** 开启城市生长

### `stopGrow`

- **Description:** 暂停城市生长

## 事件

### `@CityGrow`

- **Description:** 在 开始城市生长 加载完毕后发送该事件
- **Payload** 城市生长图层 对象

## 示例

```vue
<template>
  <mapgis-web-scene style="height:95vh"
                    v-on:load="handleLoad">
    <mapgis-rastertile-layer v-if="false" layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-city-grow ref="citygrow"  v-bind="$props" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      baseUrl:"http://192.168.88.204:6163/igs/rest/mrfs/docs/SZ2",
      heightField:'height',
      heightScale:3.0,
      width: 600,
      startTime: 1068543416,
      endTime: 1636639287,
      startTimeField: 'startTime',
      endTimeField: 'endTime'
    }
  },
  methods: {
  },
};
</script>
```
