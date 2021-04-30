import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsDocLayer from "../mapboxgl/src/components/layer/igserver/IgsDocLayer";
import FeatureLayer from "./component/FeatureLayerIgserver";

export default {
  title: "二维/OGC-WFS",
  component: MapgisIgsDocLayer,
  argTypes: {
    layer: {},
    layerId: "wuhan_WFS_4326",
    sourceId: "wuhan_WFS_4326",
    url: "http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsDocLayer,FeatureLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[(113.69534616+115.07406408)/2, (29.969811+31.36330098)/2]" :zoom="8">
  <mapgis-igs-doc-layer v-bind="$props" />
  <FeatureLayer v-bind="$props"></FeatureLayer>
  </mapgis-web-map>`,
});

export const Doc = Template.bind({});
Doc.args = {
  layerId: "wuhan_WFS_4326",
  url: "http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326"
};
