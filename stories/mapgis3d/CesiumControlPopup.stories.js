 import Mapgis3dPopup from "../../cesium/src/components/UI/Popup/Popup.vue";

export default {
  title: "三维/图形绘制/标注/气泡/自定义槽",
  component: Mapgis3dPopup,
  argTypes: {
    position: {
      longitude: 110,
      latitude: 30,
      height: 0,
    },
    visible: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPopup },
  template: `<mapgis-web-scene style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />    
    <mapgis-3d-popup v-bind="$props">
      <div>自定义槽内容</div>
    </mapgis-3d-popup>
  </mapgis-web-scene>`,
});

export const 自定义槽 = Template.bind({});
自定义槽.args = {
  position: {
    longitude: 110,
    latitude: 30,
    height: 0,
  },
  visible: true,
};
