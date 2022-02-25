import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayerService.md";

export default {
  title: "三维/图层/标绘服务(不带UI)",
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene style="height:95vh">
  </mapgis-web-scene>`,
});

export const 标绘服务 = Template.bind({});
标绘服务.args = {};

标绘服务.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
