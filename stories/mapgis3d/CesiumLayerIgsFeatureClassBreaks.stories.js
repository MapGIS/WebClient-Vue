import { Symbol, Renderer } from "@mapgis/webclient-es6-service";
const { PointSymbol3D, LineSymbol3D, PolygonSymbol3D, IconSymbol3DLayer, LineSymbol3DLayer, FillSymbol3DLayer, ExtrudeSymbol3DLayer } = Symbol;
const { SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, ColorVariable, OpacityVariable } = Renderer;
import Markdown from "../../cesium/docs/api/layer/IGServer/IgsFeatureLayer.md";
import MapgisThemeLegend from "../../cesium/src/components/Layer/IGServer/Legend.vue";

export default {
  title: "三维/图层/IGSFeatureLayer/分段专题图",
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
      description: "IGServer服务请求地址",
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
    return {
      rendererInfo1: {
        title: "武汉市2022年GDP",
        fields: [
          {label: "极低", color: "#ff0000"},
          {label: "低", color: "#ffff00"},
          {label: "中等", color: "#00ff00"},
          {label: "高", color: "#00ffff"},
          {label: "极高", color: "#0000ff"}
        ],
      },
      rendererInfo2: {},
    };
  },
  template: `
  <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-igs-feature-layer
          v-bind="$props"
      ></mapgis-3d-igs-feature-layer>
      <mapgis-theme-legend :enableLegend="$props.enableLegend" :rendererInfo="rendererInfo2" :renderer="$props.renderer"></mapgis-theme-legend>
  </mapgis-web-scene>
  `,
});

export const 点 = Template.bind({});
点.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/4",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/4",
  autoReset: true,
  enableClick: true,
  enableHover: false,
  highlightSymbol: {
    type: 'point-3d',
    symbolLayers: {
      type: "icon",
      material: { color: "#ffff00", },
    }
  },
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "lg",
    defaultSymbol: new PointSymbol3D({
      type: 'point-3d',
      symbolLayers: {
        type: "icon",
        material: { color: "#ff0000" },
        outline: { color: "#000000", width: 1.0 },
        size: 20.0
      }
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 5,
        minValue: -5,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#00ff00", },
            outline: { color: "#000000", width: 1.0, },
            size: 200.0
          })
        }),
      },
      {
        maxValue: 15,
        minValue: 5,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#0000ff", },
            outline: { color: "#000000", width: 1.0, },
            size: 200.0
          })
        }),
      },
    ],
  }),
};

export const 线 = Template.bind({});
线.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/3",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/3",
  autoReset: true,
  enableClick: true,
  enableHover: true,
  highlightSymbol: {
    type: 'line-3d',
    symbolLayers: {
      type: "line",
      material: { color: "#ffff00", },
    }
  },
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "x",
    defaultSymbol: new LineSymbol3D({
      type: 'line-3d',
      symbolLayers: new LineSymbol3DLayer({
        type: "line",
        material: { color: "#ff0000", },
        size: 1.0
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 5,
        minValue: 1,
        symbol: new LineSymbol3D({
          type: 'line-3d',
          symbolLayers: new LineSymbol3DLayer({
            type: "line",
            material: { color: "#00ff00", },
            size: 1.0
          })
        }),
      },
      {
        maxValue: 10,
        minValue: 5,
        symbol: new LineSymbol3D({
          type: 'line-3d',
          symbolLayers: new LineSymbol3DLayer({
            type: "line",
            material: { color: "#0000ff", },
            size: 1.0
          })
        }),
      },
    ],
  }),
};

export const 区 = Template.bind({});
区.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/0",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/0",
  autoReset: true,
  enablePopup: true,
  popupOptions: {
    "title": 'name',
    "popupType": 'rich-text',
    "scrollNum": 6
  },
  enableClick: true,
  enableHover: false,
  highlightSymbol: {
    type: 'polygon-3d',
    symbolLayers: {
      type: "fill",
      material: { color: "#ffff00", },
    }
  },
  enableLegend: false,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    legendOptions: {title: "武汉市2022年政区人口"},
    field: "zrk",
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ff0000", },
        outline: { color: "#ffffff", width: 1.0, },
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 100,
        minValue: 0,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#00ff00", },
            outline: { color: "#ffffff", width: 1.0, },
          })
        }),
        label: "0-100"
      },
      {
        maxValue: 130,
        minValue: 100,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#0000ff", },
            outline: { color: "#ffffff", width: 1.0, },
          })
        }),
        label: "100-130"
      },
    ],
  }),
};

