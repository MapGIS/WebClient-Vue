import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ZondyRasterLayer from "../mapboxgl/src/components/layer/RasterLayer.js";

export default {
  title: "图层/标准栅格",
  component: ZondyRasterLayer,
  argTypes: {
    layer: {},
    layerId: "igsLayer_layerId",
    sourceId: "igsLayer_sourceId",
    url:
    "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ZondyWebMap, ZondyRasterLayer },
  template: `<zondy-web-map crs="EPSG:4326" :center="[110, 30]" :zoom="3">
    <zondy-raster-layer v-bind="$props" />
  </zondy-web-map>`,
});

export const Image = Template.bind({});
Image.args = {
  layerId: "raster_tdt",
  url:
    "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
};
