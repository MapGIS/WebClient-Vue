<template>
    <div class="mapgis-legend">
        <ul v-for="layer in layers" :key="layer.layerId">
            {{
                layer.layerName
            }}
            <li v-for="legend in layer.legend" :key="legend.url">
                <img :src="'data:image/png;base64,' + legend.imageData" />
                <span>{{ legend.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { BaseServer } from "@mapgis/webclient-es6-service";

export default {
    name: "mapgis-arcserver-legend",
    inject: ["mapbox", "map"],
    props: {},
    data() {
        return {
            layers: [],
        };
    },
    watch: {},
    mounted() {
        this.getLegendUrl();
    },
    methods: {
        getLegendInfo(url) {
            let onSuccess = function (res) {
                this.layers = this.layers.concat(res.layers);
            };
            let onError = function (err) {
                console.log(err);
            };
            let legendUrl = url.replace(/(?<=MapServer).*/, "/legend?f=pjson");
            let service = new BaseServer.IgsServiceBase(legendUrl, {
                eventListeners: {
                    scope: this,
                    processCompleted: onSuccess,
                    processFailed: onError,
                },
            });
            service.processAsync();
        },
        getLegendUrl() {
            const { map } = this;
            const style = map.getStyle();
            const { sources } = style;
            let tiles = [];
            sources &&
                Object.keys(sources).forEach((key) => {
                    tiles = tiles.concat(sources[key].tiles);
                });
            tiles.forEach((url) => {
                if (/\/arcgis\/rest\/services/.test(url)) {
                    this.getLegendInfo(url);
                }
            });
        },
    },
};
</script>

<style>
.mapgis-legend {
    position: absolute;
    z-index: 9000;
    border: 1px #333 solid;
    border-radius: 6px;
    background: #ffffff;
    padding-right: 12px;
    width: fit-content;
    height: fit-content;
    right: 20px;
    bottom: 20px;
}
.mapgis-legend li {
    display: flex;
}

.mapgis-legend img {
    height: 20px;
    width: 20px;
}
</style>
