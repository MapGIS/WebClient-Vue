export default {
  title: "三维/图层/数据流/自定义Popup",
  argTypes: {
    baseUrl: {
      description: "数据流地址",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    enablePopup: {
      description: "是否启用Popup,默认不启用",
      table:{
        defaultValue: { summary: 'false' },
      },
    },
    layerStyle: {
      description: "图标样式，样式如下：<br>" +
          "1、<span class='storybook-span'>type</span>(必填)：图标类型，分为点、标签以及模型三种<br>" +
          "2、<span class='storybook-span'>radius</span>(必填)：点半径<br>" +
          "3、<span class='storybook-span'>color</span>(选填)：颜色，默认#FFFFFF<br>" +
          "3、<span class='storybook-span'>opacity</span>(选填)：透明度，默认1<br>" +
          "3、<span class='storybook-span'>outlineColor</span>(选填)：外边线颜色，默认#000000<br>" +
          "3、<span class='storybook-span'>outlineWidth</span>(选填)：外边线宽度，默认1<br>" +
          "3、<span class='storybook-span'>outlineOpacity</span>(选填)：外边线透明度，默认1<br>" +
          "",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene>
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-data-flow-layer
        v-bind="$props"
    >
      <div style="width: 200px;height: 200px;background: wheat" slot="content" slot-scope="data">
        <div>
          经度：{{data.popup.lng}}
        </div>
        <div>
          纬度：{{data.popup.lat}}
        </div>
      </div>
    </mapgis-3d-data-flow-layer>
  </mapgis-web-scene>`,
});

export const 点 = Template.bind({});
点.args = {
  baseUrl: "ws://192.168.91.123:9382/dataflow/cars_xian/subscribe",
  enablePopup: true,
  layerStyle: {
    type: "point",
    radius: 24,
    color: "#FFFF00",
    outlineColor: "#FF0000",
    outlineWidth: 6
  }
};
