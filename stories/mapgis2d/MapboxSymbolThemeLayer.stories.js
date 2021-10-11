export default {
  title: "二维/图层/专题图/符号专题图",
  argTypes: {
    layer: {},
    layerId: "",
    sourceId: "test",
    baseUrl: "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer",
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:3857" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <mapgis-arcgis-map-layer v-bind="$props" />
    </mapgis-web-map>`,
});

export const  ArcGIS地图 = Template.bind({});
ArcGIS地图.args = {
  layers: "show:0,2,4,7,9,10,11,12",
  baseUrl: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
  layerId: "arcgismap_layerid",
}