export const 体 = Template.bind({});
体.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/1",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/1",
  autoReset: true,
  enableClick: true,
  enableHover: false,
  highlightSymbol: {
    type: 'polygon-3d',
    symbolLayers: {
      type: "extrude",
      material: { color: "#ffff00", },
    }
  },
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "mpPerimete",
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new ExtrudeSymbol3DLayer({
        type: "extrude",
        material: { color: "#ff0000", },
        sizeField: "AREA",
        sizeRatio: 10,
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 0.004,
        minValue: 0,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new ExtrudeSymbol3DLayer({
            type: "extrude",
            material: { color: "#00ff00", },
            sizeField: "AREA",
            sizeRatio: 10,
          })
        }),
      },
      {
        maxValue: 0.006,
        minValue: 0.004,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new ExtrudeSymbol3DLayer({
            type: "extrude",
            material: { color: "#0000ff", },
            sizeField: "AREA",
            sizeRatio: 1000,
          })
        }),
      },
    ],
  }),
};

export const 区计算表达式 = Template.bind({});
区计算表达式.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/0",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/0",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "zrk",
    valueExpression: "$feature.zrk - 50",
    valueExpressionTitle: "sqar",
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ff0000", },
        outline: { color: "#ffffff", width: 1.0, },
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 100,
        minValue: 0,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#00ff00", },
            outline: { color: "#ffffff", width: 1.0, },
          })
        }),
      },
      {
        maxValue: 130,
        minValue: 100,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#0000ff", },
            outline: { color: "#ffffff", width: 1.0, },
          })
        }),
      },
    ],
  }),
};

export const 区字段归一化 = Template.bind({});
区字段归一化.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/0",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/0",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "zrk",
    normalizationType: "field",
    normalizationField: "czrk",
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ff0000", },
        outline: { color: "#ffffff", width: 1.0, },
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 1.5,
        minValue: 0,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#00ff00", },
            outline: { color: "#ffffff", width: 1.0, },
          })
        }),
      }
    ],
  }),
};

export const 区总和归一化 = Template.bind({});
区总和归一化.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/0",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/0",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "zrk",
    normalizationType: "percent-of-total",
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ff0000", },
        outline: { color: "#ffffff", width: 1.0, },
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 0.05,
        minValue: 0,
        symbol: new PolygonSymbol3D({
          type: 'polygon-3d',
          symbolLayers: new FillSymbol3DLayer({
            type: "fill",
            material: { color: "#00ff00", },
            outline: { color: "#ffffff", width: 1.0, },
          })
        }),
      }
    ],
  }),
};

export const 点视觉变量颜色 = Template.bind({});
点视觉变量颜色.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/4",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/4",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "lg",
    visualVariables: [
      new ColorVariable({
        type: "color",
        field: "lg",
        stops: [
          {value: 0, color: "#cd0000"},
          {value: 4, color: "#800000"},
          {value: 8, color: "#330000"}
        ]
      })
    ],
    defaultSymbol: new PointSymbol3D({
      type: 'point-3d',
      symbolLayers: {
        type: "icon",
        material: { color: "#ffff00", },
        outline: { color: "#000000", width: 1.0, },
        size: 120.0
      }
    }),
    defaultLabel: "其他",
  }),
};

export const 点视觉变量透明度 = Template.bind({});
点视觉变量透明度.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/4",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/4",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "lg",
    visualVariables: [
      new OpacityVariable({
        type: "opacity",
        field: "lg",
        stops: [
          {value: 0, color: "#ff0000ff"},
          {value: 4, color: "#ff00009a"},
          {value: 8, color: "#ff000033"}
        ]
      })
    ],
    defaultSymbol: new PointSymbol3D({
      type: 'point-3d',
      symbolLayers: {
        type: "icon",
        material: { color: "#ffff00", },
        outline: { color: "#000000", width: 1.0, },
        size: 120.0
      }
    }),
    defaultLabel: "其他",
  }),
};

export const 区视觉变量颜色 = Template.bind({});
区视觉变量颜色.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/0",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/0",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "zrk",
    visualVariables: [
      new ColorVariable({
        type: "color",
        field: "zrk",
        // valueExpression: "$feature.zrk - 50",
        // valueExpressionTitle: "sqar",
        // normalizationType: "field",
        // normalizationField: "czrk",
        // normalizationType: "percent-of-total",
        // normalizationTotal: "10",
        stops: [
          {value: 100, color: "#cd0000"},
          {value: 125, color: "#800000"},
          {value: 150, color: "#330000"},
          // {value: 0, color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)},
          // {value: 0.004, color: new Cesium.Color(1.0, 0.0, 0.0, 0.6)},
          // {value: 0.006, color: new Cesium.Color(1.0, 0.0, 0.0, 0.2)},
          // {value: 0, color: "#cd0000"},
          // {value: 4, color: "#800000"},
          // {value: 8, color: "#330000"}
        ]
      })
    ],
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ffff00", },
        outline: { color: "#00000000", width: 1.0, },
      })
    }),
    defaultLabel: "其他",
  }),
};

