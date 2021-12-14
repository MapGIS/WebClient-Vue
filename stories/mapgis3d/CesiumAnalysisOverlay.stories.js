import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/分析/叠加分析",
  argTypes: {
    baseUrl:{
      description: "http://localhost:6163",
      table:{
        defaultValue: { summary: "http://localhost:6163" },
      },
      control:'text'
    },
    srcType: {
      description: "缓冲数据源类型: 图层级叠加Layer/要素级叠加Feature",
      table:{
        defaultValue: { summary: "Layer" },
      },
      control: 'text'
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
      description: "输入被叠加要素的GeoJSON数据",
      table:{
        defaultValue: { summary: {} },
      },
      control:'object'
    },
    srcBFeature: {
      description: "输入叠加要素的GeoJSON数据",
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
      gdbps: "",
      add: false,
      feature: {
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
      },
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
    showAdd(data) {
      this.add = data
    },
  },
  template: `
    <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-overlay-analysis v-bind="$props" v-on:listenLayer="showLayer" v-on:listenOverlayAdd="showAdd"/>
      <mapgis-3d-igs-dynamic-layer v-if="finishL && add" baseUrl="http://localhost:6163/igs/rest/mrms/layers" :gdbps="gdbps"></mapgis-3d-igs-dynamic-layer>
    </mapgis-web-scene>
    `,
});

export const 叠加分析组件 = Template.bind({});
叠加分析组件.args = {
  baseUrl: "http://localhost:6163/",
  // srcType: "Layer",
  srcType: "Feature",
  srcALayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",
  srcBLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市建筑物",

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
  },
  srcBFeature: {},
};
