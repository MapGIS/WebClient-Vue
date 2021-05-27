<template>
    <div :class="['edit-wrapper-vshed', {right: position === 'right', left: position === 'left'}]">
        <div
            class="card-title"
            :style="{
                background: 'rgb(38, 151, 204)',
                padding: '5px',
                color: 'white',
            }"
        >
            可视域分析
        </div>
        <a-card class="box-card-vshed attr-table">
            <div class="starting">
                起始点:
                <div class="inputs">
                    <a-input v-model="form.startLon">
                        <span slot="prefix">经度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="startLonMax"
                        :min="startLonMin"
                        :value="startLonMin + (startLonMax - startLonMin) / 2"
                        @change="setInput($event, 'startLon')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.startLat">
                        <span slot="prefix">纬度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="startLatMax"
                        :min="startLatMin"
                        :value="startLatMin + (startLatMax - startLatMin) / 2"
                        @change="setInput($event, 'startLat')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.startAlt">
                        <span slot="prefix">高度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="10"
                        :max="startAltMax"
                        :min="startAltMin"
                        :value="startAltMin + (startAltMax - startAltMin) / 2"
                        @change="setInput($event, 'startAlt')"
                    />
                </div>
            </div>
            <div class="ending">
                结束点:
                <div class="inputs">
                    <a-input v-model="form.endLon">
                        <span slot="prefix">经度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="endLonMax"
                        :min="endLonMin"
                        :value="endLonMin + (endLonMax - endLonMin) / 2"
                        @change="setInput($event, 'endLon')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.endLat">
                        <span slot="prefix">纬度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="endLatMax"
                        :min="endLatMin"
                        :value="endLatMin + (endLatMax - endLatMin) / 2"
                        @change="setInput($event, 'endLat')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.endAlt">
                        <span slot="prefix">高度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="10"
                        :max="endAltMax"
                        :min="endAltMin"
                        :value="endAltMin + (endAltMax - endAltMin) / 2"
                        @change="setInput($event, 'endAlt')"
                    />
                </div>
            </div>
            <a-button class="content" type="primary" @click="startViewshed"
                >点击绘制</a-button
            >
            <a-button
                class="content-clear"
                type="primary"
                @click="clearViewshed"
                >清除</a-button
            >
        </a-card>
    </div>
</template>

<script>
import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

