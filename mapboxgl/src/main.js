import GlMap from "./components/map/GlMap.vue";

import Document from "./components/UI/document/Document";

import NavigationControl from "./components/UI/controls/NavigationControl";
import GeolocateControl from "./components/UI/controls/GeolocateControl";
import FullscreenControl from "./components/UI/controls/FullscreenControl";
import AttributionControl from "./components/UI/controls/AttributionControl";
import ScaleControl from "./components/UI/controls/ScaleControl";
import StateControl from "./components/UI/controls/state/StateControl";
import SearchControl from "./components/UI/controls/search/SearchControl";
import CompareControl from "./components/UI/controls/compare/CompareControl";

import BaseDraw from "./components/UI/controls/draw/BaseDraw";
import BaseDrawItem from "./components/UI/controls/draw/BaseDrawItem";

import Measure from "./components/UI/controls/measure/Measure";

import Marker from "./components/UI/Marker.vue";
import Popup from "./components/UI/Popup.vue";

import ArrayLayer from "./components/layer/ArrayLayer";
import GeojsonLayer from "./components/layer/GeojsonLayer";
import ImageLayer from "./components/layer/ImageLayer";
import CanvasLayer from "./components/layer/CanvasLayer";
import VideoLayer from "./components/layer/VideoLayer";
import VectorLayer from "./components/layer/VectorLayer";
import RasterLayer from "./components/layer/RasterLayer";
import IgsTileLayer from "./components/layer/igserver/IgsTileLayer";
import IgsDocLayer from "./components/layer/igserver/IgsDocLayer";
import IgsVectorLayer from "./components/layer/igserver/IgsVectorLayer";
import IgsWmsLayer from "./components/layer/igserver/IgsWmsLayer";
import IgsWmtsLayer from "./components/layer/igserver/IgsWmtsLayer";
import IgsTdtLayer from "./components/layer/igserver/IgsTdtLayer";
import ArcgisLayer from "./components/layer/ArcgisLayer";
import GoogleLayer from "./components/layer/GoogleLayer";
import OgcWmsLayer from "./components/layer/ogc/OgcWmsLayer";
import OgcWmtsLayer from "./components/layer/ogc/OgcWmtsLayer";

import MapvLayer from "./components/overlay/Mapv.vue";

import withEventsMixin from "./lib/withEvents";
import withSelfEventsMixin from "./components/UI/withSelfEvents";
import controlMixin from "./components/UI/controls/controlMixin";
import layerMixin from "./components/layer/layerMixin";

export const withEvents = withEventsMixin;
export const withSelfEvents = withSelfEventsMixin;
export const asControl = controlMixin;
export const asLayer = layerMixin;

export const $helpers = {
  withEvents: withEventsMixin,
  withSelfEvents: withSelfEventsMixin,
  asControl: controlMixin,
  asLayer: layerMixin
};

export const MapboxMap = GlMap;

export const MapgisDocument = Document;

// export const MapgisIgserverCatlog = IgserverCatlog;

export const MapboxNavigationControl = NavigationControl;
export const MapboxGeolocateControl = GeolocateControl;
export const MapboxFullscreenControl = FullscreenControl;
export const MapboxAttributionControl = AttributionControl;
export const MapboxScaleControl = ScaleControl;
export const MapboxStateControl = StateControl;
export const MapboxSearchControl = SearchControl;
export const MapboxCompareControl = CompareControl;

export const MapboxBaseDraw = BaseDraw;
export const MapboxBaseDrawItem = BaseDrawItem;

export const MapboxArrayLayer = ArrayLayer;
export const MapboxMeasure = Measure;

export const MapboxGeojsonLayer = GeojsonLayer;
export const MapboxImageLayer = ImageLayer;
export const MapboxCanvasLayer = CanvasLayer;
export const MapboxVideoLayer = VideoLayer;
export const MapboxVectorLayer = VectorLayer;
export const MapboxRasterLayer = RasterLayer;
export const MapboxIgsTileLayer = IgsTileLayer;
export const MapboxIgsDocLayer = IgsDocLayer;
export const MapboxIgsVectorLayer = IgsVectorLayer;
export const MapboxIgsWmsLayer = IgsWmsLayer;
export const MapboxIgsWmtsLayer = IgsWmtsLayer;
export const MapboxIgsTdtLayer = IgsTdtLayer;
export const MapboxArcgisLayer = ArcgisLayer;
export const MapboxGoogleLayer = GoogleLayer;
export const MapboxOgcWmsLayer = OgcWmsLayer;
export const MapboxOgcWmtsLayer = OgcWmtsLayer;

export const MapboxMapvLayer = MapvLayer;

export const MapboxMarker = Marker;
export const MapboxPopup = Popup;

const Components = [
  MapboxMap,
  MapgisDocument,
  MapboxNavigationControl,
  MapboxGeolocateControl,
  MapboxFullscreenControl,
  MapboxAttributionControl,
  MapboxScaleControl,
  MapboxStateControl,
  MapboxSearchControl,
  MapboxCompareControl,

  MapboxBaseDraw,
  MapboxBaseDrawItem,
  MapboxMeasure,

  MapboxArrayLayer,
  MapboxGeojsonLayer,
  MapboxImageLayer,
  MapboxCanvasLayer,
  MapboxVideoLayer,
  MapboxVectorLayer,
  MapboxRasterLayer,

  MapboxIgsTileLayer,
  MapboxIgsDocLayer,
  MapboxIgsVectorLayer,
  MapboxIgsWmsLayer,
  MapboxIgsWmtsLayer,
  MapboxIgsTdtLayer,

  MapboxArcgisLayer,
  MapboxGoogleLayer,

  MapboxOgcWmsLayer,
  MapboxOgcWmtsLayer,

  MapboxMapvLayer,

  MapboxMarker,
  MapboxPopup
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
