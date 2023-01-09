import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/CutFill.md";

export default {
  title: "三维/三维分析/地形分析",
  argTypes: {
    xPaneNum: {
      description: "X 坐标方向采样点的个数",
      table: {
        defaultValue: { summary: "16" },
      },
      control: "number",
    },
    yPaneNum: {
      description: "Y 坐标方向采样点的个数",
      table: {
        defaultValue: { summary: "16" },
      },
      control: "number",
    },
    height: {
      description: "平整高程",
      table: {
        defaultValue: { summary: "2000" },
      },
      control: "number",
    },
    cutColor: {
      description: "挖方颜色",
      table: {
        defaultValue: { summary: "rgba(0,255,0,0.5)" },
      },
      control: "color",
    },
    fillColor: {
      description: "填方颜色",
      table: {
        defaultValue: { summary: "rgba(0,0,255,0.5)" },
      },
      control: "color",
    },
    dataType: {
      description: "数据类型,0.0：地形，1.0：模型，2.0：通用",
      table: {
        defaultValue: { summary: "2.0" },
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
      terrainUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/terrain/SceneServer`,
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
  <mapgis-web-scene style="height: 95vh" v-on:load="handleLoad">
  <mapgis-3d-ogc-wmts-layer
    :baseUrl="url"
    :wmtsLayer="layer"
    :tileMatrixSet="tileMatrixSet"
    :format="format"
    :tilingScheme="tilingScheme"
    :token="token"
  ></mapgis-3d-ogc-wmts-layer>
  <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true" />
  <mapgis-ui-card class="storybook-ui-card">
    <mapgis-3d-analysis-cut-fill
      :xPaneNum="xPaneNum"
      :yPaneNum="yPaneNum"
      :height="height"
      :cutColor="cutColor"
      :fillColor="fillColor"
      :dataType="dataType"
      :useMask="useMask"
      />
  </mapgis-ui-card>
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
        destination: Cesium.Cartesian3.fromDegrees(121, 24, 5900),
        orientation: {
          heading: Cesium.Math.toRadians(60),
          pitch: Cesium.Math.toRadians(-16),
          roll: 0,
        },
        duration: 1,
      });
    },
  },
});

export const 填挖方 = Template.bind({});
填挖方.args = {
  xPaneNum: 16,
  yPaneNum: 16,
  height: 2000,
  cutColor: "rgba(0, 0, 255, 0.5)",
  fillColor: "rgba(255,165,0,0.5)",
  dataType: 2.0,
  useMask: true,
  terrainUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:TwTerrain`,
};

填挖方.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
