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

export const 多边形数据 = Template.bind({});
多边形数据.args = {
  // baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  baseUrl: `http://localhost:8895/geojson/湖北省.json`,
  
  visible: true,
  renderRule: {
    type: "range",
    // field: "name",
    field: "childrenNum",
    rangeValueInfos: [
      {
        // range: ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市'],
        range: ['0', '3'],
        symbolStyle: new FillStyle({
          color: '#ff0000',
          outlineColor: '#ff0000',
          outlineWidth: 0,
          opacity: 1,
        })
      },
      {
        // range: ['荆门市', '荆州市'],
        range: ['3', '6'],
        symbolStyle: new FillStyle({
          color: '#ff4b4b',
          outlineColor: '#ff4b4b',
          outlineWidth: 0,
          opacity: 1,
        })
      },
      {
        // range: ['黄冈市', '咸宁市'],
        range: ['6', '9'],
        symbolStyle: new FillStyle({
          color: '#ff8282',
          outlineColor: '#ff8282',
          outlineWidth: 0,
          opacity: 1,
        })
      },
      {
        // range: ['随州市', '仙桃市'],
        range: ['9', '12'],
        symbolStyle: new FillStyle({
          color: '#ffafaf',
          outlineColor: '#ffafaf',
          outlineWidth: 0,
          opacity: 1,
        })
      },
      {
        // range: ['潜江市', '天门市', '孝感市', '神农架林区', '恩施土家族苗族自治州'],
        range: ['12', '15'],
        symbolStyle: new FillStyle({
          color: '#ffdcdc',
          outlineColor: '#ffdcdc',
          outlineWidth: 0,
          opacity: 1,
        })
      }
    ]
  }
};
分段专题图.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};