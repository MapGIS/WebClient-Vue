<template>
    <div class="mapgis-legend">
        <a-select
            default-value="全部"
            style="width: 100%"
            @change="handleChange"
        >
            <a-select-option value="全部"> 全部 </a-select-option>
            <a-select-option
                :value="layer.layerName"
                v-for="layer in layers"
                :key="layer.layerId"
                >{{ layer.layerName }}
            </a-select-option>
        </a-select>
        <div class="legend-area">
            <li v-for="legend in legends" :key="legend.url">
                <img :src="'data:image/png;base64,' + legend.imageData" />
                <span>{{ legend.label }}</span>
            </li>
        </div>
    </div>
</template>

<script>
import { BaseServer } from "@mapgis/webclient-es6-service";

import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

export default {
    name: "mapgis-3d-arcserver-legend",
    inject: ["Cesium", "webGlobe", "CesiumZondy"],
    data() {
        return {
            layers: [],
            legends: [],
            allLegends: [],
        };
    },
    mounted() {
        this.getLegendUrl();
    },
    methods: {
        getLegendInfo(url) {
            let onSuccess = function (res) {
                this.layers = this.layers.concat(res.layers);
                this.layers.forEach((layer) => {
                    this.allLegends = this.allLegends.concat(layer.legend);
                });
                this.legends = this.allLegends;
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
            const { CesiumZondy } = this;
            let layers = [];
            Object.keys(CesiumZondy.arcgisManager).forEach((key) => {
                if (key !== "vueKey") {
                    layers = layers.concat(CesiumZondy.arcgisManager[key]);
                }
            });
            layers.forEach((layer) => {
                let url = layer.source._imageryProvider.url;
                if (/\/arcgis\/rest\/services/.test(url)) {
                    this.getLegendInfo(url);
                }
            });
        },
        handleChange(value) {
            if (value === "全部") {
                this.legends = this.allLegends;
            } else {
                this.layers.forEach((layer) => {
                    if (value === layer.layerName) {
                        this.legends = layer.legend;
                    }
                });
            }
        },
    },
};
</script>

<style>
.mapgis-legend {
    z-index: 100;
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: fit-content;
    height: fit-content;
    padding: 12px;
    border: 1px #333 solid;
    border-radius: 6px;
    background: #ffffff;
    overflow: auto;
}

.mapgis-legend .legend-area {
    width: 180px;
    height: 220px;
    margin-top: 10px;
    overflow: auto;
}

.mapgis-legend .legend-area li {
    display: flex;
}

.mapgis-legend .legend-area li img {
    height: 20px;
    width: 20px;
}
</style>
