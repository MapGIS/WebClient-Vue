import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsDocLayer from "../mapboxgl/src/components/layer/igserver/IgsDocLayer";

export default {
  title: "二维/IGServer-地图文档",
  component: MapgisIgsDocLayer,
  argTypes: {
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    domain: "http://develop.smaryun.com:6163",
    serverName : "北京市"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsDocLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="8">
  <mapgis-igs-doc-layer :cache="cache" :layers="layers" :filters="filters" v-bind="$props" />
  <button style="position: absolute;z-index: 1;left:0;top:0;" @click="edit('filters','0:ID>4')">修改filter</button>
  <button style="position: absolute;z-index: 1;left:80px;top:0;" @click="edit('filters','')">置空filter</button>
  <button style="position: absolute;z-index: 1;left:160px;top:0;" @click="edit('layers','show:0,1')">修改layers</button>
  <button style="position: absolute;z-index: 1;left:240px;top:0;" @click="edit('layers','show:0')">还原layers</button>
  <button style="position: absolute;z-index: 1;left:330px;top:0;" @click="edit('cache',true)">修改cache</button>
  <button style="position: absolute;z-index: 1;left:420px;top:0;" @click="edit('cache',false)">还原cache</button>
  </mapgis-web-map>`,
  data(){
    return {
      filters:"",
      layers:"show:0",
      cache:false
    }
  },
  methods:{
    edit(name,value){
      this[name] = value;
    }
  }
});

export const Doc = Template.bind({});
Doc.args = {
  layerId: "igs_layer_layerid",
  domain: "http://develop.smaryun.com:6163",
  serverName : "北京市"
};
