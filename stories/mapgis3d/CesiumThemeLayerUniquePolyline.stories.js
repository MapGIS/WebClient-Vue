import { Style } from "@mapgis/webclient-es6-service";
import { PolyLine } from "@mapgis/webclient-es6-service/common";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/单值专题图/线数据",
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

export const 线数据 = Template.bind({});
线数据.args = {
  baseUrl: `http://develop.smaryun.com/static/data/geojson/长江黄河.geojson`,

  visible: true,
  type: "unique",
  field: "name",
  themeOptions: {
    styleGroups: [
      {
        value: "长江",
        style: {
          width: 5,
          color: "#ff0000",
        }
      },
      {
        value: "黄河",
        style: {
          width: 10,
          color: "#00ff00",
        }
      }
    ]
  }
}