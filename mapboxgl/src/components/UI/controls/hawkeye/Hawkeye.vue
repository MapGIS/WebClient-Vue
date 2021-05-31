<template>
    <div class="mapgis-hawkeye-wrap">
        <mapgis-web-map
            v-bind="{ ...miniMapOptions }"
            @load="handleMiniMapLoad"
            v-if="isInitMiniMap"
        ></mapgis-web-map>
    </div>
</template>

<script>
import MapgisWebMap from "../../../map/GlMap.vue";
import * as turf from "@turf/turf";

var map, miniMap;
export default {
    name: "mapgis-hawkeye",
    inject: ["map"],
    components: { MapgisWebMap },
    data() {
        return {
            miniMapOptions: {},
            isInitMiniMap: false,

            map_x: null, //地图的x坐标
            map_y: null, //地图的y坐标
            miniMap_x: null, //鹰眼的x坐标
            miniMap_y: null, //鹰眼的y坐标
            map_zoom: null, //地图的比例尺
            miniMap_zoom: null, //鹰眼的比例尺
        };
    },
    mounted() {
        map = this.map;
        this.miniMapOptions.mapStyle = map.getStyle();
        this.miniMapOptions.crs = map.getCRS().epsgCode;
        this.miniMapOptions.zoom = map.getZoom() - 4;
        this.miniMapOptions.center = map.getCenter();
        this.isInitMiniMap = true;
    },
    methods: {
        handleMiniMapLoad(payload) {
            miniMap = payload.map;
            this.init();
        },
        init() {
            if (map && miniMap) {
                this.initExtent();

                map.on("drag", this.mapdrag);
                map.on("zoom", this.mapzoom);

                miniMap.scrollZoom.disable();
                miniMap.dragPan.disable();
            }
        },
        getPolygon() {
            let extent = map.getBounds();
            let coor = [
                [
                    [extent._sw.lng, extent._ne.lat],
                    [extent._ne.lng, extent._ne.lat],
                    [extent._ne.lng, extent._sw.lat],
                    [extent._sw.lng, extent._sw.lat],
                    [extent._sw.lng, extent._ne.lat],
                ],
            ];
            return turf.polygon(coor);
        },
        //初始化矩形范围
        initExtent() {
            let polygon = this.getPolygon();
            miniMap.addSource("extent", {
                type: "geojson",
                data: polygon,
            });
            miniMap.addLayer({
                id: "extent",
                type: "fill",
                source: "extent",
                paint: {
                    "fill-color": "red",
                    "fill-opacity": 0.2,
                    "fill-outline-color": "red",
                },
            });
        },
        // 拖拽
        mapdrag() {
            this.map_x = map.getCenter().lng;
            this.map_y = map.getCenter().lat;
            miniMap.setCenter([this.map_x, this.map_y]);
            this.extent();
        },
        // 放大缩小
        mapzoom() {
            this.map_zoom = map.getZoom();
            miniMap.setZoom(this.map_zoom - 4);
            this.map_x = map.getCenter().lng;
            this.map_y = map.getCenter().lat;
            miniMap.setCenter([this.map_x, this.map_y]);
            this.extent();
        },
        // 矩形实时变化
        extent() {
            let polygon = this.getPolygon();
            miniMap.getSource("extent").setData({
                type: "FeatureCollection",
                features: [polygon],
            });
        },
    },
};
</script>

<style scoped>
.mapgis-hawkeye-wrap {
    z-index: 200;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 200px;
    background-color: #fff;
    border: 1px solid #333;
    border-radius: 3px;
}

.mapgis-hawkeye-wrap .mapboxgl-map {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
}
</style>