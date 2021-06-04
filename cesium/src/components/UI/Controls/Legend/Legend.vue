<template>
    <div class="mapgis-legend">
        <a-select
            default-value="全部"
            style="width: 100%"
            @change="handleChange"
        >
            <a-select-option value="全部"> 全部 </a-select-option>
            <a-select-option
                :value="index"
                v-for="(layer, index) in layers"
                :key="index"
                >{{ layer.layerName }}
            </a-select-option>
        </a-select>
        <div class="legend-area">
            <li v-for="(legend, index) in legends" :key="index">
                <img :src="'data:image/png;base64,' + legend.imageData" />
                <span>{{ legend.label }}</span>
            </li>
        </div>
    </div>
</template>

<script>
import { BaseServer } from "@mapgis/webclient-es6-service";

export default {
    name: "mapgis-3d-arcgis-legend",
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
            let legendUrl = url.replace(/(?<=MapServer).*/i, "/legend?f=pjson");
            fetch(legendUrl)
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    this.layers = this.layers.concat(res.layers);
                    res.layers.forEach((layer) => {
                        this.allLegends = this.allLegends.concat(layer.legend);
                    });
                    this.legends = this.allLegends;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getLegendUrl() {
            const { CesiumZondy } = this;
            let layers = [];
            Object.keys(CesiumZondy.ArcgisManager).forEach((key) => {
                if (key !== "vueKey") {
                    layers = layers.concat(CesiumZondy.ArcgisManager[key]);
                }
            });
            layers.forEach((layer) => {
                let url = layer.source._imageryProvider.url;
                if (/\/arcgis\/rest\/services/i.test(url)) {
                    this.getLegendInfo(url);
                }
            });
        },
        handleChange(value) {
            if (value === "全部") {
                this.legends = this.allLegends;
            } else {
                this.legends = this.layers[value].legend;
            }
        },
    },
};
</script>

<style scoped>
.mapgis-legend {
    z-index: 100;
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: fit-content;
    height: fit-content;
    padding: 12px;
    border: 1px solid #333;
    border-radius: 3px;
    background: #fff;
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

.mapgis-legend .legend-area li span {
    text-align: left;
    word-break: break-all;
}
</style>
