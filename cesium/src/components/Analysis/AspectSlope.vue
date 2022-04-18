<template>
    <div class="aspect-slope-analysis">
        <mapgis-ui-switch-panel
            size="default"
            label="坡度分析"
            v-model="slopeFill"
            class="paddingStyle"
        >
            <mapgis-ui-group-tab title="坡向图例设置" class="slope-parameter-title" :hasTopMargin="false" :hasBottomMargin="false">
                <mapgis-ui-tooltip slot="tip" placement="top">
                    <template slot="title">
                        <span>{{ info }}</span>
                    </template>
                    <mapgis-ui-iconfont
                        type="mapgis-info"
                        style="right: 0"
                    ></mapgis-ui-iconfont>
                </mapgis-ui-tooltip>
            </mapgis-ui-group-tab>
            <mapgis-ui-colors-setting
                v-model="rampColorsCopy"
                :rangeField="'坡度范围'"
            />
        </mapgis-ui-switch-panel>

        <div class="dividerWrapper"><div class="divider" /></div>

        <mapgis-ui-switch-panel
            size="default"
            label="坡向分析"
            v-model="aspectArrow"
            class="paddingStyle"
        >
            <mapgis-ui-input-number-panel
                v-model="arrowRepeat"
                size="large"
                :slider="true"
                :range="[1, 10]"
                label="箭头密度"
            />
        </mapgis-ui-switch-panel>

        <mapgis-ui-setting-footer>
            <mapgis-ui-button
                type="primary"
                @click="analysis"
                :disabled="!displayOption"
                >分析</mapgis-ui-button
            >
            <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>

        <span>
            <Popup v-model="visible" :position="position" forceRender>
                <PopupContent
                    :currentLayerInfo="currentClickInfo"
                ></PopupContent>
            </Popup>
        </span>
    </div>
</template>

<script>
import aspect from "./Aspect.vue";
import slope from "./Slope.vue";
import Popup from "../UI/Popup/Popup.vue";
import PopupContent from "../UI/Geojson/Popup.vue";

