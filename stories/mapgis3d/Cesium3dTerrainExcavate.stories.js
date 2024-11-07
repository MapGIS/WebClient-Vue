import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Aspect.md";

export default {
  title: "三维/三维分析/地形分析",
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url: "http://t6.tianditu.gov.cn/img_c/wmts",
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
      <mapgis-web-scene style="height:95vh" v-on:load="handleLoad">
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="url"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSet"
          :format="format"
          :tilingScheme="tilingScheme"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-terrain-provider :url="terrainUrl" />
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-excavate-analysis />
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
        destination: Cesium.Cartesian3.fromDegrees(110.31, 31.48, 3000),
        orientation: {
          heading: Cesium.Math.toRadians(60),
          pitch: Cesium.Math.toRadians(0),
          roll: 0,
        },
        duration: 1,
      });
    },
  },
});

export const 地形开挖 = Template.bind({});
地形开挖.args = {
  terrainUrl:
    "http://webclient.smaryun.com:8200/3DData/TerrainCache/HubeiTerrain/",
};

开挖.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
