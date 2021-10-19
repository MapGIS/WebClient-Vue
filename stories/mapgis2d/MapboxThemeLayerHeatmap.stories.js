import wuhan_house from "../assets/geojson/wuhan_house"
export default {
  title: "二维/图层/专题图/热力专题图",
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
    themeOption: {
      description:  "专题图所有样式，包含专题图样式、高亮样式以及分段样式，热力图目前只应用专题图样式，有如下值：<br>" +
          "1、<span class='storybook-span'>layerStyle</span>(选填)：专题图样式<br>" +
          "有如下值：<br>" +
          "1.1、<span class='storybook-span'>color</span>：热力颜色，例如：#9999FF,#99FFFF,#FF9999,#FFFF99，以逗号分割表示从里到外的渐变颜色<br>" +
          "1.2、<span class='storybook-span'>radius</span>：热力半径，半径越大，则热力聚合越紧密，反之则热力聚合月稀疏",
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
  dataSource: wuhan_house,
  type: "heatmap",
  field: "display_x",
  themeOption: {
    layerStyle:{
      color: "#9766BF,#C9ADAD,#B5ADDD,#93A9DD,#74A9E1",
      radius: 20
    }
  }
}

export const  默认样式 = Template.bind({});
默认样式.args = {
  dataSource: wuhan_house,
  type: "heatmap",
  field: "display_x",
}