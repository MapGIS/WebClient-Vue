<template>
    <div
        :class="[
            'edit-wrapper-vshed',
            { right: position === 'right', left: position === 'left' },
        ]"
    >
        <div
            class="card-title"
            :style="{
                background: 'rgb(38, 151, 204)',
                padding: '5px',
                color: 'white',
            }"
        >
            通视分析
        </div>
        <a-card class="box-card-vshed attr-table">
            <div class="starting">
                起始点:
                <div class="inputs">
                    <a-input v-model="form.startLon" :disabled="!form.startLon">
                        <span slot="prefix">经度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="startLonMax"
                        :min="startLonMin"
                        :disabled="!form.startLon"
                        :value="parseFloat(form.startLon)"
                        @change="setInput($event, 'startLon')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.startLat" :disabled="!form.startLat">
                        <span slot="prefix">纬度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="startLatMax"
                        :min="startLatMin"
                        :disabled="!form.startLat"
                        :value="parseFloat(form.startLat)"
                        @change="setInput($event, 'startLat')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.startAlt" :disabled="!form.startAlt">
                        <span slot="prefix">高度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="10"
                        :max="startAltMax"
                        :min="startAltMin"
                        :disabled="!form.startAlt"
                        :value="parseFloat(form.startAlt)"
                        @change="setInput($event, 'startAlt')"
                    />
                </div>
            </div>
            <div class="ending">
                结束点:
                <div class="inputs">
                    <a-input v-model="form.endLon" :disabled="!form.endLon">
                        <span slot="prefix">经度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="endLonMax"
                        :min="endLonMin"
                        :disabled="!form.endLon"
                        :value="parseFloat(form.endLon)"
                        @change="setInput($event, 'endLon')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.endLat" :disabled="!form.endLat">
                        <span slot="prefix">纬度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="0.0001"
                        :max="endLatMax"
                        :min="endLatMin"
                        :disabled="!form.endLat"
                        :value="parseFloat(form.endLat)"
                        @change="setInput($event, 'endLat')"
                    />
                </div>
                <div class="inputs">
                    <a-input v-model="form.endAlt" :disabled="!form.endAlt">
                        <span slot="prefix">高度:</span>
                    </a-input>
                    <a-slider
                        class="input"
                        :step="10"
                        :max="endAltMax"
                        :min="endAltMin"
                        :disabled="!form.endAlt"
                        :value="parseFloat(form.endAlt)"
                        @change="setInput($event, 'endAlt')"
                    />
                </div>
            </div>
            <a-button class="content" type="primary" @click="initSightline"
                >点击绘制</a-button
            >
            <a-button
                class="content-clear"
                type="primary"
                @click="clearSightline"
                >清除</a-button
            >
        </a-card>
    </div>
</template>

