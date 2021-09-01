# 卷帘组件

> mapgis-3d-compare

## 属性

### `beforeLayers`

- **类型:** `Array`
- **侦听属性**
- **默认值:** `[]`
- **描述:** 卷帘左边图层的 id，允许多个图层

### `afterLayers`

- **类型:** `Array`
- **侦听属性**
- **默认值:** `[]`
- **描述:** 卷帘右边图层的 id，允许多个图层

### `vueKey`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

## 示例

::: demo

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
      afterLayers: ["fhjoghjgfjhg"]
    };
  }
};
</script>
```

:::
