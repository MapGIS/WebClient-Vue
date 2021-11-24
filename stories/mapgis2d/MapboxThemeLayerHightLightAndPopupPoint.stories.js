import wuhan_house from "../assets/geojson/wuhan_house"
export default {
  title: "二维/图层/专题图/开启Tips和Popup/点数据",
  argTypes: {
    dataSource: {
      description: "geojson格式的数据源或者geojson数据源的URl，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    type: {
      description: "<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    field: {
      description: "<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    themeOptions: {
      description:  "专题图样式，包含专题图图层样式、分段样式以及高亮样式，样式如下：<br>" +
          "1、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式(略)<br>" +
          "2、<span class='storybook-span'>highlightStyle</span>(选填)：高亮样式<br>" +
          "有如下值：<br>" +
          "2.1、<span class='storybook-span'>pointStyle</span>(选填)：高亮的区域(圆)样式<br>" +
          "有如下值：<br>" +
          "2.1.1、<span class='storybook-span'>radius</span>(选填)：高亮的区域(圆)的半径<br>" +
          "2.1.2、<span class='storybook-span'>color</span>(选填)：高亮的区域(圆)的颜色，十六进制或rgb颜色<br>" +
          "2.1.3、<span class='storybook-span'>opacity</span>(选填)：高亮的区域(圆)的透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
          "2.1.4、<span class='storybook-span'>outlineColor</span>(选填)：高亮的区域(圆)的外边线颜色，十六进制或rgb颜色<br>" +
          "2.1.5、<span class='storybook-span'>outlineWidth</span>(选填)：高亮的区域(圆)的外边线宽度<br>" +
          "2.1.6、<span class='storybook-span'>outlineOpacity</span>(选填)：高亮的区域(圆)的外边线透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
          "3、<span class='storybook-span'>layerStyle</span>(选填)：分段样式(略)<br>",
      table:{
        defaultValue: { summary: 'null' },
      }
    },
    isHoverAble: {
      description: "是否开启高亮，默认不开启",
      table:{
        defaultValue: { summary: 'false' },
      },
    },
    enableTips: {
      description: "是否开启PopUp，默认不开启",
      table:{
        defaultValue: { summary: 'false' },
      },
    }
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:96vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
});

export const  开启高亮和PopUp = Template.bind({});
开启高亮和PopUp.args = {
  dataSource: wuhan_house,
  type: "range",
  field: "display_x",
  themeOptions: {
    layerStyle: {
      radius: 10
    },
    highlightStyle: {
      pointStyle: {
        radius: 10,
        color: "#FF0000",
        opacity: 0.5,
        outlineColor: "#FFFF00",
        outlineWidth: 4,
        outlineOpacity: 1
      }
    }
  },
  isHoverAble: true,
  enableTips: true
}
