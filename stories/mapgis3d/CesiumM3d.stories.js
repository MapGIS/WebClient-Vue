import MapgisWebScene from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dIgsM3d from "../../cesium/src/components/M3D/M3d.vue";

export default {
  title: "三维/图层/M3D",
  component: Mapgis3dIgsM3d,
  argTypes: {
    url: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
    show: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebScene, Mapgis3dIgsM3d },
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
  template: `<mapgis-web-scene @load="handleMapload">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-igs-m3d v-bind="$props" :opacity="opacity" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const M3D = Template.bind({});
M3D.args = {
  url: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
  show: true,
};
