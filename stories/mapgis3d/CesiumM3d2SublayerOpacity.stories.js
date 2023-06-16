import Mapgis3dM3dLayer from "../../cesium/src/components/Layer/M3D/M3d.vue";

export default {
  title: "三维/数据图层/M3D模型/MapGIS",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/Scene/school-all-new/SceneServer`,
    show: true,
    opacity: 1.0,
    enablePopup: true,
    highlightStyle: { color: "rgba(255, 0, 0, 0.6)" },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dM3dLayer },
  data() {
    return {};
  },
  methods: {
    handleMapload() {
      const vm = this;
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">    
    <mapgis-3d-scene-layer v-bind="$props" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 子图层不透明度 = Template.bind({});
子图层不透明度.args = {
  url: `http://192.168.82.89:8089/igs/rest/services/Scene/分层分户/SceneServer`,
  show: true,
  opacity: 1.0,
  opacityLayersArray: ["0"],
  highlightStyle: { color: "rgba(255, 255, 0, 0.6)" },
  enablePopup: true,
  popupOptions: {
    title: "oid",
    enableSeparate: true,
  },
  autoReset: true,
  duration: 2.5,
};
