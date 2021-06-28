import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisArcgisTileLayer from "../mapboxgl/src/components/layer/ArcGISServer/ArcGISTileLayer";

export default {
    title: "二维/ArcGISServer-瓦片图层",
    component: MapgisArcgisTileLayer,
    argTypes: {},
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebMap, MapgisArcgisTileLayer },
    template: `
    <mapgis-web-map crs="EPSG:3857" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <mapgis-arcgis-tile-layer v-bind="$props" />
    <mapgis-arcgis-legend :url="baseUrl"></mapgis-arcgis-legend>
    </mapgis-web-map>`,
});

export const Tile = Template.bind({});
Tile.args = {
    layerId: "arcgis_tile_sourceId",
    //baseUrl: "http://192.168.81.35:6080/arcgis/rest/services/study/wuhan_2/MapServer",
    baseUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
};