export const 区视觉变量透明度 = Template.bind({});
区视觉变量透明度.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/0",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/0",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "zrk",
    visualVariables: [
      new OpacityVariable({
        type: "opacity",
        field: "zrk",
        // valueExpression: "$feature.zrk - 50",
        // valueExpressionTitle: "sqar",
        // normalizationType: "field",
        // normalizationField: "czrk",
        // normalizationType: "percent-of-total",
        // normalizationTotal: "10",
        stops: [
          {value: 100, color: "#ff0000ff", label: "100"},
          {value: 125, color: "#ff00009a", label: "125"},
          {value: 150, color: "#ff000033", label: "150"},
          // {value: 0, color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)},
          // {value: 0.004, color: new Cesium.Color(1.0, 0.0, 0.0, 0.6)},
          // {value: 0.006, color: new Cesium.Color(1.0, 0.0, 0.0, 0.2)},
          // {value: 0, color: "#ff0000ff"},
          // {value: 4, color: "#ff00009a"},
          // {value: 8, color: "#ff000033"}
        ]
      })
    ],
    defaultSymbol: new PolygonSymbol3D({
      type: 'polygon-3d',
      symbolLayers: new FillSymbol3DLayer({
        type: "fill",
        material: { color: "#ffff00", },
        outline: { color: "#00000000", width: 1.0, },
      })
    }),
    defaultLabel: "其他",
  }),
};

export const 点BillBoard = Template.bind({});
点BillBoard.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/4",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/4",
  autoReset: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    field: "lg",
    defaultSymbol: new PointSymbol3D({
      type: 'point-3d',
      symbolLayers: new IconSymbol3DLayer({
        type: "icon",
        material: { color: "#ff0000" },
        outline: { color: "#ffffff", width: 1.0 },
        resource: {primitive: "billboard"},
        size: 10.0
      })
    }),
    defaultLabel: "其他",
    classBreakInfos: [
      {
        maxValue: 5,
        minValue: 2,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#00ff00", },
            outline: { color: "#ffffff", width: 1.0, },
            resource: {primitive: "billboard"},
            size: 10.0
          })
        }),
      },
      {
        maxValue: 9,
        minValue: 5,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#0000ff", },
            outline: { color: "#ffffff", width: 1.0, },
            resource: {primitive: "billboard"},
            size: 10.0
          })
        }),
      },
    ],
  }),
};

export const 点符号svg = Template.bind({});
点符号svg.args = {
  baseUrl:
    "http://192.168.81.98:8089/igs/rest/services/武汉市地图文档/FeatureServer/4",
    // "http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/武汉市地图文档/FeatureServer/4",
  autoReset: true,
  enablePopup: true,
  popupOptions: {
    "title": 'n',
    "popupType": 'rich-text',
    "scrollNum": 6
  },
  enableClick: true,
  enableHover: false,
  highlightSymbol: {
    type: 'point-3d',
    symbolLayers: {
      type: "icon",
      material: { color: "#ffffff", },
    }
  },
  enableLegend: true,
  renderer: new ClassBreaksRenderer({
    type: "class-breaks",
    legendOptions: {title: "武汉市POI点"},
    field: "lg",
    defaultSymbol: new PointSymbol3D({
      type: 'point-3d',
      symbolLayers: new IconSymbol3DLayer({
        type: "icon",
        material: { color: "#ffffff" },
        resource: { herf: `http://${window.webclient.staticIP}:8895/img/Church.svg`, sizeInMeters: false, scale: 1.5, distanceDisplayCondition: [10, 1000000] },
        size: 10.0
      })
    }),
    defaultLabel: "Church",
    classBreakInfos: [
      {
        maxValue: 2,
        minValue: 1,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#ffffff", },
            resource: { herf: `http://${window.webclient.staticIP}:8895/img/Museum.svg`, sizeInMeters: false, scale: 1.5, distanceDisplayCondition: [10, 1000000] },
            size: 10.0
          })
        }),
        label: "Museum"
      },
      {
        maxValue: 3,
        minValue: 2,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#ffffff", },
            resource: { herf: `http://${window.webclient.staticIP}:8895/img/Hotel.svg`, sizeInMeters: false, scale: 1.5, distanceDisplayCondition: [10, 1000000] },
            size: 10.0
          })
        }),
        label: "Hotel"
      },
      {
        maxValue: 4,
        minValue: 3,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#ffffff", },
            resource: { herf: `http://${window.webclient.staticIP}:8895/img/Park.svg`, sizeInMeters: false, scale: 1.5, distanceDisplayCondition: [10, 1000000] },
            size: 10.0
          })
        }),
        label: "Park"
      },
      {
        maxValue: 5,
        minValue: 4,
        symbol: new PointSymbol3D({
          type: 'point-3d',
          symbolLayers: new IconSymbol3DLayer({
            type: "icon",
            material: { color: "#ffffff", },
            resource: { herf: `http://${window.webclient.staticIP}:8895/img/Restaurant.svg`, sizeInMeters: false, scale: 1.5, distanceDisplayCondition: [10, 1000000] },
            size: 10.0
          })
        }),
        label: "Restaurant"
      },
    ],
  }),
};

点符号svg.parameters = {
  docs: {
      description: {
          component: Markdown,
      },
  },
};
