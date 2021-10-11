import wuhan_house from "../assets/geojson/wuhan_house"
export default {
  title: "二维/图层/专题图/分段专题图/点",
  argTypes: {
    type: "range",
    field: "display_x",
    dataSource: wuhan_house,
    layerStyle: {
      color: "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
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
  field: "display_x",
  dataSource: wuhan_house,
  layerStyle: {
    color: "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
  }
}