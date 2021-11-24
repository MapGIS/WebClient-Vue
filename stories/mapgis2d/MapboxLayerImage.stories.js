import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisImageLayer from "../../mapboxgl/src/components/layer/ImageLayer.js";

export default {
  title: "二维/图层/图像图层",
  component: MapgisImageLayer,
  argTypes: {
    layer: {
      description:'[layer使用参考](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers)',
      type: { name: 'Object | String', required: true },
      table:{
        type: { summary: 'Object | String' },
        defaultValue: { summary: '必传' },
      },
      control:'object'
    },
    source: {
      description:'[imagesource使用参考](https://docs.mapbox.com/mapbox-gl-js/api/#imagesource)',
      type: { name: 'Object | String', required: false },
      table:{
        type: { summary: 'Object | String' },
        // defaultValue: { summary: '' },
      },
      control:'object'
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
    sourceId: {
      description: '待添加的数据源的id，不能与现有的数据源冲突',
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
  components: { MapgisWebMap, MapgisImageLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.3, 40.5]" :zoom="5" style="height:60vh">
    <mapgis-image-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Image = Template.bind({});
Image.args = {
  layer: {
    source: "image_source_id",
    type: "raster",
    paint: { "raster-opacity": 0.85 },
  },
  layerId: "image_layer_id",
  source: {
    type: "image",
    url: `http://${window.webclient.ip}/static/data/picture/imagelayer.png`,
    coordinates: [
      [108.7381, 45.6339],
      [126.0011, 45.6339],
      [126.0011, 34.2583],
      [108.7381, 34.2583],
    ],
  },
  sourceId: "image_source_id",
};
