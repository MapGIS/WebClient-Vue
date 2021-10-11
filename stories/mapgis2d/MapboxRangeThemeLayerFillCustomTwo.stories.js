import wuhan from "../assets/geojson/wuhan"
export default {
  title: "二维/图层/专题图/分段专题图自定义样式/定义单个分段样式/多边形",
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
      description: "专题图样式，这里定义的样式会影响整个专题图",
    },
    styleGroups: {
      description: "styleGroups为一个对象数组，每一个对象会定义一个分段的样式，如下所示：<br>" +
          "1、<span class='storybook-span'>start</span>：分段起始值<br>" +
          "2、<span class='storybook-span'>end</span>：分段结束值<br>" +
          "3、<span class='storybook-span'>style</span>：分段样式，如下所示：<br>" +
          "4、<span class='storybook-span'>color</span>：填充颜色，十六进制或rgb颜色<br>" +
          "5、<span class='storybook-span'>opacity</span>：填充颜色的透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明",
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

export const  定义单个分段样式 = Template.bind({});
定义单个分段样式.args = {
  type: "range",
  field: "adcode",
  dataSource: wuhan,
  layerStyle: {
    color: "#3D5941,#778868,#B5B991,#F6EDBD,#EDBB8A,#DE8A5A,#CA562C",
    opacity: 1
  },
  styleGroups: [{
    start: 420100,
    end: 420102,
    style: {
      color: "#FFFF00",
      opacity: 1
    }
  },{
    start: 420103,
    end: 420104,
    style: {
      color: "#00FFFF",
      opacity: 1
    }
  }]
}
