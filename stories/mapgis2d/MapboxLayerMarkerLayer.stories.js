import MapgisMarkerLayer from "../../mapboxgl/src/components/UI/marker/MarkerLayer.vue";
import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle, Shadow } = Style;

const DefaultActiveImagePlotting =
  "data:image/png;base64,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";
const DefaultInactiveImagePlotting =
  "data:image/png;base64,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";

export default {
  title: "二维/图层/标注图层",
  component: MapgisMarkerLayer,
  argTypes: {
    selects: [],
    idField: "markerId",
    layerStyle: {
      marker: new MarkerStyle({
        symbol: DefaultInactiveImagePlotting,
      }),
    },
    highlightStyle: {
      point: new PointStyle(),
      line: new LineStyle(),
      polygon: new FillStyle(),
      marker: new MarkerStyle({
        symbol: DefaultActiveImagePlotting,
      }),
    },
    fitBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMarkerLayer },
  data() {
    return {};
  },
  methods: {},
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3" style="height:95vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-marker-layer v-bind="$props">
      <mapigs-ui-card slot="popup" slot-scope="{ marker }">
        {{marker.fid}}
      </mapigs-ui-card>
    </mapgis-marker-layer>
  </mapgis-web-map>`,
});

export const 标绘图层 = Template.bind({});
标绘图层.args = {
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { fid: "1111" },
        geometry: {
          type: "Point",
          coordinates: [110, 30],
        },
      },
      {
        type: "Feature",
        properties: {
          fid: "2222",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [98.0859375, 35.60371874069731],
            [108.6328125, 27.21555620902969],
            [114.60937499999999, 32.10118973232094],
            [113.5546875, 38.685509760012],
          ],
        },
      },
      {
        type: "Feature",
        properties: { fid: "3333" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [68.73046875, 25.958044673317843],
              [91.23046875, 25.958044673317843],
              [91.23046875, 39.90973623453719],
              [68.73046875, 39.90973623453719],
              [68.73046875, 25.958044673317843],
            ],
          ],
        },
      },
    ],
  },
  idField: "fid",
  selects: ["1111", "2222"],
  fitBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
  layerStyle: {
    marker: new MarkerStyle({
      symbol: DefaultInactiveImagePlotting,
    }),
  },
  highlightStyle: {
    point: new PointStyle({
      color: "#ff0000",
      opacity: 0.8,
      radius: 10,
      outlineWidth: 5,
      outlineColor: "#000000",
    }),
    line: new LineStyle({
      color: "#ff0000",
      opacity: 0.8,
      width: 5,
      cap: 'round',
      join: 'round',
      shadow: new Shadow({ blur: 0 }),
    }),
    polygon: new FillStyle({
      color: "#ff0000",
      opacity: 0.8,
      outlineColor: "#000000",
    }),
    marker: new MarkerStyle({
      symbol: DefaultActiveImagePlotting,
    }),
  },
};
