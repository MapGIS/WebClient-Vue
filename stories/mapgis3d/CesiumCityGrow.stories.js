import "../style/card.css";
import Markdown from "../../cesium/docs/api/simulation/CityGrow.md";

export default {
  title: "三维/模拟仿真",
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
      <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
  ></mapgis-3d-ogc-wmts-layer>
  <mapgis-3d-ogc-wmts-layer
      :baseUrl="url1"
      :wmtsLayer="layer1"
      :tileMatrixSet="tileMatrixSet1"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
  ></mapgis-3d-ogc-wmts-layer>
        <mapgis-3d-city-grow  v-bind="$props"/>
    </mapgis-web-scene>
    `,
});

export const 城市生长 = Template.bind({});
城市生长.args = {
  url: "http://t7.tianditu.gov.cn/img_c/wmts",
  tileMatrixSet: "c",
  tilingScheme: "EPSG:4326",
  layer: "img",
  format: "tiles",
  token: {
      key: "tk",
      value: "9c157e9585486c02edf817d2ecbc7752",
  },
  url1: "http://t7.tianditu.gov.cn/cva_c/wmts",
  tileMatrixSet1: "c",
  tilingScheme1: "EPSG:4326",
  layer1: "cva",
  boundaryStyle: {
      color: "#1E90FF",
      opacity: 0.5,
      outlineColor: "rgba(0,191,255,0.5)"
  },
  baseUrl:`http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/shengZhenBaiMo/FeatureServer/0`,
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
城市生长.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

