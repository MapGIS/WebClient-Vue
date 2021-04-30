import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ArcgisMapLayer from "../mapboxgl/src/components/layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "二维/ArcGISServer-矢量地图图层",
    component: ArcgisMapLayer,
    argTypes: {
        layer: {},
        layerId: "",
        sourceId: "test",
        baseUrl: "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer",
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebMap,ArcgisMapLayer},
    methods:{},
    template:`<mapgis-web-map crs="EPSG:4326" :center="[116.39,40.2]" :zoom="3">
    <arcgis-map-layer v-bind="$props" />
    </mapgis-web-map>`,
});

export const  exportMap = Template.bind({});
exportMap.args = {
    layers: "0,2,4,7,9,10,11,12",
    baseUrl: "http://219.142.81.85/arcgis/rest/services/20wanZL/MapServer",
    //http://219.142.81.85/arcgis/rest/services/10wanZL/MapServer
    layerId: "arcgismap_layerid",
}