import { Symbol, Renderer } from "@mapgis/webclient-es6-service";
const {
  PointSymbol3D,
  LineSymbol3D,
  PolygonSymbol3D,
  IconSymbol3DLayer,
  LineSymbol3DLayer,
  FillSymbol3DLayer,
  ExtrudeSymbol3DLayer,
} = Symbol;
const {
  SimpleRenderer,
  UniqueValueRenderer,
  ClassBreaksRenderer,
  ColorVariable,
  OpacityVariable,
} = Renderer;
import Markdown from "../../cesium/docs/api/layer/Geojson/geojson.md";
import MapgisThemeLegend from "../../cesium/src/components/Layer/IGServer/Legend.vue";

export default {
  title: "三维/可视化/专题图/统一",
  component: MapgisThemeLegend,
  argTypes: {
    vueKey: {
      description: "组件ID",
      type: { name: "String", required: false },
      table: {
        type: { summary: "String" },
      },
      control: "text",
    },
    vueIndex: {
      description: "区分组件的标识符",
      type: { name: "Number", required: false },
      table: {
        type: { summary: "Number" },
      },
      control: "text",
    },
    // data: {
    //   description: "geojson请求地址",
    //   type: [String, Object],
    //   control: "text",
    // },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisThemeLegend },
  data() {
    return {};
  },
  template: `
  <mapgis-web-scene style="height: 95vh">
    <mapgis-3d-geojson-layer
      v-bind="$props"
    ></mapgis-3d-geojson-layer>
  </mapgis-web-scene>
  `,
});

export const 点 = Template.bind({});
// data: `http://${window.webclient.ip}:${window.webclient.port}/geojson/metroStation.json`
点.args = {
  data: `http://192.168.21.191:8088/Vector/json/metroStation_topo.json`,
  autoReset: true,
  renderer: new SimpleRenderer({
    type: "simple",
    symbol: new PointSymbol3D({
      type: "point-3d",
      symbolLayers: new IconSymbol3DLayer({
        type: "icon",
        material: { color: "#ff0000" },
        outline: { color: "#ff0000", width: 1.0 },
        size: 20.0,
      }),
    }),
  }),
};

export const 线 = Template.bind({});
// data: `http://${window.webclient.ip}:${window.webclient.port}/geojson/metro.json`
线.args = {
  data: `http://192.168.21.191:8088/Vector/json/metro.json`,
  autoReset: true,
  renderer: new SimpleRenderer({
    type: "simple",
    symbol: new LineSymbol3D({
      type: "line-3d",
      symbolLayers: new LineSymbol3DLayer({
        type: "line",
        material: { color: "#ff0000" },
        size: 10.0,
      }),
    }),
  }),
};

export const 区 = Template.bind({});
// data: `http://${window.webclient.ip}:${window.webclient.port}/geojson/populationSizeGeoJson_2017.json`
区.args = {
  data: "http://192.168.21.191:8088/Vector/json/metro.json",
  autoReset: true,
  renderer: new SimpleRenderer({
    type: "simple",
    symbol: new PolygonSymbol3D({
      type: "polygon-3d",
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ff0000" },
        outline: { color: "#ffffff", width: 1.0 },
      }),
    }),
  }),
};

区.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
