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
  baseUrl: `http://localhost:8895/geojson/湖北省.json`,
  
  visible: true,
  renderRule: {
    type: "unique",
    field: "name",
    uniqueValueInfos: [
      {
        value: "武汉市",
        symbolStyle: new FillStyle({
          color: '#00FF00',
          outlineColor: '#00FF00',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "黄石市",
        symbolStyle: new FillStyle({
          color: '#33FF33',
          outlineColor: '#33FF33',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "十堰市",
        symbolStyle: new FillStyle({
          color: '#66FF66',
          outlineColor: '#66FF66',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "宜昌市",
        symbolStyle: new FillStyle({
          color: '#99FF99',
          outlineColor: '#99FF99',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "襄阳市",
        symbolStyle: new FillStyle({
          color: '#CCFFCC',
          outlineColor: '#CCFFCC',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "鄂州市",
        symbolStyle: new FillStyle({
          color: '#FFFFFF',
          outlineColor: '#FFFFFF',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "荆门市",
        symbolStyle: new FillStyle({
          color: '#003300',
          outlineColor: '#003300',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "荆州市",
        symbolStyle: new FillStyle({
          color: '#333333',
          outlineColor: '#333333',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "黄冈市",
        symbolStyle: new FillStyle({
          color: '#663366',
          outlineColor: '#663366',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "咸宁市",
        symbolStyle: new FillStyle({
          color: '#993399',
          outlineColor: '#993399',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "随州市",
        symbolStyle: new FillStyle({
          color: '#CC33CC',
          outlineColor: '#CC33CC',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "仙桃市",
        symbolStyle: new FillStyle({
          color: '#FF33FF',
          outlineColor: '#FF33FF',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "潜江市",
        symbolStyle: new FillStyle({
          color: '#CC0000',
          outlineColor: '#CC0000',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "天门市",
        symbolStyle: new FillStyle({
          color: '#CC0033',
          outlineColor: '#CC0033',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "孝感市",
        symbolStyle: new FillStyle({
          color: '#990066',
          outlineColor: '#990066',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "神农架林区",
        symbolStyle: new FillStyle({
          color: '#660099',
          outlineColor: '#660099',
          outlineWidth: 0.01,
          opacity: 1,
        })
      },
      {
        value: "恩施土家族苗族自治州",
        symbolStyle: new FillStyle({
          color: '#3300CC',
          outlineColor: '#3300CC',
          outlineWidth: 0.01,
          opacity: 1,
        })
      }
    ],
  }
}