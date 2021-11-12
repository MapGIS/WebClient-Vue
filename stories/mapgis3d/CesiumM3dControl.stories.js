import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dM3dLayer from "../../cesium/src/components/M3D/M3d.vue";

export default {
  title: "三维/图层/M3D/1.0 图层控制",
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
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-m3d-layer v-bind="$props" :opacity="opacity" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 图层控制 = Template.bind({});
图层控制.args = {
  url: "http://192.168.21.191:6163/igs/rest/g3d/汉阳BIM",
  // url: 'http://192.168.21.191:6163/igs/rest/g3d/大楼',
  // url:`http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/汉阳BIM`,
  show: true,
  layers: "layers=show:0,1",
};