import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsDocLayer from "../mapboxgl/src/components/layer/igserver/IgsDocLayer";

export default {
  title: "二维/IGServer-地图文档",
  component: MapgisIgsDocLayer,
  argTypes: {
    layer: {},
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    url: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsDocLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="8">
    <mapgis-igs-doc-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Doc = Template.bind({});
Doc.args = {
  layerId: "igs_layer_layerid",
  url: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
};
