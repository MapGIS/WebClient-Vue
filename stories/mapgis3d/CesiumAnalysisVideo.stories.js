import "../style/card.css";
// import Markdown from "../../cesium/docs/api/analysis/Shadow.md";

export default {
  title: "三维/分析/视频投放",
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url:
        "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
      autoReset: true,
      maximumScreenSpaceError: 8,
      vueIndex: 22,
    };
  },
  template: `
      <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-raster-layer :url="url"></mapgis-3d-raster-layer>
      <mapgis-3d-m3d-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-m3d-layer>
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-video
        >
        </mapgis-3d-video>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
});

export const 视频投放 = Template.bind({});
视频投放.args = {};
视频投放.parameters = {
  docs: {
    description: {
      // component: Markdown,
    },
  },
};
