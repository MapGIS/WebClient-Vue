import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsTileLayer from "../../mapboxgl/src/components/layer/igserver/IgsTileLayer";

export default {
  title: "二维/图层/IGServer/IGS瓦片服务",
  component: MapgisIgsTileLayer,
  argTypes: {
    // serverName: {
    //   description:'服务名',
    //   type:{ name: 'String', required: true },
    //   // defaultValue:null,
    //   table:{
    //     type:{ summary: 'String' },
    //     defaultValue: { summary: '必传' },
    //   },
    //   control:'text'
    // },
    baseUrl: {
      description:'地图请求的基地址路径',
      type:{ name: 'String', required: false },
      defaultValue:null,
      table:{
        type:{
          summary: 'String',
          detail: '示例:"http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市"'
        },
        defaultValue: { summary: 'null' },
      },
      control:'text'
    },
    layerId:  {
      description: '待添加的图层的id，不能与现有的图层冲突',
      type: { name: 'String', required: true },
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '必传' },
      },
      control:'text'
    },
    source: {
      description:'栅格瓦片源<br/>' +
          '详见[sources-raster使用参考](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-raster)',
      type: { name: 'Object | String', required: false },
      table:{
        type: { summary: 'Object | String' },
        // defaultValue: { summary: '' },
      },
      control:'object'
    },
    tileSize: {
      description:'输出瓦片大小',
      defaultValue:512 ,
      type: { name: 'Number', required: false },
      table:{
        type: { summary: 'Number' },
        defaultValue: { summary: '512' },
      },
      control:'number'
    },
    zoomOffset: {
      description:'级数偏差数。<br/>' +
          '非标准裁剪的瓦片**取值: ** `igs经纬度瓦片`zoomOffset 取值为 1,`igs墨卡托瓦片` zoomOffset 取值为 0<br/>' +
          '**注意:** 此处的非标准指当前瓦片的 0 级不是 mapbox 定义的瓦片的 0 级，中间相差 zoomOffset 级',
      // defaultValue:0 ,
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
  components: { MapgisWebMap, MapgisIgsTileLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="8" style="height:95vh">
    <mapgis-igs-tile-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const IGS瓦片服务 = Template.bind({});
IGS瓦片服务.args = {
  layerId: "igs_layer_layerid",
  baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/tile/北京市`,
};
