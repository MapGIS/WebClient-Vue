import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;
export default {
  title: "三维/分析/缓冲分析",
  argTypes: {
    baseUrl:{
      description: "http://localhost:6163",
      table:{
        defaultValue: { summary: "http://localhost:6163" },
      },
      control:'text'
    },
    srcType: {
      description: "缓冲数据源类型: 图层级缓冲Layer/要素级缓冲Feature",
      table:{
        defaultValue: { summary: "Layer" },
      },
      control: 'text'
    },
    srcLayer: {
      description: "输入图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'text'
    },
    srcFeature: {
      description: "输入要素的GeoJSON数据",
      table:{
        defaultValue: { summary: {} },
      },
      control:'object'
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      finishL: false,
      finishF: false,
      add: false,
      gdbps: "",
      feature: undefined,
      layerStyle: new FillStyle({
        color: "#ff0000",
        outlineColor: "#ff0000",
        outlineWidth: 2.5,
        opacity: 1,
      }),
    };
  },
  methods: {
    showLayer(data) {
      this.finishL = true
      this.gdbps = data
    },
    showFeature(data) {
      this.finishF = true
      this.feature = data
    },
    showAdd(data) {
      this.add = data
    },
    
  },
  template: `
    <mapgis-web-scene style="height: 95vh">
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-buffer-analysis v-bind="$props" @listenLayer="showLayer" @listenFeature="showFeature" @listenBufferAdd="showAdd"/>
      </mapgis-ui-card>
      <mapgis-3d-igs-dynamic-layer v-if="finishL && add" baseUrl="http://localhost:6163/igs/rest/mrms/layers" :gdbps="gdbps"></mapgis-3d-igs-dynamic-layer>
      <mapgis-3d-geojson-layer v-if="finishF && add" :layerStyle="layerStyle" :baseUrl="feature"/>
    </mapgis-web-scene>
    `,
});

export const 缓冲区分析 = Template.bind({});
缓冲区分析.args = {
  baseUrl: "http://localhost:6163",
  srcType: "Layer",
  // srcType: "Feature",
  srcLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",

  srcFeature: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "id": "id0",
        "geometry": {
          "type": "Point",
          "coordinates": [114, 45]
        },
      },
      {
        "type": "Feature",
        "properties": {},
        "id": "id0",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [105, 30], [107, 31], [109, 30], [107, 29]
          ]
        },
      },
      {
        "type": "Feature",
        "properties": {},
        "id": "id1",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [114,30], [114,40], [124,40], [124,30], [114,30]
            ],
            [
              [110,15] , [120,20] , [125,25] , [130,30] , [110,15]
            ]
          ]
        },
      }
    ]
  },
};