import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisArcgisTileLayer from "../../mapboxgl/src/components/layer/ArcGISServer/ArcGISTileLayer";

export default {
  title: "二维/数据图层/影像/ArcGIS/瓦片图层",
  component: MapgisArcgisTileLayer,
  argTypes: {
    layerId: {
      description: "待添加的图层的id，不能与现有的图层冲突",
      type: { name: "String", required: true },
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "必传" },
      },
      control: "text",
    },
    baseUrl: {
      description: "地图请求的基地址路径",
      type: { name: "String", required: false },
      defaultValue: null,
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "null" },
      },
      control: "text",
    },
    tileSize: {
      description: "输出瓦片大小",
      defaultValue: 256,
      type: { name: "Number", required: false },
      table: {
        type: { summary: "Number" },
        defaultValue: { summary: "256" },
      },
      control: "number",
    },
    zoomOffset: {
      description: "层级偏移量",
      defaultValue: 0,
      type: { name: "Number", required: false },
      table: {
        type: { summary: "Number" },
        defaultValue: { summary: "0" },
      },
      control: "number",
    },
    forceOffset: {
      description: "控制是否强制执行层级偏移量",
      type: { name: "Boolean", required: false },
      defaultValue: false,
      table: {
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
      control: "boolean",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisArcgisTileLayer },
  template: `
    <mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:95vh">
    <mapgis-arcgis-tile-layer v-bind="$props" />
    <mapgis-arcgis-legend :url="baseUrl"></mapgis-arcgis-legend>
    </mapgis-web-map>`,
});

export const 瓦片图层 = Template.bind({});
瓦片图层.args = {
  layerId: "arcgis_tile_layerId",
  // sourceId: "arcgis_tile_sourceId",
  //baseUrl: "http://192.168.81.35:6080/arcgis/rest/services/study/wuhan_2/MapServer",
  baseUrl:
    "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer/tile/{z}/{y}/{x}",
};
