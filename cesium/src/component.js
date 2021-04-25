export { default as MapgisWebScene } from "./components/WebGlobe/WebGlobe.vue";

// 工具
export { default as Mapgis3dState } from "./components/UI/Controls/State/StateControl.vue";
export { default as Mapgis3dLink } from "./components/UI/Controls/Link/Link.vue";
export { default as Mapgis3dDraw } from "./components/UI/Controls/Draw/Draw";

// 影像
export { default as Mapgis3dImageryLayer } from "./components/Provider/ImageProvider/ImageryLayer.vue";
export { default as Mapgis3dIgsDocLayer } from "./components/Layer/IGServer/IgsDocLayer.vue";
export { default as Mapgis3dIgsTileLayer } from "./components/Layer/IGServer/IgsTileLayer.vue";
export { default as Mapgis3dRasterLayer } from "./components/Layer/RasterTile/BaseRasterLayer.vue";
export { default as Mapgis3dOgcWmtsLayer } from "./components/Layer/OGC/OGCWMTSLayer.vue";
export { default as Mapgis3dOgcWmsLayer } from "./components/Layer/OGC/OGCWMSLayer.vue";

// 矢量瓦片
export { default as Mapgis3dVectortileLayer } from "./components/Layer/VectorTile/VectorTileLayer.vue";

// 模型
export { default as Mapgis3dFileM3d } from "./components/M3D/M3dFile.vue";
export { default as Mapgis3dIgsM3d } from "./components/M3D/M3d.vue";
export { default as Mapgis3dTileset } from "./components/M3D/3dTileset.vue";

export { default as Mapgis3dPopup } from "./components/UI/Popup/Popup.vue";
// export { default as { MapvLayer }} from "./components/Overlay";

export { default as Mapgis3dTerrainProvider } from "./components/Provider/TerrainProvider/TerrainProvider.vue";

// 数据源
export { default as Mapgis3dGeoJsonDataSource } from "./components/DataSource/Geojson/GeoJsonDataSource.vue";
export { default as Mapgis3dCzmlDataSource } from "./components/DataSource/Czml/CzmlDataSource";
