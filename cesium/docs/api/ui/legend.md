# 图例

> mapgis-3d-arcgis-legend

## 示例

```vue
<template>
    <mapgis-web-scene>
        <mapgis-3d-arcgis-tile-layer
            baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
        />
        <mapgis-3d-arcgis-map-layer
            baseUrl="http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer"
        />
        <mapgis-3d-arcgis-legend></mapgis-3d-arcgis-legend>
    </mapgis-web-scene>
</template>
```