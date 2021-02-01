import WebGlobe from "./components/WebGlobe/WebGlobe.vue";

// 工具
// import StateControl from "./components/UI/Controls/State/StateControl.vue";
import Link from "./components/UI/Controls/Link/Link.vue";
import BaseDraw from "./components/UI/Controls/Draw/Draw";

// 影像
import ImageryLayer from "./components/Provider/ImageProvider/ImageryLayer.vue";
import IgsDocLayer from "./components/Layer/IGServer/IgsDocLayer.vue";
import IgsTileLayer from "./components/Layer/IGServer/IgsTileLayer.vue";
import RasterLayer from "./components/Layer/RasterTile/BaseRasterLayer.vue";
import OgcWmtsLayer from "./components/Layer/OGC/OGCWMTSLayer.vue";
import OgcWmsLayer from "./components/Layer/OGC/OGCWMSLayer.vue";

// 矢量瓦片
import VectorTileLayer from "./components/Layer/VectorTile/VectorTileLayer.vue";

// 模型
import FileM3d from "./components/M3D/M3dFile.vue";
import IgsM3d from "./components/M3D/M3d.vue";
import Tileset from "./components/M3D/3dTileset.vue";

import Popup from "./components/UI/Popup/Popup.vue";
// import { MapvLayer } from "./components/Overlay";

import TerrainProvider from "./components/Provider/TerrainProvider/TerrainProvider.vue";

// 数据源
import GeoJsonDataSource from "./components/DataSource/Geojson/GeoJsonDataSource.vue";
import CzmlDataSource from "./components/DataSource/Czml/CzmlDataSource";

/* export {
  WebGlobe,
  StateControl,
  Link,
  RasterLayer,
  ImageryLayer,
  IgsDocLayer,
  IgsTileLayer,
  Popup,
  MapvLayer,
  GeoJsonDataSource,
  Tileset,
  IgsM3d,
  FileM3d
}; */

export const CesiumWebGlobe = WebGlobe;
// export const CesiumStateControl = StateControl;
export const CesiumLink = Link;
export const CesiumBaseDraw = BaseDraw;

export const CesiumImageryLayer = ImageryLayer;
export const CesiumRasterLayer = RasterLayer;
export const CesiumIgsDocLayer = IgsDocLayer;
export const CesiumIgsTileLayer = IgsTileLayer;
export const CesiumOgcWmtsLayer = OgcWmtsLayer;
export const CesiumOgcWmsLayer = OgcWmsLayer;

export const CesiumVectorTileLayer = VectorTileLayer;

export const CesiumTerrainProvider = TerrainProvider;

export const Cesium3dTileset = Tileset;
export const CesiumIgsM3d = IgsM3d;
export const CesiumFileM3d = FileM3d;

export const CesiumGeojsonDatasource = GeoJsonDataSource;
export const CesiumCzmlDatasource = CzmlDataSource;
export const CesiumPopup = Popup;

// export const CesiumMapvLayer = MapvLayer;

const Components = [
  CesiumWebGlobe,
  // CesiumStateControl,
  CesiumLink,
  CesiumBaseDraw,

  CesiumImageryLayer,
  CesiumRasterLayer,
  CesiumIgsDocLayer,
  CesiumIgsTileLayer,
  CesiumOgcWmtsLayer,
  CesiumOgcWmsLayer,

  CesiumVectorTileLayer,

  CesiumTerrainProvider,

  Cesium3dTileset,
  CesiumIgsM3d,
  CesiumFileM3d,

  CesiumGeojsonDatasource,
  CesiumCzmlDatasource,
  CesiumPopup

  /* CesiumMapvLayer */
];

const install = function(Vue, options) {
  Components.forEach(com => {
    Vue.component(com.options ? com.options.name : com.name, com);
  });
};
if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export default {
  install
};
