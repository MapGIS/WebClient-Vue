import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/CutFill.md";

export default {
  title: "三维/分析/填挖方分析",
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
    lineColor: {
      description: "分析区域边界颜色",
      table: {
        defaultValue: { summary: "rgba(0,255,0,1)" },
      },
      control: "color",
    },
    fillColor: {
      description: "分析区域面颜色",
      table: {
        defaultValue: { summary: "rgba(0,0,255,0.3)" },
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
    };
  },
  template: `
  <mapgis-web-scene style="{height: '100vh'}" v-on:load="handleLoad">
  <mapgis-3d-ogc-wmts-layer
    :baseUrl="url"
    :wmtsLayer="layer"
    :tileMatrixSet="tileMatrixSet"
    :format="format"
    :tilingScheme="tilingScheme"
    :token="token"
  ></mapgis-3d-ogc-wmts-layer>
  <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true" />
  <mapgis-ui-card class="storybook-ui-card" style="zIndex:20002">
    <mapgis-3d-analysis-cut-fill
      :xPaneNum="xPaneNum"
      :yPaneNum="yPaneNum"
      :height="height"
      :lineColor="lineColor"
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

export const 填挖方 = Template.bind({});
填挖方.args = {
  xPaneNum: 16,
  yPaneNum: 16,
  height: 2000,
  lineColor: "rgba(0,255,0,1)",
  fillColor: "rgba(0,0,255,0.3)",
  dataType: 2.0,
  useMask: true,
};

填挖方.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
