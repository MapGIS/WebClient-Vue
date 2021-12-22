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
      <mapgis-3d-m3d-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-m3d-layer>
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-video-manager :videoOverlayLayerList="videoOverlayLayerList">
        </mapgis-3d-video-manager>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
});

export const 视频投放 = Template.bind({});
视频投放.args = {
  videoOverlayLayerList: [
    {
      //  视频投放图层
      id: "123-345-567-789",
      name: "test",
      videoList: [
        // 视频列表
        {
          id: "987-765-543-321", // 视频id
          name: "testVideo1", // 视频名称
          description: "", //描述
          isProjected: false, // 是否开启视频投放
          params: {
            videoSource: {
              protocol: "mp4", // 视频传输协议
              videoUrl: "http://localhost:8895/video/zhongdixibeijiao1.mp4", // 视频服务地址
            },
            cameraPosition: { x: 0, y: 0, z: 0 }, // 相机位置
            orientation: {
              heading: 0, // 方向角
              pitch: 0, // 俯仰角
              roll: 0, // 滚动角
            },
            hFOV: 15, // 水平视场角
            vFOV: 15, // 垂直视场角
            hintLineVisible: true, // 是否显示投放区域线
          },
        },
        {
          id: "987-765-543-123", // 视频id
          name: "testVideo2", // 视频名称
          description: "", //描述
          isProjected: false, // 是否开启视频投放
          params: {
            videoSource: {
              protocol: "mp4", // 视频传输协议
              videoUrl: "http://localhost:8895/video/zhongdixibeijiao.mp4", // 视频服务地址
            },
            cameraPosition: { x: 0, y: 0, z: 0 }, // 相机位置
            orientation: {
              heading: 0, // 方向角
              pitch: 0, // 俯仰角
              roll: 0, // 滚动角
            },
            hFOV: 15, // 水平视场角
            vFOV: 15, // 垂直视场角
            hintLineVisible: true, // 是否显示投放区域线
          },
        },
      ],
    },
    {
      //  视频投放图层
      id: "567-789-123-345",
      name: "layer2",
      videoList: [
        // 视频列表
        {
          id: "543-321-987-765", // 视频id
          name: "layer2Video1", // 视频名称
          description: "", //描述
          isProjected: false, // 是否开启视频投放
          params: {
            videoSource: {
              protocol: "mp4", // 视频传输协议
              videoUrl: "http://localhost:8895/video/DJI_0008.mp4", // 视频服务地址
            },
            cameraPosition: { x: 0, y: 0, z: 0 }, // 相机位置
            orientation: {
              heading: 0, // 方向角
              pitch: 0, // 俯仰角
              roll: 0, // 滚动角
            },
            hFOV: 15, // 水平视场角
            vFOV: 15, // 垂直视场角
            hintLineVisible: true, // 是否显示投放区域线
          },
        },
      ],
    },
  ],
};
视频投放.parameters = {
  docs: {
    description: {
      // component: Markdown,
    },
  },
};
