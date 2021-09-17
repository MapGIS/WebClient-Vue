import "../style/card.css";
// import Markdown from "../../cesium/docs/api/analysis/Aspect.md";

export default {
  title: "三维/分析/剖切分析",
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
        value: "9c157e9585486c02edf817d2ecbc7752",
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
      <mapgis-3d-igs-m3d 
          :vueIndex="$props.models[0].vueIndex" 
          url="http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s"
      />
      <mapgis-3d-igs-m3d 
          :vueIndex="$props.models[1].vueIndex" 
          url="http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent"
      />
      <a-card class="storybook-ui-card">
        <mapgis-3d-dynamic-section v-bind="$props"/>
      </a-card>
      </mapgis-web-scene>
    `,
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
    },
  },
});

export const DynamicSection = Template.bind({});
DynamicSection.args = {
  models: [
    {
      range: {
        xmin: -10000,
        xmax: 10000,
        ymin: -10000,
        ymax: 10000,
        zmin: -10000,
        zmax: 10000,
      },
      vueIndex: 1,
      title: "钻孔_2_钻孔模型s",
    },
    {
      range: {
        xmin: -10000,
        xmax: 10000,
        ymin: -10000,
        ymax: 10000,
        zmin: -10000,
        zmax: 10000,
      },
      vueIndex: 2,
      title: "钻孔分层点",
    },
  ],
};

DynamicSection.parameters = {
  docs: {
    description: {
      // component: Markdown,
    },
  },
};