export { default as MapgisEventBusMapMixin } from "./lib/eventbus/EventBusMapMixin";

export { default as MapgisWebMap } from "./components/map/GlMap.vue";

export { default as MapgisDocument } from "./components/UI/document/Document";
export { default as MapgisLayerMenuStudio } from "./components/UI/document/contextmenu/LayerMenuStudio.vue";

export { default as MapgisNavigationControl } from "./components/UI/controls/NavigationControl";
export { default as MapgisGeolocateControl } from "./components/UI/controls/GeolocateControl";
export { default as MapgisFullscreenControl } from "./components/UI/controls/FullscreenControl";
export { default as MapgisAttributionControl } from "./components/UI/controls/AttributionControl";
export { default as MapgisScaleControl } from "./components/UI/controls/ScaleControl";
export { default as MapgisCustomScaleControl } from "./components/UI/controls/scale/CustomScale.vue";
export { default as MapgisStateControl } from "./components/UI/controls/state/StateControl";
export { default as MapgisSearchControl } from "./components/UI/controls/search/SearchControl";
export { default as MapgisCompareControl } from "./components/UI/controls/compare/CompareControl";
export { default as MapgisCompareInnerControl } from "./components/UI/controls/compare/CompareInnerControl";
export { default as MapgisFpsControl } from "./components/UI/controls/fps/FpsControl";
export { default as MapgisZoom } from "./components/UI/controls/zoom/Zoom.vue";
export { default as MapgisFitbounds } from "./components/UI/controls/bounds/FitBounds.vue";
export { default as MapgisPrint } from "./components/UI/controls/print/Print";
export { default as MapgisDraw } from "./components/UI/controls/draw/BaseDraw";
export { default as MapgisMeasure } from "./components/UI/controls/measure/Measure";
// export { default as BaseDrawItem from "./components/UI/controls/draw/BaseDrawItem";
// https://gist.github.com/godismyjudge95/a4ea43263db53b90b05511c911cd0034
// export { default as MapgisFixDraw } from "./components/UI/controls/drawfix/FixDraw";
export { default as MapgisHawkeye } from "./components/UI/controls/hawkeye/Hawkeye";
export { default as MapgisArcgisLegend } from "./components/UI/controls/legend/Legend";

export { default as MapgisMarker } from "./components/UI/Marker.vue";
export { default as MapgisPopup } from "./components/UI/Popup.vue";

export { default as MapgisBaseTable } from "./components/UI/controls/table/BaseTable";
export { default as MapgisFeatureTable } from "./components/UI/controls/table/FeatureTable";
export { default as MapgisInspect } from "./components/UI/controls/inspect/Inspect";

export { default as MapgisArrayLayer } from "./components/layer/ArrayLayer";
export { default as MapgisGeojsonLayer } from "./components/layer/GeojsonLayer";
export { default as MapgisImageLayer } from "./components/layer/ImageLayer";
export { default as MapgisCanvasLayer } from "./components/layer/CanvasLayer";
export { default as MapgisVideoLayer } from "./components/layer/VideoLayer";
export { default as MapgisVectorLayer } from "./components/layer/VectorLayer";

export { default as MapgisMvtStyleLayer } from "./components/layer/vectortile/MvtStyleLayer";
export { default as MapgisMvtEditor } from "./components/layer/edit/Edit";
export { default as MapgisMvtScale } from "./components/layer/edit/Scale";
export { default as MapgisMvtLegend } from "./components/UI/controls/legend/LegendMvt";

export { default as MapgisRasterLayer } from "./components/layer/RasterLayer";
export { default as MapgisIgsTileLayer } from "./components/layer/igserver/IgsTileLayer";
export { default as MapgisIgsDocLayer } from "./components/layer/igserver/IgsDocLayer";
export { default as MapgisIgsVectorLayer } from "./components/layer/igserver/IgsVectorLayer";
export { default as MapgisIgsTdtLayer } from "./components/layer/igserver/IgsTdtLayer";
export { default as MapgisArcgisLayer } from "./components/layer/ArcgisLayer";
export { default as MapgisGoogleLayer } from "./components/layer/GoogleLayer";
export { default as MapgisOgcWmsLayer } from "./components/layer/ogc/OgcWmsLayer";
export { default as MapgisOgcWmtsLayer } from "./components/layer/ogc/OgcWmtsLayer";
export { default as MapgisArcgisMapLayer } from "./components/layer/ArcGISServer/ArcGISMapLayer";
export { default as MapgisArcgisTileLayer } from "./components/layer/ArcGISServer/ArcGISTileLayer";

export { default as MapgisTrackerLayer } from "./components/layer/tracker/TrackerLayer";
export { default as MapgisClusterLayer } from "./components/layer/cluster/ClusterLayer";
export { default as MapgisHeaterLayer } from "./components/layer/heater/HeaterLayer";
export { default as MapgisBuildingLayer } from "./components/layer/building/BuildingLayer";
export { default as MapgisElasticsearchLayer } from "./components/layer/elasticsearch/ElasticsearchLayer";

export { default as MapgisEchartsLayer } from "./components/overlay/EchartsLayer";
export { default as MapgisMapvLayer } from "./components/overlay/MapvLayer";
// es5的依赖过多先不放开
// export { default as MapgisThreeboxLayer } from "./components/overlay/ThreeboxLayer";

export { default as MapgisFeatureService } from "./components/map/mixins/FeatureService";
export { default as MapgisUniqueThemeLayer } from "./components/layer/ThemeLayer/UniqueThemeLayer";
export { default as MapgisSymbolThemeLayer } from "./components/layer/ThemeLayer/SymbolThemeLayer";
export { default as MapgisRangeThemeLayer } from "./components/layer/ThemeLayer/RangeThemeLayer";
export { default as MapgisThemePanel } from "./components/layer/ThemeLayer/ThemePanel";
export { default as MapgisThemeLayer } from "./components/layer/ThemeLayer/ThemeLayer";
export { default as MapgisHeatThemeLayer } from "./components/layer/ThemeLayer/HeatThemeLayer";

/* 
import withEventsMixin from "./lib/withEvents";
import withSelfEventsMixin from "./components/UI/withSelfEvents";
import controlMixin from "./components/UI/controls/controlMixin";
import layerMixin from "./components/layer/layerMixin";

export { default as const withEvents = withEventsMixin;
export { default as const withSelfEvents = withSelfEventsMixin;
export { default as const asControl = controlMixin;
export { default as const asLayer = layerMixin;

export { default as const $helpers = {
  withEvents: withEventsMixin,
  withSelfEvents: withSelfEventsMixin,
  asControl: controlMixin,
  asLayer: layerMixin
}; 
*/
