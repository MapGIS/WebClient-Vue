<template>
    <div id="app">
        <mapbox-compare ref="compare" :left-map-options="leftMapOptions" :right-map-options="rightMapOptions">
            <div class="custom-compare-toolbar" v-on:click="handleEnable">
                卷帘
            </div>
        </mapbox-compare>
    </div>
</template>

<script>
import Mapbox from "@mapgis/mapbox-gl";
import mapboxCompare from "./CompareControl.vue";

export default {
    components: {
        mapboxCompare,
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
    methods: {
        handleEnable(e) {
            let compare = this.$refs.compare;
            compare.handleEnable(e);
        },
    },
    created() {
        // 在组件中使用mapbox-gl.js的脚本库功能
        this.mapbox = Mapbox;
    },
};
</script>

<style type="text/css">
#app {
    margin: 0 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.custom-compare-toolbar {
    position: absolute;
    z-index: 9000;
    top: 20px;
    left: 20px;
    height: 36px;
    width: 36px;
    border-radius: 6px;
    background: #ffffff;
    color: #000000;
    line-height: 36px;
}
</style>