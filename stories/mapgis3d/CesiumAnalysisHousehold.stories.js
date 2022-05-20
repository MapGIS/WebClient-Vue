import Mapgis3dStratifiedHousehold from "../../cesium/src/components/Analysis/StratifiedHousehold.vue";
import Markdown from "../../cesium/docs/api/analysis/Household.md";

export default {
  title: "三维/分析/分层分户",
  component: Mapgis3dStratifiedHousehold,
  argTypes: {
    enablePopup: true,
    enableDynamicQuery: false,
    enableStratifiedHouse: true,
    layers: [],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dStratifiedHousehold },
  data() {
    return {
      g3d: {
        url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/场景图层-分层分户/SceneServer`,
        vueIndex: "test_g3d_layer1",
      },
    };
  },
  methods: {
    handleMapload() {
      const vm = this;
    },
  },
  template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">    
    <mapgis-3d-scene-layer v-bind="g3d" />
    <mapgis-3d-stratified-household style="position: absolute;top: 10px;left: 10px;" v-bind="$props" />

    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 分层分户 = Template.bind({});
分层分户.args = {
  enablePopup: true,
  enableDynamicQuery: false,
  enableStratifiedHouse: true,
  layers: [
    {
      title: "BIM-3栋",
      vueIndex: "test_g3d_layer1",
    },
  ],
};

分层分户.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
