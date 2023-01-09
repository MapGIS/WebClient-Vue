import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/ViewpointManager.md";
import Mapgis3dViewpointManager from "../../cesium/src/components/WebGlobe/ViewpointManager.vue";

export default {
  title: "三维/场景控制/相机",
  component: Mapgis3dViewpointManager,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { "mapgis-3d-viewpoint-manager": Mapgis3dViewpointManager },
  data() {
    return {
      autoReset: true,
      maximumScreenSpaceError: 8,
    };
  },
  template: `
  <mapgis-web-scene
    style="height:95vh"
  >
  <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}& tk=9c157e9585486c02edf817d2ecbc7752" />  
  <mapgis-3d-m3d-layer
      :autoReset="autoReset"
      :maximumScreenSpaceError="maximumScreenSpaceError"
      :url="$props.m3dUrl"
  />
  <mapgis-3d-viewpoint-manager class="storybook-ui-card" style="width: 320px;"></mapgis-3d-viewpoint-manager>
</mapgis-web-scene>
    `,
});

export const 视点管理 = Template.bind({});
视点管理.args = {
  m3dUrl: `http://${webclient.igsIp}:${webclient.igsPort}/igs/rest/g3d/Scene:ZondyModels`
};
视点管理.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
