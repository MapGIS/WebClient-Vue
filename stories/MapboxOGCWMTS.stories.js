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
  template: `<mapgis-web-map crs="EPSG:4326" style="height:60vh">
    <mapgis-ogc-wmts-layer v-bind="$props" />
  </mapgis-web-map>`
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
