import wuhan_subway from "../assets/geojson/wuhan_subway"
export default {
  title: "二维/图层/专题图/分段专题图自定义样式/开启高亮和PopUp/线",
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
    },
    highlightStyle: {
      description: "高亮区域样式，可单独定义多边形样式和线样式",
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
  }
});

export const  开启高亮和PopUp = Template.bind({});
开启高亮和PopUp.args = {
  type: "range",
  field: "mpLength",
  dataSource: wuhan_subway,
  isHoverAble: true,
  isPopUpAble: true,
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
}
