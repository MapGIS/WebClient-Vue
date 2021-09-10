import MapgisNavigation from "../../mapboxgl/src/components/UI/controls/NavigationControl";

export default {
    title: "二维/地图子组件/导航组件",
    component: MapgisNavigation,
    argTypes: {
        showCompass:{
            description:'控制是否显示罗盘按钮',
            type: { name: 'Boolean', required: false },
            defaultValue: true,
            table:{
                type: { summary: 'Boolean' },
                defaultValue: { summary: 'true' },
            },
            control:'boolean'
        } ,
        showZoom:{
            description:'控制是否显示缩放（放大和缩小）按钮',
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
    components: { MapgisNavigation },
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
        <mapgis-navigation v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 导航组件 = Template.bind({});
导航组件.args = {
    showCompass:true,
    showZoom:true
};
