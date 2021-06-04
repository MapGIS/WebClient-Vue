import MapgisWebScene from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import GeoJsonDataSource from "../cesium/src/components/DataSource/Geojson/GeoJsonDataSource.vue";

export default {
  title: "三维/图层-GeoJSON",
  component: GeoJsonDataSource,
  argTypes: {
    baseUrl: "",
    options: {
      markerSize: 48,
      strokeWidth: 2,
      clampToGround: true,
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      libPath: undefined, // "http://localhost:8080/static/libs/cdn/cesium/Cesium.js",
      pluginPath: undefined, // "http://localhost:8080/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js",
    };
  },
  components: {
    MapgisWebScene,
  },
  template: `<mapgis-web-scene :libPath="libPath" :pluginPath="pluginPath" >
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-geojson-datasource v-bind="$props"/>
  </mapgis-web-scene>`,
});

export const GeoJSON = Template.bind({});
GeoJSON.args = {
  baseUrl: "http://develop.smaryun.com/static/data/geojson/wuhan_bounds.geojson",
  options: {
    markerSize: 48,
    strokeWidth: 2,
    clampToGround: true,
  },
};
