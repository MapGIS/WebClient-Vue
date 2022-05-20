import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/ViewpointManager.md";
import Mapgis3dViewpointManager from "../../cesium/src/components/WebGlobe/ViewpointManager.vue";

export default {
  title: "三维/场景子组件/视点管理",
  component:Mapgis3dViewpointManager,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components:{'mapgis-3d-viewpoint-manager':Mapgis3dViewpointManager},
  data() {
    return {
      m3dUrl: `http://${webclient.ip}:${webclient.port}/igs/rest/g3d/ZondyModels`,
      // m3dUrl: "http://192.168.88.204:6163/igs/rest/g3d/汉阳BIM",
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
      :url="m3dUrl"
  />
  <mapgis-3d-viewpoint-manager style="position:absolute;top:10px;left:10px;"></mapgis-3d-viewpoint-manager>
</mapgis-web-scene>
    `,
});

export const 视点管理 = Template.bind({});
视点管理.args = {
};
视点管理.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

