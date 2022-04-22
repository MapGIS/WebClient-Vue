import Markdown from "../../cesium/docs/api/Overlay/ThemeLayerCustom.md";
import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/分段专题图/多边形数据",
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
      <mapgis-3d-arcgis-tile-layer
        baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
        :layerStyle='{"visible":true,"opacity":1,"zIndex":2}'
      />
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

export const 多边形数据渐变效果 = Template.bind({});
多边形数据渐变效果.args = {
  // baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  baseUrl: `http://localhost:8895/geojson/湖北省.json`,
  
  enablePopup: true,
  enableTips: false,
  visible: true,
  renderRule: {
    type: "gradual",
    field: "childrenNum",
    gradualValueInfos: {
      range: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39],
      // range: [0, 3, 6, 9, 12, 15],
      color: "#FF3300",
      outlineColor: "#FFFFFF",
      outlineWidth: 0,
      opacity: 0.9,
      // startColor: "#CC9900",
      // endColor: "#CC3300",
      startOpacity: 0.2,
      endOpacity: 1,
    }
  },
  highlightStyle: {
    point: new PointStyle({
      radius: 45000,
      color: "#ff0000",
      outlineColor: "#ffffff",
      outlineWidth: 2.5,
    }),
    line: new LineStyle({
      width: 6,
      color: "#000000",
      shadow: new Shadow({ blur: 6, color: "#ff0000" }),
      outlineColor: "#ff0000",
      outlineWidth: 8,
    }),
    polygon: new FillStyle({ 
      color: "#0000ff",
      outlineColor: '#00ff00',
      outlineWidth: 0,
      opacity: 0.8 
    }),
  }
};
