import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmsLayer from "../../mapboxgl/src/components/layer/ogc/OgcWmsLayer.js";
import Markdown from "../../mapboxgl/docs/api/Layers/igserver/igsWmsLayer.md"

export default {
  title: "二维/图层/OGC/WMS-3857",
  component: MapgisOgcWmsLayer,
  argTypes: {
    baseUrl: {
      description:'WMS 请求基地址',
      type:{ name: 'String', required: false },
      defaultValue:null,
      table:{
        type:{
          summary: 'String',
          detail: '示例:"http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMSServer"'
        },
        defaultValue: { summary: 'null' },
      },
      control:'text'
    },
    layers:{
      description: '图层名称或 Id，多个值以逗号分隔，不传时不显示地图 <br/> ' +
          '1. igs 使用地图名称 <br/> ' +
          '2. arcgis 根据版本不同，可使用 id 或名称，具体依据 arcgis 的 wms 服务的 xml 文档',
      type: {
        name: 'String',
        required: false
      },
      defaultValue:null,
      table:{
        type: {summary: 'String'},
        defaultValue: { summary: 'null' },
      },
      control:'text'
    } ,
    version:{
      description:'wmts 服务版本号',
      type: { name: 'String', required: false },
      defaultValue: '1.1.1',
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '1.1.1' },
      },
      control:'text'
    } ,
    format:{
      description:'返回格式',
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
    token:{
      description:'瓦片请求的 token',
      type: { name: 'String', required: false },
      // defaultValue: '',
      table:{
        type: { summary: 'String' },
        // defaultValue: { summary: '' },
      },
      control:'text'
    } ,
    height: {
      description:'瓦片的高度',
      defaultValue:512 ,
      type: { name: 'Number', required: false },
      table:{
        type: { summary: 'Number' },
        defaultValue: { summary: '512' },
      },
      control:'number'
    },
    width: {
      description:'瓦片的宽度',
      defaultValue:512 ,
      type: { name: 'Number', required: false },
      table:{
        type: { summary: 'Number' },
        defaultValue: { summary: '512' },
      },
      control:'number'
    },
    reversebbox:{
      description:'这个参数专门针对特定版本的 arcserver，在一些特定的 arcserver 版本其 bbox 的传入方式是[miny, minx, maxy, maxx],而不是[minx, miny, maxx, maxy]',
      type: { name: 'Boolean', required: false },
      defaultValue: false,
      table:{
        type: { summary: 'Boolean' },
        defaultValue: { summary: 'false' },
      },
      control:'boolean'
    } ,

    layers: {
      description:'传入OGC/WMS服务中图层的Name字段',
      table:{
        type: {
          summary: 'String',
          detail:'示例:\n<Layer queryable="1">\n<Name>t78</Name>\n<Title>高尔夫POI</Title>\n<Abstract/>\n<SRS>EPSG:4326</SRS>\n<SRS>EPSG:3857</SRS>\n<LatLonBoundingBox minx="115.68781625002069" miny="39.485428600000006" maxx="116.72606048165855" maxy="40.40083445"/>\n<BoundingBox minx="115.68781625002069" miny="39.485428600000006" maxx="116.72606048165855" maxy="40.40083445" SRS="EPSG:4326"/>\n<BoundingBox minx="1.2878308795938104E7" miny="4791445.516172612" maxx="1.2993885615123086E7" maxy="4924362.565474523" SRS="EPSG:3857"/>\n</Layer>\n 其中t78即为layers传参的内容'
        },
      }
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWmsLayer },
  template: `<mapgis-web-map crs="EPSG:3857" :center="[116.39, 40.20]" :zoom="7.5" style="height:95vh">
    <mapgis-ogc-wms-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const IGS_3857 = Template.bind({});
IGS_3857.args = {
  layers: 't0,t1,t2',
  layerId: 'raster_layerId',
  sourceId: 'raster_sourceId',
  baseUrl:`http://${window.webclient.ip}:${window.webclient.port}/igs/rest/ogc/doc/北京市/WMSServer`,
  crs:'EPSG:3857'
};
IGS_3857.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

export const ArcGis_3857 = Template.bind({});
ArcGis_3857.args = {
  layers: '0',
  layerId: 'raster_layerId',
  sourceId: 'raster_sourceId',
  baseUrl:'http://219.142.81.85/arcgis/services/矿产地数据库2019/ferrous_metal/MapServer/WmsServer',
  crs:'EPSG:3857'
};


