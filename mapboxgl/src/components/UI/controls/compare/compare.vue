<template>
    <div id="app">
        <mapbox-compare
            :left-map-options="leftMapOptions"
            :right-map-options="rightMapOptions"
            orientation="horizontal"
        >
            <template v-slot:leftMap>
                <mapbox-ogc-wmts-layer
                    :layer="leftMapOptions.layerWmts"
                    :layer-id="leftMapOptions.layerWmtsId"
                    :source-id="leftMapOptions.sourceWmtsId"
                    :url="leftMapOptions.wmtsurl"
                >
                </mapbox-ogc-wmts-layer>
            </template>
            <template v-slot:rightMap>
                <mapbox-ogc-wmts-layer
                    :layer="rightMapOptions.layerWmts"
                    :layer-id="rightMapOptions.layerWmtsId"
                    :source-id="rightMapOptions.sourceWmtsId"
                    :url="rightMapOptions.wmtsurl"
                >
                </mapbox-ogc-wmts-layer>
            </template>
        </mapbox-compare>
    </div>
</template>

<script>
// import Mapbox from "@mapgis/mapbox-gl";
import mapboxCompare from "./CompareControl.vue";
import MapboxOgcWmtsLayer from "../../../layer/ogc/OgcWmtsLayer.js";

export default {
    components: {
        mapboxCompare,
        MapboxOgcWmtsLayer,
    },
    data() {
        return {
            leftMapOptions: {
                mapStyle: {
                    //设置版本号，一定要设置
                    version: 8,
                    //添加来源
                    sources: {},
                    //设置加载并显示来源的图层信息
                    layers: [],
                }, // 地图样式
                mapZoom: 2, // 地图初始化级数
                outerCenter: [116.39, 40.2], // 地图显示中心
                mapCrs: "EPSG:4326",

                layerWmts: {},
                layerWmtsId: "ogcwmts_layerId",
                sourceWmtsId: "ogcwmts_sourceId",
                wmtsurl:
                    "http://t0.tianditu.com/DataServer?T=img_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            },
            rightMapOptions: {
                mapStyle: {
                    //设置版本号，一定要设置
                    version: 8,
                    //添加来源
                    sources: {},
                    //设置加载并显示来源的图层信息
                    layers: [],
                }, // 地图样式
                mapZoom: 2, // 地图初始化级数
                outerCenter: [116.39, 40.2], // 地图显示中心
                mapCrs: "EPSG:4326",

                layerWmts: {},
                layerWmtsId: "ogcwmts_layerId",
                sourceWmtsId: "ogcwmts_sourceId",
                wmtsurl:
                    "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            },
        };
    },
    methods: {},
    created() {},
};
</script>

<style type="text/css">
#app {
    margin: 0 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>