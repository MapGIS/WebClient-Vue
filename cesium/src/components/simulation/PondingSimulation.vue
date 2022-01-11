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

        <mapgis-ui-radio-group v-model="rainOption" class="padding">
            <mapgis-ui-radio :value="0"> 小雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="1"> 中雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="2"> 大雨 </mapgis-ui-radio>
            <mapgis-ui-radio :value="3"> 暴雨 </mapgis-ui-radio>
        </mapgis-ui-radio-group>

        <mapgis-3d-draw
            v-on:drawCreate="handleDrawCreate"
            v-on:load="handleDrawLoad"
            :drawStyle="drawStyleCopy"
            :enableControl="enableControl"
        >
            <label class="title-label">仿真区域</label>

            <mapgis-ui-radio-group v-model="radioValue" class="padding">
                <mapgis-ui-radio :value="1">绘制区域</mapgis-ui-radio>
                <mapgis-ui-radio :value="2">输入区域</mapgis-ui-radio>
            </mapgis-ui-radio-group>

            <div v-if="radioValue === 1" class="padding">
                <mapgis-ui-tooltip
                    v-for="(item, i) in draws"
                    :key="i"
                    placement="bottom"
                >
                    <template slot="title">
                        <span>{{ item.tip }}</span>
                    </template>
                    <mapgis-ui-button
                        shape="circle"
                        :type="item.type"
                        @click="item.click"
                        :class="item.className"
                        style="margin-right: 12px"
                    >
                        <mapgis-ui-iconfont
                            :type="item.icon"
                            :class="item.className"
                            theme="filled"
                        />
                    </mapgis-ui-button>
                </mapgis-ui-tooltip>
            </div>

            <div v-if="radioValue === 2">
                <mapgis-ui-row class="padding">
                    <mapgis-ui-col span="4">
                        <label>圆心</label>
                    </mapgis-ui-col>
                    <mapgis-ui-col span="20">
                        <mapgis-ui-space>
                            <mapgis-ui-input
                                v-model.number="circleCenter.longitude"
                                placeholder="经度"
                                allow-clear
                            />
                            <mapgis-ui-input
                                v-model.number="circleCenter.latitude"
                                placeholder="纬度"
                                allow-clear
                            />
                        </mapgis-ui-space>
                    </mapgis-ui-col>
                </mapgis-ui-row>

                <mapgis-ui-row class="padding">
                    <mapgis-ui-col span="4">
                        <label>半径</label>
                    </mapgis-ui-col>
                    <mapgis-ui-col span="20">
                        <mapgis-ui-input
                            v-model.number="radius"
                            type="number"
                            min="0"
                            addon-after="(米)"
                        />
                    </mapgis-ui-col>
                </mapgis-ui-row>
            </div>
        </mapgis-3d-draw>

        <mapgis-ui-collapse expand-icon-position="left" :bordered="false">
            <template #expandIcon="props">
                <mapgis-ui-iconfont
                    type="mapgis-chevrons-down"
                    :rotate="props.isActive ? 180 : 0"
                    style="left: 6px; font-size: 14px; color: #0081e2"
                />
            </template>
            <mapgis-ui-collapse-panel :style="collapseStyle">
                <div slot="header">
                    <label style="color: #0081e2; margin-left: 16px"
                        >展开详细参数</label
                    >
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
            <mapgis-ui-tooltip placement="bottom">
                <template slot="title">
                    <span>重现积水上涨效果</span>
                </template>
                <mapgis-ui-iconfont
                    type="mapgis-revision"
                    @click="addSimulation"
                    v-show="isSimulation"
                    class="redo-button-style"
                />
            </mapgis-ui-tooltip>
            <mapgis-ui-button type="primary" @click="simulation"
                >开始</mapgis-ui-button
            >
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
// import PondingSimulationTimeline from "./PondingSimulation/timeline.vue"
import flood from "../Analysis/Flood.vue";
import * as turf from "@turf/turf";

