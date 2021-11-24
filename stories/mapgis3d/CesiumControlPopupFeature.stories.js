import Mapgis3dFeaturePopup from "../../cesium/src/components/UI/Popup/PopupFeature.vue";

export default {
  title: "三维/场景子组件/Popup-默认样式",
  component: Mapgis3dFeaturePopup,
  argTypes: {
    properties: {},
    position: {
      longitude: 110,
      latitude: 30,
      height: 0,
    },
    showed: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dFeaturePopup },
  template: `<mapgis-web-scene style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />    
    <mapgis-3d-feature-popup v-bind="$props">
      <div>自定义槽内容</div>
    </mapgis-3d-feature-popup>
  </mapgis-web-scene>`,
});

export const 默认样式 = Template.bind({});
默认样式.args = {
  properties: {
    name: "测试名称",
    id: "测试id",
  },
  position: {
    longitude: 110,
    latitude: 30,
    height: 0,
  },
  popupOptions: {
    title: "name",
    popupType: "table",
    fullHeight: 400,
  },
  visible: true,
};
