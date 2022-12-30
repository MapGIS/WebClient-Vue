import Markdown from "../../cesium/docs/api/layer/ArcGISServer/ArcGISMapLayer.md"
export default {
    title: "三维/数据图层/影像/ArcGIS"
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    template: `
    <mapgis-web-scene style="height:95vh">
    <mapgis-3d-arcgis-map-layer v-bind="$props"/>
    </mapgis-web-scene >`,
});

export const 地图服务 = Template.bind({});
地图服务.args = {
    baseUrl: "http://219.142.81.85/arcgis/rest/services/20wanZL/MapServer",
    layers: "show:0,2,4,7,9,10,11,12",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
    options: {
        tileWidth: 256,
        tileHeight: 256,
    },
    srs: "EPSG:4326"
};
地图服务.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};
