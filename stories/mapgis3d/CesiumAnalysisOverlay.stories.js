export default {
  title: "三维/分析/叠加分析",
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
        defaultValue: { summary: "Layer" },
      },
      control: 'String'
    },
    srcALayer: {
      description: "输入被叠加图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'String'
    },
    srcBLayer: {
      description: "输入叠加图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'String'
    },
    destLayer: {
      description: "输出叠加分析结果图层的gdbp",
      table:{
        defaultValue: { summary: "" },
      },
      control:'String'
    },
    srcAFeature: {
      description: "输入被叠加要素的GeoJSON数据",
      table:{
        defaultValue: { summary: "" },
      },
      control:'Object'
    },
    srcBFeature: {
      description: "输入叠加要素的GeoJSON数据",
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
    };
  },
  template: `
    <mapgis-web-scene style="height: 95vh">
       <mapgis-3d-overlay-analysis v-bind="$props"/>
    </mapgis-web-scene>
    `,
});

export const 叠加分析组件 = Template.bind({});
叠加分析组件.args = {
  // baseUrl: "http://172.38.172.10:8089",
  baseUrl: "http://localhost:6163/",
  srcType: "Layer",
  srcALayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓",
  srcBLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市建筑物",
  destLayer: "gdbp://MapGISLocalPlus/sample/sfcls/武汉市轮廓-overlay",
  srcAFeature: {},
  srcBFeature: {},
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
