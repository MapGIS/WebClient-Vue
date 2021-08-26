<template>
    <div class="mapgis-legend">
        <mapgis-ui-select
            default-value="全部"
            style="width: 100%"
            @change="handleChange"
        >
            <mapgis-ui-select-option value="全部"> 全部 </mapgis-ui-select-option>
            <mapgis-ui-select-option
                :value="index"
                v-for="(layer, index) in layers"
                :key="index"
                >{{ layer.layerName }}
            </mapgis-ui-select-option>
        </mapgis-ui-select>
        <div class="legend-area">
            <li v-for="(legend, index) in legends" :key="index">
                <img :src="'data:image/png;base64,' + legend.imageData" />
                <span>{{ legend.label }}</span>
            </li>
        </div>
    </div>
</template>

<script>
export default {
    name: "mapgis-arcgis-legend",
    inject: ["mapbox", "map"],
    props: {},
    data() {
        return {
            layers: [],
            legends: [],
            allLegends: [],
        };
    },
    watch: {},
    mounted() {
        this.getLegendUrl();
    },
    methods: {
        getLegendInfo(url) {
            // let legendUrl = url.replace(/(?<=MapServer).*/i, "/legend?f=pjson");
          const legend = new RegExp("(?<=MapServer).*", 'i');
          let legendUrl = url.replace(legend, "/legend?f=pjson");
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
            const { map } = this;
            const style = map.getStyle();
            const { sources } = style;
            let tiles = [];
            sources &&
                Object.keys(sources).forEach((key) => {
                    tiles = tiles.concat(sources[key].tiles);
                });
            tiles.forEach((url) => {
              const regExp = new RegExp("\\/arcgis\\/rest\\/services", 'i');
              if (regExp.test(url)) {
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
