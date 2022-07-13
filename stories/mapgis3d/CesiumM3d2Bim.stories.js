import Mapgis3dM3dLayer from "../../cesium/src/components/Layer/M3D/M3d.vue";

export default {
  title: "三维/图层/M3D/2.0 BIM",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
    show: true,
    opacity: 1.0,
    enablePopup: true,
    highlightStyle: {color: 'rgba(255, 0, 0, 0.6)'}
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
    <mapgis-3d-m3d-layer v-bind="$props" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const BIM = Template.bind({});
BIM.args = {
  // url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
  url: `http://${window.webclient.ip}:${window.webclient.port}/M3D/2.0/高级住所模型/高级住所模型.mcj`,
  show: true,
  opacity: 1.0,
  highlightStyle: {color: 'rgba(255, 255, 0, 0.6)'},
  enablePopup: true,
  popupOptions: {
    title: "oid",
    enableSeparate: true
  },
  autoReset: true,
  duration: 2.5
};
