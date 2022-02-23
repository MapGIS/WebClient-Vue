import MapgisDocument from "../../mapboxgl/src/components/UI/document/Document.vue";

export default {
  title: "二维/地图子组件/地图文档",
  component: MapgisDocument,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /.*Data$/,
  argTypes: {
    wrapperStyle: {},
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisDocument },
  template: `<mapgis-web-map crs="EPSG:3857" :zoom="1" style="height:95vh">
    <mapgis-arcgis-map-layer layerId="ArcGIS地图图层" baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer" />
    <mapgis-arcgis-tile-layer layerId="ArcGIS瓦片图层" baseUrl="http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer" />
    <mapgis-document />
  </mapgis-web-map>`,
});

export const 基础示例 = Template.bind({});
基础示例.args = {
  wrapperStyle: {
    position: "absolute",
    background: "#ffffff",
    top: "20px",
    left: "20px",
    zIndex: 10,
    borderRadius: "6px",
  },
};
