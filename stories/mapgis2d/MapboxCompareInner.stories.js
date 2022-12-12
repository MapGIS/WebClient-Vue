import MapgisInnerCompare from "../../mapboxgl/src/components/UI/controls/compare/CompareInnerControl.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "二维/场景控制/联动/卷内部帘",
  component: MapgisInnerCompare,
  argTypes:{
    orientation: {
      description:'卷帘显示方向',
      type:{ name: 'String', required: false },
      defaultValue:'vertical',
      table:{
        type:{
          summary: 'String',
          detail:'"vertical"   : 垂直方向\n' +
              '"horizontal" : 水平方向'
        },
        defaultValue: { summary: 'vertical' },
      },
      control: {
        type:'select',
        options:['vertical','horizontal']
      }
    },
  }

};

var leftMap, rightMap;
const Vertical = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisInnerCompare, MapgisWebMap, MapgisOgcWmtsLayer },
  methods: {
    handleBeforeMapLoad(payload) {
      leftMap = payload.map;
    },
    handleAfterMapLoad(payload) {
      rightMap = payload.map;
    },
    handleEnable(e) {
      let compare = this.$refs.compare;
      let enable = compare.enable;
      if (enable) {
        compare.remove();
      } else {
        let parent = this.$refs.leftmap.$parent.$el;
        compare.compare(leftMap, rightMap, parent, {});
      }
    },
  },
  template: `<div style="height:60vh">
            <mapgis-web-map ref="leftmap" style="height:95vh;width:100%;position:absolute;"
                v-bind="{ ...beforeMapOptions }"
                v-on:load="handleBeforeMapLoad"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...beforeLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
                <mapgis-compare-inner ref="compare">
                    <div v-on:click="handleEnable" 
                        style="height:36px;width:72px;background: #fff;position: absolute;zIndex:9999;fontSize:24px;">
                    卷帘</div>
                </mapgis-compare-inner>
            </mapgis-web-map>
            <mapgis-web-map style="height:100vh;width:100%;position:absolute;"
                v-bind="{ ...afterMapOptions }"
                v-on:load="handleAfterMapLoad"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...afterLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
            </mapgis-web-map>
            </div>`,
});

export const 卷内部帘 = Vertical.bind({});
卷内部帘.args = {
  orientation: "vertical",
  beforeMapOptions: {
    mapStyle: {
      //设置版本号，一定要设置
      version: 8,
      //添加来源
      sources: {},
      //设置加载并显示来源的图层信息
      layers: [],
    }, // 地图样式
    zoom: 2, // 地图初始化级数
    center: [116.39, 40.2], // 地图显示中心
    crs: "EPSG:4326",
  },
  beforeLayerOptions: {
    layer: {},
    layerId: "ogcwmts_layerId",
    sourceId: "ogcwmts_sourceId",
    url:
      "http://t0.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
  },
  afterMapOptions: {
    mapStyle: {
      //设置版本号，一定要设置
      version: 8,
      //添加来源
      sources: {},
      //设置加载并显示来源的图层信息
      layers: [],
    }, // 地图样式
    zoom: 2, // 地图初始化级数
    center: [116.39, 40.2], // 地图显示中心
    crs: "EPSG:4326",
  },
  afterLayerOptions: {
    layer: {},
    layerId: "ogcwmts_layerId",
    sourceId: "ogcwmts_sourceId",
    url:
      "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
  },
};
