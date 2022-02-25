<template>
    <div class="effect-setting">
        <mapgis-ui-row>
            <mapgis-ui-col :span="12">
                <mapgis-ui-switch-panel
                    size="small"
                    label="黑白照片"
                    :checked="blckWhite"
                    @changeChecked="blackAndWhiteChange"
                />
            </mapgis-ui-col>
            <mapgis-ui-col :span="12">
                <mapgis-ui-switch-panel
                    size="small"
                    label="夜视效果"
                    :checked="ntVision"
                    @changeChecked="nightVision"
                />
            </mapgis-ui-col>
        </mapgis-ui-row>

        <div class="dividerWrapper"><div class="divider" /></div>

        <mapgis-ui-switch-panel
            size="small"
            label="场景泛光"
            :checked="bloom"
            @changeChecked="enableBloom"
        >
            <mapgis-ui-input-number-panel
                size="small"
                label="亮度"
                :value="bloomBrt"
                :range="bloomBrtRange"
                :step="0.05"
                @change="bloomBrtChange"
            />
            
            <mapgis-ui-input-number-panel
                size="small"
                label="对比度"
                :value="bloomCtrst"
                :range="bloomCtrstRange"
                :step="10"
                @change="bloomCtrstChange"
            />
        </mapgis-ui-switch-panel>
    </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
    name: "EffectSetting",
    mixins: [ServiceLayer],
    data() {
        return {
            bloom: false,
            bloomParams: undefined,
            bloomBrt: -0.3,
            bloomBrtRange: [-0.6, 0.2],
            bloomCtrst: 128,
            bloomCtrstRange: [-255, 255],

            blckWhite: false,
            ntVision: false,
        };
    },
    methods: {
        /*
         * 场景泛光
         * */
        enableBloom(e) {
            const { viewer } = this;
            this.bloom = e;
            this.$emit("updateSpin", true);
            let vm = this;

            setTimeout(function () {
                viewer.scene.postProcessStages.bloom.enabled = vm.bloom;
                vm.$emit("updateSpin", false);
            }, 400);
        },
        /*
         * 泛光亮度
         * */
        bloomBrtChange(e) {
            const { viewer } = this;
            this.bloomBrt = e;
            viewer.scene.postProcessStages.bloom.uniforms.brightness =
                this.bloomBrt;
        },
        /*
         * 泛光对比度
         * */
        bloomCtrstChange(e) {
            const { viewer } = this;
            this.bloomCtrst = e;
            viewer.scene.postProcessStages.bloom.uniforms.contrast =
                this.bloomCtrst;
        },

        //黑白照片
        blackAndWhiteChange(e) {
            const { viewer, Cesium } = this;
            this.blckWhite = e;
            let vm = this;
            if (vm.blckWhite) {
                vm.removeOtherStages();

                let blackAndWhite = viewer.scene.postProcessStages.add(
                    Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
                );
                blackAndWhite.uniforms.gradations = 5.0; //(灰度级数)
            } else {
                vm.removeOtherStages();
            }
        },
        //夜视效果
        nightVision(e) {
            const { viewer, Cesium } = this;
            this.ntVision = e;
            let vm = this;
            if (vm.ntVision) {
                vm.removeOtherStages();
                viewer.scene.postProcessStages.add(
                    Cesium.PostProcessStageLibrary.createNightVisionStage()
                );
            } else {
                vm.removeOtherStages();
            }
        },
        removeOtherStages() {
            const { viewer } = this;
            let length = viewer.scene.postProcessStages._activeStages.length;

            if (length > 0) {
                viewer.scene.postProcessStages.removeAll();
            }
        },
    },
};
</script>

<style scoped>
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(odd) .mapgis-ui-switch-panel {
    padding-right: 10px;
}

::v-deep
    .mapgis-ui-row
    .mapgis-ui-col:nth-child(even)
    .mapgis-ui-switch-panel::before {
    content: "";
    display: block;
    width: 1px;
    height: 14px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0;
    background: #dcdcdc;
}

::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(even) .mapgis-ui-switch-panel {
    padding-left: 10px;
}

.dividerWrapper {
    height: 13px;
}
.divider {
    display: block;
    height: 1px;
    position: absolute;
    left: 16px;
    right: 16px;
    margin: 6px 0;
    background: #f0f0f0;
}
</style>