import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisOgcWmtsLayer from "../cesium/src/components/Layer/OGC/OGCWMTSLayer.vue";

export default {
  title: "三维/OGC-WMTS",
  component: MapgisOgcWmtsLayer,
  argTypes: {
    url: "http://t0.tianditu.gov.cn/img_w/wmts",
    options: {
      tilingScheme: "EPSG:3857",
      tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisOgcWmtsLayer },
  template: `<mapgis-web-globe >
    <mapgis-3d-ogc-wmts-layer v-bind="$props"/>
  </mapgis-web-globe>`,
});

export const EPSG_4326 = Template.bind({});
EPSG_4326.args = {
  url:
    "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
  options: {
    tilingScheme: "EPSG:4326",
    tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
};

export const EPSG_3857 = Template.bind({});
EPSG_3857.args = {
  url:
    "http://t0.tianditu.com/DataServer?T=img_w&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
  options: {
    tilingScheme: "EPSG:3857",
  },
};
