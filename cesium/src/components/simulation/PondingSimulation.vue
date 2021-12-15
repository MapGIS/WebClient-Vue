<template>
    <div class="mapgis-3d-ponding-simulation">
        <mapgis-ui-input-number-panel
            label="积水高度(米)"
            size="small"
            v-model="maxHeightCopy"
            :range="[startHeightCopy,]"
            :step="100"
            :slider="false"
            :labelCol="{ span: 12 }"
            :wrapperCol="{ span: 12 }"
        />
        <mapgis-ui-input-number-panel
            label="积水上涨速度(米/秒)"
            size="small"
            v-model="floodSpeedCopy"
            :range="[0,]"
            :step="100"
            :slider="false"
            :labelCol="{ span: 12 }"
            :wrapperCol="{ span: 12 }"
        />

        <mapgis-ui-color-pick-panel
            label="积水颜色"
            :color="floodColorCopy"
            @input="
                (val) =>
                    (floodColorCopy = `rgba(${val.rgba.r},${val.rgba.g},${val.rgba.b},${val.rgba.a})`)
            "
            :disableAlpha="false"
            :labelCol="12"
            :wrapperCol="12"
        />
        <mapgis-ui-group-tab title="雨参数" />
        <mapgis-ui-radio-group v-model="rainOption">
            <mapgis-ui-radio :value="0"> 小雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="1"> 中雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="2"> 大雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="3"> 暴雨 </mapgis-ui-radio>
        </mapgis-ui-radio-group>

        <mapgis-ui-input-number-panel
            size="small"
            label="雨角度"
            v-model="angle"
            :range="[-30, 30]"
            :step="2"
            :slider="false"
            :labelCol="{ span: 12 }"
            :wrapperCol="{ span: 12 }"
        />

        <mapgis-ui-setting-footer>
            <mapgis-ui-button type="primary" @click="simulation">分析</mapgis-ui-button>
            <mapgis-ui-button @click="stopSimulation">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
    </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import flood from "../Analysis/Flood.vue";

export default {
    name: "mapgis-3d-ponding-simulation",
    components: {},
    mixins: [ServiceLayer, flood],
    mounted() {
        this.mounted();
    },
    watch: {
        positions: {
            handler: function (e) {
                if (e) {
                    this.initHeight();
                    this.rain();
                }
            },
            deep: true,
            immediate: true,
        },
        rainOption() {
            this.rain();
        },
        angle() {
            this.rain();
        },
    },
    data() {
        return {
            // startHeight: 0, //洪水起点高度
            // minHeight: 0, //动画起点高度
            // maxHeight: 100,
            // floodColor: Cesium.Color(0.0, 0.4, 0.1, 0.1),
            // floodSpeed: 0.05, //m/s
            rainOption: 2,
            angle: 30,
        };
    },
    destroyed() {
        this.destroyed();
    },
    methods: {
        mounted() {
            const { vueCesium, vueKey, vueIndex } = this;
            this.$emit("load", this);
            vueCesium.PondingSimulationManager.addSource(
                vueKey,
                vueIndex,
                null,
                {
                    rain: null,
                }
            );
            this.mount();
        },
        destroyed() {
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.PondingSimulationManager.findSource(
                vueKey,
                vueIndex
            );
            if (find.options && find.options.rain) {
                find.options.rain.removeRain();
            }
            vueCesium.PondingSimulationManager.deleteSource(vueKey, vueIndex);
            this.unmount();
            this.$emit("unload");
        },
        simulation() {
            this.stopSimulation();
            this.analysis();
            this.rain();
        },
        initHeight() {
            let Cartographics = this.positionsToCartographics(this.positions);
            let bdrMinHeight = this.maxHeightCopy;
            Cartographics.forEach(function(cart){
                if(cart.height < bdrMinHeight){
                    bdrMinHeight = cart.height;
                }
            });
            console.log("bdrMinHeight",bdrMinHeight);
            this.maxHeightCopy = bdrMinHeight;
        },
        positionsToCartographics(positions){
            const { viewer,Cesium } = this;
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let result = [];
            console.log("positions",positions);
            let x1 = positions[0].x;
            let x2 = positions[0].x;
            let y1 = positions[0].y;
            let y2 = positions[0].y;

            positions.forEach(function(item){
                if(x1 > item.x){ x1 = item.x };
                if(x2 < item.x){ x2 = item.x };
                if(y1 > item.y){ y1 = item.y };
                if(y2 < item.y){ y2 = item.y };
                let pos = Cesium.Cartographic.fromCartesian(item,ellipsoid);
                result.push(pos);
            });
            console.log("result",result);
            //x方向采样点个数(采样距离50m)
            let xn = Math.ceil((x2 - x1)/50);
            //y方向采样点个数
            let yn = Math.ceil((y2 - y1)/50);
            
            console.log("x1:",x1,"x2:",x2,"xn",xn,"y1:",y1,"y2:",y2,"yn",yn);
            
            let xmin = result[0].longitude;
            let xmax = result[0].longitude;
            let ymin = result[0].latitude;
            let ymax = result[0].latitude;

            positions.forEach(function(i){
                if(xmin > i.longitude){ xmin = i.longitude };
                if(xmax < i.longitude){ xmax = i.longitude };
                if(ymin > i.latitude){ ymin = i.latitude };
                if(ymax < i.latitude){ ymax = i.latitude };
            });

            console.log("xmin：",xmin,"xmax",xmax,"ymin：",ymin,"ymax",ymax);

            return result
        },
        rain() {
            const { viewer, Cesium, vueCesium, vueKey, vueIndex, positions } = this;
            const vm = this;
            if (positions) {
                vm.removeRain();
                let weather = new Cesium.WeatherEffect(viewer);

                let options = [
                    {
                        alpha: 0.3,
                        speed: 1,
                        rainLength: 0,
                        factor: 0.1,
                    },
                    {
                        alpha: 0.5,
                        speed: 5,
                        rainLength: 0.2,
                        factor: 0.1,
                    },
                    {
                        alpha: 0.6,
                        speed: 18,
                        rainLength: 1,
                        factor: 0.1,
                    },
                    {
                        alpha: 1,
                        speed: 20,
                        rainLength: 2,
                        factor: 0.2,
                    },
                ];

                let option = options[vm.rainOption];

                option.angle = vm.angle;

                weather.removeAll();
                weather.addRain(option);
                vueCesium.PondingSimulationManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "rain",
                    weather
                );

                // console.log("weather.addRain");
            }
        },
        stopSimulation() {
            this.remove();
            this.removeRain();
        },
        removeRain() {
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.PondingSimulationManager.findSource(
                vueKey,
                vueIndex
            );
            if (find.options && find.options.rain) {
                find.options.rain.removeRain();
            }
            vueCesium.PondingSimulationManager.changeOptions(
                vueKey,
                vueIndex,
                "rain",
                null
            );
        },
    },
};
</script>

<style scoped>
.mapgis-3d-ponding-simulation {
    width: 320px;
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #fff;
    padding: 6px 10px;
}
</style>