export default {
    name: "mapgis-3d-viewshed",
    props: {
        index: { 
            type: Number,
            default: 0 
        },
        position: {
            type: String,
            default: "right"
        }
    },
    inject: ["Cesium", "CesiumZondy", "webGlobe"],
    data() {
        return {
            //定义鼠标事件类
            viewshedAn: false,
            viewshed3daction: false,
            viewshed3ding: false,

            startLonMin: 0,
            startLatMin: 0,
            startAltMin: 0,
            endLonMin: 0,
            endLatMin: 0,
            endAltMin: 0,
            startLonMax: 0,
            startLatMax: 0,
            startAltMax: 0,
            endLonMax: 0,
            endLatMax: 0,
            endAltMax: 0,
            form: {
                startLon: 0,
                startLat: 0,
                startAlt: 0,
                endLon: 0,
                endLat: 0,
                endAlt: 0,
            },
        };
    },
    watch: {
        form: {
            deep: true,
            handler: function (val) {
                let find = this.findSource();
                let vshed3d = window.viewshed3d[this.index][find.index];
                if (vshed3d !== null && typeof vshed3d !== "undefined") {
                    vshed3d.viewPosition = Cesium.Cartesian3.fromDegrees(
                        val.startLon,
                        val.startLat,
                        val.startAlt
                    );
                    vshed3d.targetPosition = Cesium.Cartesian3.fromDegrees(
                        val.endLon,
                        val.endLat,
                        val.endAlt
                    );
                }
            },
        },
    },
    methods: {
        setInput(event, data) {
            this.form[data] = event;
        },
        findSource() {
            const vm = this;
            let index = -1;
            let find = window.viewshed3d[this.index].find((s, i) => {
                let result = false;
                let { layer } = vm;
                if (s instanceof Cesium.ViewshedAnalysis) {
                    index = i;
                    result = true;
                }
                return result;
            });
            return { index: index, value: find };
        },
        startViewshed() {
            let that = this;
            let viewer = that.webGlobe.viewer;
            viewer.scene.globe.depthTestAgainstTerrain = true;
            function left(movement) {
                let find = that.findSource();
                let vshed3d = window.viewshed3d[that.index][find.index];
                console.log(window.viewshed3d);
                that.webGlobe.viewer.scene.globe.enableTransparent = false;
                // window.webGlobe.viewer.scene.globe
                if (that.viewshedAn) {
                    // 可视域分析
                    if (that.viewshed3daction) {
                        //获取鼠标位置
                        let cartesian = viewer.getCartesian3Position(
                            movement.position,
                            cartesian
                        );
                        if (cartesian !== undefined && !that.viewshed3ding) {
                            cartesian.x += 3.6;
                            let cartographic = Cesium.Cartographic.fromCartesian(
                                cartesian
                            );
                            let lng = Cesium.Math.toDegrees(
                                cartographic.longitude
                            );
                            let lat = Cesium.Math.toDegrees(
                                cartographic.latitude
                            );
                            //模型高度
                            let height = cartographic.height;
                            that.form.startLon = lng;
                            that.form.startLat = lat;
                            that.form.startAlt = height;
                            //设置观察点坐标
                            vshed3d.viewPosition = cartesian;
                            //添加可视域分析结果显示
                            viewer.scene.VisualAnalysisManager.add(vshed3d);
                            that.viewshed3ding = true;
                        } else {
                            //设置可视域结果点
                            vshed3d.targetPosition = cartesian;

                            let cartographic = Cesium.Cartographic.fromCartesian(
                                cartesian
                            );
                            let lng = Cesium.Math.toDegrees(
                                cartographic.longitude
                            );
                            let lat = Cesium.Math.toDegrees(
                                cartographic.latitude
                            );
                            //模型高度
                            let height = cartographic.height;
                            that.form.endLon = lng;
                            that.form.endLat = lat;
                            that.form.endAlt = height;
                            that.viewshed3daction = false;
                            that.viewshed3ding = false;

                            that.startLonMin = that.form.startLon - 0.001;
                            that.startLatMin = that.form.startLat - 0.001;
                            that.startAltMin = that.form.startAlt - 100;
                            that.endLonMin = that.form.endLon - 0.001;
                            that.endLatMin = that.form.endLat - 0.001;
                            that.endAltMin = that.form.endAlt - 100;
                            that.startLonMax = that.form.startLon + 0.001;
                            that.startLatMax = that.form.startLat + 0.001;
                            that.startAltMax = that.form.startAlt + 100;
                            that.endLonMax = that.form.endLon + 0.001;
                            that.endLatMax = that.form.endLat + 0.001;
                            that.endAltMax = that.form.endAlt + 100;
                        }
                        //viewshed3ding = true;
                    }
                }
            }
            //鼠标右键结束
            function right(movement) {
                let find = that.findSource();
                let vshed3d = window.viewshed3d[that.index][find.index];
                if (that.viewshed3ding) {
                    let cartesian = viewer.getCartesian3Position(
                        movement.position,
                        cartesian
                    );
                    if (that.viewshedAn) {
                        if (cartesian) {
                            //设置可视域结果点
                            vshed3d.targetPosition = cartesian;
                        } else {
                            vshed3d.targetPoint = cartesian;
                        }

                        let cartographic = Cesium.Cartographic.fromCartesian(
                            cartesian
                        );
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);
                        //模型高度
                        let height = cartographic.height;
                        that.form.endLon = lng;
                        that.form.endLat = lat;
                        that.form.endAlt = height;

                        that.startLonMin = that.form.startLon - 0.001;
                        that.startLatMin = that.form.startLat - 0.001;
                        that.startAltMin = that.form.startAlt - 100;
                        that.endLonMin = that.form.endLon - 0.001;
                        that.endLatMin = that.form.endLat - 0.001;
                        that.endAltMin = that.form.endAlt - 100;
                        that.startLonMax = that.form.startLon + 0.001;
                        that.startLatMax = that.form.startLat + 0.001;
                        that.startAltMax = that.form.startAlt + 100;
                        that.endLonMax = that.form.endLon + 0.001;
                        that.endLatMax = that.form.endLat + 0.001;
                        that.endAltMax = that.form.endAlt + 100;
                        that.viewshed3daction = false;
                        that.viewshed3ding = false;
                    }
                }
            }

            function move(movement) {
                let find = that.findSource();
                let vshed3d = window.viewshed3d[that.index][find.index];
                if (that.viewshed3ding) {
                    let cartesian = viewer.getCartesian3Position(
                        movement.endPosition,
                        cartesian
                    );
                    if (cartesian) {
                        vshed3d.targetPosition = cartesian;
                        let cartographic = Cesium.Cartographic.fromCartesian(
                            cartesian
                        );
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);
                        //模型高度
                        let height = cartographic.height;
                        that.form.endLon = lng;
                        that.form.endLat = lat;
                        that.form.endAlt = height;
                    }
                }
            }
            if (that.viewshedAn === false) {
                //获取三位场景视图对象
                that.viewshedAn = true;
                //可视域分析（新）

                window.viewshed3d[that.index].push(
                    new Cesium.ViewshedAnalysis(viewer.scene)
                );
                that.viewshed3daction = true;
                that.viewshed3ding = false;

                //注册事件
                that.webGlobe.registerMouseEvent("LEFT_CLICK", left);
                that.webGlobe.registerMouseEvent("RIGHT_CLICK", right);
                that.webGlobe.registerMouseEvent("MOUSE_MOVE", move);
            }
        },
        clearViewshed() {
            let that = this;
            let viewer = that.webGlobe.viewer;
            let find = that.findSource();
            viewer.scene.globe.depthTestAgainstTerrain = true;
            if (that.viewshedAn === true) {
                that.webGlobe.unRegisterMouseEvent("LEFT_CLICK");
                that.webGlobe.unRegisterMouseEvent("MOUSE_MOVE");
                that.webGlobe.unRegisterMouseEvent("RIGHT_CLICK");

                // window.webGlobe.viewer.entities.removeById("vshedPos");
                viewer.scene.VisualAnalysisManager.remove(
                    window.viewshed3d[this.index][find.index]
                );
                that.viewshedAn = false;
                that.viewshed3daction = false;
                that.viewshed3ding = false;
                //定义可视域分析类
                delete window.viewshed3d[this.index][find.index];
                that.form.endLon = 0;
                that.form.endLat = 0;
                that.form.endAlt = 0;
                that.form.startLon = 0;
                that.form.startLat = 0;
                that.form.startAlt = 0;

                that.startLonMin = 0;
                that.startLatMin = 0;
                that.startAltMin = 0;
                that.endLonMin = 0;
                that.endLatMin = 0;
                that.endAltMin = 0;
                that.startLonMax = 0;
                that.startLatMax = 0;
                that.startAltMax = 0;
                that.endLonMax = 0;
                that.endLatMax = 0;
                that.endAltMax = 0;
            }
        },
    },
    mounted() {
        // const { window.webGlobe, Cesium } = this
        // let that = this
        window.viewshed3d = window.viewshed3d || [[], []];
    },
    destroyed() {
        delete window.viewshed3d;
        window.viewshed3d = [[], []];
    },
};
</script>


<style scoped>
::v-deep .ant-card-body {
    max-height: 300px;
    overflow: auto;
}
::v-deep .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 45px;
}
.edit-wrapper-vshed.right {
    position: absolute;
    top: 20px;
    right: 20px;
}
.edit-wrapper-vshed.left {
    position: absolute;
    top: 20px;
    left: 20px;
}
</style>