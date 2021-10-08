import GeoJsonLayer from "../../cesium/src/components/Layer/GeoJSON/GeoJsonLayer.vue";

export default {
  title: "三维/图层/GeoJSON",
  component: GeoJsonLayer,
  argTypes: {
    baseUrl: "",
    enablePopup: true,
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
      libPath: "http://localhost:8888/static/libs/cdn/cesium/Cesium.js",
      pluginPath:
        "http://localhost:8888/static/libs/cdn/cesium/webclient-cesium-plugin.min.js",
    };
  },
  components: {},
  template: `<mapgis-web-scene :libPath="libPath" :pluginPath="pluginPath" style="height: 95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-geojson-layer v-bind="$props"/>
  </mapgis-web-scene>`,
});

export const GeoJSON = Template.bind({});
GeoJSON.args = {
  baseUrl: "http://develop.smaryun.com/static/data/geojson/china.geojson",
  enablePopup: true,
  options: {
    markerSize: 48,
    strokeWidth: 2,
    clampToGround: true,
  },
};