export default {
    name: "mapgis-3d-ponding-simulation",
    mixins: [ServiceLayer, flood],
    // components:{PondingSimulationTimeline},
    mounted() {
        this.mounted();
    },
    watch: {
        rainOption(e) {
            let rainfalls = [9, 19, 49, 99];
            this.rainFall = rainfalls[e];
        },
        rainFall() {
            const vm = this;

            if (vm.rainFall < 10) {
                vm.rainOption = 0;
            } else if (vm.rainFall < 25) {
                vm.rainOption = 1;
            } else if (vm.rainFall < 50) {
                vm.rainOption = 2;
            } else {
                vm.rainOption = 3;
            }
        },
        pondingTime(e) {
            let speed =
                (this.maxHeightCopy - this.startHeightCopy) / e;
            this.currentSpeed = Math.round(speed * 100) / 100;
        },
        sliderValue:{
            handler:function(e){
                this.$emit('updateValue',e)
            },
            immediate:true
        },
        pond:{
            handler:function(e){
                this.$emit('isPonding',e)
            },
            immediate:true
        },
    },
    props:{
        //积水上涨的时间
        pondingTime:{
            type:Number,
            default:4
        }
    },
    data() {
        return {
            sliderValue: 0,

            drawStyleCopy: {
                color: "#FF8C00",
                opacity: 0.6,
            },
            draws: [
                {
                    icon: "mapgis-huizhijuxing",
                    type: "primary",
                    tip: "绘制矩形",
                    click: this.drawRectangle,
                },
                {
                    icon: "mapgis-draw-polygon",
                    type: "primary",
                    tip: "绘制多边形",
                    click: this.drawPolygon,
                },
                {
                    icon: "mapgis-huizhiyuan1",
                    type: "primary",
                    tip: "绘制圆",
                    click: this.drawCircle,
                },
            ],
            //绘制方式的选择
            radioValue: 1,
            enableControl: false,

            //输入的圆半径
            circleCenter: {
                longitude: "",
                latitude: "",
            },
            radius: 0,

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
            
            //计算体积的误差
            VolErr: undefined,
            //计算不同高度填方体积的次数
            loopCount: 0,

            //降雨量
            rainFall: 36,
            //降雨体积
            rainFallVol: undefined,
            //雨大小的选项，0-3分别对应小雨，中雨，大雨，暴雨
            rainOption: 2,
            //雨倾斜角度
            angle: 30,

            //  折叠面板的样式
            collapseStyle: {
                border: "0",
                overflow: "hidden",
                padding: "0",
            },

            //分析时的遮罩效果
            maskShow: false,
            maskText: "正在分析中, 请稍等...",

            //判断是否存在积水仿真效果
            isSimulation: false,
            currentMaxHeight: null,
            currentSpeed: null,
            //判断是否停止积水分析计算
            stopCaculate: true,
            //判断积水是否正在进行积水仿真
            pond: false,
            timer: undefined,
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
                }
            );
            this.mount();
            this.$emit("loaded", this);
        },
        destroyed() {
            const { vueCesium, vueKey, vueIndex } = this;
            //积水仿真
            this.stopSimulation();
            vueCesium.PondingSimulationManager.deleteSource(vueKey, vueIndex);

            //绘制组件
            this.drawer.unmount();
            //洪水淹没分析
            this.unmount();

            this.$emit("unload");
        },
        handleDrawLoad(drawer) {
            this.drawer = drawer;
        },
        drawPolygon() {
            this.stopSimulation();
            this.drawer && this.drawer.enableDrawPolygon();
        },
        drawCircle() {
            this.stopSimulation();
            this.isDrawCircle = true;
            this.drawer && this.drawer.enableDrawCircle();
        },
        drawRectangle() {
            this.stopSimulation();
            this.drawer && this.drawer.enableDrawRectangle();
        },
        //绘制组件的回调函数
        handleDrawCreate(cartesian3, param2) {
            //圆形的第二个参数为半径，多边形和矩形的第二个参数为经纬度数组
            const { Cesium, viewer } = this;
            const vm = this;
            let ellipsoid = viewer.scene.globe.ellipsoid;

            if (vm.isDrawCircle) {
                let center = [];
                // 圆心 笛卡尔转换经纬度
                let cartographic =
                    Cesium.Cartographic.fromCartesian(cartesian3);
                center.push(Cesium.Math.toDegrees(cartographic.longitude));
                center.push(Cesium.Math.toDegrees(cartographic.latitude));
                let radius = param2 / 1000;
                let lnglatArr = vm.getCircleDegrees(center, radius);
                vm.positions = Cesium.Cartesian3.fromDegreesArray(
                    lnglatArr,
                    ellipsoid
                );
                // console.log("circlelng",vm.lnglat);
                // console.log("circlecartesian",vm.positions);
                vm.isDrawCircle = false;
            } else {
                // 获取矩形或者多边形的位置坐标
                if (param2.length === 2) {
                    let lnglatArr = vm.getRectDegrees(param2[0], param2[1]);
                    vm.positions = Cesium.Cartesian3.fromDegreesArray(
                        lnglatArr,
                        ellipsoid
                    );
                    //   console.log("rectanglelng",vm.lnglat);
                    //   console.log("rectanglecartesian",vm.positions);
                } else {
                    vm.getPolygonDegrees(param2);
                    vm.positions = cartesian3;
                    //   console.log("polygonlng",vm.lnglat);
                    //   console.log("polygoncartesian",vm.positions);
                }
            }
        },
        //获取圆形边界的经纬度坐标点
        getCircleDegrees(center, radius) {
            // turf 计算坐标点
            let options = {};
            let circle = turf.circle(center, radius, options);
            let degrees = circle.geometry.coordinates[0];
            this.lnglat = degrees;
            let allPoint = [];
            degrees.forEach(function (degree) {
                allPoint.push(degree[0], degree[1]);
            });
            return allPoint;
        },
        //获取矩形的经纬度坐标点
        getRectDegrees(lnglat1, lnglat2) {
            let p1 = [],
                p2 = [],
                p3 = [],
                p4 = [];
            p1.push(lnglat1[0]);
            p1.push(lnglat1[1]);

            p2.push(lnglat2[0]);
            p2.push(lnglat2[1]);

            p3.push(lnglat1[0]);
            p3.push(lnglat2[1]);

            p4.push(lnglat2[0]);
            p4.push(lnglat1[1]);
            this.lnglat = [p1, p4, p2, p3, p1];

            let allPoint = [
                lnglat1[0],
                lnglat1[1],
                lnglat2[0],
                lnglat1[1],
                lnglat2[0],
                lnglat2[1],
                lnglat1[0],
                lnglat2[1],
                lnglat1[0],
                lnglat1[1],
            ];
            return allPoint;
        },
        getPolygonDegrees(degreeArr3) {
            let degreeArr2 = [];
            degreeArr3.forEach(function (degree) {
                degreeArr2.push([degree[0], degree[1]]);
            });
            this.lnglat = degreeArr2;
        },
        //开始模拟仿真计算
        simulation() {
            const { Cesium, viewer } = this;
            const vm = this;
            if (viewer.terrainProvider && viewer.terrainProvider.range3D) {
                switch (vm.radioValue) {
                    case 1:
                        if (vm.lnglat) {
                            vm.stopCaculate = false;
                            this.drawer && this.drawer.removeEntities(true);

                            vm.maskShow = true;
                            vm.computeRainfallVol();
                            vm.computeHeight();
                        } else {
                            this.$message.warning("请先绘制仿真区域");
                        }
                        break;
                    case 2:
                        if (
                            vm.circleCenter.longitude &&
                            vm.circleCenter.latitude &&
                            vm.radius
                        ) {
                            vm.stopCaculate = false;
                            //先清除
                            vm.lnglat = undefined;

                            let ellipsoid = this.viewer.scene.globe.ellipsoid;

                            // 根据用户输入的圆心和半径计算圆范围的坐标点
                            let circle = [
                                vm.circleCenter.longitude,
                                vm.circleCenter.latitude,
                            ];
                            let lnglatArr = vm.getCircleDegrees(
                                circle,
                                vm.radius / 1000
                            ); //turf创建圆的半径单位为km
                            vm.positions = Cesium.Cartesian3.fromDegreesArray(
                                lnglatArr,
                                ellipsoid
                            );

                            vm.maskShow = true;
                            vm.computeRainfallVol();
                            vm.computeHeight();
                        } else {
                            this.$message.warning("请先输入仿真区域");
                        }
                        break;
                }
            } else {
                this.$message.warning("请先加载地形");
                return;
            }
        },
        //根据降雨量计算绘制区域的降雨体积
        computeRainfallVol() {
            const vm = this;
            if (!this.isSimulation) {
                //计算绘制区域面积
                let turfPoly = turf.polygon([vm.lnglat]);
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
            vm.maskText = "正在计算积水的起始高度，请稍等...";

            //获取地形的高度最值
            let minH, maxH;
            viewer.terrainProvider.readyPromise
                .then(function () {
                    // console.log("viewer.terrainProvider",viewer.terrainProvider);
                    //将地形的最大高程设置为积水上涨高度的上限
                    maxH = viewer.terrainProvider.range3D.zMax;
                    vm.maxH = Math.round(maxH * 100) / 100;
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
                const { min, max } = payload;
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
            // console.log("third callback",result)
            let { Vol, min, midRange, max } = result;
            //计算指定高度计算所得体积与雨水体积的误差
            let err = Vol - this.rainFallVol;
            // console.log('err', err);

            //判断误差是否满足条件
            if (Math.abs(err) < vm.VolErr) {
                //若误差满足条件，将使用的高度设置为积水上涨的高度
                vm.maxHeightCopy = Math.round(midRange * 100) / 100;
                //在实际计算出来的积水高度上增加一米以优化积水显示的效果
                vm.maxHeightCopy += 1;
                // console.log("heightflood",vm.maxHeightCopy);
                //积水上涨高度的步长值
                vm.heightStep = (vm.maxH - vm.startHeightCopy) / 10;

                //积水上涨的速度
                let speed =
                    (vm.maxHeightCopy - vm.startHeightCopy) / vm.pondingTime;
                vm.floodSpeedCopy = Math.round(speed * 100) / 100;

                vm.maskShow = false;
                vm.isSimulation = true;
                vm.currentMaxHeight = vm.maxHeightCopy;
                vm.currentSpeed = vm.floodSpeedCopy;

                //积水上涨
                vm.addSimulation();
                vm.loopCount = 0;
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
                    if (!vm.stopCaculate) {
                        vm.maskText =
                            "正在进行第 " + vm.loopCount + " 次计算...";
                        vm.loopCutFill(midRange, "loop", resolve);
                    }
                },
                (reject) => {}
            );
            promise.then((event) => {
                vm.computePondingHeight({
                    Vol: event.fillVolume,
                    min: min,
                    midRange: midRange,
                    max: max,
                });
            });
        },
        //填挖方分析
        loopCutFill(height, eventtype, resolve) {
            const vm = this;
            if (eventtype == "first_calc") {
                vm.maskText = "正在计算积水的高度，请稍等...";
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
            // console.log("docutfill");
        },
        //填挖方分析的回调函数
        handleCallback(eventtype, eventdata, height, resolve) {
            // console.log(eventtype, eventdata);
            const vm = this;

            if (eventtype == "minmax") {
                let min = eventdata.minHeight;
                let max = eventdata.maxHeight;
                // console.log("minmax callback");
                resolve({ min: min, max: max });
            } else if (eventtype == "first_calc") {
                // console.log("first_calc callback");
                let { fillVolume, minHeight, maxHeight } = eventdata;
                vm.loopCount++;
                vm.computePondingHeight({
                    Vol: fillVolume,
                    min: minHeight,
                    midRange: height,
                    max: maxHeight,
                });
            } else if (eventtype == "loop") {
                vm.loopCount++;
                // console.log("loop callback");
                resolve(eventdata);
            }
        },
        addSimulation() {
            const vm = this;
            if (vm.isSimulation) {
                //下雨
                vm.addrain();
                vm.pond = true;
                vm.maxHeightCopy = vm.currentMaxHeight;
                vm.floodSpeedCopy = vm.currentSpeed;
                vm.sliderValue = 0;
                vm.timer = setInterval(() => {
                    vm.sliderValue += 24 * (0.5 / vm.pondingTime);
                    if (vm.sliderValue >= 24) {
                        clearInterval(vm.timer);
                        vm.removeRain();
                        vm.pond = false;
                    }
                }, 500);

                vm._removeFlood();
                vm._doAnalysis();
            } else {
                this.$message.warning("请先开始仿真！");
            }
        },
        addrain() {
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
            this.stopCaculate = true;
            this.maskShow = false;
            this.lnglat = undefined;

            this._removeFlood();
            this.removeRain();
            this.removeDraw();
            this.isSimulation = false;
            this.currentMaxHeight = null;
            this.currentSpeed = null;
            this.sliderValue = 0;
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
        },
        removeDraw() {
            //   this.lnglat = undefined;
            this.drawer && this.drawer.removeEntities();
            //清空drawElement
            if (window.drawElement) {
                window.drawElement.stopDrawing();
            }
        },
    },
};
</script>

<style scoped>
.mapgis-3d-ponding-simulation {
    width: 320px;
    /* position: absolute;
    top: 10px;
    left: 10px; */
    padding: 10px;
}

.title-label {
    display: block;
    padding: 6px;
    font-size: 14px;
    /* color: #333; */
    font-weight: 700;
}

::v-deep
    .mapgis-ui-collapse
    > .mapgis-ui-collapse-item
    > .mapgis-ui-collapse-header {
    border-left: unset !important;
    padding: 10px 6px;
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

.padding {
    padding: 10px 6px;
}

.mapgis-ui-setting-footer {
    position: relative;
}

.redo-button-style {
    position: absolute;
    left: 0px;
    font-size: 21px;
}

</style>
