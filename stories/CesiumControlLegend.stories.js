import ArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import ArcgisMapLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "三维/交互-arcgis图例"
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ArcgisTileLayer, ArcgisMapLayer },
    data() {
        return {}
    },
    template: `
    <mapgis-web-scene>
        <arcgis-tile-layer srs="EPSG:3857" baseUrl="http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer" />
        <mapgis-3d-arcgis-legend></mapgis-3d-arcgis-legend>
    </mapgis-web-scene>
    `
});

export const Legend = Template.bind({});
Legend.args = {}