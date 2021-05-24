import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import ArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";

export default {
    title: "三维/ArcGISServer-瓦片图层",
    component: ArcgisTileLayer,
    argTypes: {
        url: "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer",
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebGlobe, ArcgisTileLayer },
    template: `
    <mapgis-web-globe>
    <arcgis-tile-layer v-bind="$props" />
    </mapgis-web-globe >`,
});

export const Tile = Template.bind({});
Tile.args = {
    // url: "http://219.142.81.85/arcgis/rest/services/20wanZL/MapServer",
    url:"http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
    srs:"EPSG:4326"
};
