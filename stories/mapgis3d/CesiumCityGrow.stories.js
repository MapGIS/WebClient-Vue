import "../style/card.css";
import Markdown from "../../cesium/docs/api/simulation/CityGrow.md";

export default {
  title: "三维/模拟仿真/城市生长",
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {};
  },
  methods: {
    handleLoad(e){
    },
    handleGlow(){
      this.$refs.citygrow.startGrow();
    }
  },
  template: `
    <mapgis-web-scene 
      style="height:95vh"
      v-on:load="handleLoad"
    >
        <mapgis-rastertile-layer v-if="false" layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-3d-city-grow  v-bind="$props"/>
    </mapgis-web-scene>
    `,
});

export const cityGrow = Template.bind({});
cityGrow.args = {
  // width:720,
  baseUrl:`http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrfs/docs/shengZhenBaiMo/0/0`,
  featureStyle:{
    startTimeField:"startTime",
    endTimeField:"endTime",
    heightField:"height",
    startTime: 1068543416,
    endTime: 1636639287,
    heightRadio:3.0,
    isGrowHeight:false,
    colors:["rgba(245,33,0,1)", "rgba(255,121,26,1)", "rgba(255,164,46,1)", "rgba(255,209,82,1)"],
    times:[2005,2010,2015]
  }
};
cityGrow.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

