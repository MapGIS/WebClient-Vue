import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dM3dLayer from "../../cesium/src/components/Layer/M3D/M3d.vue";

export default {
  title: "三维/图层/M3D/1.0 点云",
  component: Mapgis3dM3dLayer,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/ZondyModels`,
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

export const 点云 = Template.bind({});
点云.args = {
  url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/m3d_点云`,
  // url:`http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/m3d_点云`,
  show: true,

};
