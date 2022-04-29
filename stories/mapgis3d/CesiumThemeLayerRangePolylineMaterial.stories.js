import Markdown from "../../cesium/docs/api/Overlay/ThemeLayerCustom.md";
import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/分段专题图/线数据",
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{
    load(data) {
    },
    unload(data) {
    },
    handlebbox(data) {
    },
    handleClick(data) {
    },
    handleHover(data) {
    }
  },
  data() {
    return {
      type1: "range",
      field1: "Fc",
      themeOptions1: {
        hasMaterial: true,
        materialType: "PolylineTrailLink",
        styleGroups: [
          {
            range: ['0.9', '1.1'],
            style: {
              width: 10,
              color: "#ff0000",
            },
            material: {
              image: "http://localhost:8895/material/arrow_1.png",
              direction: 1.0,
              duration: 100000,
              gapColor: "#ffffff",
              dashLength: 16.0,
              dashPattern: 255.0
            }
          }
        ]
      },
      themeOptions2: {
        hasMaterial: true,
        materialType: "PolylineTrailLink",
        styleGroups: [
          {
            range: ['1.9', '2.1'],
            style: {
              width: 10,
              color: "#00ff00",
            },
            material: {
              image: "http://localhost:8895/material/arrow_1.png",
              direction: 1.0,
              duration: 100000,
              gapColor: "#ffffff",
              dashLength: 16.0,
              dashPattern: 255.0
            }
          }
        ]
      },
      themeOptions3: {
        hasMaterial: true,
        materialType: "PolylineTrailLink",
        styleGroups: [
          {
            range: ['2.9', '3.1'],
            style: {
              width: 10,
              color: "#0000ff",
            },
            material: {
              image: "http://localhost:8895/material/arrow_1.png",
              direction: 1.0,
              duration: 100000,
              gapColor: "#ffffff",
              dashLength: 16.0,
              dashPattern: 255.0
            }
          }
        ]
      },
      themeOptions4: {
        hasMaterial: true,
        materialType: "PolylineTrailLink",
        styleGroups: [
          {
            range: ['3.9', '4.1'],
            style: {
              width: 10,
              color: "#ff00ff",
            },
            material: {
              image: "http://localhost:8895/material/arrow_1.png",
              direction: 1.0,
              duration: 100000,
              gapColor: "#ffffff",
              dashLength: 16.0,
              dashPattern: 255.0
            }
          }
        ]
      }
    };
  },
  template:`
    <mapgis-web-scene :style="{height: '95vh'}">
      // <mapgis-3d-arcgis-tile-layer
      //   baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
      //   :layerStyle='{"visible":true,"opacity":1,"zIndex":2}'
      // />
      <mapgis-3d-theme-layer-custom 
        v-bind="$props"
        @load="load"
        @unload="unload"
        @bbox="handlebbox"
        @themeClick="handleClick" 
        @themeHover="handleHover"
      />
      // <mapgis-3d-theme-layer-custom 
      //   baseUrl="http://localhost:8895/geojson/roadClass1.json"
      //   :themeOptions="themeOptions1"
      //   :type="type1"
      //   :field="field1"
      //   @load="load"
      //   @unload="unload"
      //   @bbox="handlebbox"
      //   @themeClick="handleClick" 
      //   @themeHover="handleHover"
      // />
      // <mapgis-3d-theme-layer-custom 
      //   baseUrl="http://localhost:8895/geojson/roadClass2.json"
      //   :themeOptions="themeOptions2"
      //   :type="type1"
      //   :field="field1"
      // />
      // <mapgis-3d-theme-layer-custom 
      //   baseUrl="http://localhost:8895/geojson/roadClass3.json"
      //   :themeOptions="themeOptions3"
      //   :type="type1"
      //   :field="field1"
      // />
      // <mapgis-3d-theme-layer-custom 
      //   baseUrl="http://localhost:8895/geojson/roadClass4.json"
      //   :themeOptions="themeOptions4"
      //   :type="type1"
      //   :field="field1"
      // />
    </mapgis-web-scene>`,
});

export const 线数据material = Template.bind({});
线数据material.args = {
  // baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  baseUrl: `http://localhost:8895/geojson/metro.json`,
  
  type: "range",
  field: "x",
  autoReset: false,
  offsetHeight: 100,
  themeOptions: {
    hasMaterial: true,
    // materialType: "PolylineTrailLink",
    styleGroups: [
      {
        // range: ['1号线', '2号线', '3号线', '4号线'],
        start: 1,
        end: 5,
        style: {
          width: 10,
          color: "#ff0000",
        },
        material: {
          image: "http://localhost:8895/img/arrow_1.png",
          direction: 1.0,
          duration: 100000,
          gapColor: "ffffff",
          dashLength: 16.0,
          dashPattern: 255.0
        }
      },
      {
        // range: ['5号线', '6号线', '7号线', '8号线',],
        start: 5,
        end: 9,
        style: {
          width: 12,
          color: "#00ff00",
        },
        material: {
          image: "http://localhost:8895/img/arrow_1.png",
          direction: 2.0,
          duration: 1000,
          gapColor: "ffffff",
          dashlength: 8.0,
          dashPattern: 255.0
        }
      },
      {
        // range: ['11号线', '16号线', '21号线'],
        start: 9,
        end: 12,
        style: {
          width: 15,
          color: "#0000ff",
        },
        material: {
          image: "http://localhost:8895/img/LinkPulse.png",
          direction: 1.0,
          duration: 1000,
          gapColor: "ffffff",
          dashLength: 320,
          dashPattern: 2550.0
        }
      }
    ]
  }
};
线数据material.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};