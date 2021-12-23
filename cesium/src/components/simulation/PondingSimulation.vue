<template>
    <div class="mapgis-3d-ponding-simulation">
        
        <label class="title-label">参数设置</label>
        
        <mapgis-ui-input-number-panel
            label="日降雨量(毫米)"
            size="small"
            v-model="rainFall"
            :range="[0, 2000]"
            :rangeShow="false"
            :step="10"
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

        <mapgis-ui-collapse expand-icon-position="left" :bordered="false">
            <template #expandIcon="props">
                <mapgis-ui-iconfont
                    type="mapgis-chevrons-down"
                    :rotate="props.isActive ? 180 : 0"
                    style="left:6px;font-size:14px"
                />
            </template>
            <mapgis-ui-collapse-panel :style="collapseStyle">              
                <div slot="header">
                    <!-- <mapgis-ui-iconfont type="mapgis-chevrons-down"/> -->
                    <label  style="color: #0081e2;margin-left:16px">展开详细参数</label>
                </div>

                <label class="title-label">积水参数设置</label>

                <mapgis-ui-input-number-panel
                    label="积水高度(米)"
                    size="small"
                    v-model="maxHeightCopy"
                    :range="[startHeightCopy, maxH]"
                    :rangeShow="false"
                    :step="heightStep"
                    :slider="false"
                    :labelCol="{ span: 12 }"
                    :wrapperCol="{ span: 12 }"
                />
                <mapgis-ui-input-number-panel
                    label="积水上涨速度(米/秒)"
                    size="small"
                    v-model="floodSpeedCopy"
                    :range="[0, 500]"
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
                    :step="10"
                    :slider="false"
                    :labelCol="{ span: 12 }"
                    :wrapperCol="{ span: 12 }"
                />


            </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        
        <mapgis-ui-setting-footer>
            <mapgis-ui-button type="primary" @click="simulation">分析</mapgis-ui-button>
            <mapgis-ui-button @click="stopSimulation">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>

        <mapgis-ui-mask
            :loading="maskShow"
            :parentDivClass="'cesium-map-wrapper'"
            :text="maskText"
        />
    </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import flood from "../Analysis/Flood.vue";
import * as turf from "@turf/turf";

