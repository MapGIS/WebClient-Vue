import Mapgis3dM3dLayer from "../../cesium/src/components/Layer/M3D/M3d.vue";

export default {
  title: "三维/数据图层/M3D模型/M3D(2.0)",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/M3Dv2/高级住所模型/M3dServer`,
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

export const M3D = Template.bind({});
M3D.args = {
  url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/M3Dv2/高级住所模型/M3dServer`,
  show: true,
  opacity: 1.0,
  highlightStyle: { color: 'rgba(255, 255, 0, 0.6)' },
  enablePopup: true,
  popupOptions: {
    title: "oid",
    enableSeparate: true
  },
};
