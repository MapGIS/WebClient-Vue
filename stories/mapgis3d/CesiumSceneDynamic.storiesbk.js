import Mapgis3dSceneLayer from "../../cesium/src/components/Layer/M3D/Scene.vue";

export default {
  title: "三维/图层/场景图层/动态单体化",
  component: Mapgis3dSceneLayer,
  argTypes: {
    url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/dth`,
    layers: "show",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dSceneLayer },
  data() {
    return {
    };
  },
  methods: {
    handleMapload() {
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-scene-layer v-bind="$props" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 动态单体化 = Template.bind({});
动态单体化.args = {
  url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/dth`,
  layers: "show:1,2",
};
