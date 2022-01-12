<template>
    <div>
        <mapgis-ui-card
            size="small"
            hoverable
            :style="{ width: '500px' }"
            class="ponding-simulation-timeline"
        >
            <label class="title-label">倍速播放时间</label>
            <mapgis-ui-radio-group v-model="pondingTime">
                <mapgis-ui-radio :value="1"> 1s </mapgis-ui-radio>
                <mapgis-ui-radio :value="2"> 2s </mapgis-ui-radio>
                <mapgis-ui-radio :value="4"> 4s </mapgis-ui-radio>
                <mapgis-ui-radio :value="8"> 8s </mapgis-ui-radio>
                <mapgis-ui-radio :value="86400"> 24h </mapgis-ui-radio>
            </mapgis-ui-radio-group>

            <mapgis-ui-slider
                :tip-formatter="formatter"
                :min="0"
                :max="24"
                v-model="sliderValue"
                :marks="marks"
                :step="1"
            ></mapgis-ui-slider>
            <span class="ponding-simulation-timeline-starttime"
                >起始时间：{{ startTimeCopy }}</span
            >
            <div class="ponding-simulation-timeline-toolbar">
                <!-- <mapgis-ui-tooltip>
                    <template slot="title"> 跳转至开头 </template>
                    <mapgis-ui-iconfont
                        type="mapgis-chevrons-left"
                        @click.capture.stop="JumpToBegin"
                    />
                </mapgis-ui-tooltip> -->
                <!-- <mapgis-ui-tooltip>
                    <template slot="title"> 快退一步 </template>
                    <mapgis-ui-iconfont
                        type="mapgis-chevron-left"
                        @click.capture.stop="stepBack"
                    />
                </mapgis-ui-tooltip> -->

                <mapgis-ui-iconfont
                    :class="pond ? 
                      'mapgis-iconfont-disabled': 'mapgis-iconfont'
                    "
                    type="mapgis-play-circle-fill"
                    class="ponding-simulation-timeline-toolbar-main"
                    @click.capture.stop="addflood"
                />
                <!-- <mapgis-ui-iconfont
                    v-else
                    type="mapgis-zanting"
                    class="ponding-simulation-timeline-toolbar-main"
                    @click.capture.stop="stopFlood"
                /> -->
                <!-- <mapgis-ui-tooltip>
                    <template slot="title"> 快进一步 </template>
                    <mapgis-ui-iconfont
                        type="mapgis-chevron-right"
                        @click.capture.stop="stepForward"
                    />
                </mapgis-ui-tooltip> -->
                <!-- <mapgis-ui-tooltip>
                    <template slot="title"> 跳转至结尾 </template>
                    <mapgis-ui-iconfont
                        type="mapgis-chevrons-right"
                        @click.capture.stop="JumpToEnd"
                    />
                </mapgis-ui-tooltip> -->
            </div>
            <span class="ponding-simulation-timeline-endtime"
                >结束时间：{{ endTimeCopy }}</span
            >
        </mapgis-ui-card>
    </div>
</template>

<script>
export default {
    name: "mapgis-3d-ponding-simulation-timeline",
    inject: ["Cesium", "vueCesium", "viewer"],
    props: {
        value: {
            type: Number,
            default: 0,
        },
        pond: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        value(e) {
            this.sliderValue = e;
        },
        pondingTime: {
            handler: function (e) {
                this.$emit("updateTime", e);
            },
            immediate: true,
        },
    },
    data() {
        return {
            startTimeCopy: "0:00",
            endTimeCopy: "24:00",
            sliderValue: this.value,
            marks: {
                0: "0:00",
                4: "4:00",
                8: "8:00",
                12: "12:00",
                16: "16:00",
                20: "20:00",
                24: "24:00",
            },

            //积水上涨的时间
            pondingTime: 4,
        };
    },
    mounted() {
        this.mount();
    },
    beforeDestroy() {
        this.unmount();
    },
    methods: {
        mount() {
            this.$emit("loaded", this);
        },
        unmount() {
            let vm = this;
            vm.sliderValue = 0;
        },
        formatter(value) {
            return `${value}:00`;
        },
        
        /* 开始播放 */
        addflood() {
            this.$emit("play");
        },
        // /* 跳转至开始 */
        // JumpToBegin(e) {
        //     if (this.timer) {
        //         clearInterval(this.timer);
        //     }
        //     this.sliderValue = 0;
        //     this.maxHeightCopy = this.startHeightCopy;
        //     console.log("JumpToBegin", e);
        // },

        // /* 回退一步 */
        // stepBack(e) {
        //     if (this.sliderValue == 0) return;
        //     this.sliderValue -= 24 * (0.5 / this.pondingTime);
        //     console.log("stepBack", e);
        // },

        // /* 暂停分析 */
        // stopFlood() {
        //     console.log("stopFlood");

        //     const options = this._getSourceOptions();
        //     const { floodAnalysis } = options;
        //     console.log("stopFlood", floodAnalysis);
        //     if (this.timer) {
        //         clearInterval(this.timer);
        //     }
        //     this.maxHeightCopy =
        //         (this.sliderValue / 24) *
        //             (this.currentMaxHeight - this.startHeightCopy) +
        //         this.startHeightCopy;
        //     this.pond = false;
        // },

        // /* 快进一步 */
        // stepForward(e) {
        //     if (this.sliderValue >= 24) return;
        //     this.sliderValue += 24 * (0.5 / this.pondingTime);

        //     console.log("stepForward", e);
        // },

        // /* 跳转至结尾 */
        // JumpToEnd() {
        //     if (this.currentSpeed) {
        //         this.sliderValue = 24;
        //         // this.floodSpeedCopy = this.floodSpeedCopy * (this.pondingTime / 0.1);
        //         this.maxHeightCopy = this.currentMaxHeight;

        //         // this._removeFlood();
        //         // this._doAnalysis();
        //     } else {
        //         this.$message.warning("请先进行分析！");
        //     }
        // },
    },
};
</script>

<style scoped>
.ponding-simulation-timeline {
    position: absolute;
    bottom: 10px;
    left: 10px;
}

.ponding-simulation-timeline-toolbar {
    display: flex;
    width: 110px;
    margin: 0px auto;
}

.ponding-simulation-timeline-toolbar-main:hover {
    color: #49a8ff;
}

.ponding-simulation-timeline-toolbar-main {
    color: #1890ff;
}

.ponding-simulation-timeline-toolbar > .anticon {
    font-size: 22px;
}

.mapgis-ui-card-small > .mapgis-ui-card-body {
    padding: 6px 12px;
}

.ponding-simulation-timeline-starttime {
    position: absolute;
    left: 10px;
}

.ponding-simulation-timeline-endtime {
    position: absolute;
    right: 10px;
    bottom: 12px;
}

.title-label {
    padding: 6px;
    font-size: 14px;
    font-weight: 700;
}

.mapgis-iconfont-disabled{
    cursor: not-allowed;
}
</style>