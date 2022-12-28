import path from "../assets/geojson/path"
export default {
  title: "三维/数据图层/数据流",
  argTypes: {
    startTime: {
      description: "起始时间"
    },
    endTime: {
      description: "结束时间"
    },
    trackPointStyle: {
      description: "模型样式，样式如下：<br>" +
          "1、<span class='storybook-span'>url</span>(必填)：模型的url地址<br>" +
          "2、<span class='storybook-span'>scale</span>(选填)：图标的放大倍数，默认为1<br>" +
          "",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    trackStyle: {
      description: "轨迹样式，样式如下：<br>" +
          "1、<span class='storybook-span'>show</span>(选填)：是否显示轨迹<br>" +
          "2、<span class='storybook-span'>width</span>(选填)：轨迹宽度，默认为8<br>" +
          "3、<span class='storybook-span'>color</span>(选填)：轨迹填充颜色，默认为#FF00FF<br>" +
          "4、<span class='storybook-span'>opacity</span>(选填)：轨迹填充透明度，默认为1<br>" +
          "5、<span class='storybook-span'>outlineColor</span>(选填)：轨迹外边线颜色，默认为#00FFFF<br>" +
          "6、<span class='storybook-span'>outlineWidth</span>(选填)：轨迹外边线宽度，默认为5<br>" +
          "7、<span class='storybook-span'>outlineOpacity</span>(选填)：轨迹外边线透明度，默认为1<br>" +
          "",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    dataSource: {
      description: "轨迹数据"
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene style="height: 95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-track-layer
        v-bind="$props"
    />
  </mapgis-web-scene>`,
});

export const 模型 = Template.bind({});
模型.args = {
  dataSource: path,
  startTime: "2012-08-04T10:00:00Z",
  endTime: "2012-08-04T15:00:00Z",
  trackPointStyle: {
    type: "model",
    url: "./glb/CesiumMilkTruck.glb"
  },
  trackStyle:{
    color: "rgba(0,0,0,0.4)",
    outlineColor: "rgba(255,0,255,0.4)"
  }
};
