import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../../mapboxgl/src/components/layer/GeojsonLayer";

import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;

import '../style/popup.css';

export default {
  title: "二维/图层/GeoJSON图层/线",
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

export const 线 = Template.bind({});
线.args = {
  layerId: "geojson_layer_id",
  layerStyle: new LineStyle({
    width: 6,
    color: "#ffffff",
    opacity: 0.8,
    outlineWidth: 5,
    outlineColor: "#52B883",
  }),

  highlightStyle: {
    line: new LineStyle({
      width: 8,
      color: "#ffff00",
      opacity: 0.8,
      outlineWidth: 6,
      outlineColor: "#ff0000",
    }),
  },
  data:
    `http://${window.webclient.ip}/static/data/geojson/china.geojson` /* geojson, */,
    enablePopup: true,
  enableTips: true,
};
