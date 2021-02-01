import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWfsLayer from "../mapboxgl/src/components/layer/ogc/OgcWfsLayer.vue";

export default {
  title: "二维/OGC-WFS",
  component: MapgisOgcWfsLayer,
  argTypes: {
    url:
      "http://219.142.81.85/arcgis/services/orefield2019_6/MapServer/WFSServer",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWfsLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="3.5">
    <mapgis-ogc-wfs-layer v-bind="$props" />
  </mapgis-web-map>`,
});

/* export const GeoServer = Template.bind({});
GeoServer.args = {
  layerId: "wfs_layer_id",
  url: "https://ahocevar.com/geoserver/wfs",
}; */

export const MapGIS = Template.bind({});
MapGIS.args = {
  layerId: "wfs_layer_id",
  url:
    "http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WFSServer",
};

/* export const ArcGIS = Template.bind({});
ArcGIS.args = {
  layerId: "wfs_layer_id",
  url:
    "http://219.142.81.85/arcgis/services/orefield2019_6/MapServer/WFSServer",
}; */
