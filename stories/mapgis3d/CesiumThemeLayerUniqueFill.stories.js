import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/可视化/专题图/单值专题图/多边形数据",
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
  baseUrl: `http://${window.webclient.staticIP}:8895/geojson/湖北省.json`,
  
  visible: true,
  type: "unique",
  field: "name",
  themeOptions: {
    styleGroups: [
      {
        value: ["武汉市", "黄石市", "十堰市", ],
        style: {
          color: '#00FF00',
          outlineColor: '#00FF00',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: ["宜昌市", "襄阳市", "鄂州市"],
        style: {
          color: '#99FF99',
          outlineColor: '#99FF99',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: ["荆门市", "荆州市", "黄冈市"],
        style: {
          color: '#003300',
          outlineColor: '#003300',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: ["咸宁市", "随州市", "仙桃市"],
        style: {
          color: '#993399',
          outlineColor: '#993399',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: "潜江市",
        style: {
          color: '#CC0000',
          outlineColor: '#CC0000',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: "天门市",
        style: {
          color: '#CC0033',
          outlineColor: '#CC0033',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: "孝感市",
        style: {
          color: '#990066',
          outlineColor: '#990066',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: "神农架林区",
        style: {
          color: '#660099',
          outlineColor: '#660099',
          outlineWidth: 1,
          opacity: 1,
        }
      },
      {
        value: "恩施土家族苗族自治州",
        style: {
          color: '#3300CC',
          outlineColor: '#3300CC',
          outlineWidth: 1,
          opacity: 1,
        }
      }
    ],
  }
}