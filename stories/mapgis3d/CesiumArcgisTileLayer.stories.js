import Markdown from "../../cesium/docs/api/layer/ArcGISServer/ArcGISTileLayer.md"

export default {
    title: "三维/数据图层/影像/ArcGIS",
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    template: `
      <mapgis-web-scene style="height:95vh">
    <mapgis-3d-arcgis-tile-layer v-bind="$props" />
    </mapgis-web-scene >`,
});

export const 瓦片图层 = Template.bind({});
瓦片图层.args = {
    // url: "http://219.142.81.85/arcgis/rest/services/20wanZL/MapServer",
    baseUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
};
