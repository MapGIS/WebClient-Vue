import wuhan_house from "../assets/geojson/wuhan_house"
export default {
  title: "二维/图层/专题图/热力专题图/无样式",
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
  dataSource: wuhan_house
}