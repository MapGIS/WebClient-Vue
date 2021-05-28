export { default as MapgisWebScene } from "../../cesium/src/components/WebGlobe/WebGlobe.vue";

// 工具
export { default as Mapgis3dState } from "../../cesium/src/components/UI/Controls/State/StateControl.vue";
export { default as Mapgis3dLink } from "../../cesium/src/components/UI/Controls/Link/Link.vue";
export { default as Mapgis3dDraw } from "../../cesium/src/components/UI/Controls/Draw/Draw";
export { default as Mapgis3dCompare } from "../../cesium/src/components/UI/Controls/Compare/Compare.vue";

// 影像
export { default as Mapgis3dImageryLayer } from "../../cesium/src/components/Provider/ImageProvider/ImageryLayer.vue";
export { default as Mapgis3dIgsDocLayer } from "../../cesium/src/components/Layer/IGServer/IgsDocLayer.vue";
export { default as Mapgis3dIgsTileLayer } from "../../cesium/src/components/Layer/IGServer/IgsTileLayer.vue";
export { default as Mapgis3dRasterLayer } from "../../cesium/src/components/Layer/RasterTile/BaseRasterLayer.vue";
export { default as Mapgis3dOgcWmtsLayer } from "../../cesium/src/components/Layer/OGC/OGCWMTSLayer.vue";
export { default as Mapgis3dOgcWmsLayer } from "../../cesium/src/components/Layer/OGC/OGCWMSLayer.vue";

// 矢量瓦片
export { default as Mapgis3dVectortileLayer } from "../../cesium/src/components/Layer/VectorTile/VectorTileLayer.vue";

// 模型
export { default as Mapgis3dFileM3d } from "../../cesium/src/components/M3D/M3dFile.vue";
export { default as Mapgis3dIgsM3d } from "../../cesium/src/components/M3D/M3d.vue";
export { default as Mapgis3dTileset } from "../../cesium/src/components/M3D/3dTileset.vue";

export { default as Mapgis3dPopup } from "../../cesium/src/components/UI/Popup/Popup.vue";
// export { default as { MapvLayer }} from "../../cesium/src/components/Overlay";

export { default as Mapgis3dTerrainProvider } from "../../cesium/src/components/Provider/TerrainProvider/TerrainProvider.vue";

// 数据源
export { default as Mapgis3dGeoJsonDataSource } from "../../cesium/src/components/DataSource/Geojson/GeoJsonDataSource.vue";
export { default as Mapgis3dCzmlDataSource } from "../../cesium/src/components/DataSource/Czml/CzmlDataSource";

//三维空间分析
export { default as Mapgis3dViewshed } from "../../cesium/src/components/Analysis/Viewshed.vue";
export { default as Mapgis3dSightline } from "../../cesium/src/components/Analysis/Sightline.vue";