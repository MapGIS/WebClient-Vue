import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/ProjectorManager.md";

export default {
  title: "三维/通用工具/视频投放",
  argTypes: {
    projectorOverlayLayerList: {
      description: "视频投放图层数组",
      table: {
        defaultValue: {
          summary:
            '[{id: "123-345-567-789",name: "test",projectorList: [{id: "987-765-543-321",name: "testProjector1",description: "",isProjected: false,params: {projectorType: "video",imgUrl: "",videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video1/20211221/out.m3u8"},cameraPosition: {x: 114.401228136856,y: 30.467421377675457,z: 84.94989410478892},orientation: {heading: 6.053866507322313,pitch: -73.6,roll: 354.1},hFOV: 34.6,vFOV: 18.9,hintLineVisible: true}},{id: "987-765-543-123",name: "testProjector2",description: "",isProjected: false,params: {projectorType: "video",imgUrl: "",videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video2/20211221/out.m3u8"},cameraPosition: {x: 114.40088870656619,y: 30.467421563975016,z: 84.91172691510191},orientation: {heading: 359.89407747239846,pitch: -74.2,roll: 0},hFOV: 33.1,vFOV: 19.2,hintLineVisible: true}},{id: "987-765-543-124",name: "testProjector3",description: "",isProjected: false,params: {projectorType: "video",imgUrl: "",videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video3/20211221/out.m3u8"},cameraPosition: {x: 114.4006886798949,y: 30.467287432107295,z: 85.46751512564336},orientation: {heading: 271.628505216584,pitch: -78.4,roll: 359.3},hFOV: 32.5,vFOV: 19,hintLineVisible: true}}]},{id: "567-789-123-345",name: "layer2",projectorList: [{id: "765-987-543-321",name: "layer2Projector1",description: "",isProjected: false,params: {projectorType: "video",imgUrl: "",videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video1/20211221/out.m3u8"},cameraPosition: {x: 114.401228136856,y: 30.467421377675457,z: 84.94989410478892},orientation: {heading: 6.053866507322313,pitch: -73.6,roll: 354.1},hFOV: 34.6,vFOV: 18.9,hintLineVisible: true}},{id: "765-987-543-123",name: "layer2Projector2",description: "",isProjected: false,params: {projectorType: "video",imgUrl: "",videoSource: {protocol: "m3u8",videoUrl:"http://192.168.91.123:10008/record/video2/20211221/out.m3u8"},cameraPosition: {x: 114.40088870656619,y: 30.467421563975016,z: 84.91172691510191},orientation: {heading: 359.89407747239846,pitch: -74.2,roll: 0},hFOV: 33.1,vFOV: 19.2,hintLineVisible: true}}]}]',
        },
      },
      control: "array",
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
    maxProjected: {
      description: "最大投放数",
      table: {
        defaultValue: {
          summary: `10`,
        },
      },
      control: "number",
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
      m3dUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:ZondyModels`,
      autoReset: true,
      maximumScreenSpaceError: 8,
    };
  },
  template: `
      <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-scene-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-scene-layer>
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-projector-manager :modelUrl="modelUrl" :modelOffset="modelOffset" :maxProjected="maxProjected" :hideVPInvisible="hideVPInvisible" :projectorOverlayLayerList="projectorOverlayLayerList">
        </mapgis-3d-projector-manager>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
});

export const 投放管理 = Template.bind({});
投放管理.args = {
  m3dUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:ZondyModels`,
  modelUrl: `http://${window.webclient.ip}:${window.webclient.port}/CesiumModels/Cesium_Camera.glb`,
  modelOffset: { headingOffset: -90, pitchOffset: 0, rollOffset: 0 },
  maxProjected: 10,
  hideVPInvisible: false,
  projectorOverlayLayerList: [
    {
      id: "123-345-567-789",
      name: "test",
      projectorList: [
        {
          id: "987-765-543-321",
          name: "testProjector1",
          description: "",
          isProjected: false,
          params: {
            projectorType: "video",
            imgUrl: "",
            videoSource: {
              protocol: "m3u8",
              videoUrl: `http://${window.webclient.ip}:${window.webclient.port}/record/video1/20211221/out.m3u8`,
            },
            cameraPosition: {
              x: 114.401228136856,
              y: 30.467421377675457,
              z: 84.94989410478892,
            },
            orientation: {
              heading: 6.053866507322313,
              pitch: -73.6,
              roll: 354.1,
            },
            hFOV: 34.6,
            vFOV: 18.9,
            hintLineVisible: true,
          },
        },
        {
          id: "987-765-543-123",
          name: "testProjector2",
          description: "",
          isProjected: false,
          params: {
            projectorType: "video",
            imgUrl: "",
            videoSource: {
              protocol: "m3u8",
              videoUrl: `http://${window.webclient.ip}:${window.webclient.port}/record/video2/20211221/out.m3u8`,
            },
            cameraPosition: {
              x: 114.40088870656619,
              y: 30.467421563975016,
              z: 84.91172691510191,
            },
            orientation: {
              heading: 359.89407747239846,
              pitch: -74.2,
              roll: 0,
            },
            hFOV: 33.1,
            vFOV: 19.2,
            hintLineVisible: true,
          },
        },
        {
          id: "987-765-543-124",
          name: "testProjector3",
          description: "",
          isProjected: false,
          params: {
            projectorType: "video",
            imgUrl: "",
            videoSource: {
              protocol: "m3u8",
              videoUrl: `http://${window.webclient.ip}:${window.webclient.port}/record/video3/20211221/out.m3u8`,
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
      ],
    },
    {
      id: "567-789-123-345",
      name: "layer2",
      projectorList: [
        {
          id: "765-987-543-321",
          name: "layer2Projector1",
          description: "",
          isProjected: false,
          params: {
            projectorType: "video",
            imgUrl: "",
            videoSource: {
              protocol: "m3u8",
              videoUrl: `http://${window.webclient.ip}:${window.webclient.port}/record/video1/20211221/out.m3u8`,
            },
            cameraPosition: {
              x: 114.401228136856,
              y: 30.467421377675457,
              z: 84.94989410478892,
            },
            orientation: {
              heading: 6.053866507322313,
              pitch: -73.6,
              roll: 354.1,
            },
            hFOV: 34.6,
            vFOV: 18.9,
            hintLineVisible: true,
          },
        },
        {
          id: "765-987-543-123",
          name: "layer2Projector2",
          description: "",
          isProjected: false,
          params: {
            projectorType: "video",
            imgUrl: "",
            videoSource: {
              protocol: "m3u8",
              videoUrl: `http://${window.webclient.ip}:${window.webclient.port}/record/video2/20211221/out.m3u8`,
            },
            cameraPosition: {
              x: 114.40088870656619,
              y: 30.467421563975016,
              z: 84.91172691510191,
            },
            orientation: {
              heading: 359.89407747239846,
              pitch: -74.2,
              roll: 0,
            },
            hFOV: 33.1,
            vFOV: 19.2,
            hintLineVisible: true,
          },
        },
      ],
    },
  ],
};
投放管理.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
