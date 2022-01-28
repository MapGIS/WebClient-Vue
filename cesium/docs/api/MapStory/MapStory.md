# MapStory

> mapgis-3d-map-story
> [点此跳转到示例](#example)

## 属性

### `dataSource`

- **类型:** `Array`
- **默认值:** ``
- **侦听属性**
- **描述:** 地图故事源数据，如下所示：[dataSource(点击跳转到说明文档)](#dataSource)

### `height`

- **类型:** `Number`
- **默认值:** `700`
- **侦听属性**
- **描述:** 地图故事面板高度

### `width`

- **类型:** `Array`
- **默认值:** `300`
- **侦听属性**
- **描述:** 地图故事面板宽度

### `enableOneMap`

- **类型:** `Boolean`
- **默认值:** `false`
- **侦听属性**
- **描述:** 是否为一张图模式，此模式下 UI 有所调整，不用一张图的项目可忽略

### `models`

- **类型:** `Object`
- **非侦听属性**
- **选填**
- **描述:** 模型信息对象，添加模型时使用，格式入下：[models(点击跳转到说明文档)](#modelObj)

## 事件

### `@storyPreview`

- **描述** 预览地图故事
- **Payload** `{ mapStoryData }`
- - `mapStoryData` 地图故事数据，预览功能默已经包含在地图故事里，当希望自己实现预览功能时，可使用此事件

### `@chapterPreview`

- **描述** 预览地图里的某一章节
- **Payload** `{ mapStoryData }`
- - `mapStoryData` 地图故事数据，预览功能默已经包含在地图故事里，当希望自己实现预览功能时，可使用此事件

### `@save`

- **描述** 保存地图故事
- **Payload** `{ mapStoryData }`
- - `mapStoryData` 地图故事数据

<span id="example">## 示例</span>

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-map-story
      @storyPreview="storyPreview"
      @chapterPreview="chapterPreview"
      @save="save"
      :dataSource="dataSource"
    />
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      dataSource: []
    };
  },
  methods: {
    storyPreview(mapStoryData) {},
    chapterPreview(mapStoryData) {},
    save(mapStoryData) {}
  }
};
</script>
<style lang="css"></style>
```

## 说明文档

<span id="dataSource">### `dataSource（地图故事数据源）`</span>

| 名称        | 类型                  | 默认值        | 描述                                         |
| ----------- | --------------------- | ------------- | -------------------------------------------- |
| title       | String                | 无标题        | 地图故事标题                                 |
| description | String                | 无            | 地图故事描述信息                             |
| uuid        | String                | Math.random() | 地图故事的 ID，默认随机数                    |
| map         | [map](#map)           | {}            | 与地图故事绑定的底图，每个故事绑定一个底图   |
| chapters    | [[chapter]](#chapter) | []            | 地图故事的章节数组，每个地图故事可有多个章节 |

<span id="map">### `map（地图故事底图）`</span>

| 名称          | 类型   | 默认值        | 描述                                                                                                              |
| ------------- | ------ | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| type          | String | 无            | 地图类型，分别为"WMTS","WMS","TILE"(IGS 瓦片),"DOC"(IGS 地图文档),"DYNAMIC"(IGS 矢量图层),"GeoJSON"(GeoJSON 数据) |
| baseUrl       | String | 无            | 基地址                                                                                                            |
| layer         | String | 无            | 图层名称                                                                                                          |
| tilingScheme  | String | 无            | 瓦片切片方式，支持"EPSG:4326","EPSG:4490","EPSG:4610","EPSG:4214","EPSG:3857"                                     |
| tileMatrixSet | String | 无            | 瓦片矩阵集                                                                                                        |
| format        | String | image/png     | 瓦片的请求返回格式，"image/png","tiles"等                                                                         |
| vueKey        | String | default       | vueKey，唯一标识一个 Cesium 球体，分屏时使用                                                                      |
| vueIndex      | String | Math.random() | vueIndex，唯一标识一个地图图层                                                                                    |

<span id="chapter">### `chapter（地图故事章节信息）`</span>

| 名称          | 类型              | 默认值        | 描述                               |
| ------------- | ----------------- | ------------- | ---------------------------------- |
| title         | String            | 无标题        | 章节标题                           |
| uuid          | String            | Math.random() | 章节 ID，默认随机数                |
| mapStoryUUID  | String            | Math.random() | 章节所对应的地图故事 ID            |
| animationTime | Number            | 5000          | 从当前章节播放到下一个章节所需时间 |
| content       | String            | 无            | 章节描述信息                       |
| features      | Array             | []            | 当前章节所包含的标绘要素           |
| camera        | [camera](#camera) | {}            | 当前章节所对应的相机视角           |

<span id="camera">### `camera（地图故事相机视角对象）`</span>

| 名称                           | 类型   | 默认值 | 描述             |
| ------------------------------ | ------ | ------ | ---------------- |
| heading                        | Number | 0      | 方向角，弧度制   |
| pitch                          | Number | 0      | 俯仰角，弧度制   |
| roll                           | Number | 0      | 滚动角，弧度制   |
| positionCartographic           | Object | {}     | 相机视角所在位置 |
| positionCartographic.longitude | Number | 0      | 经度             |
| positionCartographic.latitude  | Number | 0      | 纬度             |
| positionCartographic.height    | Number | 0      | 高程             |

<span id="modelObj">### `models（模型信息）`</span>

| 名称         | 类型   | 默认值 | 描述                 |
| ------------ | ------ | ------ | -------------------- |
| models       | Object | {}     | 模型分类对象         |
| models.img   | String | 无     | 模型缩略图的相对路径 |
| models.model | String | 无     | 模型的相对路径       |
