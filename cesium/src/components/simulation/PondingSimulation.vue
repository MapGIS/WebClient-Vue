<template>
    <div class="mapgis-3d-ponding-simulation">

        <label class="title-label">积水参数设置</label>

        <mapgis-ui-input-number-panel
            label="积水高度(米)"
            size="small"
            v-model="maxHeightCopy"
            :range="[startHeightCopy,99999999]"
            :rangeShow="false"
            :step="100"
            :slider="false"
            :labelCol="{ span: 12 }"
            :wrapperCol="{ span: 12 }"
        />
        <mapgis-ui-input-number-panel
            label="积水上涨速度(米/秒)"
            size="small"
            v-model="floodSpeedCopy"
            :range="[0,99999999]"
            :rangeShow="false"
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

        <label class="title-label">雨参数设置</label>

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

        <mapgis-ui-radio-group v-model="rainOption"  style="padding:10px 6px">
            <mapgis-ui-radio :value="0"> 小雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="1"> 中雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="2"> 大雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="3"> 暴雨 </mapgis-ui-radio>
        </mapgis-ui-radio-group>

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
        rainOption(e) {
            this.rain();
            let floodSpeeds =  [100,300,500,600];
            this.floodSpeedCopy = floodSpeeds[e];

            this.computeStartHeight();
        },
        angle() {
            this.rain();
        },
    },
    data() {
        return {
            //雨大小的选项
            rainOption: 2,
            //雨倾斜角度
            angle: 30,
            //积水初始高度
            mHeight: 0,
        };
    },
    destroyed() {
        this.destroyed();
    },
    methods: {
        mounted() {
            const { vueCesium, vueKey, vueIndex } = this;
            vueCesium.PondingSimulationManager.addSource(
                vueKey,
                vueIndex,
                null,
                {
                    rain: null,
                    drawElement: null
                }
            );
            this.mount();
            this.$emit("loaded", this);
        },
        destroyed() {
            const { vueCesium, vueKey, vueIndex } = this;
            
            this.stopSimulation();
            vueCesium.PondingSimulationManager.deleteSource(vueKey, vueIndex);

            this.unmount();

            this.$emit("unload");
        },
        simulation() {
            const{ viewer, Cesium, vueCesium, vueKey, vueIndex} = this;
            const vm = this;
            this.stopSimulation();

            let drawElement = new Cesium.DrawElement(viewer);
            // 激活交互式绘制工具
            drawElement.startDrawingPolygon({
              // 绘制完成回调函数
              callback: result => {
                vm.stopSimulation();
                vm.positions = result.positions;
                vm.computeStartHeight();
                // vm._doAnalysis();
                vm.rain();
              }
            });
            vueCesium.PondingSimulationManager.changeOptions(
              vueKey,
              vueIndex,
              "drawElement",
              drawElement
            );
        },
        computeStartHeight(){
            const { viewer,Cesium,positions } = this;

            let ellipsoid = viewer.scene.globe.ellipsoid;

            let result = [];

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
            // console.log("result",result);

            //x方向采样点个数(采样距离50m)
            let xn = Math.ceil((x2 - x1)/50);
            //y方向采样点个数
            let yn = Math.ceil((y2 - y1)/50);

            // console.log("x1:",x1,"x2:",x2,"xn",xn,"y1:",y1,"y2:",y2,"yn",yn);
            
            let xmin = result[0].longitude;
            let xmax = result[0].longitude;
            let ymin = result[0].latitude;
            let ymax = result[0].latitude;
            // let zmin = result[0].height;
            // let zmax = result[0].height;

            result.forEach(function(i){
                if(xmin > i.longitude){ xmin = i.longitude };
                if(xmax < i.longitude){ xmax = i.longitude };
                if(ymin > i.latitude){ ymin = i.latitude };
                if(ymax < i.latitude){ ymax = i.latitude };
                // if(i.height > zmax){ zmax = i.height; }
                // if(i.height < zmin){ zmin = i.height; }
            });

            // console.log("xmin：",xmin,"xmax",xmax,"ymin：",ymin,"ymax",ymax,"zmin",zmin,"zmax",zmax);

            // this.maxHeightCopy = (zmin + zmax)/2;
            
            let x = (xmax - xmin) / xn ;
            let y = (ymax - ymin) / yn ;

            let samplePoints = [];
            let m,n;
            for(m=0;m<yn;m++){
                for(n=0;n<xn;n++){
                    let pt = Cesium.Cartographic.fromRadians( xmin+n*x , ymin+m*y );
                        samplePoints.push(pt);
                }
            }
            
            const vm = this;
            
            var promise = Cesium.sampleTerrain(viewer.terrainProvider,11, samplePoints);
            Cesium.when(promise, function(updatedPositions) {
                let minHeight = updatedPositions[0].height;
                updatedPositions.forEach(function(pt){
                    if(pt.height < minHeight){
                        minHeight = pt.height;
                    }

                })
                vm.startHeightCopy = minHeight;
                
                vm._removeFlood();
                vm._doAnalysis();
            });

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
                        speed: 15,//1
                        rainLength: 0,
                        factor: 0.1,
                    },
                    {
                        alpha: 0.5,
                        speed: 15,//5
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
                        factor: 0.1,//0.2
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
            }
        },
        stopSimulation() {
            this._removeFlood();
            this.removeRain();
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.PondingSimulationManager.findSource(
                vueKey,
                vueIndex
            );
            const { options } = find;
            const { drawElement} = options;
            
            if (drawElement) {
              // 取消交互式绘制事件激活状态
              drawElement.stopDrawing();
              vueCesium.PondingSimulationManager.changeOptions(
                vueKey,
                vueIndex,
                "drawElement",
                null
              );
            }
        },
        removeRain(){
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.PondingSimulationManager.findSource(
                vueKey,
                vueIndex
            );
            const { options } = find;
            const { rain} = options;

            if (rain) {
                rain.removeRain();
                vueCesium.PondingSimulationManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "rain",
                    null
                );
            }
        }
    },
};
</script>

<style scoped>
.mapgis-3d-ponding-simulation {
    width: 320px;
    /* position: absolute;
    top: 10px;
    left: 10px; */
    background-color: #fff;
    padding: 10px;
}

.title-label{
    display: inline-block;
    padding: 6px;
    font-size: 14px;
    color:#333;
    font-weight: 700;
}
</style>
