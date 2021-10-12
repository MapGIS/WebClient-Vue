import wuhan_subway from "../assets/geojson/wuhan_subway"
export default {
  title: "二维/图层/专题图/专题图开启高亮和PopUp/线数据",
  argTypes: {
    dataSource: {
      description: "geojson格式的数据源，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    themeOption: {
      description:  "除了热力图意外，所有专题图都可以开启高亮和Popup，高亮样式如下所示：<br>" +
          "1、<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)<br>" +
          "2、<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图<br>" +
          "3、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式(略)<br>" +
          "4、<span class='storybook-span'>highlightStyle</span>(选填)：高亮样式<br>" +
          "有如下值：<br>" +
          "4.1、<span class='storybook-span'>lineStyle</span>(选填)：高亮的区域样式<br>" +
          "有如下值：<br>" +
          "4.1.1、<span class='storybook-span'>width</span>(选填)：高亮的区域的宽度<br>" +
          "4.1.2、<span class='storybook-span'>color</span>(选填)：高亮的区域的颜色，十六进制或rgb颜色<br>" +
          "4.1.3、<span class='storybook-span'>opacity</span>(选填)：高亮的区域的透明度，0~1之间的值，0表示透明，1表示不透明<br>",
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
    isPopUpAble: {
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
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
});

export const  开启高亮和PopUp = Template.bind({});
开启高亮和PopUp.args = {
  dataSource: wuhan_subway,
  themeOption: {
    type: "range",
    field: "mpLength",
    layerStyle: {
      color: "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
      width: 5
    },
    highlightStyle: {
      lineStyle: {
        width: 10,
        color: "#FF0000",
        opacity: 1
      }
    }
  },
  isHoverAble: true,
  isPopUpAble: true
}
