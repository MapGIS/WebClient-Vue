import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisVectorLayer from "../../mapboxgl/src/components/layer/VectorLayer";

export default {
    title: "二维/图层/矢量图层",
    component: MapgisVectorLayer,
    argTypes: {
        layerId: "china_bound_id",
        sourceId: "vector_source_id",
        layer:{
            type: 'fill',
            source: 'vector_source_id', //必须和上面的layerVectorId一致
            paint: {
                'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
                'fill-color': '#000000', //颜色
                'fill-opacity': 1.0, //透明度
                'fill-outline-color': '#FF0000' //边线颜色，没错,确实没有边线宽度这个选项
            }
        },
        source: {
            type: 'geojson',
            data: 'http://develop.smaryun.com/static/data/geojson/china.geojson'
        },
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisWebMap, MapgisVectorLayer },
    template: `<mapgis-web-map crs="EPSG:4326" :center="[105.247175, 36.152892]" :zoom="3" style="height:60vh">
    <mapgis-vector-layer v-bind="$props" />
  </mapgis-web-map>`,
    data(){
        return {

        }
    },
    methods:{

    }
});

export const 矢量图层 = Template.bind({});
矢量图层.args = {
    layerId: "china_bound_id",
    sourceId: "vector_source_id",
    layer:{
        type: 'fill',
        source: 'vector_source_id', //必须和上面的layerVectorId一致
        paint: {
            'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
            'fill-color': '#000000', //颜色
            'fill-opacity': 1.0, //透明度
            'fill-outline-color': '#FF0000' //边线颜色，没错,确实没有边线宽度这个选项
        }
    },
    source: {
        type: 'geojson',
        data: `http://${window.webclient.ip}/static/data/geojson/china.geojson`
    },
};
