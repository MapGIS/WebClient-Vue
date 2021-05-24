import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ArcgisTileLayer from "../mapboxgl/src/components/layer/ArcGISServer/ArcGISTileLayer";

export default {
    title: "二维/ArcGISServer-瓦片图层",
    component: ArcgisTileLayer,
    argTypes: {
        layerId: "",
        sourceId: "test",
        baseUrl: "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer",
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebMap, ArcgisTileLayer },
    template: `
    <mapgis-web-map crs="EPSG:3857" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <arcgis-tile-layer v-bind="$props" />
    <mapgis-arcserver-legend :url="url"></mapgis-arcserver-legend>
    </mapgis-web-map>`,
});

export const Tile = Template.bind({});
Tile.args = {
    layerId: "arcgis_tile_sourceId",
    //baseUrl: "http://192.168.81.35:6080/arcgis/rest/services/study/wuhan_2/MapServer",
    baseUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
};
