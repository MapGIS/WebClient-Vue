import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/ProjectorSetting.md";

export default {
  title: "三维/分析/视频投放/投放配置",
  argTypes: {
    settings: {
      description: "投放视频参数对象",
      table: {
        defaultValue: {
          summary:
            '{id: "987-765-543-321",name: "testProjector1",description: "",isProjected: false,params: {projectorType:"video",imgUrl:"",videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video1/20211221/out.m3u8"},cameraPosition: {x: 114.401228136856,y: 30.467421377675457,z: 84.94989410478892},orientation: {heading: 6.053866507322313,pitch: -73.6,roll: 354.1},hFOV: 34.6,vFOV: 18.9,hintLineVisible: true}}',
        },
      },
      control: "object",
    },
    modelUrl: {
      description: "相机模型路径",
      table: {
        defaultValue: {
          summary: `./CesiumModels/Cesium_Camera.glb`,
        },
      },
      control: "text",
    },
    modelOffset: {
      description: "相机模型朝向偏移量",
      table: {
        defaultValue: {
          summary: `{ headingOffset: -90, pitchOffset: 0, rollOffset: 0 }`,
        },
      },
      control: "object",
    },
    hideVPInvisible: {
      description:
        "当摄像头不在当前视图范围内，隐藏投影；参数设置后，对新投放或者重新投放的对象有效，对于已经投放的对象无效",
      table: {
        defaultValue: {
          summary: `false`,
        },
      },
      control: "boolean",
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
      <mapgis-ui-card v-if="isM3DLoaded" class="storybook-ui-card">
      <mapgis-3d-projector-setting style="height:70vh;" :settings="settings" :modelUrl="modelUrl" :modelOffset="modelOffset" :hideVPInvisible="hideVPInvisible"></mapgis-3d-projector-setting>
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
  modelUrl: "./CesiumModels/Cesium_Camera.glb",
  modelOffset: { headingOffset: -90, pitchOffset: 0, rollOffset: 0 },
  hideVPInvisible: false,
  settings: {
    id: "987-765-543-124",
    name: "testProjector3",
    description: "",
    isProjected: false,
    params: {
      projectorType: "video",
      imgUrl: "",
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
