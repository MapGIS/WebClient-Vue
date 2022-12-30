import MapgisAttribution from "../../mapboxgl/src/components/UI/controls/AttributionControl";

export default {
    title: "二维/其他/属性组件",
    component: MapgisAttribution,
    argTypes: {
        customAttribution: {
            description:'当前属性组件要显示的字符串或者多个字符串组成的数组，详见[参数介绍](https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol-parameters)',
            type: { name: 'Array | String', required: false },
            defaultValue:undefined,
            table:{
                type: { summary: 'Object | Array' },
                defaultValue: { summary: 'undefined' },
            },
            control:'object'
        },
        compact:{
            description:'控制是否折叠属性组件。为true时，属性组件处于折叠状态，在鼠标悬停时会展示完整属性信息。详见[参数介绍](https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol-parameters)',
            type: { name: 'Boolean', required: false },
            defaultValue: true,
            table:{
                type: { summary: 'Boolean' },
                defaultValue: { summary: 'true' },
            },
            control:'boolean'
        } ,
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisAttribution },
    data() {
        return {
            mapOptions: {
                crs: "EPSG:4326", //经纬度一定要设置crs参数
                maxBounds: [
                    [-180, -90],
                    [180, 90],
                ],
                zoom: 7.5,
                center: [116.39, 40.2],
            },
        };
    },
    template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:95vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-attribution v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 属性组件 = Template.bind({});
属性组件.args = {
    customAttribution:"中地数码-司马云-二维属性组件",
    position:"bottom-left",
    compact:true
};
