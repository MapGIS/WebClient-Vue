import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisArcgisMapLayer from "../../mapboxgl/src/components/layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "二维/图层/ArcGIS地图",
    component: MapgisArcgisMapLayer,
    argTypes: {
        layers:{
            description: '指定需要被取图的图层序列号数组，以“，”分隔。默认为依据文档原始图层状态进行设置。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。<br/> 1、show：仅仅显示指定了图层序号的图层；<br/> 2、hide ：显示除 hide 参数指定图层外所有的图层；<br/> 3、include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层；<br/> 4、exclude: 从默认图层列表里删除这些被指定的图层后，进行显示。',
            type: { summary: 'string' },
            defaultValue: { summary: 'null' },
            control:'text'
        } ,
        // test:{
        //     description: 'test',
        //     type: { summary: 'summary' , detail:'detail'},
        //     defaultValue: { summary: 'summary' , detail:'detail'},
        //     control:'null'
        // } ,
        layerId:  {
            description: '待添加的图层的id，不能与现有的图层冲突。',
            type: { summary: 'string' },
            defaultValue: { summary: '必传' },
        },
        sourceId: {
            name: 'sourceId',
            description: '待添加的数据源的id，不能与现有的数据来源冲突。',
            type: { summary: 'string' },
            defaultValue: { summary: '必传' },
        },
        baseUrl: {
            name:'baseUrl',
            description:'地图请求的基地址路径。',
            type:{ summary: 'string' },
            defaultValue:{ summary: 'null' }
        }
        // baseUrl: "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer",
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebMap,MapgisArcgisMapLayer},
    methods:{},
    template:`<mapgis-web-map crs="EPSG:3857" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <mapgis-arcgis-map-layer v-bind="$props" />
    </mapgis-web-map>`,
});

export const  ArcGIS地图 = Template.bind({});
ArcGIS地图.args = {
    layers: "show:0,2,4,7,9,10,11,12",
    baseUrl: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
    layerId: "arcgismap_layerid",
    sourceId:'test'
}