<script>
export default {
    name: "mapgis-3d-sightline",
    inject: ["Cesium", "CesiumZondy", "webGlobe"],
    props: {
        index: {
            type: Number,
            default: 0,
        },
        position: {
            type: String,
            default: "right",
        },
    },
    data() {
        return {
            //定义是否正在执行通视分析
            visiblitying: false,
            visiblityAn: false,
            visiblity3daction: false,

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
                let visiblity = window.visiblity[this.index][find.index];
                if (visiblity !== null && typeof visiblity !== "undefined") {
                    if (val.startLon && val.startLat && val.startAlt) {
                        visiblity.viewPosition = Cesium.Cartesian3.fromDegrees(
                            val.startLon,
                            val.startLat,
                            val.startAlt
                        );
                    }
                    if (val.endLon && val.endLat && val.endAlt) {
                        visiblity.targetPosition = Cesium.Cartesian3.fromDegrees(
                            val.endLon,
                            val.endLat,
                            val.endAlt
                        );
                    }
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
            let find = window.visiblity[this.index].find((s, i) => {
                let result = false;
                let { layer } = vm;
                if (s instanceof Cesium.VisiblityAnalysis) {
                    index = i;
                    result = true;
                }
                return result;
            });
            return { index: index, value: find };
        },
        initSightline() {
            const { webGlobe } = this;
            let viewer = webGlobe.viewer;
            let that = this;
            viewer.scene.globe.depthTestAgainstTerrain = true;
            //注册鼠标左键点击事件
            function left(movement) {
                let find = that.findSource();
                let visiblity = window.visiblity[that.index][find.index];
                viewer.scene.globe.enableTransparent = false;
                //判断是否初始化过通视分析类
                if (that.visiblity3daction) {
                    //获取鼠标点击位置
                    var cartesian = viewer.getCartesian3Position(
                        movement.position,
                        cartesian
                    );
                    //第一个点
                    if (cartesian != undefined && !that.visiblitying) {
                        //设置通视分析观察点
                        // visiblity.viewPosition = cartesian;

                        let cartographic = Cesium.Cartographic.fromCartesian(
                            cartesian
                        );
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);
                        //模型高度
                        let height = cartographic.height;
                        that.form.startLon = lng;
                        that.form.startLat = lat;
                        that.form.startAlt = height;

                        viewer.scene.VisualAnalysisManager.add(visiblity);
                        //设置为正在通视分析
                        that.visiblitying = true;

                        that.startLonMin = that.form.startLon - 0.001;
                        that.startLatMin = that.form.startLat - 0.001;
                        that.startAltMin = that.form.startAlt - 100;
                        that.startLonMax = that.form.startLon + 0.001;
                        that.startLatMax = that.form.startLat + 0.001;
                        that.startAltMax = that.form.startAlt + 100;
                    } else {
                        if (that.visiblitying) {
                            //设置通视分析结果点
                            // visiblity.targetPosition = cartesian;
                            //设置为不在通视分析
                            that.visiblitying = false;
                            that.visiblity3daction = false;
                        }
                    }
                }
            }
            //鼠标右键结束
            function right(movement) {
                let find = that.findSource();
                let visiblity = window.visiblity[that.index][find.index];
                //判断是否正在通视分析
                if (that.visiblitying) {
                    //设置通视分析结果点
                    // visiblity.targetPosition = cartesian;
                    //设置不在通视分析
                    that.visiblitying = false;
                    that.visiblity3daction = false;
                }
            }
            //鼠标移动事件
            function move(movement) {
                let find = that.findSource();
                let visiblity = window.visiblity[that.index][find.index];
                //判断是否正在通视分析
                if (that.visiblitying) {
                    //获取鼠标位置
                    var cartesian = viewer.getCartesian3Position(
                        movement.endPosition,
                        cartesian
                    );
                    if (cartesian) {
                        //设置通视分析结果点
                        // visiblity.targetPosition = cartesian;

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

                        that.endLonMin = that.form.endLon - 0.001;
                        that.endLatMin = that.form.endLat - 0.001;
                        that.endAltMin = that.form.endAlt - 100;
                        that.endLonMax = that.form.endLon + 0.001;
                        that.endLatMax = that.form.endLat + 0.001;
                        that.endAltMax = that.form.endAlt + 100;
                    }
                }
            }
            if (that.visiblityAn === false) {
                window.visiblity[that.index].push(
                    new Cesium.VisiblityAnalysis(viewer.scene)
                );
                //获取三位场景视图对象
                that.visiblityAn = true;
                that.visiblitying = false;
                that.visiblity3daction = true;
                //注册事件
                webGlobe.registerMouseEvent("LEFT_CLICK", left);
                webGlobe.registerMouseEvent("RIGHT_CLICK", right);
                webGlobe.registerMouseEvent("MOUSE_MOVE", move);
            }
        },
        clearSightline() {
            const { webGlobe } = this;
            let that = this;
            let find = that.findSource();
            webGlobe.viewer.scene.globe.depthTestAgainstTerrain = true;
            if (that.visiblityAn === true) {
                //注销事件
                webGlobe.unRegisterMouseEvent("LEFT_CLICK");
                webGlobe.unRegisterMouseEvent("RIGHT_CLICK");
                webGlobe.unRegisterMouseEvent("MOUSE_MOVE");
                //移除通视分析结果
                webGlobe.viewer.scene.VisualAnalysisManager.remove(
                    window.visiblity[this.index][find.index]
                );
                that.visiblityAn = false;
                that.visiblitying = false;
                that.visiblity3daction = false;
                //销毁通视分析类
                delete window.visiblity[this.index][find.index];
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
        window.visiblity = window.visiblity || [[], []];
    },
    destroyed() {
        const { webGlobe } = this;
        let find = this.findSource();
        webGlobe.viewer.scene.VisualAnalysisManager.remove(
            window.visiblity[this.index][find.index]
        );
        delete window.visiblity;
        window.visiblity = [[], []];
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