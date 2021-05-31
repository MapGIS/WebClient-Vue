import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisOgcWmtsLayer from "../cesium/src/components/Layer/OGC/OGCWMTSLayer.vue";

export default {
  title: "三维/OGC-WMTS",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    baseUrl:"http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
    wmtsLayer: "beijing",
    tileMatrixSet : "EPSG:4326_北京市_028mm_GB",
    srs : "EPSG:4326",
    layerStyle: {
      visible: true,
      opacity: 1,
      zIndex: 10
    },
    vueIndex: 1,
    options: {}
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisOgcWmtsLayer },
  template: `<mapgis-web-globe >
    <mapgis-3d-ogc-wmts-layer v-bind="$props"/>
  </mapgis-web-globe>`,
  data(){
    return {
    }
  },
  methods:{
  }
});

export const OGCWMTS = Template.bind({});
OGCWMTS.args = {
  baseUrl:"http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
  wmtsLayer: "beijing",
  tileMatrixSet : "EPSG:4326_北京市_028mm_GB",
  srs : "EPSG:4326",
  layerStyle: {
    visible: true,
    opacity: 1,
    zIndex: 10
  },
  vueIndex: 1,
  options: {}
};

