import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";
import Markdown from "../../mapboxgl/docs/api/Layers/OGC/ogcWmtsLayer.md";

export default {
  title: "二维/数据图层/影像/MapGIS/WMTS/3857",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    baseUrl: {
      description:'KVP 模式的基地址',
      type:{ name: 'String', required: false },
      defaultValue:null,
      table:{
        type:{
          summary: 'String',
          detail: '示例:"http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer"'
        },
        defaultValue: { summary: 'null' },
      },
      control:'text'
    },
    wmtsLayer:{
      description:'wmts 标准中的 layer 属性，即图层名称',
      type: { name: 'String', required: false },
      defaultValue: "",
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: "" },
      },
      control:'text'
    } ,
    tileMatrixSet:{
      description:'wmts 标准中的 TileMatrixSet 属性，即地图矩阵集合',
      type: { name: 'String', required: false },
      defaultValue: "",
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: "" },
      },
      control:'text'
    } ,
    version:{
      description:'wmts 服务版本号',
      type: { name: 'String', required: false },
      defaultValue: '1.0.0',
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '1.0.0' },
      },
      control:'text'
    } ,
    wmtsStyle:{
      description:'wmts 标准中的 style 属性，即地图样式',
      type: { name: 'String', required: false },
      defaultValue: "default",
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: "default" },
      },
      control:'text'
    } ,
    format:{
      description:'wmts 标准中的 format 属性，即请求的图片的返回格式',
      type: { name: 'String', required: false },
      defaultValue: 'image/png',
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: 'image/png' },
      },
      control:{
        type:'select',
        options:['image/png','image/gif','image/jpg']
      }
    } ,
    zoomOffset: {
      description:'地图偏移级数，老版本的 Igserver 会使用到<br/>' ,
      defaultValue:0 ,
      type: { name: 'Number', required: false },
      table:{
        type: { summary: 'Number' },
        defaultValue: { summary: '0' },
      },
      control:'number'
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWmtsLayer },
  template: `<mapgis-web-map crs="EPSG:3857" :zoom="mapZoom" :center="outerCenter" style="height:95vh">
    <mapgis-ogc-wmts-layer v-bind="$props" />
  </mapgis-web-map>`,
  data() {
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
    };
  },
});

export const TDT_3857 = Template.bind({});
TDT_3857.args = {
  baseUrl: "http://t0.tianditu.gov.cn/vec_w/wmts",
  /**
   * @description 123123123
   */
  wmtsLayer: "vec",
  tileMatrixSet: "w",
  format: "tiles",
  layerId: "ogcwmts_layerId",
  sourceId: "ogcwmts_sourceId",
  // token:"f5347cab4b28410a6e8ba5143e3d5a35"
  token: {
    key: "tk",
    value: "f5347cab4b28410a6e8ba5143e3d5a35",
  },
};

export const ArcGis_3857 = Template.bind({});
ArcGis_3857.args = {
  wmtsLayer: "ChinaOnlineCommunity",
  layerId: "ogcwmts_layerId",
  sourceId: "ogcwmts_sourceId",
  tileMatrixSet: "default028mm",
  baseUrl:
    "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/WMTS",
};

TDT_3857.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
