import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisImageLayer from "../../mapboxgl/src/components/layer/ImageLayer.js";

export default {
  title: "二维/图层/图像图层",
  component: MapgisImageLayer,
  argTypes: {
    layer: {},
    layerId: "geojson_layer_id",
    source: {},
    sourceId: "geojson_source_id",
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
