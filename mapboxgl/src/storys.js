export { default as MapgisWebMap } from "./components/map/GlMap.vue";

export { default as MapgisDocument } from "./components/UI/document/Document";

export { default as MapgisNavigationControl } from "./components/UI/controls/NavigationControl";
export { default as MapgisGeolocateControl } from "./components/UI/controls/GeolocateControl";
export { default as MapgisFullscreenControl } from "./components/UI/controls/FullscreenControl";
export { default as MapgisAttributionControl } from "./components/UI/controls/AttributionControl";
export { default as MapgisScaleControl } from "./components/UI/controls/ScaleControl";
export { default as MapgisStateControl } from "./components/UI/controls/state/StateControl";
export { default as MapgisSearchControl } from "./components/UI/controls/search/SearchControl";
export { default as MapgisCompareControl } from "./components/UI/controls/compare/CompareControl";
export { default as MapgisFpsControl } from "./components/UI/controls/fps/FpsControl";
// export { default as MapgisDraw } from "./components/UI/controls/draw/BaseDraw";
// export { default as MapgisMeasure } from "./components/UI/controls/measure/Measure";
// export { default as BaseDrawItem from "./components/UI/controls/draw/BaseDrawItem";
// https://gist.github.com/godismyjudge95/a4ea43263db53b90b05511c911cd0034
// export { default as MapgisFixDraw } from "./components/UI/controls/drawfix/FixDraw";

export { default as MapgisMarker } from "./components/UI/Marker.vue";
export { default as MapgisPopup } from "./components/UI/Popup.vue";

export { default as MapgisArrayLayer } from "./components/layer/ArrayLayer";
export { default as MapgisGeojsonLayer } from "./components/layer/GeojsonLayer";
export { default as MapgisImageLayer } from "./components/layer/ImageLayer";
export { default as MapgisCanvasLayer } from "./components/layer/CanvasLayer";
export { default as MapgisVideoLayer } from "./components/layer/VideoLayer";
export { default as MapgisVectorLayer } from "./components/layer/VectorLayer";
export { default as MapgisRasterLayer } from "./components/layer/RasterLayer";
export { default as MapgisIgsTileLayer } from "./components/layer/igserver/IgsTileLayer";
export { default as MapgisIgsDocLayer } from "./components/layer/igserver/IgsDocLayer";
export { default as MapgisIgsVectorLayer } from "./components/layer/igserver/IgsVectorLayer";
export { default as MapgisIgsTdtLayer } from "./components/layer/igserver/IgsTdtLayer";
export { default as MapgisArcgisLayer } from "./components/layer/ArcgisLayer";
export { default as MapgisGoogleLayer } from "./components/layer/GoogleLayer";
export { default as MapgisOgcWmsLayer } from "./components/layer/ogc/OgcWmsLayer";
export { default as MapgisOgcWmtsLayer } from "./components/layer/ogc/OgcWmtsLayer";

export { default as MapgisMapvLayer } from "./components/overlay/Mapv.vue";

const MapComponents = {
  MapgisWebMap,
  MapgisDocument,

  MapgisNavigationControl,
  MapgisGeolocateControl,
  MapgisFullscreenControl,
  MapgisAttributionControl,
  MapgisScaleControl,
  MapgisStateControl,
  MapgisSearchControl,
  MapgisCompareControl,
  MapgisFpsControl,

  MapgisMarker,
  MapgisPopup,

  MapgisArrayLayer,
  MapgisGeojsonLayer,
  MapgisImageLayer,
  MapgisCanvasLayer,
  MapgisVideoLayer,
  MapgisVectorLayer,
  MapgisRasterLayer,
  MapgisIgsTileLayer,
  MapgisIgsDocLayer,
  MapgisIgsVectorLayer,
  MapgisIgsTdtLayer,
  MapgisArcgisLayer,
  MapgisGoogleLayer,
  MapgisOgcWmsLayer,
  MapgisOgcWmtsLayer,

  MapgisMapvLayer
};

const install = function(Vue, options) {
  for (let name in MapComponents) {
    const com = MapComponents[name];
    Vue.component(com.options ? com.options.name : com.name, com);
  }
};

if (typeof window !== "undefined" && window["Vue"]) {
  install(window["Vue"], {});
}

export default {
  install
};
