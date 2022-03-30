import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle } = Style;
import Markdown from "../../cesium/docs/api/analysis/Overlay.md";

export default {
  title: "三维/分析/叠加分析",
  argTypes: {
    srcType: {
      description: "叠加数据源类型：图层级叠加Layer；要素级叠加Feature",
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
    srcALayer: {
      description: "输入被叠加图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'text'
    },
    srcBLayer: {
      description: "输入叠加图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'text'
    },
    srcAFeature: {
      description: "输入叠加要素的GeoJSON数据",
      table:{
        defaultValue: { summary: {} },
      },
      control:'object'
    },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      // baseUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/layers`,
      finishedResult: false,
      resultLayer: "",
      addResultToLayer: false
    };
  },
  methods: {
    showLayer(data) {
      this.finishedResult = true
      this.resultLayer = data
    },
    showAdd(data) {
      this.addResultToLayer = data
    },
  },
  template: `
    <mapgis-web-scene style="height: 95vh">
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-analysis-overlay v-bind="$props" v-on:listenLayer="showLayer" v-on:listenOverlayAdd="showAdd"/>
      </mapgis-ui-card>
      <mapgis-3d-igs-dynamic-layer v-if="finishedResult && addResultToLayer" :baseUrl="this.baseUrl" :gdbps="resultLayer"></mapgis-3d-igs-dynamic-layer>
    </mapgis-web-scene>
    `,
});

export const Overlay = Template.bind({});
Overlay.args = {
  srcType: "Layer",
  // srcType: "Feature",
  baseUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/layers`,
  srcALayer: "gdbp://MapGISLocal/Templates/sfcls/湖北省市级区划",
  srcBLayer: "gdbp://MapGisLocal/专题图数据/sfcls/县城驻地",
  srcAFeature: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "id": "id1",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [ [114,30], [114,31], [115,31], [115,30], [114,30] ]
          ]
        },
      },
      {
        "type": "Feature",
        "properties": {},
        "id": "id2",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [ [115,30] , [115,31] , [116,31] , [116,30] , [115,30] ]
          ]
        },
      },
    ]
  }
};
Overlay.parameters = {
  docs: {
      description: {
          component: Markdown,
      },
  },
};
