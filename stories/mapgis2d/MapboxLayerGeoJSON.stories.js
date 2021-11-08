import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../../mapboxgl/src/components/layer/GeojsonLayer";

import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;

export default {
  title: "二维/图层/GeoJSON图层",
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

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [114.28939819335936, 30.594183452544694],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [114.34776306152344, 30.623436511269382],
          [114.32510375976562, 30.63909360759635],
          [114.30673599243164, 30.634958017061198],
          [114.29180145263672, 30.629640569460406],
          [114.28339004516601, 30.627424880048103],
          [114.26467895507812, 30.620777507443577],
          [114.24613952636719, 30.616050209185243],
          [114.23566818237304, 30.61073172273802],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [114.33454513549805, 30.479893814659587],
            [114.38587188720703, 30.479893814659587],
            [114.38587188720703, 30.504596494227247],
            [114.33454513549805, 30.504596494227247],
            [114.33454513549805, 30.479893814659587],
          ],
        ],
      },
    },
  ],
};

export const Circle = Template.bind({});
Circle.args = {
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
  data:
      `http://${window.webclient.ip}/static/data/geojson/china.geojson` /* geojson, */,
  enablePopup: true,
  enableTips: true,
};

export const Line = Template.bind({});
Line.args = {
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

export const Fill = Template.bind({});
Fill.args = {
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
      `http://${window.webclient.ip}/static/data/geojson/china.geojson` /* geojson, */,
  enablePopup: true,
  enableTips: true,
};
