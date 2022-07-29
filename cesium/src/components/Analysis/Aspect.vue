<template>
    <div>
        <slot>
            <div class="mapgis-widget-aspect-analysis">
                <mapgis-ui-group-tab title="显示模式" />
                <mapgis-ui-radio-group v-model="value">
                    <mapgis-ui-radio :value="1"> 坡向箭头 </mapgis-ui-radio>
                    <mapgis-ui-radio :value="2"> 填充颜色 </mapgis-ui-radio>
                </mapgis-ui-radio-group>
                <mapgis-ui-group-tab title="坡向图例设置" v-show="value === 2">
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
                    :rangeField="'坡向范围'"
                    v-show="value === 2"
                >
                </mapgis-ui-colors-setting>

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
    name: "mapgis-3d-analysis-aspect",
    inject: ["Cesium", "vueCesium", "viewer"],
    props: {
        ...VueOptions,
        /**
         * @type Object
         * @description 坡向分析角度颜色数组
         */
        rampColors: {
            type: Array,
            default: () => {
                return [
                    { min: 0, max: 60, color: "rgba(244, 67, 54, 0.5)" },
                    { min: 60, max: 120, color: "rgba(233, 30, 99, 0.5)" },
                    { min: 120, max: 180, color: "rgba(156, 39, 176, 0.5)" },
                    { min: 180, max: 240, color: "rgba(255, 235, 59, 0.5)" },
                    { min: 240, max: 300, color: "rgba(96, 125, 139, 0.5)" },
                    { min: 300, max: 360, color: "rgba(76, 175, 80, 0.5)" },
                ];
            },
        },
        /**
         * @type Number
         * @description 坡向分析箭头显示结果时箭头的密度
         */
        arrowDensity: {
            type: Number,
            default: 3.0,
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
                { min: 0, max: 60, color: "rgba(244, 67, 54, 0.5)" },
                { min: 60, max: 120, color: "rgba(233, 30, 99, 0.5)" },
                { min: 120, max: 180, color: "rgba(156, 39, 176, 0.5)" },
                { min: 180, max: 240, color: "rgba(255, 235, 59, 0.5)" },
                { min: 240, max: 300, color: "rgba(96, 125, 139, 0.5)" },
                { min: 300, max: 360, color: "rgba(76, 175, 80, 0.5)" },
            ],

            isEnableLighting: undefined, // 光照是否已开启

            light: undefined, // 是否有light对象

            dynamicAtmosphereLighting: undefined,

            dynamicAtmosphereLightingFromSun: undefined,

            info: "坡向分析需要带法线地形。\r\n坡向按照东北西南的顺序表示方向,即0°表示坡向指向正东方向。",

            value: 1,
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
                vueCesium.AspectAnalysisManager.addSource(
                    vueKey,
                    vueIndex,
                    dataSource,
                    {
                        drawElement: null,
                        aspectAnalysis: null,
                    }
                );
            });
        },
        unmount() {
            let { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.AspectAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            if (find) {
                this.remove();
            }
            vueCesium.AspectAnalysisManager.deleteSource(vueKey, vueIndex);
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
            let { vueCesium, vueKey, vueIndex, Cesium } = this;
            let find = vueCesium.AspectAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            let { options } = find;
            let { aspectAnalysis, drawElement } = options;
            const { viewer } = this;
            // 初始化交互式绘制控件
            drawElement = drawElement || new this.Cesium.DrawElement(viewer);
            vueCesium.AspectAnalysisManager.changeOptions(
                vueKey,
                vueIndex,
                "drawElement",
                drawElement
            );
            this._enableBrightness(); // 开启光照

            const { rampColorsCopy } = this;
            const vm = this;

            const colors = [];
            const ramp = [];
            rampColorsCopy.forEach(({ max, color }) => {
                ramp.push((max / 360).toFixed(2));
                colors.push(color);
            });
            const rampColor = this._transformColor(colors);
            let cartesian2 = new Cesium.Cartesian2(
                this.arrowDensity,
                this.arrowDensity
            );

            // 激活交互式绘制工具
            drawElement.startDrawingPolygon({
                // 绘制完成回调函数
                callback: (result) => {
                    vm.remove();
                    vm._enableBrightness(); // 开启光照
                    aspectAnalysis =
                        aspectAnalysis ||
                        new vm.Cesium.TerrainAnalyse(viewer, {
                            aspectRampColor: rampColor,
                            aspectRamp: ramp,
                        });

                    if (vm.value === 1) {
                        //改变坡向箭头的密度
                        aspectAnalysis.changeArrowAspectRepeat(cartesian2);
                        aspectAnalysis.updateMaterial("aspectArrow");
                        aspectAnalysis.changeAnalyseArea(result.positions);
                        // console.log("arrow analysis done");
                    } else {
                        aspectAnalysis.updateMaterial("aspect");
                        aspectAnalysis.changeAnalyseArea(result.positions);
                        // console.log("color analysis done");
                    }

                    vueCesium.AspectAnalysisManager.changeOptions(
                        vueKey,
                        vueIndex,
                        "aspectAnalysis",
                        aspectAnalysis
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
         * @description 移除坡向分析结果，取消交互式绘制事件激活状态
         */
        remove() {
            let { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.AspectAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            let { options } = find;
            let { aspectAnalysis, drawElement } = options;

            // 判断是否已有坡向分析结果
            if (aspectAnalysis) {
                // 移除坡向分析显示结果
                aspectAnalysis.updateMaterial("none");
                vueCesium.AspectAnalysisManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "aspectAnalysis",
                    null
                );
            }

            if (drawElement) {
                // 取消交互式绘制矩形事件激活状态
                drawElement.stopDrawing();
                vueCesium.AspectAnalysisManager.changeOptions(
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
