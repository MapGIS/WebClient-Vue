
import MapgisFullscreen from "../../mapboxgl/src/components/UI/controls/FullscreenControl";

export default {
    title: "二维/地图子组件/全屏组件",
    component: MapgisFullscreen,
    argTypes: {
        position:"top-right",
        container:undefined
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisFullscreen },
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
        <mapgis-fullscreen v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 全屏组件 = Template.bind({});
全屏组件.args = {
    position:"top-right",
    container:undefined
};
