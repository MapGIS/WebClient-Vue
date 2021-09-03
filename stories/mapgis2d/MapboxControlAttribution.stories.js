import MapgisAttribution from "../../mapboxgl/src/components/UI/controls/AttributionControl";

export default {
    title: "二维/地图子组件/属性组件",
    component: MapgisAttribution,
    argTypes: {
        customAttribution:"中地数码-司马云-二维属性组件",
        position:"bottom-left",
        compact:true
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
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
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
