import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisArcgisMapLayer from "../../mapboxgl/src/components/layer/ArcGISServer/ArcGISMapLayer";

export default {
    title: "二维/图层/ArcGIS Server/ArcGIS地图",
    component: MapgisArcgisMapLayer,
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
        sourceId: {
            description: '待添加的数据源的id，不能与现有的数据源冲突',
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
        type:{
            description:'瓦片加载模式',
            type: { name: 'String', required: false },
            defaultValue: 'raster',
            table:{
                type: { summary: 'String' },
                defaultValue: { summary: 'raster' },
            },
            control:{
                type:'select',
                options:['raster','image-map']
            }
        },
        // baseUrl: "http://219.142.81.85/arcgis/rest/services/10wanZH/MapServer",
        bboxsr:{
            description:'',
            type: { name: 'Number', required: false },
            // defaultValue: ,
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '地图坐标系' },
            },
            control:'number'
        } ,
        imagesr:{
            description:'',
            // defaultValue: ,
            type: { name: 'Number', required: false },
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '地图坐标系' },
            },
            control:'number'
        } ,
        layers:{
            description: '指定需要被取图的图层序列号数组，以“，”分隔。默认为依据文档原始图层状态进行设置。当 cache 为 true 时此参数无效（仅在非动态裁图时才有意义）。<br/> ' +
                '1. show：仅仅显示指定了图层序号的图层；<br/> ' +
                '2. hide ：显示除 hide 参数指定图层外所有的图层；<br/> ' +
                '3. include：除显示默认图层（地图文档内图层状态为可见的图层）外，另追加这些被指定的图层显示，追加的这些图层必须为地图中包含的图层；<br/> ' +
                '4. exclude: 从默认图层列表里删除这些被指定的图层后，进行显示。',
            type: {
                name: 'String',
                required: false
            },
            table:{
                type: {
                    summary: 'String',
                    detail:'示例:"show:1,2,3"\n'+
                        '注意:若不传入开头的[show|hide|include|exclude],则默认是显示所有图层 \n' +
                        '  eg:"1,2,3"，显示的是所有图层,并非图层1、2、3'
                },
                defaultValue: { summary: 'null' },
            },
            control:'text'
        } ,
        width:{
            description:'导出图像的大小（宽度），以像素为单位',
            type: { name: 'Number', required: false },
            defaultValue:256,
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '256' },
            },
            control:'number'
        } ,
        height:{
            description:'导出图像的大小（高度），以像素为单位',
            type: { name: 'Number', required: false },
            defaultValue:256,
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '256' },
            },
            control:'number'
        } ,
        format:{
            description:'返回图片格式',
            type: { name: 'String', required: false },
            defaultValue: 'png',
            table:{
                type: { summary: 'String' },
                defaultValue: { summary: 'png' },
            },
            control:{
                type:'select',
                options:['png','png8','png24','jpg','pdf','bmp','gif','svg','svgz','emf','ps','png32']
            }
        } ,
        f:{
            description:'返回信息的格式',
            type: { name: 'String', required: false },
            defaultValue: 'image',
            table:{
                type: { summary: 'String' },
                defaultValue: { summary: 'image' },
            },
            control:{
                type:'select',
                options:['html','json','image','kmz']
            }
        } ,
        dpi:{
            description:'屏幕分辨率',
            type: { name: 'Number', required: false },
            defaultValue:96,
            table:{
                type: { summary: 'Number' },
                defaultValue: { summary: '96' },
            },
            control:'number'
        } ,
        transparent:{
            description:'控制背景是否透明，只有当 format 为 png | gif 时生效',
            type: { name: 'Boolean', required: false },
            defaultValue: false,
            table:{
                type: { summary: 'Boolean' },
                defaultValue: { summary: 'false' },
            },
            control:'boolean'
        } ,
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebMap,MapgisArcgisMapLayer},
    methods:{},
    template:`<mapgis-web-map crs="EPSG:3857" :center="[114.299039,30.594797]" :zoom="8" style="height:95vh">
    <mapgis-arcgis-map-layer v-bind="$props" />
    </mapgis-web-map>`,
});

export const  ArcGIS地图 = Template.bind({});
ArcGIS地图.args = {
    layers: "show:0,2,4,7,9,10,11,12",
    baseUrl: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer",
    layerId: "arcgismap_layerid",
    sourceId:'arcgismap_sourceid',
}