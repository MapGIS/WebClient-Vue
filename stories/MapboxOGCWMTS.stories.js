import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "二维/OGC-WMTS",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    layer: {},
    baseUrl:
        "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
    tileMatrixSet:"EPSG:4326_北京市_arcgis_GB",
    wmtsLayer:"beijing",
    version:"1.0.0",
    wmtsStyle:"default",
    format:"image/png",
    zoomOffset:-1
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWmtsLayer },
  template: `<mapgis-web-map crs="EPSG:4326">
    <mapgis-ogc-wmts-layer v-bind="$props" />
    <button @click="test" style="position: absolute;left: 0;top: 0;z-index: 999;">改值</button>
    <button @click="test2" style="position: absolute;left: 60px;top: 0;z-index: 999;">改值</button>
  </mapgis-web-map>`,
  methods:{
    test(){
      this.$props.wmtsStyle = "qqqqq"
    },
    test2(){
      this.$props.wmtsStyle = "default"
    }
  }
});

export const Image = Template.bind({});
Image.args = {
  layerId: "tdt",
  baseUrl:
    "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMTSServer",
  tileMatrixSet:"EPSG:4326_北京市_arcgis_GB",
  wmtsLayer:"beijing",
  version:"1.0.0",
  wmtsStyle:"default",
  format:"image/png",
  zoomOffset:-1
};
