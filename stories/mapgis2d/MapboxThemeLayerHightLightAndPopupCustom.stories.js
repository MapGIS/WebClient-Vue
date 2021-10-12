import wuhan from "../assets/geojson/wuhan"
export default {
  title: "二维/图层/专题图/专题图开启高亮和PopUp/自定义Tips",
  argTypes: {
    dataSource: {
      description: "geojson格式的数据源，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
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
    themeOption: {
      description:  "专题图样式，包含专题图图层样式、分段样式以及高亮样式，样式如下：<br>" +
          "1、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式(略)<br>" +
          "2、<span class='storybook-span'>highlightStyle</span>(选填)：高亮样式<br>" +
          "有如下值：<br>" +
          "2.1、<span class='storybook-span'>lineStyle</span>：高亮图层的外边线样式：<br>" +
          "有如下值：<br>" +
          "2.1.1、<span class='storybook-span'>color</span>：高亮图层的外边线颜色，十六进制或rgb颜色<br>" +
          "2.1.2、<span class='storybook-span'>width</span>：高亮图层的外边线宽度<br>" +
          "2.1.3、<span class='storybook-span'>opacity</span>：高亮图层的外边透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
          "2.2、<span class='storybook-span'>fillStyle</span>：高亮图层的填充区域样式<br>" +
          "有如下值：<br>" +
          "2.2.1、<span class='storybook-span'>color</span>：高亮图层的填充区域颜色，十六进制或rgb颜色<br>" +
          "2.2.2、<span class='storybook-span'>opacity</span>：高亮图层的填充区域透明度，0~1之间的值，0表示透明，1表示不透明<br>" +
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
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
});

export const  开启高亮和PopUp = Template.bind({});
开启高亮和PopUp.args = {
  dataSource: wuhan,
  type: "range",
  field: "adcode",
  enableTips: true,
  tipsOptions: {
    anchor: "top-left",
    offset: 20,
    maxWidth: "400px",
    fields: [
        "name",
        "adcode",
        "center",
    ],
    alias: {
      "name": "行政区名",
      "adcode": "邮政编码",
      "center": "中心点",
    },
    style: {
    },
    enableHighlight: true,
    highlightStyle: {
      lineStyle: {
        color: "#FF0000",
        width: 4,
        opacity: 1
      },
      fillStyle: {
        color: "#0000FF",
        opacity: 0.5
      }
    }
  },
  enablePopup: true,
  popupOptions: {
    anchor: "bottom",
    offset: 20,
    maxWidth: "400px",
    fields: [
      "name",
      "adcode",
      "center",
    ],
    alias: {
      "name": "行政区名",
      "adcode": "邮政编码",
      "center": "中心点",
    },
    style: {
    },
    enableHighlight: true,
    highlightStyle: {
      lineStyle: {
        color: "#FF0000",
        width: 4,
        opacity: 1
      },
      fillStyle: {
        color: "#0000FF",
        opacity: 0.5
      }
    }
  },
}
