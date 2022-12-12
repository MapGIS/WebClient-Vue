import Markdown from "../../cesium/docs/api/Overlay/ThemeLayerCustom.md";
import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/分段",
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

export const 线数据 = Template.bind({});
线数据.args = {
  // baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  baseUrl: `http://develop.smaryun.com/static/data/geojson/长江黄河.geojson`,

  visible: true,
  type: "range",
  field: "mpLength",
  enableHighlight: false,
  enablePopup: false,
  enableTips: false,
  filter: {
    fieldName: "name",
    fieldRange: ["长江"]
  },
  filterOptions: {
    hasMaterial: false,
    materialType: "Image",
    layerStyle: {
      width: 10,
      color: "#00ff00",
    },
  },
  themeOptions: {
    styleGroups: [
      {
        start: 0,
        end: 50,
        style: {
          width: 5,
          color: "#0000ff",
        }
      },
      {
        start: 50,
        end: 100,
        style: {
          width: 10,
          color: "#ff0000",
        }
      }
    ]
  }
};
线数据.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
