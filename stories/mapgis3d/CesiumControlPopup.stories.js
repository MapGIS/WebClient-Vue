import Mapgis3dPopup from "../../cesium/src/components/UI/Popup/Popup.vue";

export default {
  title: "三维/图形绘制/标注/气泡",
  component: Mapgis3dPopup,
  argTypes: {
    position: {
      longitude: 110,
      latitude: 30,
      height: 0,
    },
    popupWapperStyle: {
      width: "500px",
      height: "500px",
      color: "#ff0000",
    },
    visible: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPopup },
  template: `<mapgis-web-scene style="height:95vh" v-on:load="handleLoad">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />    
    <mapgis-3d-popup v-bind="$props">
      <div style="margin-top:50px">自定义槽内容</div>
    </mapgis-3d-popup>
  </mapgis-web-scene>`,

  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
      const { viewer } = component;
      //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(110, 30, 300),
        duration: 1,
      });
    },
  },
});

export const 自定义槽 = Template.bind({});
自定义槽.args = {
  position: {
    longitude: 110,
    latitude: 30,
    height: 0,
  },
  options: {
    type: "default",
    title: "name",
  },
  visible: true,
  popupWapperStyle: {
    width: "300px",
    height: "300px",
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },
  popupCloseBtnStyle: {
    top: "0px",
    right: "0px",
    width: "50px",
    height: "50px",
    backgroundColor: "#619ED6",
    color: "#FFFF00",
  },
  popupHeaderStyle: {
    width: "300px",
    height: "50px",
    backgroundColor: "#aaaaaa",
    color: "#FFA645",
  },
};
