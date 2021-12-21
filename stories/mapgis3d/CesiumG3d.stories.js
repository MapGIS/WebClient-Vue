import Mapgis3dG3dLayer from "../../cesium/src/components/Layer/M3D/G3D.vue";

export default {
  title: "三维/图层/G3D/场景",
  component: Mapgis3dG3dLayer,
  argTypes: {
    url: "http://192.168.88.204:6163/igs/rest/g3d/大楼",
    layers: "show",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dG3dLayer },
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
    <mapgis-3d-g3d-layer v-bind="$props" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 场景 = Template.bind({});
场景.args = {
  url: "http://192.168.88.204:6163/igs/rest/g3d/临海3号楼",
  // layers: "show:1,2",
};
