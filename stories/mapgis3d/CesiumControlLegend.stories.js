import ArcgisTileLayer from "../../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import ArcgisMapLayer from "../../cesium/src/components/Layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "三维/场景子组件/arcgis图例"
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ArcgisTileLayer, ArcgisMapLayer },
    data() {
        return {}
    },
    template: `
    <mapgis-web-scene :cameraView = "cameraView">
        <arcgis-tile-layer tilingScheme="EPSG:4326" baseUrl="http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer" />
        <mapgis-3d-arcgis-legend></mapgis-3d-arcgis-legend>
    </mapgis-web-scene>
    `
});

export const Legend = Template.bind({});
Legend.args = {
    cameraView:{
        destination: {
            x: -2409221.7854387695,
            y: 4705113.697479787,
            z: 4500333.6696071755
        },
        orientation: {
            heading: 3.2694614177406143,
            pitch: -1.4832321184766042,
            roll: 3.1369303868636838
        },
    }
}