import path from "../assets/geojson/path"
export default {
  title: "三维/图层/轨迹/模型",
  argTypes: {
    dataSource: {
      description: "轨迹数据"
    },
    startTime: {
      description: "起始时间"
    },
    endTime: {
      description: "结束时间"
    },
    layerStyle: {
      description: "模型样式，样式如下：<br>" +
          "1、<span class='storybook-span'>url</span>(必填)：模型的url地址<br>" +
          "2、<span class='storybook-span'>scale</span>(选填)：图标的放大倍数。默认为1<br>" +
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
  layerStyle: {
    type: "model",
    url: "./glb/CesiumMilkTruck.glb"
  }
};
