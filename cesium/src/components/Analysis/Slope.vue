<template>
    <div>
        <slot>
            <div class="mapgis-widget-slope-analysis">
                <mapgis-ui-group-tab title="坡度图例设置">
                    <mapgis-ui-tooltip slot="tip" placement="top">
                        <template slot="title">
                            <span>{{ info }}</span>
                        </template>
                        <mapgis-ui-iconfont
                            type="mapgis-info"
                        ></mapgis-ui-iconfont>
                    </mapgis-ui-tooltip>
                </mapgis-ui-group-tab>
                <mapgis-ui-colors-setting
                    v-model="rampColorsCopy"
                    :rangeField="'坡度范围'"
                ></mapgis-ui-colors-setting>
                <mapgis-ui-setting-footer>
                    <mapgis-ui-button type="primary" @click="analysis"
                        >分析</mapgis-ui-button
                    >
                    <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
                </mapgis-ui-setting-footer>
            </div>
        </slot>
    </div>
</template>

<script>
import { rgbaToHex } from "../Utils/common/color-util";
/* import { Util } from "@mapgis/webclient-vue-ui";
const { ColorUtil } = Util; */
import VueOptions from "../Base/Vue/VueOptions";
import {
    isEnableLighting,
    setEnableLighting,
    getLight,
    setLight,
    getDynamicAtmosphereLighting,
    setDynamicAtmosphereLighting,
    getDynamicAtmosphereLightingFromSun,
    setDynamicAtmosphereLightingFromSun,
} from "../WebGlobe/util";

