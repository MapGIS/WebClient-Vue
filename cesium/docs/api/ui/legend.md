# 图例

> mapgis-3d-arcgis-legend

## 示例

```vue
<template>
    <mapgis-web-scene>
        <mapgis-3d-arcgis-tile-layer
            :baseUrl="baseUrl"
        />
        <mapgis-3d-arcgis-map-layer
            :baseUrl="baseUrl2"
        />
        <mapgis-3d-arcgis-legend></mapgis-3d-arcgis-legend>
    </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
      baseUrl2:"http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer"
    };
  }
};
</script>
```
