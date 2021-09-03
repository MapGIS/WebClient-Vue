import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";

export default {
    title: "三维/图层/ArcGISServer/瓦片图层",
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebGlobe },
    template: `
    <mapgis-web-globe>
    <mapgis-3d-arcgis-tile-layer v-bind="$props" />
    </mapgis-web-globe >`,
});

export const Tile = Template.bind({});
Tile.args = {
    // url: "http://219.142.81.85/arcgis/rest/services/20wanZL/MapServer",
    baseUrl:"http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
};
