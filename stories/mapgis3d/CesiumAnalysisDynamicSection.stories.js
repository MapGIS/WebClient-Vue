import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/DynamicSection.md";

export default {
  title: "三维/三维分析/模型分析",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
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

export const 剖切 = Template.bind({});
剖切.args = {
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
    }
  ],
  axis: "X",
  color: "rgb(200,200,200,0.5)",
  time: 10,
  distance: 0,
  showM3D: true,
  showTiles: false,
  m3dUrl1: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/M3Dv1/钻孔模型/M3dServer`,
  m3dUrl2: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/M3Dv1/地质体/M3dServer`
};
