import wuhan_subway from "../assets/geojson/wuhan_subway"
export default {
  title: "二维/图层/专题图/分段专题图/线数据",
  argTypes: {
    dataSource: {
      description: "geojson格式的数据源，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    themeOption: {
      description:  "创建专题图所需要的参数，有如下值：<br>" +
          "1、<span class='storybook-span'>type</span>(必填)：专题图类型，类型有以下值，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)<br>" +
          "2、<span class='storybook-span'>field</span>(必填)：属性字段，即以某个字段的值来创建专题图<br>" +
          "3、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式<br>" +
          "有如下值：<br>" +
          "1、<span class='storybook-span'>color</span>：渐变颜色，例如：#9999FF,#99FFFF,#FF9999,#FFFF99<br>" +
          "2、<span class='storybook-span'>opacity</span>：透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>" +
          "3、<span class='storybook-span'>radius</span>：点半径，默认为6<br>" +
          "4、<span class='storybook-span'>outlineColor</span>：点的外边线颜色，16进制或rgb颜色，默认为#000000<br>" +
          "5、<span class='storybook-span'>outlineOpacity</span>：点的外边线透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>" +
          "6、<span class='storybook-span'>outlineWidth</span>：点的外边线宽度，默认为1",
      table:{
        defaultValue: { summary: 'null' },
      }
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

export const  自定义样式 = Template.bind({});
自定义样式.args = {
  dataSource: wuhan_subway,
  themeOption: {
    type: "range",
    field: "mpLength",
    layerStyle: {
      color: "#ff0000,#ff8700,#ffd300,#deff0a,#a1ff0a,#0aff99,#0aefff,#147df5,#580aff,#be0aff",
      width: 5,
      opacity: 1
    }
  }
}

export const  默认样式 = Template.bind({});
默认样式.args = {
  dataSource: wuhan_subway,
  themeOption: {
    type: "range",
    field: "mpLength",
  }
}