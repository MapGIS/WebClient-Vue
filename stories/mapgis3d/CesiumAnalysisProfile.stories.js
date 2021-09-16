import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Aspect.md";

export default {
  title: "三维/分析/剖面分析",
  argTypes: {
    position: {
      //描述信息，即页面上Description那一栏的值
      description: "分析面板的位置",
      table: {
        //description描述信息下的提示框，可选，添加这一项就会在描述信息文字下生成一个提示信息按钮
        //summary：提示按钮里的文字，detail：提示信息
        // type:{ summary: 'tips',detail: "这里是提示" },
        //默认值，即页面上Default那一栏的值，不在这里填写，则页面上不会有默认值
        //如果加了detail,{ summary: 'null',detail: "这里是提示" },则页面会多出一个描述信息的提示框
        defaultValue: { summary: "null" },
      },
      //Control这里一栏里面展示数据的方式，可以是input、textArean、boolean等，可选值如下
      control: "text",
    },
    profileType: {
      description: "分析类型，0代表地形，1代表地形和模型兼容",
      table: {
        defaultValue: { summary: "0" },
      },
      control: "number",
    },
    polygonHeight: {
      description: "垂直面高度，相较于最大地形高程",
      table: {
        defaultValue: { summary: "100" },
      },
      control: "number",
    },
    polygonColor: {
      description: "垂直面颜色",
      table: {
        defaultValue: { summary: "rgb(0,0,255)" },
      },
      control: "color",
    },
    polyLineColor: {
      description: "垂直线颜色",
      table: {
        defaultValue: { summary: "rgb(0,255,0)" },
      },
      control: "color",
    },
    pointColor: {
      description: "贴地点颜色",
      table: {
        defaultValue: { summary: "rgb(0,255,0)" },
      },
      control: "color",
    },
    polylineGroundColor: {
      description: "贴地线颜色",
      table: {
        defaultValue: { summary: "rgb(255,0,0)" },
      },
      control: "color",
    },
    showPolygon: {
      description: "是否显示垂直面",
      table: {
        defaultValue: { summary: "false" },
      },
      control: "boolean",
    },
    samplePrecision: {
      description: "采样精度",
      table: {
        defaultValue: { summary: "2" },
      },
      control: "number",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      //地形url TODO这里地址打包的时候改一下
      terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029",
      },
    };
  },
  template: `
      <mapgis-web-scene style="{height: '100vh'}"
          v-on:load="handleLoad"
      >
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="url"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSet"
          :format="format"
          :tilingScheme="tilingScheme"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true"/>
      <mapgis-3d-analysis-profile 
          :profileType="profileType" 
          :position="position" 
          :polygonHeight="polygonHeight" 
          :polygonColor="polygonColor" 
          :polyLineColor="polyLineColor" 
          :pointColor="pointColor"
          :polylineGroundColor="polylineGroundColor" 
          :showPolygon="showPolygon" 
          :samplePrecision="samplePrecision"/>
      </mapgis-web-scene>
    `,
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
      const { webGlobe } = component;
      webGlobe.viewer.camera.setView({
        direction: {
          x: 0.4680575394156845,
          y: -0.8267033643312148,
          z: 0.31222377744109403,
        },
        position: {
          x: -674271.5790185562,
          y: 5530042.656916835,
          z: 3232882.3357299212,
        },
      });
      //构造视图功能管理对象（视图）
      var sceneManager = new CesiumZondy.Manager.SceneManager({
        viewer: webGlobe.viewer,
      });
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      sceneManager.flyToEx(121, 24, {
        height: 5900,
        heading: 60,
        pitch: -16,
        roll: 0,
      });
    },
  },
});

export const 剖面 = Template.bind({});
剖面.args = {
  position: "left",
  profileType: 0,
  polygonHeight: 100,
  polygonColor: "rgb(0,0,255)",
  polyLineColor: "rgb(0,255,0)",
  pointColor: "rgb(0,255,0)",
  polylineGroundColor: "rgb(255,0,0)",
  showPolygon: false,
  samplePrecision: 2,
};

剖面.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};