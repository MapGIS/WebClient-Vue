import Markdown from "../../cesium/docs/api/Overlay/ThemeLayerCustom.md";
import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/分段专题图/点数据",
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
  // baseUrl: `http://develop.smaryun.com/static/data/geojson/省会城市.geojson`,
  baseUrl: `http://${window.webclient.ip}:${window.webclient.port}/geojson/metroStation.json`,
  
  visible: true,
  type: "range",
  // field: "name",
  field: "lg",
  enableHighlight: false,
  enablePopup: false,
  enableTips: false,
  filter: {
    fieldName: "name",
    fieldRange: ["武汉"]
  },
  filterOptions: {
    hasMaterial: false,
    materialType: "Image",
    layerStyle: {
      radius: 45000,
      color: "#00ff00",
      outlineColor: "#0000ff",
      outlineWidth: 10,
    },
  },
  themeOptions: {
    styleGroups: [
      {
        // range: ['乌鲁木齐', '拉萨', '西宁', '兰州', '成都', '重庆', '贵阳', '昆明', '银川', '西安', '南宁', '海口'],
        start: 0,
        end: 1,
        style: {
          radius: 100,
          color: "#ff0000",
          outlineColor: "#0000ff",
          outlineWidth: 10,
        }
      },
      {
        // range: ['广州', '长沙', '南昌', '福州', '台北', '杭州', '上海', '武汉', '合肥', '南京', '郑州', '济南'],
        start: 1,
        end: 2,
        style: {
          radius: 200,
          color: "#00ff00",
          outlineColor: "#0000ff",
          outlineWidth: 10,
        }
      },
      {
        // range: ['石家庄', '太原', '呼和浩特', '天津', '沈阳', '长春', '哈尔滨', '北京', '香港', '澳门'],
        start: 2,
        end: 8,
        style: {
          radius: 300,
          color: "#0000ff",
          outlineColor: "#0000ff",
          outlineWidth: 10,
        }
      }
    ]
  }
};
点数据.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};