import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsTileLayer from "../mapboxgl/src/components/layer/igserver/IgsTileLayer";

export default {
  title: "二维/IGServer-地图瓦片",
  component: MapgisIgsTileLayer,
  argTypes: {
    layer: {},
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    url: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsTileLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="8" style="height:60vh">
    <mapgis-igs-tile-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Tile = Template.bind({});
Tile.args = {
  layerId: "igs_layer_layerid",
  url: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
};
