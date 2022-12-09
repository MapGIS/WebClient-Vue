import Mapgis3dFeaturePopup from "../../cesium/src/components/UI/Popup/PopupFeature.vue";

export default {
  title: "三维/图形绘制/标注/气泡/要素/自定义槽",
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

export const 自定义槽 = Template.bind({});
自定义槽.args = {
  properties: {
    title: "测试名称",
    content: "富文本字符内容",
    images: ["https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F14090176146%2F1000&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640522366&t=d53479c6c63e01c044bc210c2fcdba90"]
  },
  position: {
    longitude: 110,
    latitude: 30,
    height: 0,
  },
  popupOptions: {
    title: "name",
    popupType: "rich-text",
    fullHeight: 600,
  },
  visible: true,
};
