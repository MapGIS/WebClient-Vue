export default {
  title: "三维/图层/数据流/模型",
  argTypes: {
    baseUrl: {
      description: "数据流地址",
      table: {
        defaultValue: { summary: "null" },
      },
    },
    layerStyle: {
      description:
        "图标样式，样式如下：<br>" +
        "1、<span class='storybook-span'>type</span>(必填)：图标类型，分为点、标签以及模型三种<br>" +
        "2、<span class='storybook-span'>url</span>(必填)：模型的url地址<br>" +
        "3、<span class='storybook-span'>scale</span>(选填)：图标的放大倍数。默认为1<br>" +
        "",
      table: {
        defaultValue: { summary: "null" },
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene>
<!--    <mapgis-3d-raster-layer url="http://t5.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />-->
    <mapgis-3d-data-flow-layer
        v-bind="$props"
    />
  </mapgis-web-scene>`,
});

export const 模型 = Template.bind({});
模型.args = {
  baseUrl: "ws://192.168.199.65:9382/dataflow/cars_xian/subscribe",
  layerStyle: {
    type: "model",
    url: "./CesiumModels/CesiumMilkTruck.glb",
    scale: 10,
  },
  enableAnimation: true,
  enableFlyTo: true,
};
