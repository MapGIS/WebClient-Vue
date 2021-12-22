import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/VideoSetting.md";

export default {
  title: "三维/分析/视频投放/投放配置",
  argTypes: {
    settings: {
      description: "投放视频参数对象",
      table: {
        defaultValue: {
          summary:
            '{id: "987-765-543-321",name: "testVideo1",description: "",isProjected: false,params: {videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video1/20211221/out.m3u8"},cameraPosition: {x: 114.401228136856,y: 30.467421377675457,z: 84.94989410478892},orientation: {heading: 6.053866507322313,pitch: -73.6,roll: 354.1},hFOV: 34.6,vFOV: 18.9,hintLineVisible: true}}',
        },
      },
      control: "object",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
      autoReset: true,
      maximumScreenSpaceError: 8,
      isM3DLoaded: false,
    };
  },
  template: `
      <mapgis-web-scene style="height: 95vh" v-on:load="handleLoad">
      <mapgis-3d-m3d-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-m3d-layer>
      <mapgis-ui-card v-if="isM3DLoaded" class="storybook-ui-card" style="max-height:500px;overflow-y:auto">
      <mapgis-3d-video-setting :settings="settings"></mapgis-3d-video-setting>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
  methods: {
    handleLoad(e) {
      setTimeout(() => {
        //增加延时，确保模型已加载
        this.isM3DLoaded = true;
      }, 5000);
    },
  },
});

export const 投放配置 = Template.bind({});
投放配置.args = {
  settings: {
    id: "987-765-543-124",
    name: "testVideo3",
    description: "",
    isProjected: false,
    params: {
      videoSource: {
        protocol: "m3u8",
        videoUrl: "http://192.168.91.123:10008/record/video3/20211221/out.m3u8",
      },
      cameraPosition: {
        x: 114.4006886798949,
        y: 30.467287432107295,
        z: 85.46751512564336,
      },
      orientation: {
        heading: 271.628505216584,
        pitch: -78.4,
        roll: 359.3,
      },
      hFOV: 32.5,
      vFOV: 19,
      hintLineVisible: true,
    },
  },
};
投放配置.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
