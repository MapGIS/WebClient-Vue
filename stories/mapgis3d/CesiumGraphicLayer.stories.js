import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayer.md";

export default {
  title: "三维/图层/标绘图层",
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene style="height:95vh">
      <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
      <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cta_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
      <mapgis-3d-graphic-layer style="position: absolute;top: 10px;right: 10px;" :dataSource="dataSource"/>
  </mapgis-web-scene>`,
});

export const 标绘图层 = Template.bind({});
标绘图层.args = {
  dataSource: []
};

标绘图层.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
