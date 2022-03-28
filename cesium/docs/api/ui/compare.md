# 卷帘组件

> mapgis-3d-compare

## 属性

| 名称         | 类型   | 默认值  | 描述                                                                                                                                                                                                                          | 是否监听 |
| ------------ | ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| beforeLayers | Array  | []      | 卷帘左边图层的 id，允许多个图层                                                                                                                                                                                               | 是       |
| afterLayers  | Array  | []      | 卷帘右边图层的 id，允许多个图层                                                                                                                                                                                               | 是       |
| vueKey       | String | default | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | 否       |
| vueIndex     | Number |         | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。                                                                                                                 | 否       |

## 示例

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-arcgis-tile-layer :baseUrl="tileUrl" :id="tileId" />
    <mapgis-3d-arcgis-map-layer :baseUrl="mapUrl" :id="mapId" />
    <mapgis-3d-compare
      :beforeLayers="beforeLayers"
      :afterLayers="afterLayers"
    ></mapgis-3d-compare>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      tileUrl:
        "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      tileId: "asdasdasdsafasf",
      mapUrl:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
      mapId: "fhjoghjgfjhg",
      beforeLayers: ["asdasdasdsafasf"],
      afterLayers: ["fhjoghjgfjhg"],
    };
  },
};
</script>
```
