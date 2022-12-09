import Mapgis3dM3dLayer from "../../cesium/src/components/Layer/M3D/M3d.vue";

export default {
  title: "三维/图层/M3D/2.0 基础",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/ZondyModels`,
    show: true,
    opacity: 1.0,
    enablePopup: true,
    highlightStyle: { color: 'rgba(255, 0, 0, 0.6)' }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dM3dLayer },
  data() {
    return {};
  },
  methods: {
    handleMapload(data) {
      const vm = this;
      let component = data.component;
      component.viewer.extend(window.Cesium.viewerCesiumInspectorMixin);
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">    
    <mapgis-3d-m3d-layer v-bind="$props" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 基础 = Template.bind({});
基础.args = {
  url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/ModelM3D/SceneServer`,
  // url: `http://${window.webclient.ip}:${window.webclient.port}/M3D/2.0/M3DAttributeTest_BIN/zondy.mcj`,
  // url: `http://${window.webclient.ip}:${window.webclient.port}/结果矿体/结果矿体.mcj`,
  // url: "http://192.168.81.98:8089/igs/rest/services/分层分户_0/M3dServer",
  show: true,
  opacity: 1.0,
  highlightStyle: { color: 'rgba(255, 255, 0, 0.6)' },
  enablePopup: true,
  popupOptions: {
    title: "oid",
    enableSeparate: true
  },
};
