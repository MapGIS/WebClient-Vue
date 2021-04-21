import MapgisCompare from "../mapboxgl/src/components/UI/controls/compare/CompareControl.vue";
import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue"
import MapgisOgcWmtsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
    title: "二维/交互-卷帘",
    component: MapgisCompare
};

var map = [];
const Vertical = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisCompare, MapgisWebMap, MapgisOgcWmtsLayer },
    methods: {
        handleBeforeMapLoad(payload) {
            map[0] = payload.map;
            this.$refs.compare.handleMap(map, this.$refs.compare.$el);
        },
        handleAfterMapLoad(payload) {
            map[1] = payload.map;
            this.$refs.compare.handleMap(map, this.$refs.compare.$el);
        },
    },
    template: `
        <mapgis-compare ref="compare" :orientation="orientation">
            <mapgis-web-map
                style="position: absolute;top: 0;bottom: 0;width: 100%;height: 100%;"
                v-bind="{ ...beforeMapOptions }"
                v-on:load="handleBeforeMapLoad"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...beforeLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
            </mapgis-web-map>
            <mapgis-web-map
                style="position: absolute;top: 0;bottom: 0;width: 100%;height: 100%;"
                v-bind="{ ...afterMapOptions }"
                v-on:load="handleAfterMapLoad"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...afterLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
            </mapgis-web-map>
        </mapgis-compare>
        `
});

export const VerticalMode = Vertical.bind({});
VerticalMode.args = {
    orientation: "vertical",
    beforeMapOptions: {
        mapStyle: {
            //设置版本号，一定要设置
            version: 8,
            //添加来源
            sources: {},
            //设置加载并显示来源的图层信息
            layers: [],
        }, // 地图样式
        zoom: 2, // 地图初始化级数
        center: [116.39, 40.2], // 地图显示中心
        crs: "EPSG:4326",
    },
    beforeLayerOptions: {
        layer: {},
        layerId: "ogcwmts_layerId",
        sourceId: "ogcwmts_sourceId",
        url:
            "http://t0.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
    },
    afterMapOptions: {
        mapStyle: {
            //设置版本号，一定要设置
            version: 8,
            //添加来源
            sources: {},
            //设置加载并显示来源的图层信息
            layers: [],
        }, // 地图样式
        zoom: 2, // 地图初始化级数
        center: [116.39, 40.2], // 地图显示中心
        crs: "EPSG:4326"
    },
    afterLayerOptions: {
        layer: {},
        layerId: "ogcwmts_layerId",
        sourceId: "ogcwmts_sourceId",
        url:
            "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
    }
};


export const HorizontalMode = Vertical.bind({});
HorizontalMode.args = {
    ...VerticalMode.args,
    orientation: "horizontal",
}