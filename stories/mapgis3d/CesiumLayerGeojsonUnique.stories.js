import { Symbol, Renderer } from "@mapgis/webclient-es6-service";
const { PointSymbol3D, LineSymbol3D, PolygonSymbol3D, IconSymbol3DLayer, LineSymbol3DLayer, FillSymbol3DLayer, ExtrudeSymbol3DLayer } = Symbol;
const { SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, ColorVariable, OpacityVariable } = Renderer;
import Markdown from "../../cesium/docs/api/layer/Geojson/geojson.md";
import MapgisThemeLegend from "../../cesium/src/components/Layer/IGServer/Legend.vue";

export default {
  title: "三维/图层/geojson/单值专题图",
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
    baseUrl: {
      description: "geojson请求地址",
      type: { name: "String", required: true },
      table: {
        type: { summary: "String" },
      },
      control: "text",
    }
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
点.args = {
  baseUrl: "http://localhost:8895/geojson/metroStation.json",
  autoReset: true,
  renderer: new UniqueValueRenderer({
    type: "unique-value",
    field: "lg",
    defaultSymbol: new PointSymbol3D({
      type: 'point-3d',
      symbolLayers: new IconSymbol3DLayer({
        type: "icon",
        material: { color: "#ffff00" },
        outline: { color: "#ff0000", width: 1.0 },
        size: 100.0,
      })
    }),
    defaultLabel: "标签",
    uniqueValueInfos: [
      {
        value: "0",
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#ff0000" },
            outline: { color: "#000000", width: 1.0 },
            size: 100.0,
          })
        }),
        label: "0",
      },
      {
        value: "1",
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#00ff00" },
            outline: { color: "#000000", width: 1.0 },
            size: 100.0,
          })
        }),
        label: "1",
      },
      {
        value: "2",
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#0000ff" },
            outline: { color: "#0000ff", width: 1.0 },
            size: 100.0,
          })
        }),
        label: "2",
      },
    ],
  }),
};

export const 线 = Template.bind({});
线.args = {
  baseUrl: "http://localhost:8895/geojson/metro.json",
  autoReset: true,
  renderer: new UniqueValueRenderer({
    type: "unique-value",
    field: "x",
    defaultSymbol: new LineSymbol3D({
      type: 'line-3d',
      symbolLayers: new LineSymbol3DLayer({
        type: "line",
        material: { color: "#ffff00" },
        size: 1.0,
      })
    }),
    defaultLabel: "标签",
    uniqueValueInfos: [
      {
        value: 1,
        symbol: new LineSymbol3D({
          type: 'line-3d',
          symbolLayers: new LineSymbol3DLayer({
            type: "line",
            material: { color: "#ff0000" },
            size: 1.0,
          })
        }),
        label: "1号线",
      },
      {
        value: 2,
        symbol: new LineSymbol3D({
          type: 'line-3d',
          symbolLayers: new LineSymbol3DLayer({
            type: "line",
            material: { color: "#00ff00" },
            size: 1.0,
          })
        }),
        label: "2号线",
      },
      {
        value: 3,
        symbol: new LineSymbol3D({
          type: 'line-3d',
          symbolLayers: new LineSymbol3DLayer({
            type: "line",
            material: { color: "#0000ff" },
            size: 1.0,
          })
        }),
        label: "3号线",
      },
    ],
  }),
};

export const 区 = Template.bind({});
区.args = {
  baseUrl: "http://localhost:8895/geojson/populationSizeGeoJson_2017.json",
  autoReset: true,
  renderer: new UniqueValueRenderer({
    type: "unique-value",
    field: "name",
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ffff00" },
        outline: { color: "#ffffff", width: 1.0 },
      })
    }),
    defaultLabel: "标签",
    uniqueValueInfos: [
      {
        value: "新洲区",
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#ff0000" },
            outline: { color: "#ffffff", width: 1.0 },
          })
        }),
        label: "新洲区",
      },
      {
        value: "黄陂区",
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#00ff00" },
            outline: { color: "#ffffff", width: 1.0 },
          })
        }),
        label: "黄陂区",
      },
      {
        value: "洪山区",
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#0000ff" },
            outline: { color: "#ffffff", width: 1.0 },
          })
        }),
        label: "洪山区",
      },
    ],
  }),
};

区.parameters = {
  docs: {
      description: {
          component: Markdown,
      },
  },
};
