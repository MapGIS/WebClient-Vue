import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../../mapboxgl/src/components/layer/RasterLayer.js";

export default {
  title: "二维/图层/栅格图层",
  component: MapgisRasterLayer,
  argTypes: {
    url:  {
      description: '栅格瓦片源的url',
      type: { name: 'String', required: false },
      defaultValue:null,
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: 'null' },
      },
      control:'text'
    },
    layerId:  {
      description: '待添加的图层的id，不能与现有的图层冲突',
      type: { name: 'String', required: true },
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '必传' },
      },
      control:'text'
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisRasterLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[110, 30]" :zoom="3" style="height:60vh">
    <mapgis-rastertile-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const 栅格图层 = Template.bind({});
栅格图层.args = {
  layerId: "raster_tdt",
  url:
    "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
};
