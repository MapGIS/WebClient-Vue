<template>
  <div>
    <slot>
      <div class="mp-widget-shadow-analysis">
        <mapgis-ui-setting-form
            :model="formData"
            :layout="layout"
            size="default"
        >
            <mapgis-ui-form-model-item label="日期">
                <mapgis-ui-date-picker
                    autoWidth
                    :default-value="startDate"
                    @change="changeDate"
                    style="width: 100%"
                />
            </mapgis-ui-form-model-item>
            <div>
                <mapgis-ui-form-model-item label="开始时间">
                    <mapgis-ui-time-picker
                        :default-value="startTime"
                        @change="changeTime($event, 'startTime')"
                        style="width: 100%"
                    />
                </mapgis-ui-form-model-item>
                <mapgis-ui-form-model-item label="结束时间">
                    <mapgis-ui-time-picker
                        :default-value="endTime"
                        @change="changeTime($event, 'endTime')"
                        style="width: 100%"
                    />
                </mapgis-ui-form-model-item>
            </div>
        </mapgis-ui-setting-form>
            <mapgis-ui-input-number-panel
                size="large"
                label="底部高程(米)"
                v-model="formData.minHeight"
                :range="[0]"
                :rangeShow="false"
                :slider="false"
            />

            <mapgis-ui-input-number-panel
                size="large"
                label="拉伸高度(米)"
                v-model="formData.stretchHeight"
                :range="[0]"
                :rangeShow="true"
                :slider="true"
            />

            <mapgis-ui-input-number-panel
                size="large"
                label="间隔时间(分钟)"
                v-model="formData.intervalTime"
                :range="[1]"
                :rangeShow="false"
                :slider="false"
            />

            <mapgis-ui-color-pick-panel
                label="阴影颜色"
                :labelCol="24"
                :wrapperCol="24"
                :color.sync="formData.shadowColor"
                :disableAlpha="true"
                @input="
                    (val) =>
                        (formData.shadowColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
                "
            />
            <mapgis-ui-color-pick-panel
                label="非阴影颜色"
                :labelCol="24"
                :wrapperCol="24"
                :color.sync="formData.sunColor"
                :disableAlpha="true"
                @input="
                    (val) =>
                        (formData.sunColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
                "
            />

        <mapgis-ui-setting-footer class="settingButton">
            <!-- <mapgis-ui-space> -->
                <mapgis-ui-button
                    :disabled="maskShow"
                    type="primary"
                    @click="shadow"
                    >阴影分析
                </mapgis-ui-button>
                <mapgis-ui-button
                    :disabled="maskShow"
                    type="primary"
                    @click="sun"
                    >日照效果
                </mapgis-ui-button>
                <mapgis-ui-button
                    type="primary"
                    @click="removeAll"
                >
                    清除
                </mapgis-ui-button>
            <!-- </mapgis-ui-space> -->
        </mapgis-ui-setting-footer>
        <mapgis-ui-mask
            :loading="maskShow"
            :parentDivClass="'cesium-map-wrapper'"
            :percent="percent"
            :text="maskText"
        ></mapgis-ui-mask>
        <span>
            <Popup v-model="visible" :position="position" forceRender>
                <PopupContent
                    :currentLayerInfo="currentClickInfo"
                ></PopupContent>
            </Popup>
        </span>
      </div>
    </slot>
  </div>
</template>

<script>
import BaseMixin from "./BaseLayer";
import { hexToRgba } from "../Utils/common/color-util";

import VueOptions from "../Base/Vue/VueOptions";
import Popup from "../UI/Popup/Popup.vue";
import PopupContent from "../UI/Geojson/Popup";

const shadowMoment = require("moment");
const manager = "shadowAnalysisManager";
let handler;
export default {
    name: "mapgis-3d-shadow",
    mixins: [BaseMixin],
    inject: ["Cesium", "vueCesium", "viewer"],
    props: {
        ...VueOptions,
        /**
         * @type String
         * @default "vertical"
         * @description 表单布局
         */
        layout: {
        type: String,
        default: "vertical" // 'horizontal' 'vertical' 'inline'
        },
        /**
         * @type String
         * @default 'rgba(0,255,0,255)'
         * @description 阴影部分颜色
         */
        shadowColor: {
            type: String,
            default: "rgba(0,255,0,255)",
        },
        /**
         * @type String
         * @default 'rgba(255,0,0,255)'
         * @description 非阴影部分颜色
         */
        sunColor: {
            type: String,
            default: "rgba(255,0,0,255)",
        },
        /**
         * @type Number
         * @default 0
         * @description 底部高程(米)
         */
        minHeight: {
            type: Number,
            default: 0,
        },
        /**
         * @type Number
         * @default 20
         * @description 拉伸高度(米)
         */
        stretchHeight: {
            type: Number,
            default: 20,
        },
        /**
         * @type Number
         * @default 60
         * @description 间隔时间（分钟）
         */
        intervalTime: {
            type: Number,
            default: 60,
        },
        /**
         * @type Number
         * @default 8
         * @description 时区，UTC标准时间 + 时区 = 本地时间
         */
        timeZone: {
            type: Number,
            default: 8,
        },
        /**
         * @type Boolean
         * @default false
         * @description 是否开启显示阴影率的popup弹框
         */
        enableShadowRatio: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            formData: {
                date: "2021-7-1", // 日期
                startTime: "10:00:00", // 开始时间
                endTime: "14:00:00", // 结束时间
                dateTimeVal: "10:00:00",
                minHeight: 0, // 最低高程(米)
                stretchHeight: 20, // 拉伸高度(米)
                intervalTime: 60, //间隔时间
                shadowColor: "rgba(0,255,0,255)", // 阴影颜色
                sunColor: "rgba(255,0,0,255)", // 非阴影颜色
            },
            startDate: "",
            formDataTime: "",
            startTime: "",
            endTime: "",
            percent: 0,
            layout: {
                labelCol: { span: 5 },
                wrapperCol: { span: 16 },
            },
            maskShow: false,
            maskText: "正在分析中, 请稍等...0%",

            position: {
                longitude: 110,
                latitude: 30,
                height: 0,
            },
            visible: false,
            currentClickInfo: undefined,
            handler: undefined,
        };
    },
    components: {
        Popup,
        PopupContent,
    },
    created() {
        this.startDate = shadowMoment(this.formData.date, "YYYY-MM-DD");
        // this.formDataTime = shadowMoment(this.formData.time, "HH:mm:ss");
        this.startTime = shadowMoment(this.formData.startTime, "HH:mm:ss");
        this.endTime = shadowMoment(this.formData.endTime, "HH:mm:ss");
    },
    mounted() {
        this.mount();
    },
    destroyed() {
        this.removeAll();
    },
    computed: {
        formDataNew() {
            return JSON.parse(JSON.stringify(this.formData));
        },
    },
    watch: {
        shadowColor: {
            handler: function (newVal, oldVal) {
                if (newVal.indexOf("#") > -1) {
                    this.shadowColor = hexToRgba(newVal, 1);
                }
                this.formData.shadowColor = this.shadowColor;
            },
            immediate: true,
        },
        sunColor: {
            handler: function (newVal, oldVal) {
                if (newVal.indexOf("#") > -1) {
                    this.sunColor = hexToRgba(newVal, 1);
                }
                this.formData.sunColor = this.sunColor;
            },
            immediate: true,
        },
        minHeight: {
            handler: function () {
                this.formData.minHeight = this.minHeight;
            },
            immediate: true,
        },
        stretchHeight: {
            handler: function () {
                this.formData.stretchHeight = this.stretchHeight;
            },
            immediate: true,
        },
        intervalTime: {
            handler: function () {
                this.formData.intervalTime = this.intervalTime;
            },
            immediate: true,
        },
        formDataNew: {
            deep: true,
            handler: function (newVal, oldVal) {
                let find = this.findSource();
                if (find && find.options.shadowAnalysis) {
                    // console.log("shadowAnalysis",find.options.shadowAnalysis)
                }
            },
        },
        maskShow: {
            handler: function () {
                this.getShadowRatio();
            },
        },
    },
    methods: {
        async createCesiumObject() {
            return new Promise(
                (resolve) => {
                    resolve();
                },
                (reject) => {}
            );
        },
        mount() {
            const vm = this;
            let promise = this.createCesiumObject();
            promise.then(function (dataSource) {
                vm.$emit("loaded", vm);
            });
        },
        /**
         * 日期组件值变化
         */
        changeDate(val) {
            const date = shadowMoment(val).format("YYYY-MM-DD");
            this.$set(this.formData, "date", date);
        },

        /**
         * 时间组件值变化
         */
        changeTime(val, tag) {
            const time = shadowMoment(val).format("HH:mm:ss");
            this.$set(this.formData, tag, time);
        },

        /**
         * 时间字符串转JulianDate时间
         */
        getJulianDate(timeStr) {
            let { timeZone } = this;
            const utc = this.Cesium.JulianDate.fromDate(new Date(timeStr)); // UTC
            return this.Cesium.JulianDate.addHours(
                utc,
                timeZone,//默认北京时区，8
                new this.Cesium.JulianDate()
            ); // 北京时间
        },

        /**
         * 范围时间段阴影分析
         */
        shadow() {
            this.remove();
            const { viewer, vueCesium, Cesium } = this;

            // 初始化交互式绘制控件
            let drawElement = new Cesium.DrawElement(viewer);
            let { date, minHeight, stretchHeight, intervalTime, shadowColor, sunColor } =
                this.formData;
            // const time = new Date(`${date} ${this.formData.time}`);
            const startTime = this.timeTransfer(`${date} ${this.formData.startTime}`);
            const endTime = this.timeTransfer(`${date} ${this.formData.endTime}`);

            const self = this;
            let shadowAnalysis;
            // 1.绘制分析区域(矩形)
            // 激活交互式绘制工具
            drawElement.startDrawingPolygon({
                // 绘制完成回调函数
                callback: (results) => {
                    drawElement.stopDrawing();

                    let positions = results.positions;
                    // self.remove();

                    self.toggleMask(true);

                    this.$emit("analysisBegin");
                    let xmin;
                    let ymin;
                    let xmax;
                    let ymax;

                    viewer.scene.globe.depthTestAgainstTerrain = true;

                    positions.forEach((point) => {
                        const { x, y } = point;
                        if (xmin === undefined || x < xmin) {
                            xmin = x;
                        }
                        if (xmax === undefined || x > xmax) {
                            xmax = x;
                        }
                        if (ymin === undefined || y < ymin) {
                            ymin = y;
                        }
                        if (ymax === undefined || y > ymax) {
                            ymax = y;
                        }
                    });

                    // 多边形x方向长度
                    const recXLength = self.Cesium.Cartesian3.distance(
                        new this.Cesium.Cartesian3(xmin, ymin, 0),
                        new this.Cesium.Cartesian3(xmax, ymin, 0)
                    );
                    // 多边形y方向长度
                    const recYLength = self.Cesium.Cartesian3.distance(
                        new this.Cesium.Cartesian3(xmin, ymin, 0),
                        new this.Cesium.Cartesian3(xmin, ymax, 0)
                    );
                    const xPaneNum = Math.ceil(recXLength / 4); // X轴方向插值点个数
                    const yPaneNum = Math.ceil(recYLength / 4); // Y轴方向插值点个数
                    const zPaneNum = Math.ceil((stretchHeight - minHeight) / 4); // Z轴方向插值点个数

                    shadowAnalysis = new Cesium.ShadowAnalysis(viewer, {
                        xPaneNum: xPaneNum,
                        yPaneNum: yPaneNum,
                        zPaneNum: zPaneNum,
                        shadowColor: shadowColor,
                        sunColor: sunColor,
                        percentCallback: this.setPercent,
                        intervalTime: intervalTime,
                        pointSize: 10,
                    });
                    console.log("startTime",startTime);
                    console.log("endTime",endTime);
                    // 时间段范围阴影分析
                    shadowAnalysis.calcPointsArrayInShadowTime(
                        positions,
                        minHeight,
                        stretchHeight,
                        startTime,
                        endTime
                    );

                    self.getShadowRatio();

                    // 深拷贝positions数组对象
                    let positionCopy = [];
                    positionCopy = this.copy(positions);
                    // positionCopy = JSON.parse(JSON.stringify(positions));
                    vueCesium.shadowAnalysisManager.addSource(
                        self.vueKey,
                        self.vueIndex,
                        null,
                        {
                            shadowAnalysis: shadowAnalysis,
                            drawElement: drawElement,
                        }
                    );
                    // drawElement.stopDrawing();
                },
            });
        },
        timeTransfer(time){
            const { timeZone } = this;
            let timeInTimezone = new Date(time);
            let timezoneInms = timeInTimezone.getTime();
            let utcInms = timezoneInms + timeZone * 3600000;
            let timeInUTC =  new Date(utcInms);

            return timeInUTC
        },

        /**
         * 原生日照分析
         */
        sun() {
            this.removeSun();
            // this.remove();
            let { viewer } = this;
            viewer.scene.globe.enableLighting = true; // 开启日照
            viewer.shadows = true; // 开启阴影
            const { date, startTime, endTime } = this.formData;
            // 时间段日照分析
            viewer.clock.shouldAnimate = true; // 开启计时

            // var utc = Cesium.JulianDate.fromDate(new Date('2019/10/04 15:00:00')); //UTC
            // viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate()); //北京时间=UTC+8=GMT+8

            viewer.clock.startTime = this.getJulianDate(
                `${date} ${startTime}`
            );
            viewer.clock.stopTime = this.getJulianDate(
                `${date} ${endTime}`
            );
            viewer.clock.currentTime = this.getJulianDate(
                `${date} ${startTime}`
            );
            console.log("sun starttime",viewer.clock.startTime)
            console.log("sun endTime",viewer.clock.stopTime)
            viewer.clock.multiplier = 3600; // cesium中1秒表示现实中1个小时
            viewer.clock.clockRange = this.Cesium.ClockRange.LOOP_STOP; // 循环动画
        },

        /**
         * 时间段阴影分析回调函数，获取分析进度值
         */
        setPercent(result) {
            this.percent = result;
            this.maskText = `正在分析中, 请稍等...${Number(
                (result * 100).toFixed(2)
            )}%`;
            const timer = setInterval(() => {
                if (this.percent === result) {
                    this.toggleMask(false);
                    this.$emit("success");
                }
                clearInterval(timer);
            }, 200);
        },

        /**
         * 获取时间段阴影分析结果点的阴影率
         */
        getShadowRatio() {
            const { viewer, Cesium } = this;
            if (this.enableShadowRatio && !this.maskShow) {
                let vm = this;

                //左击查看阴影时间和光照时间
                // console.log('startComputeShadowRatio');
                handler = new Cesium.ScreenSpaceEventHandler(
                    viewer.scene.canvas
                );
                handler.setInputAction(function (movement) {
                    //获取鼠标点击位置的实体
                    let pickedFeature = viewer.scene.pick(
                        movement.endPosition,
                        10,
                        10
                    );

                    if (
                        pickedFeature &&
                        pickedFeature.primitive &&
                        pickedFeature.primitive.id
                    ) {
                        // console.log('pickedFeature',pickedFeature);

                        //获取点的属性信息
                        let info = pickedFeature.primitive.id;
                        let timeInSun = info.timeInSun;
                        // console.log('timeInSun', timeInSun);
                        let timeInShadow = info.timeInShadow;
                        let shadowRatio = Math.round(
                            (timeInShadow / (timeInShadow + timeInSun)) * 100
                        );

                        //设置popup的内容
                        vm.currentClickInfo = [
                            {
                                // title:"阴影率信息",
                                properties: {
                                    光照时间: timeInSun + "分钟",
                                    阴影时间: timeInShadow + "分钟",
                                    阴影率: shadowRatio + "%",
                                },
                            },
                        ];

                        //获取点的经纬度坐标
                        let cartesian = viewer.scene.globe.pick(
                            viewer.camera.getPickRay(movement.endPosition),
                            viewer.scene
                        );
                        let cartographic =
                            Cesium.Cartographic.fromCartesian(cartesian);
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);

                        //设置弹出popup的位置
                        vm.position.height = cartographic.height;
                        vm.position.latitude = lat;
                        vm.position.longitude = lng;

                        //显示popup
                        vm.visible = true;

                        viewer.scene.requestRender();
                    } else {
                        vm.visible = false;
                        // console.log("未选中");
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
        },

        /**
         * 数组对象深拷贝
         */
        copy(obj) {
            var newobj = obj.constructor === Array ? [] : {};
            if (typeof obj !== "object") {
                return;
            }
            for (let i in obj) {
                newobj[i] =
                    typeof obj[i] === "object" ? this.copy(obj[i]) : obj[i];
            }
            return newobj;
        },
        findSource() {
            let { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.shadowAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            return find;
        },
        /**
         * 移除绘制插件和阴影分析结果
         */
        remove() {
            let { vueKey, vueIndex, vueCesium, Cesium } = this;
            // let findSource = vm.$_getManager(manager);
            if (handler) {
                handler.removeInputAction(
                    Cesium.ScreenSpaceEventType.MOUSE_MOVE
                );
            }
            let findSource = this.findSource();
            // console.log("findSource", findSource)
            // 判断是否已有阴影分析结果
            if (findSource && findSource.options) {
                // 移除阴影分析显示结果
                this.visible = false;
                findSource.options.shadowAnalysis.remove();
                findSource.options.shadowAnalysis = null;
                // 取消交互式绘制矩形事件激活状态
                findSource.options.drawElement.stopDrawing();
                findSource.options.drawElement = null;
            }
            // 这段代码可以认为是对应的vue的获取destroyed生命周期
            vueCesium[manager].deleteSource(vueKey, vueIndex);
        },
        /**
         * 移除日照分析结果
         */
        removeSun() {
            const { viewer } = this;
            viewer.scene.globe.enableLighting = false;
            viewer.shadows = false;
            viewer.clock.multiplier = 1;
            viewer.clock.shouldAnimate = false; // 关闭计时
        },
        removeAll() {
            this.remove();
            this.removeSun();
            this.$emit("unload", this);
        },
        /**
         * 阴影分析遮罩层
         */
        toggleMask(status) {
            this.maskShow = status;
        },

        changeShadowColor(color) {
            this.formData.shadowColor = color;
        },
        changeSunColor(color) {
            this.formData.sunColor = color;
        },
    },
};
</script>

<style scoped>
.mp-widget-shadow-analysis {
    /* padding: 10px; */
    border-radius: 4px;
}

::v-deep .mapgis-popup-row-container {
    height: fit-content;
    /* background: #fff; */
}

::v-deep .mapgis-popup-row {
    min-width: 200px;
}

::v-deep .mapgis-popup-field {
    width: 50%;
    font-size: 14px;
    font-weight: bold;
}

::v-deep .mapgis-popup-value {
    width: 50%;
    text-align: right;
    font-size: 14px;
}
</style>