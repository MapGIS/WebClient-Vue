import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Flood.md";

export default {
  title: "三维/分析/洪水淹没分析",
  argTypes: {
    startHeight: {
      description: "洪水淹没水体起始高度",
      table: {
        defaultValue: { summary: "0" },
      },
      control: "number",
    },
    minHeight: {
      description: "淹没动画高度起始点",
      table: {
        defaultValue: { summary: "0" },
      },
      control: "number",
    },
    maxHeight: {
      description: "最大淹没高度，淹没动画高度终止点",
      table: {
        defaultValue: { summary: "2000" },
      },
      control: "number",
    },
    floodColor: {
      description: "洪水颜色",
      table: {
        defaultValue: { summary: "rgba(149,232,249,0.5)" },
      },
      control: "color",
    },
    floodSpeed: {
      description: "洪水淹没速度，单位 米/秒",
      table: {
        defaultValue: { summary: "500" },
      },
      control: "number",
    },
    specularIntensity: {
      description: "反射光线强度",
      table: {
        defaultValue: { summary: "2" },
      },
      control: "number",
    },
    amplitude: {
      description: "水波高度",
      table: {
        defaultValue: { summary: "10" },
      },
      control: "number",
    },
    animationSpeed: {
      description: "水纹速度",
      table: {
        defaultValue: { summary: "0.01" },
      },
      control: "number",
    },
    frequency: {
      description: "水纹频率",
      table: {
        defaultValue: { summary: "500" },
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
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-analysis-flood 
            :startHeight="startHeight"
            :minHeight="minHeight"
            :maxHeight="maxHeight"
            :floodColor="floodColor"
            :floodSpeed="floodSpeed"
            :specularIntensity="specularIntensity"
            :amplitude="amplitude"
            :animationSpeed="animationSpeed"
            :frequency="frequency"/>
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

export const 洪水淹没 = Template.bind({});
洪水淹没.args = {
  startHeight: 0,
  minHeight: 0,
  maxHeight: 2000,
  floodColor: "rgba(149,232,249,0.5)",
  floodSpeed: 500,
  specularIntensity: 2,
  amplitude: 10,
  animationSpeed: 0.01,
  frequency: 500,
};

洪水淹没.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
