import Mapgis3dSceneLayer from "../../cesium/src/components/Layer/M3D/Scene.vue";
import Markdown from "../../cesium/docs/api/layer/m3d/scene.md";

export default {
  title: "三维/图层/场景图层",
  component: Mapgis3dSceneLayer,
  argTypes: {
    url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/CIMyanshi/倾斜临时/SceneServer`,
    layers: "show",
    maximumScreenSpaceError: 16,
    opacity: 1,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dSceneLayer },
  data() {
    return {
      opacityS: 0.25,
    };
  },
  methods: {
    handleMapload() {
      const vm = this;
      window.setTimeout(() => {
        vm.opacityS = 0.6;
      }, 5000);
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-scene-layer v-bind="$props"/>
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 场景展示 = Template.bind({});
场景展示.args = {
  // url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/场景-BIM/SceneServer`,
  url: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/分层分户/SceneServer`,
  layers: "show:0,1",
  maximumScreenSpaceError: 4,
  opacity: 0.5,
  opacityLayersArray: [0, 1],
  enablePopup: true
};

场景展示.parameters = {
  docs: {
      description: {
          component: Markdown,
      },
  },
};