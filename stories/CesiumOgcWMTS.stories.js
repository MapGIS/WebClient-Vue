import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisOgcWmtsLayer from "../cesium/src/components/Layer/OGC/OGCWMTSLayer.vue";

export default {
  title: "三维/OGC-WMTS",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    url:"http://localhost:6163/igs/rest/ogc/武汉_专题图_4327/WMTSServer",
    tilingScheme: "EPSG:4326",
    tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    wmtsLayer: "武汉_专题图_4327",
    wmtsStyle: "default",
    format: "image/png",
    version: "1.0.0",
    tileMatrixSet : "武汉_专题图_4327"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisOgcWmtsLayer },
  template: `<mapgis-web-globe >
    <mapgis-3d-ogc-wmts-layer :show="flag" v-bind="$props"/>
    <button @click="showMap">隐藏</button>
  </mapgis-web-globe>`,
  data(){
    return {
      flag:true
    }
  },
  methods:{
    showMap(){
      this.flag = !this.flag;
    }
  }
});

export const EPSG_4326 = Template.bind({});
EPSG_4326.args = {
  url:"http://localhost:6163/igs/rest/ogc/武汉_专题图_4327/WMTSServer",
  tilingScheme: "EPSG:4326",
  tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  wmtsLayer: "武汉_专题图_4327",
  wmtsStyle: "default",
  format: "image/png",
  version: "1.0.0",
  tileMatrixSet : "武汉_专题图_4327"
};

