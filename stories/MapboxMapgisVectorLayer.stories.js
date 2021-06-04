import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsVectorLayer from "../mapboxgl/src/components/layer/igserver/IgsVectorLayer";

export default {
  title: "二维/IGServer-矢量图层",
  component: MapgisIgsVectorLayer,
  argTypes: {
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    baseUrl:"http://develop.smaryun.com:6163/igs/rest/mrms/layers"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsVectorLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[112.247175, 30.152892]" :zoom="6" style="height:60vh">
    <mapgis-igs-vector-layer :filters="filters" :gdbps="gdbps" v-bind="$props" />
    <button style="position: absolute;z-index: 1;left:0;top:0;" @click="edit('filters','0:ID>4')">修改filter</button>
    <button style="position: absolute;z-index: 1;left:80px;top:0;" @click="edit('filters','')">置空filter</button>
    <button style="position: absolute;z-index: 1;left:160px;top:0;" @click="editGdbp">修改gdbps</button>
    <button style="position: absolute;z-index: 1;left:240px;top:0;" @click="reset">还原gdbps</button>
  </mapgis-web-map>`,
  data(){
    return {
      gdbps:[
        "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/湖北省市级区划2",
        "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/点编辑",
      ],
      filters:""
    }
  },
  methods:{
    edit(name,value){
      this[name] = value;
    },
    editGdbp(){
      this.gdbps = [
        "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/点编辑"
      ]
    },
    reset(){
      this.gdbps = [
        "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/湖北省市级区划2",
        "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/点编辑",
      ]
    }
  }
});

export const Vector = Template.bind({});
Vector.args = {
  layerId: "igs_layer_layerid",
  sourceId: "igs_layer_sourceid",
  baseUrl:"http://develop.smaryun.com:6163/igs/rest/mrms/layers"
};