export default {
    name: "mapgis-3d-aspect-slope",
    inject: ["Cesium", "vueCesium", "viewer"],
    mixins: [aspect, slope],
    components: {
        Popup,
        PopupContent,
    },
    watch: {
        displayOption(newOpt) {
            if (!newOpt) {
                this.$message.warning("请至少开启一种分析");
                return;
            }
            let options = this.getManagerOptions();
            let { aspectSlopeAnalysis } = options;
            // 判断是否已有坡度分析结果
            if (aspectSlopeAnalysis) {
                // 坡度分析显示结果
                aspectSlopeAnalysis.updateMaterial(newOpt);
            }
        },
        aspectArrow: {
            handler: function (e) {
                const { slopeFill } = this;
                const vm = this;
                if (e) {
                    if (slopeFill) {
                        vm.displayOption = "arrowAspectSlope";
                    } else {
                        vm.displayOption = "aspectArrow";
                    }
                } else {
                    if (slopeFill) {
                        vm.displayOption = "slope";
                    } else {
                        vm.displayOption = undefined;
                    }
                }
            },
            immediate: true,
        },
        slopeFill: {
            handler: function (e) {
                const { aspectArrow } = this;
                const vm = this;

                if (e) {
                    if (aspectArrow) {
                        vm.displayOption = "arrowAspectSlope";
                    } else {
                        vm.displayOption = "slope";
                    }
                } else {
                    if (aspectArrow) {
                        vm.displayOption = "aspectArrow";
                    } else {
                        vm.displayOption = undefined;
                    }
                }
            },
            immediate: true,
        },
        arrowRepeat() {
            let options = this.getManagerOptions();
            let { aspectSlopeAnalysis } = options;

            if (aspectSlopeAnalysis) {
                aspectSlopeAnalysis.aspectArrowRepeat =
                    new this.Cesium.Cartesian2(
                        this.arrowRepeat,
                        this.arrowRepeat
                    );
            }
        },
    },
    data() {
        return {
            aspectArrow: true,
            slopeFill: true,
            arrowRepeat: 1.0,
            displayOption: "arrowAspectSlope", //"aspectArrow", "slope", "arrowAspectSlope"

            //popup参数设置
            currentClickInfo: undefined,
            visible: false,
            position: {
                longitude: 110,
                latitude: 30,
                height: 0,
            },
        };
    },
    mounted() {
        this.mount();
    },
    destroyed() {
        this.unmount();
    },
    methods: {
        mount() {
            const { vueCesium, vueKey, vueIndex, viewer } = this;
            const vm = this;
            let promise = this.createCesiumObject();
            promise.then(function (dataSource) {
                vm.$emit("loaded", vm);
                let handler = new Cesium.ScreenSpaceEventHandler(
                    viewer.scene.canvas
                );
                vueCesium.AspectSlopeAnalysisManager.addSource(
                    vueKey,
                    vueIndex,
                    dataSource,
                    {
                        drawElement: null,
                        aspectSlopeAnalysis: null,
                        cesiumHandler: handler,
                    }
                );
            });
        },
        unmount() {
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.AspectSlopeAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            if (find) {
                this.remove();
                let options = this.getManagerOptions();
                options.cesiumHandler =
                    options.cesiumHandler && options.cesiumHandler.destroy();
            }
            vueCesium.AspectSlopeAnalysisManager.deleteSource(vueKey, vueIndex);
            this.$emit("unload", this);
        },
        /**
         * @description 开始绘制并分析
         */
        analysis() {
            const {
                vueCesium,
                vueKey,
                vueIndex,
                viewer,
                Cesium,
                rampColorsCopy,
            } = this;
            const vm = this;

            this.remove();

            let options = this.getManagerOptions();

            let { aspectSlopeAnalysis, drawElement, cesiumHandler } = options;
            // 初始化交互式绘制控件
            drawElement = drawElement || new Cesium.DrawElement(viewer);
            vueCesium.AspectSlopeAnalysisManager.changeOptions(
                vueKey,
                vueIndex,
                "drawElement",
                drawElement
            );
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
                    drawElement.stopDrawing();
                    this._enableBrightness(); // 开启光照
                    aspectSlopeAnalysis =
                        aspectSlopeAnalysis ||
                        new Cesium.TerrainAnalyse(viewer, {
                            slopeRampColor: rampColor,
                            slopeRamp: ramp,
                        });

                    aspectSlopeAnalysis.changeColorTable(rampColor,'slope')
                    aspectSlopeAnalysis.changeColorTableDis(ramp,'slope')
                    aspectSlopeAnalysis.updateMaterial(vm.displayOption);
                    aspectSlopeAnalysis.changeAnalyseArea(result.positions);
                    var cartesian2 = new Cesium.Cartesian2(
                        vm.arrowRepeat,
                        vm.arrowRepeat
                    );
                    aspectSlopeAnalysis.changeArrowAspectRepeat(cartesian2);

                    aspectSlopeAnalysis.queryInfo(vm.handleQueryResult);

                    //监听右击事件 设置popup的弹出位置
                    cesiumHandler.setInputAction(function (ev) {
                        //阻止浏览器默认的右键菜单行为
                        document.oncontextmenu = function () {
                            return false;
                        };

                        //获取点的经纬度坐标
                        let cartesian = viewer.scene.globe.pick(
                            viewer.camera.getPickRay(ev.position),
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
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    vueCesium.AspectSlopeAnalysisManager.changeOptions(
                        vueKey,
                        vueIndex,
                        "aspectSlopeAnalysis",
                        aspectSlopeAnalysis
                    );
                },
            });
        },
        handleQueryResult(e) {
            const { viewer } = this;
            const vm = this;

            let aspectAngle = parseFloat(e.cursor_aspect_angle);
            let slopeAngle = parseFloat(e.cursor_slope_angle);
            //设置popup的内容
            this.currentClickInfo = [
                {
                    // title:"阴影率信息",
                    properties: {
                        坡向: aspectAngle + "°",
                        坡度: slopeAngle + "°",
                    },
                },
            ];
            //显示popup
            this.visible = true;
        },
        /**
         * @description 获取管理器中的选项
         */
        getManagerOptions() {
            const { vueCesium, vueKey, vueIndex } = this;
            let find = vueCesium.AspectSlopeAnalysisManager.findSource(
                vueKey,
                vueIndex
            );
            let { options } = find;
            return options;
        },
        /**
         * @description 移除坡度分析结果，取消交互式绘制事件激活状态
         */
        remove() {
            const { vueCesium, vueKey, vueIndex } = this;
            const vm = this;
            let options = this.getManagerOptions();

            let { aspectSlopeAnalysis, drawElement, cesiumHandler } = options;

            // 判断是否已有坡度分析结果
            if (aspectSlopeAnalysis) {
                // 移除坡度分析显示结果
                aspectSlopeAnalysis.removeQueryInfo();
                vm.visible = false;
                aspectSlopeAnalysis.updateMaterial("none");

                vueCesium.AspectSlopeAnalysisManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "aspectSlopeAnalysis",
                    null
                );
            }

            if (drawElement) {
                // 取消交互式绘制矩形事件激活状态
                drawElement.stopDrawing();
                vueCesium.AspectSlopeAnalysisManager.changeOptions(
                    vueKey,
                    vueIndex,
                    "drawElement",
                    null
                );
            }

            cesiumHandler.removeInputAction(
                Cesium.ScreenSpaceEventType.RIGHT_CLICK
            );

            // 恢复光照设置
            this._restoreEnableLighting();
        },
    },
};
</script>

<style scoped>
.aspect-slope-analysis {
    /* padding: 10px; */
}
.paddingStyle {
    /* padding: 10px 6px; */
}

.slope-parameter-title {
    /* display: flex;
    padding: 6px;
    font-size: 12px;
    font-weight: 700;
    justify-content: space-between;
    align-items: center; */
}

::v-deep .mapgis-popup-row-container {
    height: fit-content;
}

::v-deep .mapgis-popup-row {
    min-width: 150px;
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

.dividerWrapper {
    height: 13px;
}
.divider {
    display: block;
    height: 1px;
    /* position: absolute; */
    left: 16px;
    right: 16px;
    margin: 6px 0;
    background: #f0f0f0;
}
</style>
