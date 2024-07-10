import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../../mapboxgl/src/components/layer/GeojsonLayer";

import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;

import "../style/popup.css";

export default {
  title: "二维/数据图层/矢量/GeoJSON/点",
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

export const 点 = Template.bind({});
点.args = {
  layerId: "geojson_layer_id",
  layerStyle: new PointStyle({
    radius: 12,
    color: "#ffffff",
    opacity: 0.8,
    outlineWidth: 5,
    outlineColor: "#52B883",
  }),
  highlightStyle: {
    point: new PointStyle({
      radius: 15,
      color: "#ffff00",
      opacity: 0.8,
      outlineWidth: 6,
      outlineColor: "#ff0000",
    }),
  },
  data: `${window.domain}/static/data/geojson/china.geojson` /* geojson, */,
  enablePopup: true,
  enableTips: true,
};
