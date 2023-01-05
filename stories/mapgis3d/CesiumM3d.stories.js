import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dM3dLayer from "../../cesium/src/components/Layer/M3D/M3d.vue";

export default {
  title: "三维/数据图层/M3D模型/M3D(1.0)",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/M3Dv1/ZondyModels/M3dServer`,
    show: true,
    opacity: 1.0,
    layers: '',
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
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-m3d-layer v-bind="$props" :opacity="opacity" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const M3D = Template.bind({});
M3D.args = {
  url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/M3Dv1/ZondyModels/M3dServer`,
  show: true,
  opacity: 0.5,
};
