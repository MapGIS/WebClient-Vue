import ArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import ArcgisMapLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "三维/交互-卷帘"
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ArcgisTileLayer, ArcgisMapLayer },
    data() {
        return {
            tileUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
            tileId: "asdasdasdsafasf",
            mapUrl: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
            mapId: "fhjoghjgfjhg",
            beforeLayers: ["asdasdasdsafasf"],
            afterLayers: ["fhjoghjgfjhg"]
        }
    },
    template: `
    <mapgis-web-scene>
        <arcgis-tile-layer :url="tileUrl" :id="tileId" />
        <arcgis-map-layer :url="mapUrl" :id="mapId" />
        <mapgis-3d-compare :beforeLayers="beforeLayers" :afterLayers="afterLayers"></mapgis-3d-compare>
    </mapgis-web-scene>
    `
});

export const Compare = Template.bind({});
Compare.args = {
    orientation: "vertical",
}