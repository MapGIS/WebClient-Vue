import MapgisOgcWmsLayer from "../../cesium/src/components/Layer/OGC/OGCWMSLayer.vue";

export default {
  title: "三维/图层/OGC/raszt",
  component: MapgisOgcWmsLayer,
  argTypes: {
    baseUrl:
      "http://47.107.228.143:9081/mongo/czsg_raster_remote/遥感/WMTS?style=default&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}",
    crs: "EPSG:4326",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {  MapgisOgcWmsLayer },
  template: `<mapgis-web-scene style="height: 95vh">
    <mapgis-3d-rastertile-layer v-bind="$props"></mapgis-3d-rastertile-layer>
    <mapgis-3d-statebar @change="change"/>
  </mapgis-web-scene>`,
  methods: {
    change(e) {
      console.log("---e", e);
    },
  },
});

export const OGCWMS = Template.bind({});
OGCWMS.args = {
  baseUrl:
    "http://47.107.228.143:9081/mongo/czsg_raster_remote/遥感/WMTS?style=default&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}",
  crs: "EPSG:4326",
};
