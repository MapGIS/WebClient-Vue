import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../../mapboxgl/src/components/layer/GeojsonLayer";

import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;

import '../style/popup.css';

export default {
  title: "二维/数据图层/矢量/GeoJSON/区",
  component: MapgisGeojsonLayer,
  argTypes: {
    layer: {},
    layerId: "geojson_layer_id",
    source: {},
    sourceId: "geojson_source_id",
    enablePopup: true,
    enableTips: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisGeojsonLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[114.3, 30.5]" :zoom="3" style="height:95vh">
    <mapgis-geojson-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const 区 = Template.bind({});
区.args = {
  layerId: "geojson_layer_id",
  layerStyle: new FillStyle({
    color: "#ffffff",
    opacity: 0.8,
    outlineColor: "#52B883",
  }),

  highlightStyle: {
    polygon: new FillStyle({
      width: 8,
      color: "#ffff00",
      opacity: 0.8,
      outlineColor: "#ff0000",
    }),
  },
  data:
      `http://${window.webclient.ip}:${window.webclient.port}/static/data/geojson/china.geojson` /* geojson, */,
  enablePopup: true,
  enableTips: true,
};