export default {
    name: "mapgis-3d-analysis-slope",
    inject: ["Cesium", "vueCesium", "viewer"],
    props: {
        ...VueOptions,
        /**
         * @type Object
         * @description 坡度分析角度颜色数组
         */
        rampColors: {
            type: Array,
            default: () => {
                return [
                    { min: 0, max: 15, color: "rgba(244, 67, 54, 0.5)" },
                    { min: 15, max: 30, color: "rgba(233, 30, 99, 0.5)" },
                    { min: 30, max: 45, color: "rgba(156, 39, 176, 0.5)" },
                    { min: 45, max: 60, color: "rgba(255, 235, 59, 0.5)" },
                    { min: 60, max: 75, color: "rgba(96, 125, 139, 0.5)" },
                    { min: 75, max: 90, color: "rgba(76, 175, 80, 0.5)" },
                ];
            },
        },
    },
    watch: {
        rampColors: {
            handler() {
                this.rampColorsCopy = this.rampColors;
            },
            deep: true,
            immediate: true,
        },
    },
    data() {
        return {
            rampColorsCopy: [
                { min: 0, max: 15, color: "rgba(244, 67, 54, 0.5)" },
                { min: 15, max: 30, color: "rgba(233, 30, 99, 0.5)" },
                { min: 30, max: 45, color: "rgba(156, 39, 176, 0.5)" },
                { min: 45, max: 60, color: "rgba(255, 235, 59, 0.5)" },
                { min: 60, max: 75, color: "rgba(96, 125, 139, 0.5)" },
                { min: 75, max: 90, color: "rgba(76, 175, 80, 0.5)" },
            ],

            isEnableLighting: undefined, // 光照是否已开启

            light: undefined, // 是否有light对象

            dynamicAtmosphereLighting: undefined,

            dynamicAtmosphereLightingFromSun: undefined,

            info: "坡度分析需要带法线地形。",
        };
    },

    created() {},
    mounted() {
        this.mount();
    },
    destroyed() {
        this.unmount();
    },
    methods: {
        async createCesiumObject() {
            const { baseUrl, options } = this;
            return new Promise(
                (resolve) => {
                    resolve();
                },
                (reject) => {}
            );
        },
        mount() {
            const { viewer, vueCesium, vueKey, vueIndex } = this;
            const vm = this;
            let promise = this.createCesiumObject();
            promise.then(function (dataSource) {
                vm.$emit("load", vm);
                vueCesium.SlopeAnalysisManager.addSource(
                    vueKey,
                    vueIndex,
                    dataSource,
                    {
                        drawElement: null,
                        slopeAnalysis: null,
                    }
                );
            });
        },
        unmount() {
            let { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.SlopeAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            if (find) {
                this.remove();
            }
            vueCesium.SlopeAnalysisManager.deleteSource(vueKey, vueIndex);
            this.$emit("unload", this);
        },
        /**
         * @description 开启光照
         */
        _enableBrightness() {
            // 开启光照，不然放大地图，分析结果显示异常

            this.isEnableLighting = isEnableLighting(this.viewer);
            if (!this.isEnableLighting) {
                // 未开启光照，开启
                setEnableLighting(true, this.viewer);
            }
            // 调高亮度
            const { viewer } = this;
            this.light = getLight(viewer);
            this.dynamicAtmosphereLighting =
                getDynamicAtmosphereLighting(viewer);
            this.dynamicAtmosphereLightingFromSun =
                getDynamicAtmosphereLightingFromSun(viewer);
            const searchLight = new this.Cesium.DirectionalLight({
                direction: viewer.scene.camera.directionWC, // Updated every frame
                intensity: 2.0,
            });
            setLight(searchLight, viewer);
            setDynamicAtmosphereLighting(false, viewer);
            setDynamicAtmosphereLightingFromSun(false, viewer);
        },
        /**
         * @description 开始绘制并分析
         */
        analysis() {
            let { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.SlopeAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            let { options } = find;
            let { slopeAnalysis, drawElement } = options;
            const { viewer } = this;
            // 初始化交互式绘制控件
            drawElement = drawElement || new this.Cesium.DrawElement(viewer);
            vueCesium.SlopeAnalysisManager.changeOptions(
                vueKey,
                vueIndex,
                "drawElement",
                drawElement
            );

            const { rampColorsCopy } = this;

            const colors = [];
            const ramp = [];
            rampColorsCopy.forEach(({ max, color }) => {
                ramp.push((max / 90).toFixed(2));
                colors.push(color);
            });
            const rampColor = this._transformColor(colors);

            // 激活交互式绘制工具
            drawElement.startDrawingPolygon({
                // 绘制完成回调函数
                callback: (result) => {
                    this.remove();
                    this._enableBrightness(); // 开启光照
                    slopeAnalysis =
                        slopeAnalysis ||
                        new this.Cesium.TerrainAnalyse(viewer, {
                            slopeRampColor: rampColor,
                            slopeRamp: ramp,
                        });
                    slopeAnalysis.changeColorTableDis(ramp,'slope')
                    slopeAnalysis.changeColorTable(rampColor,'slope')
                    slopeAnalysis.updateMaterial("slope");
                    slopeAnalysis.changeAnalyseArea(result.positions);
                    // slopeAnalysis.queryInfo(function(e){
                    //     console.log('sloperesult',e.cursor_slope_angle);
                    // })
                    vueCesium.SlopeAnalysisManager.changeOptions(
                        vueKey,
                        vueIndex,
                        "slopeAnalysis",
                        slopeAnalysis
                    );
                },
            });
        },
        /**
         * @description rgba数组转hex数组
         * @param arrayColor - {Array} rgba数组
         * @return hex数组
         */
        _transformColor(arrayColor) {
            let isNull = false;
            const arr = arrayColor.map((color) => {
                if (color) {
                    return rgbaToHex(color);
                }
                isNull = true;
                return null;
            });
            if (isNull) {
                return [];
            }
            return arr;
        },
        /**
         * @description 移除坡度分析结果，取消交互式绘制事件激活状态
         */
        remove() {
            let { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.SlopeAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            let { options } = find;
            let { slopeAnalysis, drawElement } = options;

            // 判断是否已有坡度分析结果
            if (slopeAnalysis) {
                // 移除坡度分析显示结果
                slopeAnalysis.updateMaterial("none");
                vueCesium.SlopeAnalysisManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "slopeAnalysis",
                    null
                );
            }

            if (drawElement) {
                // 取消交互式绘制矩形事件激活状态
                drawElement.stopDrawing();
                vueCesium.SlopeAnalysisManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "drawElement",
                    null
                );
            }

            // 恢复光照设置
            this._restoreEnableLighting();
        },
        /***
         * 恢复光照设置
         */
        _restoreEnableLighting() {
            const { viewer } = this;
            // 恢复光照开启状态设置
            if (this.isEnableLighting !== undefined) {
                setEnableLighting(this.isEnableLighting, viewer);
            }

            // 恢复brightness参数设置
            if (this.light !== undefined) {
                setLight(this.light, viewer);
            }
            setDynamicAtmosphereLighting(
                this.dynamicAtmosphereLighting,
                viewer
            );
            setDynamicAtmosphereLightingFromSun(
                this.dynamicAtmosphereLightingFromSun,
                viewer
            );
        },
    },
};
</script>
