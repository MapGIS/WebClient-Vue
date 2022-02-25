export default {
    title: "三维/场景子组件/卷帘"
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            tileUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
            tileId: "asdasdasdsafasf",
            mapUrl1: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
            mapId1: "fhjoghjgfjhg",
            mapUrl2: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer",
            mapId2: "jmghmfgjnf",
            beforeLayers: ["asdasdasdsafasf"],
            afterLayers: ["jmghmfgjnf"]
        }
    },
    template: `
    <div>
        <mapgis-web-scene vueKey="webGlobe" style="height:95vh">
            <mapgis-3d-arcgis-map-layer vueKey="webGlobe" :baseUrl="mapUrl2" :id="mapId2" />
            <mapgis-3d-arcgis-tile-layer vueKey="webGlobe" :baseUrl="tileUrl" :id="tileId" />
            <mapgis-3d-arcgis-map-layer vueKey="webGlobe" :baseUrl="mapUrl1" :id="mapId1" />
        </mapgis-web-scene>
        <mapgis-3d-compare vueKey="webGlobe" :beforeLayers="beforeLayers" :afterLayers="afterLayers">
        </mapgis-3d-compare>
    </div>
    `
});

export const Compare = Template.bind({});
Compare.args = {}