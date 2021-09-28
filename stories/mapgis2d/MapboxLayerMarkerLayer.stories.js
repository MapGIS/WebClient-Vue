import MapgisMarkerLayer from "../../mapboxgl/src/components/UI/marker/MarkerLayer.vue";

export default {
  title: "二维/图层/标注",
  component: MapgisMarkerLayer,
  argTypes: {
    selectedMarkers: [],
    highlightStyle: {
      feature: {
        pnt: {
          color: "#ff0000",
          size: 5,
        },
        line: { color: "#ff0000", size: 5 },
        reg: {
          color: "#ff0000",
          size: 5,
        },
      },
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
        {{marker.markerId}}
      </mapigs-ui-card>
    </mapgis-marker-layer>
  </mapgis-web-map>`,
});

export const 标绘标注 = Template.bind({});
标绘标注.args = {
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { markerId: "1111" },
        geometry: {
          type: "Point",
          coordinates: [110, 30],
        },
      },
      {
        type: "Feature",
        properties: {
          markerId: "2222",
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
        properties: { markerId: "3333" },
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
  selectedMarkers: [],
  highlightStyle: {
    feature: {
      pnt: {
        color: "#ff0000",
        size: 25,
      },
      line: { color: "#ff0000", size: 5 },
      reg: {
        color: "#ff0000",
        size: 5,
      },
    },
  },
  fitBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
};
