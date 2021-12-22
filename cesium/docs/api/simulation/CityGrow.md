# 城市生长
> mapgis-3d-city-grow

<font style="color:red;fontsize=5px;"> 注意：</font>由于三维底层支持原因，目前仅支持二维矢量文档形式的数据。
数据中必须包含的字段有开始时间字段（时间戳格式）、结束时间字段（时间戳形式）以及表示高程的字段。

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
- **描述:** 播放条面板的宽度
- **默认值:** 500

### `baseUrl`
- **类型:** `String`
- **非侦听属性**
- **描述:** 二维矢量文档形式的url
- **默认值:**  服务基地址：发布的二维文档地址， eg：二维地图文档地址：http://[host]:[port]/igs/rest/mrfs/docs/{docName}/mapIndex/LayerIndex。


### autoReset

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **描述:** 视角是否自动切换到地图文档范围。

### filter

- **类型:** `Object|Array`
- **可选**
- **侦听属性**
- **描述:** 过滤条件数组对象，空对象则默认无过滤。
- **示例:**
  ```json
      filter: {
             where: 'OBJECTID>500'
       }
  ```

### featureStyle

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 矢量地图文档对应图层做城市生长的style 样式对象,
  featureStyle对象中包括以下属性：

| Name         | Type   | Default | Description                                                                                                                                     |
| :----------- | :----- | :------------------------| :---------------------------------------------------------------------------------------------------------------------- |
| startTimeField        | String | 'startTime' | 矢量文档数据中的建筑生长开始时间字段名。                 |
| endTimeField        | String | 'endTime' | 矢量文档数据中的建筑生长结束时间字段名。                     |
| heightField         | String | 'height' | 矢量文档数据中的建筑用作高程的属性字段名称，不设置则高程为零 |
| heightRatio         | Number | 1 | 建筑生长高程的缩放比例 |
| startTime        | Number |  | 城市建筑生长的起始时间（）                     |
| endTime        | Number |  | 城市建筑生长的结束时间（）                          |
| colors | Array | ["#fff0f6","#ff85c0","#eb2f96"] | 城市生长的颜色设置 |
| displayWithTile        | Boolean | false | Line或Tile 根据时间线性加载(false)或网格动态加载(true)，适用不同的数据量展示，默认为线性加载。1. Line：线性加载，是指依照时间段进行加载，每个时间段的加载量由buildingLimit来限制；2.Tile：网格动态加载，是指内部逻辑实现根据当前视角距离计算满足显示精度的瓦片，并请求加载数据渲染城市建筑。                                                                                                                 |
| growTime         | Number | 60 |城市生长的总播放时长，单位秒。                  |
| buildingsLimit | Number |400 |线性加载时每一时段的矢量要素数量限制    |
| updateInterval | Number | 1 | 城市生长过程中建筑物颜色和高度更新间隔，默认1s更新一次|


### `tileFeaturesCount`
- **类型:** `Number`
- **非侦听属性**
- **描述:** 网格加载时请求的矢量要素数量
- **默认值:** 400

## 方法

### `startGrow`

- **Description:** 开启城市生长

### `stopGrow`

- **Description:** 暂停城市生长

## 事件

### `loaded`
- **Description:** 在 城市生长 加载完毕后发送该事件
- **Payload** 城市生长组件对象

### `CityGrow`

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
      baseUrl:"http://192.168.21.192:6163/igs/rest/mrfs/docs/shengZhenBaiMo/0/0",
      featureStyle:{
        startTimeField:"startTime",
        endTimeField:"endTime",
        heightField:"height",
        startTime: 1068543416,
        endTime: 1636639287,
        heightScale:3.0,
      }
    }
  },
  methods: {
  },
};
</script>
```
