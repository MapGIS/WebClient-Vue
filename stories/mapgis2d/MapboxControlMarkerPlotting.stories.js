import MapgisMarkerPlotting from "../../mapboxgl/src/components/UI/marker/MarkerPlotting.vue";

export default {
  title: "二维/地图子组件/标注-标绘",
  component: MapgisMarkerPlotting,
  argTypes: {
    markers: [
      {
        markerId: "1",
        coordinates: [110, 30],
        img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
        properties: {
          name: "测试名称",
          address: "街道1",
          description: "详细描述",
        },
      },
    ],
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
    selectionBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMarkerPlotting },
  data() {
    return {};
  },
  methods: {},
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.2]" :zoom="3" style="height:95vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-marker-plotting v-bind="$props">
      <mapigs-ui-card slot="popup" slot-scope="{ marker }">
        {{marker.markerId}}
      </mapigs-ui-card>
    </mapgis-marker-plotting>
  </mapgis-web-map>`,
});

export const 标绘标注 = Template.bind({});
标绘标注.args = {
  markers: [
    {
      markerId: "标绘1",
      coordinates: [110, 30],
      img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
      properties: {
        name: "测试名称",
        address: "街道1",
        description: "详细描述",
      },
      feature: {
        type: "Feature",
        properties: { AREA: 0, PERIMETER: 0, name: "东方市", mapgis_style: 1 },
        geometry: {
          type: "Point",
          coordinates: [110, 30],
        },
      },
    },
    {
      markerId: "标绘2",
      coordinates: [114.60937499999999, 32.1011897323209],
      img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
      properties: {
        name: "测试名称",
        address: "街道1",
        description: "详细描述",
      },
      feature: {
        type: "Feature",
        properties: {},
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
    },
    {
      markerId: "标绘3",
      coordinates: [91.23046875, 39.90973623453719],
      img: "http://develop.smaryun.com/static/assets/graphic-image/bar.png",
      properties: {
        name: "测试名称",
        address: "街道1",
        description: "详细描述",
      },
      feature: {
        type: "Feature",
        properties: {},
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
    },
  ],
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
  selectionBound: { xmin: 100, ymin: 20, xmax: 110, ymax: 30 },
};
