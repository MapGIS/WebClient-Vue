import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Profile.md";

export default {
  title: "三维/分析/剖面分析",
  argTypes: {
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
    useMask: {
      description: "是否使用内置的遮罩层",
      table: {
        defaultValue: { summary: "true" },
      },
      control: "boolean",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      //地形url TODO这里地址打包的时候改一下
      //terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
      terrainUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/terrain`,
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029",
      },
      profile2dVisible: false,
    };
  },
  template: `
    <mapgis-web-scene style="height: 95vh"
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
      <mapgis-ui-card  customPosition="top-left" class="storybook-ui-card">
      <mapgis-3d-analysis-profile 
          :profileType="profileType" 
          :polygonHeight="polygonHeight" 
          :polygonColor="polygonColor" 
          :polyLineColor="polyLineColor" 
          :pointColor="pointColor"
          :polylineGroundColor="polylineGroundColor" 
          :showPolygon="showPolygon" 
          :samplePrecision="samplePrecision"
          :useMask="useMask"
          :echartsDivId="'profileChart'"
          @success="success"
          @remove="remove"/>
          </mapgis-ui-card>
      <mapgis-ui-window
        :visible.sync="profile2dVisible"
        :min-width="400"
        :max-height="250"
        anchor="bottom-left"
        title="剖面信息"
      >
        <div
          id="profileChart"
          style="width: 380px; height: 180px; float: right"
        ></div>
      </mapgis-ui-window>
    </mapgis-web-scene>
    `,
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
      const { viewer } = component;
      viewer.camera.setView({
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
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(121,24,5900),
        orientation:{
          heading: Cesium.Math.toRadians(60),
          pitch: Cesium.Math.toRadians(-16),
          roll: 0,
        },
        duration:1
      })
    },
    success() {
      this.profile2dVisible = true;
    },
    remove() {
      this.profile2dVisible = false;
    },
  },
});

export const 剖面 = Template.bind({});
剖面.args = {
  profileType: 0,
  polygonHeight: 100,
  polygonColor: "rgb(0,0,255)",
  polyLineColor: "rgb(0,255,0)",
  pointColor: "rgb(0,255,0)",
  polylineGroundColor: "rgb(255,0,0)",
  showPolygon: false,
  samplePrecision: 2,
  useMask: true,
};

剖面.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
