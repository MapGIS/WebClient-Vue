import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "二维/图层/OGC/WMTS-4326",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    baseUrl:`http://${window.webclient.ip}:${window.webclient.port}/igs/rest/ogc/WMTSServer`,
    wmtsLayer: 'beijing',
    tileMatrixSet:"EPSG:4326_北京市_arcgis_GB",
    layerId: 'ogcwmts_layerId',
    sourceId: 'ogcwmts_sourceId',
    //因为司马云是用的老版本的igs服务，因此offset必须传-1
    zoomOffset: -1
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWmtsLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :zoom="mapZoom" :center="outerCenter" style="height:60vh">
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
      mapZoom: 8, // 地图初始化级数
      outerCenter: [116.39, 40.20], // 地图显示中心
      mapCrs: 'EPSG:4326',
    }
  }
});

// export const Igs_4326 = Template.bind({});
// Igs_4326.args = {
//   baseUrl:'http://develop.smaryun.com:6163/igs/rest/ogc/WMTSServer',
//   wmtsLayer: 'beijing',
//   tileMatrixSet:"EPSG:4326_北京市_arcgis_GB",
//   layerId: 'ogcwmts_layerId',
//   sourceId: 'ogcwmts_sourceId',
//   //因为司马云是用的老版本的igs服务，因此offset必须传-1
//   zoomOffset: -1
// };

export const ArcGis_4326 = Template.bind({});
ArcGis_4326.args = {
  baseUrl:'http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer/WMTS',
  wmtsLayer: '10wanZH',
  tileMatrixSet:"default",
  layerId: 'ogcwmts_layerId',
  sourceId: 'ogcwmts_sourceId',
  //制图时设置了偏移，因此offset必须传-1
  zoomOffset: -1
};

