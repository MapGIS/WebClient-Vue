import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dM3dLayer from "../../cesium/src/components/M3D/M3d.vue";

export default {
  title: "三维/图层/M3D/2.0 基础",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
    show: true,
    opacity: 1.0,
    layers: undefined,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebScene, Mapgis3dM3dLayer },
  data() {
    return {
      opacity: 0.25,
    };
  },
  methods: {
    handleMapload() {
      const vm = this;
      window.setTimeout(() => {
        vm.opacity = 1;
      }, 5000);
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">    
    <mapgis-3d-m3d-layer v-bind="$props" :opacity="opacity" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 基础 = Template.bind({});
基础.args = {
  // url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
  url: "http://192.168.88.204:8089/M3D/2.0/M3DAttributeTest_BIN/zondy.mcj",
  show: true,
  opacity: 0.5,
};
