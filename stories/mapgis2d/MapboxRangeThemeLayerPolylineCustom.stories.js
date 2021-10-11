import wuhan_subway from "../assets/geojson/wuhan_subway"
export default {
  title: "二维/图层/专题图/分段专题图自定义样式/定义整体样式/线",
  argTypes: {
    type: {
      description: "专题图类型，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
      table:{
        defaultValue: { summary: 'range' },
      },
    },
    field: {
      description: "专题图字段，请填写仅含有数字的字段",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    dataSource: {
      description: "geojson格式的数据源",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    layerStyle: {
      description: "渐变样式，有如下参数：<br>" +
          "1、<span class='storybook-span'>color</span>：渐变颜色，例如：#9999FF,#99FFFF,#FF9999,#FFFF99<br>" +
          "2、<span class='storybook-span'>width</span>：线宽度，默认为1<br>" +
          "3、<span class='storybook-span'>opacity</span>：线透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明",
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
  data(){
    return{
    }
  },
  mounted(){
    console.log("props",this.$props)
  }
});

export const  分段专题图点 = Template.bind({});
分段专题图点.args = {
  type: "range",
  field: "mpLength",
  dataSource: wuhan_subway,
  layerStyle: {
    color: "#ff0000,#ff8700,#ffd300,#deff0a,#a1ff0a,#0aff99,#0aefff,#147df5,#580aff,#be0aff",
    width: 5,
    opacity: 1
  }
}