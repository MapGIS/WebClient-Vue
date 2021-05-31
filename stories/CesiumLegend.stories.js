import ArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import ArcgisMapLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "三维/交互-图例"
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ArcgisTileLayer, ArcgisMapLayer },
    data() {
        return {}
    },
    template: `
    <mapgis-web-scene>
        <arcgis-tile-layer baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer" />
        <arcgis-map-layer baseUrl="http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer" />
        <mapgis-3d-arcgis-legend></mapgis-3d-arcgis-legend>
    </mapgis-web-scene>
    `
});

export const Legend = Template.bind({});
Legend.args = {}