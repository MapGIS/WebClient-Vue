import MapgisCompare from "../mapboxgl/src/components/UI/controls/compare/CompareControl.vue";
import MapgisOgcWmtsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
    title: "二维/交互-卷帘",
    component: MapgisCompare
};

const Template1 = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisCompare },
    template: `<mapgis-compare :left-map-options="leftMapOptions" :right-map-options="rightMapOptions" :orientation="orientation"></mapgis-compare>`,
})

export const compare1 = Template1.bind({});
compare1.args = {
    leftMapOptions: {
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
    rightMapOptions: {
        mapStyle: {
            //设置版本号，一定要设置
            version: 8,
            //添加来源
            sources: {},
            //设置加载并显示来源的图层信息
            layers: [
                {
                    id: "背景",
                    type: "background",
                    paint: {
                        "background-color": "rgba(0, 0, 0, 1)"
                    }
                }
            ],
        }, // 地图样式
        zoom: 2, // 地图初始化级数
        center: [116.39, 40.2], // 地图显示中心
        crs: "EPSG:4326"
    },
    orientation: "horizontal"
};

const Template2 = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { MapgisCompare, MapgisOgcWmtsLayer },
    template: `
        <mapgis-compare :left-map-options="leftMapOptions" :right-map-options="rightMapOptions" :orientation="orientation">
            <template v-slot:leftMap>
                <mapgis-ogc-wmts-layer
                    :layer="layerWmts"
                    :layer-id="layerWmtsId"
                    :source-id="sourceWmtsId"
                    :url="wmtsurl1"
                >
                </mapgis-ogc-wmts-layer>
            </template>
            <template v-slot:rightMap>
                <mapgis-ogc-wmts-layer
                    :layer="layerWmts"
                    :layer-id="layerWmtsId"
                    :source-id="sourceWmtsId"
                    :url="wmtsurl2"
                >
                </mapgis-ogc-wmts-layer>
            </template >
        </mapgis-compare>
        `
})

export const compare2 = Template2.bind({});
compare2.args = {
    ...compare1.args,
    orientation: "vertical",
    layerWmts: {},
    layerWmtsId: "ogcwmts_layerId",
    sourceWmtsId: "ogcwmts_sourceId",
    wmtsurl1:
        "http://t0.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
    wmtsurl2:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
};
