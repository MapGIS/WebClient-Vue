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
    name: "mapgis-legend",
    props: {
        url: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            layers: [],
        };
    },
    mounted() {
        this.$_init();
    },
    methods: {
        $_init() {
            let onSuccess = function (res) {
                this.layers = res.layers;
            };
            let onError = function (err) {
                console.log(err);
            };
            let service = new BaseServer.IgsServiceBase(this.url, {
                eventListeners: {
                    scope: this,
                    processCompleted: onSuccess,
                    processFailed: onError,
                },
            });
            service.processAsync();
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
li {
    display: flex;
}
img {
    height: 20px;
    width: 20px;
}
</style>
