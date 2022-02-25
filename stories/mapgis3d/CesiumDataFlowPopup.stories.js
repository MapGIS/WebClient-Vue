export default {
  title: "三维/图层/数据流/启用Popup",
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
    popupOptions: {
      description: "Popup对象的配置参数，如下所示：<br>" +
          "1、<span class='storybook-span'>type</span>(选填)：弹框样式类型，默认'default'，有如下值可选：'default','left','underline','point','table','default'<br>" +
          "2、<span class='storybook-span'>anchor</span>(选填)：锚点，即鼠标相对于Tips的位置，默认值为'bottom'，有如可选下值：'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' ,'bottom-right'<br>" +
          "3、<span class='storybook-span'>offset</span>(选填)：相对偏移，即Tips相对鼠标偏移量，有数字(例如10)和数组(例如[10,10])两种方式，<br>" +
          "<span class='storybook-span'>当偏移量为一个数字X(例如10)时</span>，表示Tips在锚点(anchor)所定义的方向上相对鼠标进行偏移X(例如10)像素;<br>" +
          "<span class='storybook-span'>当偏移量为一个数组'[x,y]'(例如[10,10])时</span>，表示Tips相对鼠标进行[10(像素/X轴),10(像素/Y轴)]偏移;<br>" +
          "4、<span class='storybook-span'>maxWidth</span>(选填)：Tips的最大宽度， 默认值'240px'<br>" +
          "5、<span class='storybook-span'>closeButton</span>(选填)：是否在右上角显示关闭Popup的按钮，默认值为true<br>" +
          "6、<span class='storybook-span'>closeOnMove</span>(选填)：是否在移动地图时示关闭Popup，默认值为false<br>" +
          "7、<span class='storybook-span'>fields</span>(选填)：Tips中要显示的字段， 默认值为[]，当不指定要显示的字段时，则会使用field所表示的字段作为默认字段<br>" +
          "8、<span class='storybook-span'>alias</span>(选填)：Tips中要显示的字段的别名，一个键值对对象，会将字段名替换为别名<br>" +
          "9、<span class='storybook-span'>title</span>(选填)：标题<br>" +
          "10、<span class='storybook-span'>style</span>(选填)：定义Popup中的整体样式，规则与css规则一致，有如下值：<br>" +
          "10.1、<span class='storybook-span'>containerStyle</span>(选填)：容器样式<br>" +
          "10.2、<span class='storybook-span'>rowStyle</span>(选填)：一行数据的整体样式<br>" +
          "10.3、<span class='storybook-span'>titleStyle</span>(选填)：标题样式<br>" +
          "10.4、<span class='storybook-span'>fieldStyle</span>(选填)：字段名样式<br>" +
          "10.5、<span class='storybook-span'>valueStyle</span>(选填)：字段值样式<br>" +
          "11、<span class='storybook-span'>class</span>(选填)：定义Popup中的class，以空格区分多个class，有如下值：<br>" +
          "11.1、<span class='storybook-span'>containerClass</span>(选填)：定义Popup中容器的class<br>" +
          "11.2、<span class='storybook-span'>rowClass</span>(选填)：定义Popup中一行的class：<br>" +
          "11.3、<span class='storybook-span'>titleClass</span>(选填)：定义Popup中标题的class，有如下值：<br>" +
          "11.4、<span class='storybook-span'>fieldClass</span>(选填)：定义Popup中字段名的class，有如下值：<br>" +
          "11.5、<span class='storybook-span'>valueClass</span>(选填)：定义Popup中字段值的class，有如下值：<br>" +
          "12、<span class='storybook-span'>enableHighlight</span>(选填)：当鼠标移动到要素上时，是否显示高亮，默认为false不显示高亮<br>" +
          "13、<span class='storybook-span'>highlightStyle</span>(选填)：高亮样式<br>" +
          "有如下值：<br>" +
          "13.1、<span class='storybook-span'>lineStyle</span>：高亮图层的外边线样式：<br>" +
          "有如下值：<br>" +
          "13.1.1、<span class='storybook-span'>color</span>：高亮图层的外边线颜色，十六进制或rgb颜色<br>" +
          "13.1.2、<span class='storybook-span'>width</span>：高亮图层的外边线宽度<br>" +
          "13.1.3、<span class='storybook-span'>opacity</span>：高亮图层的外边透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
          "13.2、<span class='storybook-span'>fillStyle</span>：高亮图层的填充区域样式<br>" +
          "有如下值：<br>" +
          "13.2.1、<span class='storybook-span'>color</span>：高亮图层的填充区域颜色，十六进制或rgb颜色<br>" +
          "13.2.2、<span class='storybook-span'>opacity</span>：高亮图层的填充区域透明度，0~1之间的值，0表示透明，1表示不透明<br>",
      table: {
        defaultValue: {summary: 'false'},
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
  template: `<mapgis-web-scene style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-data-flow-layer
        v-bind="$props"
    />
  </mapgis-web-scene>`,
});

export const 点 = Template.bind({});
点.args = {
  baseUrl: "ws://192.168.91.123:9382/dataflow/cars_xian/subscribe",
  enablePopup: true,
  popupOptions: {
    title: "测试标题"
  },
  layerStyle: {
    type: "point",
    radius: 24,
    color: "#FFFF00",
    outlineColor: "#FF0000",
    outlineWidth: 6
  }
};
