import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;
import Markdown from "../../cesium/docs/api/analysis/Buffer.md";

export default {
  title: "三维/分析/缓冲分析",
  argTypes: {
    srcType: {
      description: "缓冲数据源类型：图层级缓冲Layer；要素级缓冲Feature",
      table:{
        defaultValue: { summary: "Layer" },
      },
      control: 'text'
    },
    baseUrl:{
      description: "输入图层的baseUrl",
      table:{
        defaultValue: { summary: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/layers` },
      },
      control:'text'
    },
    srcLayer: {
      description: "输入图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control: 'text'
    },
    srcFeature: {
      description: "输入要素的GeoJSON数据",
      table:{
        defaultValue: { summary: {} },
      },
      control: 'object'
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      finishedLayer: false,
      finishedFeature: false,
      addResultToLayer: false,
      resultLayer: "",
      resultFeature: undefined,
      layerStyle: new FillStyle({
        color: "#ff0000",
        outlineColor: "#ff0000",
        outlineWidth: 2.5,
        opacity: 1,
      })
    };
  },
  methods: {
    showLayer(data) {
      this.finishedLayer = true
      this.resultLayer = data
    },
    showFeature(data) {
      this.finishedFeature = true
      this.resultFeature = data
    },
    showAdd(data) {
      this.addResultToLayer = data
    }
  },
    template: `
    <mapgis-web-scene style="height: 95vh">
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-analysis-buffer v-bind="$props" @listenLayer="showLayer" @listenFeature="showFeature" @listenBufferAdd="showAdd"/>
      </mapgis-ui-card>
      <mapgis-3d-igs-dynamic-layer v-if="finishedLayer && addResultToLayer" :baseUrl="this.baseUrl" :gdbps="resultLayer"></mapgis-3d-igs-dynamic-layer>
      <mapgis-3d-geojson-layer v-if="finishedFeature && addResultToLayer" :layerStyle="layerStyle" :baseUrl="resultFeature"/>
    </mapgis-web-scene>
    `,
});

{/* <mapgis-web-scene style="height: 95vh">
<mapgis-ui-borderbox1 class="storybook-ui-card" style="height:60vh;">
  <mapgis-3d-analysis-buffer v-bind="$props" @listenLayer="showLayer" @listenFeature="showFeature" @listenBufferAdd="showAdd"/>
</mapgis-ui-borderbox1>
<mapgis-3d-igs-dynamic-layer v-if="finishedLayer && addResultToLayer" :baseUrl="this.baseUrl" :gdbps="resultLayer"></mapgis-3d-igs-dynamic-layer>
<mapgis-3d-geojson-layer v-if="finishedFeature && addResultToLayer" :layerStyle="layerStyle" :baseUrl="resultFeature"/>
</mapgis-web-scene> */}

export const Buffer = Template.bind({});
Buffer.args = {
  srcType: "Layer",
  // srcType: "Feature",
  baseUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/layers`,
  srcLayer: "gdbp://MapGISLocal/Templates/sfcls/湖北省市级区划",
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
  }
};
Buffer.parameters = {
  docs: {
      description: {
          component: Markdown,
      },
  },
};
