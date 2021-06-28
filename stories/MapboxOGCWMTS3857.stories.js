import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "二维/OGC-WMTS-3857",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    baseUrl:'http://t0.tianditu.gov.cn/vec_w/wmts',
    wmtsLayer: 'vec',
    tileMatrixSet:"w",
    format:"tiles",
    layerId: 'ogcwmts_layerId',
    sourceId: 'ogcwmts_sourceId',
    token:"f5347cab4b28410a6e8ba5143e3d5a35"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWmtsLayer },
  template: `<mapgis-web-map crs="EPSG:3857" :zoom="mapZoom" :center="outerCenter" style="height:60vh">
    <mapgis-ogc-wmts-layer v-bind="$props" />
  </mapgis-web-map>`,
  data(){
    return {
      mapStyle: {
        //设置版本号，一定要设置
        version: 8,
        //添加来源
        sources: {},
        //设置加载并显示来源的图层信息
        layers: [],
      }, // 地图样式
      mapZoom: 1, // 地图初始化级数
      outerCenter: [114.3, 30.5], // 地图显示中心
    }
  }
});

export const TDT_3857 = Template.bind({});
TDT_3857.args = {
  baseUrl:'http://t0.tianditu.gov.cn/vec_w/wmts',
  wmtsLayer: 'vec',
  tileMatrixSet:"w",
  format:"tiles",
  layerId: 'ogcwmts_layerId',
  sourceId: 'ogcwmts_sourceId',
  // token:"f5347cab4b28410a6e8ba5143e3d5a35"
  token:{
    key:'tk',
    value:'f5347cab4b28410a6e8ba5143e3d5a35'
  }
};

export const ArcGis_3857 = Template.bind({});
ArcGis_3857.args = {
  wmtsLayer: 'ChinaOnlineCommunity',
  layerId: 'ogcwmts_layerId',
  sourceId: 'ogcwmts_sourceId',
  tileMatrixSet:"default028mm",
  baseUrl:'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/WMTS'
};

