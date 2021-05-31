# Compare

## Props

### `beforeLayers`

- **类型:** `Array`
- **synced**
- **默认值:** `[]`
- **描述:** 卷帘左边图层的id，允许多个图层

### `afterLayers`

- **类型:** `Array`
- **synced**
- **默认值:** `[]`
- **描述:** 卷帘右边图层的id，允许多个图层

## Example

```vue
<template>
    <mapgis-web-scene>
        <mapgis-3d-arcgis-tile-layer :url="tileUrl" :id="tileId" />
        <mapgis-3d-arcgis-map-layer :url="mapUrl" :id="mapId" />
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
