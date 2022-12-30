import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsVectorLayer from "../../mapboxgl/src/components/layer/igserver/IgsVectorLayer";

export default {
  title: "二维/数据图层/影像/MapGIS/矢量图层",
  component: MapgisIgsVectorLayer,
  argTypes: {
    layerId:  {
      description: '待添加的图层的id，不能与现有的图层冲突',
      type: { name: 'String', required: true },
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '必传' },
      },
      control:'text'
    },
    baseUrl: {
      description:'地图请求的基地址路径',
      type:{ name: 'String', required: false },
      defaultValue:null,
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: 'null' },
      },
      control:'text'
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
    domain: {
      description:'igs 服务域名。(domain 和（protocol，ip，port）二选一)',
      type:{ name: 'String', required: false },
      defaultValue:null,
      table:{
        type:{
          summary: 'String',
          detail: '示例:"http://localhost:6163"'
        },
        defaultValue: { summary: 'null' },
      },
      control:'text'
    },
    protocol: {
      description:'igs 服务网络协议',
      type:{ name: 'String', required: false },
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: 'location.protocol.split(":")[0] || "http"' },
      },
      control:'text'
    },
    ip: {
      description:'igs 服务 ip',
      type:{ name: 'String', required: false },
      defaultValue:'localhost',
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: 'localhost' },
      },
      control:'text'
    },
    port: {
      description:'igs 服务 port',
      type:{ name: 'String', required: false },
      defaultValue:'6163',
      table:{
        type:{
          summary: 'String',
        },
        defaultValue: { summary: '6163' },
      },
      control:'text'
    },
    gdbps: {
      description:'图层的 gdbps 地址，允许传入多个图层，以“,”隔开',
      table:{
        type:{
          summary: 'Array || String',
          required: true
        },
        defaultValue: { summary: '必传' },
      },
      control:'array'
    },
    filters:{
      description:'用户指定的图层过滤条件，它由多个键值对组成，值为过滤条件',
      type: { name: 'String', required: false },
      // defaultValue: null,
      table:{
        type:{
          summary: 'String',
          detail: '示例:"1:ID>4,3:ID>1"'
        },
        defaultValue: { summary: 'null' },
      },
      control:'text'
    },
    igsMapStyle:{
      description:'用户指定的图层显示样式，每个 gdbp 对应一个 style，style 为 CDisplayStyleExtend 的 json 序列化形式，多个 style 之间用“，”隔开',
      type: { name: 'Object', required: false },
      defaultValue: null,
      table:{
        type: {
          summary: 'Object',
          detail:'示例:[{index:0,symbleshow:true,followscale:true},{index:1,symbleshow:true,FollowScale:true}]'
        },
        defaultValue: { summary: 'null' },
      },
      control:'object'
    } ,
    f:{
      description:'矢量图片的格式',
      type: { name: 'String', required: false },
      defaultValue: 'png',
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: 'png' },
      },
      control:{
        type:'select',
        options:['jpg','png','gif']
      }
    } ,
    guid:{
      description:'用户标识地图图层的唯一id',
      type: { name: 'String', required: false },
      table:{
        type: { summary: 'String' },
        defaultValue: {
          summary: 'new Date().getTime().toString()',
        },
      },
      control:'text'
    } ,
    keepCache:{
      description:'当 keepCache 设置为 true 时，优先从客户端缓存中取瓦片，否则不从客户端缓存中提取',
      type: { name: 'Boolean', required: false },
      defaultValue: true,
      table:{
        type: { summary: 'Boolean' },
        defaultValue: { summary: 'true' },
      },
      control:'boolean'
    } ,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsVectorLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[112.247175, 30.152892]" :zoom="6" style="height:95vh">
    <mapgis-igs-vector-layer v-bind="$props"></mapgis-igs-vector-layer>
    <button style="position: absolute;z-index: 1;left:0;top:0;" @click="edit('filters','0:ID>4')">修改filter</button>
    <button style="position: absolute;z-index: 1;left:80px;top:0;" @click="edit('filters','')">置空filter</button>
    <button style="position: absolute;z-index: 1;left:160px;top:0;" @click="editGdbp">修改gdbps</button>
    <button style="position: absolute;z-index: 1;left:240px;top:0;" @click="reset">还原gdbps</button>
  </mapgis-web-map>`,
  data(){
    return {
    }
  },
  methods:{
    edit(name,value){
      this[name] = value;
    },
    editGdbp(){
      this.gdbps = [
        // "gdbp://MapGISLocal/ClientTheme/ds/epsg4326/sfcls/点编辑"
      ]
    },
    reset(){
      this.gdbps = [
        "gdbp://MapGISLocal/ClientTheme/ds/epsg4326/sfcls/湖北省市级区划2",
        // "gdbp://MapGISLocal/ClientTheme/ds/epsg4326/sfcls/点编辑",
      ]
    }
  }
});

export const 矢量图层 = Template.bind({});
矢量图层.args = {
  layerId: "igs_layer_layerid",
  sourceId: "igs_layer_sourceid",
  baseUrl:`http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/layers`,
  gdbps:[
    "gdbp://MapGISLocal/ClientTheme/ds/epsg4326/sfcls/湖北省市级区划2",
    // "gdbp://MapGISLocal/ClientTheme/ds/epsg4326/sfcls/点编辑",
  ],
  filters:""
};
