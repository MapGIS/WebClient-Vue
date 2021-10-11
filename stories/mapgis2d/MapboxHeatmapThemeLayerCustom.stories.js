import wuhan_house from "../assets/geojson/wuhan_house"
export default {
  title: "二维/图层/专题图/热力专题图/自定义样式",
  argTypes: {
    type: {
      description: "专题图类型，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
      table:{
        defaultValue: { summary: 'heatmap' },
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
          "1、<span class='storybook-span'>color</span>：渐变颜色，例如：#9999FF,#99FFFF,#FF9999,#FFFF99，以逗号分割表示从里到外的渐变颜色<br>" +
          "2、<span class='storybook-span'>radius</span>：渐变半径，半径越大，则热力聚合越紧密，反之则热力聚合月稀疏",
      table:{
        defaultValue: { summary: 'null' },
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
  type: "heatmap",
  field: "display_x",
  dataSource: wuhan_house,
  layerStyle:{
    color: "#9766BF,#C9ADAD,#B5ADDD,#93A9DD,#74A9E1",
    radius: 20
  }
}