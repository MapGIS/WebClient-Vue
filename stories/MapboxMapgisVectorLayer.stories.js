import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisIgsVectorLayer from "../mapboxgl/src/components/layer/igserver/IgsVectorLayer";

export default {
  title: "二维/IGServer-矢量图层",
  component: MapgisIgsVectorLayer,
  argTypes: {
    layer: {},
    layerId: "igs_layer_layerid",
    sourceId: "igs_layer_sourceid",
    url: "http://develop.smaryun.com:6163/igs/rest/mrms/layers",
    gdbps: ["gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/湖北省市级区划2"],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisIgsVectorLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[112.247175, 30.152892]" :zoom="6">
    <mapgis-igs-vector-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Vector = Template.bind({});
Vector.args = {
  layerId: "igs_layer_layerid",
  url: "http://develop.smaryun.com:6163/igs/rest/mrms/layers",
  gdbps: [
    "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/湖北省市级区划2",
    "gdbp://MapGisLocal/ClientTheme/ds/epsg4326/sfcls/点编辑",
  ],
};