export default {
    name: "mapgis-3d-ponding-simulation",
    components: {},
    mixins: [ServiceLayer, flood],
    mounted() {
        this.mounted();
    },
    watch: {
        rainOption(e) {
            let rainfalls = [9, 19, 49, 99];
            let pondingTimes = [7,5,3,1];
            this.rainFall = rainfalls[e];
            this.pondingTime = pondingTimes[e];
        },
        rainFall() {
            const vm = this;

            if( vm.rainFall < 10 ){
                vm.rainOption = 0
            }else if( vm.rainFall < 25){
                vm.rainOption = 1
            }else if( vm.rainFall <50){
                vm.rainOption = 2
            }else{
                vm.rainOption =3
            }
            
            if(vm.pond){
                vm.maskShow = true;
                vm.removeRain();
                vm._removeFlood();
                vm.computeRainfallVol();
                vm.loopCutFill(vm.midRange, "first_calc", undefined);
            }

        },
        angle() {
            const vm = this;
            if(vm.pond){
                vm.rain();
            }
        },
    },
    data() {
        return {
            //绘制区域面积
            area: undefined,
            //绘制区域高程的中程数
            midRange: undefined,
            
            //积水初始高度
            mHeight: 0,
            //积水上涨高度的上限
            maxH: undefined, 
            //积水上涨高度调整的步长值
            heightStep: 100,
            //积水上涨的时间
            pondingTime: 3,
            //计算体积的误差
            VolErr: undefined,
            //计算不同高度填方体积的次数
            loopCount:0,

            //降雨量
            rainFall: 36,
            //降雨体积
            rainFallVol: undefined,
            //雨大小的选项，0-3分别对应小雨，中雨，大雨，暴雨
            rainOption: 2,
            //雨倾斜角度
            angle: 30,

            collapseStyle: {
                background: "#ffffff",
                border: "0",
                overflow: "hidden",
                padding: "0",
            },

            maskShow: false,
            maskText: '正在分析中, 请稍等...',

            //判断是否存在积水仿真效果
            pond: false,

        };
    },
    destroyed() {
        this.destroyed();
    },
    methods: {
        mounted() {
            const { vueCesium, vueKey, vueIndex, viewer } = this;
            vueCesium.PondingSimulationManager.addSource(
                vueKey,
                vueIndex,
                null,
                {
                    rain: null,
                    drawElement: null,
                }
            );
            const vm = this;
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
            const { viewer, Cesium, vueCesium, vueKey, vueIndex } = this;
            const vm = this;
            this.stopSimulation();

            let drawElement = new Cesium.DrawElement(viewer);
            vueCesium.PondingSimulationManager.changeOptions(
                vueKey,
                vueIndex,
                "drawElement",
                drawElement
            );
            // 激活交互式绘制工具
            drawElement.startDrawingPolygon({
                // 绘制完成回调函数
                callback: (result) => {
                    vm.stopSimulation();
                    vm.positions = result.positions;
                    vm.maskShow = true;
                    vm.computeRainfallVol(result.positions);
                    vm.computeHeight();
                    // vm.rain();
                },
            });
        },
        //根据降雨量计算绘制区域的降雨体积
        computeRainfallVol(cartesians) {
            const { viewer, Cesium } = this;
            
            if(!this.pond){
                //计算绘制区域面积
                let ellipsoid = viewer.scene.globe.ellipsoid;
                let polygon = [];
                cartesians.forEach(function (cartesian) {
                    let radian = Cesium.Cartographic.fromCartesian(
                        cartesian,
                        ellipsoid
                    );
                    let lng = Cesium.Math.toDegrees(radian.longitude);
                    let lat = Cesium.Math.toDegrees(radian.latitude);
                    polygon.push([lng, lat]);
                });
                let turfPoly = turf.polygon([polygon]);
                this.area = turf.area(turfPoly); //square meters
            }

            //计算绘制区域体积
            let rainFallVol = this.area * this.rainFall * 0.001; //cubic meters
            this.VolErr = rainFallVol * 0.1;
            this.rainFallVol = rainFallVol;
        },
        //计算积水的起始高度和上涨高度
        computeHeight() {
            const { viewer } = this;
            const vm = this;
            vm.maskText="正在计算积水的起始高度，请稍等..."

            //获取地形的高度最值
            let minH,maxH;
            viewer.terrainProvider.readyPromise
                .then(function () {
                    console.log("viewer.terrainProvider",viewer.terrainProvider);
                    //将地形的最大高程设置为积水上涨高度的上限
                    maxH = viewer.terrainProvider.range3D.zMax;
                    vm.maxH = Math.round(maxH * 100 ) / 100;
                    minH = viewer.terrainProvider.range3D.zMin;
                    // //将地形的最小高程设置为积水的起始高度
                    // vm.startHeightCopy = Math.round(minH * 100) / 100;
                })
                .otherwise(function (err) {
                    console.log(err);
                });

            let midRange = (minH + maxH) / 2;
            let promise = new Promise(
                (resolve) => {
                    //获取绘制区域的高程最值
                    vm.loopCutFill(midRange, "minmax", resolve);
                },
                (reject) => {}
            );
            promise.then(function (payload) {
                const{ min, max} =  payload;
                //将绘制区域的最小高程设置为积水的起始高度
                vm.startHeightCopy = Math.round(min * 100) / 100;

                vm.midRange = (min + max) / 2;
                //指定绘制区域的最值的平均值为规整高度，计算填方体积
                vm.loopCutFill(vm.midRange, "first_calc", undefined);
            });
        },
        //计算积水上涨的高度
        computePondingHeight(result, resolve) {
            const vm = this;
            console.log("third callback",result)
            let { Vol, min, midRange, max } = result;
            //计算指定高度计算所得体积与雨水体积的误差
            let err = Vol - this.rainFallVol;
            console.log('err', err);

            //判断误差是否满足条件
            if (Math.abs(err) < vm.VolErr) {
                //若误差满足条件，将使用的高度设置为积水上涨的高度
                vm.maxHeightCopy = Math.round(midRange * 100 ) / 100;

                //积水上涨高度的步长值
                vm.heightStep = (vm.maxH - vm.startHeightCopy) / 10;
                
                //积水上涨的速度
                let speed = (vm.maxHeightCopy - vm.startHeightCopy) / vm.pondingTime;
                vm.floodSpeedCopy = Math.round(speed * 100) / 100;
                //下雨
                vm.rain();
                vm._removeFlood();
                //积水上涨
                vm._doAnalysis();
                vm.maskShow = false;
                vm.loopCount = 0;
                vm.pond = true;
                return;
            }
            
            //使用二分法改变使用的高度使得填方体积逼近降雨体积，从而计算积水高度
            if (err > 0) {
                max = midRange;
                midRange = Math.abs(min + midRange) / 2;
            } else {
                min = midRange;
                midRange = Math.abs(max + midRange) / 2;
            }
            let promise = new Promise(
                (resolve) => {
                    vm.maskText = "正在进行第 " + vm.loopCount +" 次计算..."
                    vm.loopCutFill(midRange, "loop", resolve);
                },
                (reject) => {}
            );
            promise.then((event) => {
                vm.computePondingHeight({ Vol:event.fillVolume, min:min, midRange:midRange, max:max });
            });
        },
        //填挖方分析
        loopCutFill(height, eventtype, resolve) {
            const vm = this;
            if(eventtype == "first_calc"){
                vm.maskText="正在计算积水的高度，请稍等..."
            }
            this.doCutFill({
                height: height,
                callBack: function (event) {
                    vm.handleCallback(eventtype, event, height, resolve);
                },
            });
        },
        doCutFill(opt) {
            const { viewer, Cesium, positions } = this;
            // 创建填挖方实例
            const cutFill = new Cesium.CutFillAnalysis(viewer, opt);
            cutFill._pointsPolygon = positions;
            let minMax = cutFill.getMinAndMaxCartesian();
            cutFill.start(minMax);
            console.log("docutfill");
        },
        //填挖方分析的回调函数
        handleCallback(eventtype, eventdata, height, resolve) {
            console.log(eventtype, eventdata);
            const vm = this;
            
            if (eventtype == "minmax") {
                let min = eventdata.minHeight;
                let max = eventdata.maxHeight;
                console.log("minmax callback");
                resolve({min:min,max:max});
            } else if (eventtype == "first_calc") {
                // console.log("first_calc callback");
                let {fillVolume, minHeight,maxHeight} = eventdata;
                vm.loopCount ++;
                vm.computePondingHeight({ Vol:fillVolume, min:minHeight, midRange:height, max:maxHeight });

            } else if (eventtype == "loop") {
                vm.loopCount ++;
                console.log("loop callback");
                resolve(eventdata);
            }
        },
        rain() {
            const { viewer, Cesium, vueCesium, vueKey, vueIndex, positions } =
                this;
            const vm = this;
            if (positions) {
                vm.removeRain();

                let weather = new Cesium.WeatherEffect(viewer);

                let options = [
                    //小雨
                    {
                        alpha: 0.3,
                        speed: 15, //1
                        rainLength: 0,
                        factor: 0.1,
                    },
                    //中雨
                    {
                        alpha: 0.5,
                        speed: 15, //5
                        rainLength: 0.2,
                        factor: 0.1,
                    },
                    //大雨
                    {
                        alpha: 0.6,
                        speed: 18,
                        rainLength: 1,
                        factor: 0.1,
                    },
                    //暴雨
                    {
                        alpha: 1,
                        speed: 20,
                        rainLength: 2,
                        factor: 0.1, //0.2
                    },
                ];

                // 雨特效的长度
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
            const { drawElement } = options;

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

            this.pond = false;
        },
        removeRain() {
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.PondingSimulationManager.findSource(
                vueKey,
                vueIndex
            );
            const { options } = find;
            const { rain } = options;

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

.title-label {
    display: inline-block;
    padding: 6px;
    font-size: 14px;
    color: #333;
    font-weight: 700;
}

::v-deep
    .mapgis-ui-collapse
    > .mapgis-ui-collapse-item
    > .mapgis-ui-collapse-header {
    border-left: unset !important;
    padding: 6px;
}

::v-deep .mapgis-ui-collapse-content > .mapgis-ui-collapse-content-box {
    padding: 0;
}

::v-deep
    .mapgis-ui-collapse-borderless
    > .mapgis-ui-collapse-item
    > .mapgis-ui-collapse-content
    > .mapgis-ui-collapse-content-box {
    padding: 0;
}
</style>
