import "../style/card.css";
import Mapgis3dTileset from "../../cesium/src/components/Layer/M3D/3dTileset.vue";
import Markdown from "../../cesium/docs/api/analysis/DynamicSection.md";

export default {
  title: "三维/分析/剖切分析",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dTileset },
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
        value: "9c157e9585486c02edf817d2ecbc7752",
      },
      m3dUrl1: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/钻孔_2_钻孔模型s`,
      m3dUrl2: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/钻孔分层点_Sur_000_Ent`,
      m3dUrl3: `http://${window.webclient.ip}:${window.webclient.port}/3DTileset/dayantaresult/tileset.json`
    };
  },
    template: `
      <mapgis-web-scene style="height: 95vh"
          v-on:load="handleLoad"
      >
        <mapgis-3d-m3d-layer
          v-if="$props.showM3D"
          :vueIndex="$props.models[0].vueIndex" 
          :url="m3dUrl1"
        />
        <mapgis-3d-m3d-layer 
          v-if="$props.showM3D"
          :vueIndex="$props.models[1].vueIndex" 
          :url="m3dUrl2"
        />
        <mapgis-3d-tileset 
          v-if="$props.showTiles"
          :vueIndex="$props.models[2].vueIndex"
          :url="m3dUrl3" 
        />
        <mapgis-ui-card class="storybook-ui-card">
          <mapgis-3d-dynamic-section :models="models" :axis="axis" :color="color" :time="time" :distance="distance"/>
        </mapgis-ui-card>
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

export const DynamicSectionM3D = Template.bind({});
DynamicSectionM3D.args = {
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
    {
      range: {
        xmin: -10000,
        xmax: 10000,
        ymin: -10000,
        ymax: 10000,
        zmin: -10000,
        zmax: 10000,
      },
      vueIndex: 3,
      title: "大雁塔",
    },
  ],
  axis: "X",
  color: "rgb(200,200,200,0.5)",
  time: 10,
  distance: 0,
  showM3D: true,
  showTiles: false
};

export const DynamicSection3DTiles = Template.bind({});
DynamicSection3DTiles.args = {
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
    {
      range: {
        xmin: -10000,
        xmax: 10000,
        ymin: -10000,
        ymax: 10000,
        zmin: -10000,
        zmax: 10000,
      },
      vueIndex: 3,
      title: "大雁塔",
    },
  ],
  axis: "X",
  color: "rgb(200,200,200,0.5)",
  time: 10,
  distance: 0,
  showM3D: false,
  showTiles: true
};

DynamicSection3DTiles.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
