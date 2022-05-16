import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisSupermapRasterLayer from "../../mapboxgl/src/components/layer/SupermapServer/SupermapRasterLayer";

export default {
    title: "二维/图层/Supermap Server/Supermap Raster",
    component: MapgisSupermapRasterLayer,
    argTypes: {
        layerId:  {
            description: '待添加的图层的id，不能与现有的图层冲突',
            type: { name: 'String', required: true },
            table:{
                type: { summary: 'String' },
                defaultValue: { summary: '必传' },
            },
            control:'text'
        },
        baseUrl: {
            description:'地图请求的基地址路径',
            type:{ name: 'String', required: false },
            defaultValue:null,
            table:{
                type:{ summary: 'String' },
                defaultValue: { summary: 'null' },
            },
            control:'text'
        },
        tileSize: {
            description:'输出瓦片大小',
            defaultValue:256 ,
            type: { name: 'Number', required: false },
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '256' },
            },
            control:'number'
        },
        zoomOffset: {
            description:'层级偏移量',
            defaultValue:0 ,
            type: { name: 'Number', required: false },
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '0' },
            },
            control:'number'
        },
        forceOffset: {
            description:'控制是否强制执行层级偏移量',
            type: { name: 'Boolean', required: false },
            defaultValue: false,
            table:{
                type: { summary: 'Boolean' },
                defaultValue: { summary: 'false' },
            },
            control:'boolean'
        },
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebMap, MapgisSupermapRasterLayer },
    template: `
    <mapgis-web-map crs="EPSG:3857" :center="[114.299039,30.594797]" :zoom="3" style="height:95vh">
    <mapgis-supermap-raster-layer v-bind="$props" />
    </mapgis-web-map>`,
});

export const supermap = Template.bind({});
supermap.args = {
    layerId: "arcgismap_layerid",
    sourceId:'arcgismap_sourceid',
    baseUrl: "http://192.168.84.158:31708/iserver/services/map-mongodb-420000_SL_0518_SKY_20200620-3k6ybamafh/rest/maps/420000_SL_0518_SKY_20200620",
    tileSize: 256,
    transparent: true,
    redirect: false,
    cacheEnabled: true,
    originx: -180,
    originy: 90,
    level: [1, 2, 3, 4],
    scale: ['5.4085234291284955e-8', '2.7042617145642478e-8', '1.3521308572821239e-8', '6.760654286410619e-9']
};
