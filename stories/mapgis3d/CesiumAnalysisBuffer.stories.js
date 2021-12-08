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
      control:'String'
    },
    srcType: {
      description: "缓冲数据源类型：图层级缓冲/要素级缓冲",
      table:{
        defaultValue: { summary: "Feature" },
      },
      control: 'String'
    },
    srcLayer: {
      description: "输入图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'String'
    },
    destLayer: {
      description: "输出图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'String'
    },
    srcFeature: {
      description: "输入要素的json数据",
      table:{
        defaultValue: { summary: "" },
      },
      control:'Object'
    },
    destFeature: {
      description: "输出要素的json数据",
      table:{
        defaultValue: { summary: "" },
      },
      control:'Object'
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      add: false,
      // gdbps: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",
      // gdbps: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓test",
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
    showAdd(data) {
      this.add = data
      console.log(this.add)
    },
    showFeature(data) {
      this.feature = data
      console.log(this.feature)
    }
  },
  template: `
    <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-igs-feature-layer baseUrl="gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓"></mapgis-3d-igs-feature-layer>
      <mapgis-3d-buffer-analysis v-bind="$props" v-on:listenBufferAdd="showAdd" v-on:listenFeature="showFeature"/>
      <mapgis-3d-igs-dynamic-layer v-if="add" baseUrl="http://localhost:6163/igs/rest/mrms/layers" gdbps="gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓"></mapgis-3d-igs-dynamic-layer>
      <mapgis-3d-geojson-layer v-if="feature" :layerStyle="layerStyle" :baseUrl="feature"/>
    </mapgis-web-scene>
    `,
});

export const 缓冲区分析 = Template.bind({});
缓冲区分析.args = {
  // baseUrl: "http://192.168.21.192:6163",
  baseUrl: "http://localhost:6163",
  srcType: "Layer",
  // srcType: "Feature",
  // srcLayer: "gdbp://MapGISLocalPlus/sample/sfcls/等值线",
  // srcLayer: "gdbp://MapGISLocal/Templates/sfcls/湖北省市级区划",
  srcLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",
  destLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓test",
  // srcFeature: {
  //   "type":"Feature",
  //   "properties":{},
  //   "geometry":{
  //     "type":"LineString",
  //     "coordinates":[ [105, 30], [107, 31], [109, 30], [107, 29] ]
  //   }
  // },
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
  destFeature: {},
};


// 构造测试数据

// 点
// var point = {
//   "type":"Feature",
//   "properties":{},
//   "geometry":{
//     "type":"Point",
//     "coordinates":[114, 30]
//   }
// }

// 线
// var polyline = {"type":"Feature",
//   "properties":{},
//   "geometry":{
//     "type":"LineString",
//     "coordinates":[ [105, 30], [107, 31], [109, 30], [107, 29] ]
//   }
// }

// 多面
// var polygon = {
//   "type": "Feature",
//   "properties": {},
//   "geometry": {
//     "type": "MultiPolygon",
//     "coordinates":	[
//       [
//         [ [114,30], [114,40], [124,40], [124,30], [114,30],	]
//       ] ,
//       [
//         [ [110,15] , [120,20] , [125,25] , [130,30] , [110,15] ]
//       ]
//      ]
//   }
// }

// GeoJSON要素集合
// var collection = {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {},
//       "id": "id0",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [114, 45]
//       },
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "id": "id0",
//       "geometry": {
//         "type": "LineString",
//         "coordinates": [
//           [105, 30], [107, 31], [109, 30], [107, 29]
//         ]
//       },
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "id": "id1",
//       "geometry": {
//                 "type": "Polygon",
//         "coordinates": [
//           [
//             [114,30], [114,40], [124,40], [124,30], [114,30]
//           ],
//           [
//             [110,15] , [120,20] , [125,25] , [130,30] , [110,15]
//           ]
//         ]
//       },
//     }
//   ]
// }