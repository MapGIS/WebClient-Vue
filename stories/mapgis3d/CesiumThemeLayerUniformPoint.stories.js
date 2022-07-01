import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/统一专题图/点数据",
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{
    load(data) {
    },
    unload(data) {
    },
    handlebbox(data) {
    },
    handleClick(data) {
    },
    handleHover(data) {
    }
  },
  template:`
    <mapgis-web-scene :style="{height: '95vh'}">
      // <mapgis-3d-arcgis-tile-layer
      //   baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
      //   :layerStyle='{"visible":true,"opacity":1,"zIndex":2}'
      // />
      <mapgis-3d-theme-layer-custom 
        v-bind="$props"
        @load="load"
        @unload="unload"
        @bbox="handlebbox"
        @themeClick="handleClick" 
        @themeHover="handleHover"
      />
    </mapgis-web-scene>`,
});

export const 点数据 = Template.bind({});
点数据.args = {
  // baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  // baseUrl: `http://${window.webclient.staticIP}:8895/geojson/china-city.geojson`,
  baseUrl: `http://develop.smaryun.com/static/data/geojson/省会城市.geojson`,

  visible: true,
  type: "uniform",
  enableHighlight: false,
  enablePopup: false,
  enableTips: false,
  themeOptions: {
    layerStyle: {
      radius: 45000,
      color: "#ff0000",
      outlineColor: "#0000ff",
      outlineWidth: 10,
    }
  }
}