import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../mapboxgl/src/components/layer/RasterLayer.js";

export default {
  title: "二维/图层-栅格",
  component: MapgisRasterLayer,
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
  components: { MapgisWebMap, MapgisRasterLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[110, 30]" :zoom="3" style="height:60vh">
    <mapgis-rastertile-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Image = Template.bind({});
Image.args = {
  layerId: "raster_tdt",
  url:
    "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
};
