export default {
  title: "三维/数据图层/数据流/标签",
  argTypes: {
    baseUrl: {
      description: "数据流地址",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    layerStyle: {
      description: "图标样式，样式如下：<br>" +
          "1、<span class='storybook-span'>type</span>(必填)：图标类型，分为点、标签以及模型三种<br>" +
          "2、<span class='storybook-span'>field</span>(选填)：要显示的字段<br>" +
          "3、<span class='storybook-span'>text</span>(选填)：要显示的问题，与field互斥<br>" +
          "4、<span class='storybook-span'>scale</span>(选填)：我文字放大倍数，默认1<br>" +
          "5、<span class='storybook-span'>xOffset</span>(选填)：文字x轴偏移，默认0<br>" +
          "6、<span class='storybook-span'>yOffset</span>(选填)：文字y轴偏移，默认0<br>" +
          "7、<span class='storybook-span'>color</span>(选填)：文字颜色，默认#FFFFFF<br>" +
          "8、<span class='storybook-span'>opacity</span>(选填)：文字透明度，默认1<br>" +
          "9、<span class='storybook-span'>outlineColor</span>(选填)：文字描边颜色，默认#FFFFFF<br>" +
          "10、<span class='storybook-span'>outlineWidth</span>(选填)：文字描边宽度，默认0<br>" +
          "11、<span class='storybook-span'>backgroundColor</span>(选填)：文字背景颜色，默认#FFFFFF<br>" +
          "12、<span class='storybook-span'>backgroundOpacity</span>(选填)：文字背景透明度，默认0<br>" +
          "13、<span class='storybook-span'>url</span>(选填)：图标url地址<br>" +
          "14、<span class='storybook-span'>rotation</span>(选填)：图标旋转角度<br>" +
          "15、<span class='storybook-span'>imageScale</span>(选填)：图标放大倍数，默认1<br>" +
          "16、<span class='storybook-span'>width</span>(选填)：图标宽度<br>" +
          "17、<span class='storybook-span'>height</span>(选填)：图标高度<br>" +
          "",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene style="height:95vh">
  <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-data-flow-layer
        v-bind="$props"
    />
  </mapgis-web-scene>`,
});

export const 标签 = Template.bind({});
标签.args = {
  baseUrl: "ws://192.168.199.65:9382/dataflow/cars_xian/subscribe",
  layerStyle: {
    type: "marker",
    field: "imei",
    yOffset: 35,
    url: "./img/icon.png",
    imageScale: 0.5
  }
};
