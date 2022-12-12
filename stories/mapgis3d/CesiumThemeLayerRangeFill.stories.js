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

export const 多边形数据 = Template.bind({});
多边形数据.args = {
  // baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  baseUrl: `http://${window.webclient.ip}:${window.webclient.port}/geojson/湖北省.json`,

  visible: true,
  type: "range",
  field: "childrenNum",
  enableHighlight: false,
  enablePopup: false,
  enableTips: false,
  filter: {
    fieldName: "name",
    fieldRange: ["武汉市"]
  },
  filterOptions: {
    layerStyle: {
      color: '#00ff00',
      outlineColor: '#ffffff',
      outlineWidth: 1,
      opacity: 1,
    },
  },
  themeOptions: {
    styleGroups: [
      {
        start: 0,
        end: 3,
        style: {
          color: '#ff0000',
          outlineColor: '#ff0000',
          outlineWidth: 0,
          opacity: 1,
        }
      },
      {
        start: 3,
        end: 6,
        style: {
          color: '#ff4b4b',
          outlineColor: '#ff4b4b',
          outlineWidth: 0,
          opacity: 1,
        }
      },
      {
        start: 6,
        end: 9,
        style: {
          color: '#ff8282',
          outlineColor: '#ff8282',
          outlineWidth: 0,
          opacity: 1,
        }
      },
      {
        start: 9,
        end: 12,
        style: {
          color: '#ffafaf',
          outlineColor: '#ffafaf',
          outlineWidth: 0,
          opacity: 1,
        }
      },
      {
        start: 12,
        end: 15,
        style: {
          color: '#ffdcdc',
          outlineColor: '#ffdcdc',
          outlineWidth: 0,
          opacity: 1,
        }
      }
    ]
  }
};
多边形数据.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
