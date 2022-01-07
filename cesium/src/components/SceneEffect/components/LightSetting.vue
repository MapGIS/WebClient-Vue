<template>
    <div class="light-setting">
        <mapgis-ui-form-model
            :layout="layout"
            v-bind="formItemLayout"
            labelAlign="left"
            class="formStyle"
            :colon="false"
        >
            <mapgis-ui-switch-panel
                size="small"
                label="太阳光照"
                :checked="sunlight"
                @changeChecked="enableSunlight"
            >
                <mapgis-ui-color-pick-panel
                    label="光照颜色"
                    :color="lightColor"
                    :disableAlpha="false"
                    @input="
                        (val) =>
                            (lightColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
                    "
                >
                </mapgis-ui-color-pick-panel>
            </mapgis-ui-switch-panel>
        </mapgis-ui-form-model>
    </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
    name: "SceneEffect",
    mixins: [ServiceLayer],
    props: {
        layout: {
            type: String,
            default: "horizontal", // 'horizontal' 'vertical' 'inline'
        },
    },
    data() {
        return {
            sunlight: false,
            sunlightParams: undefined,
            // 光照颜色
            lightColor: "rgba(255,255,255,255)",
        };
    },
    computed: {
        formItemLayout({ layout }) {
            return layout === "horizontal"
                ? {
                      labelCol: { span: 7 },
                      wrapperCol: { span: 17 },
                  }
                : {};
        },
    },
    watch: {
        lightColor: {
            handler: function (newColor) {
                this.lightColorChange(newColor);
            },
            deep: true,
        },
    },
    methods: {
        //太阳
        enableSunlight(e) {
            const { viewer } = this;
            this.sunlight = e;
            this.$emit("updateSpin", true);
            let vm = this;

            if (vm.sunlight) {
                this.sunlightParams = "40px";
            } else {
                this.sunlightParams = "0px";
            }

            setTimeout(function () {
                viewer.scene.globe.enableLighting = vm.sunlight;
                // var sunLight = new Cesium.SunLight({color:Cesium.Color.RED});
                // viewer.scene.light = sunLight
                vm.$emit("updateSpin", false);
            }, 400);
        },
        //光照颜色
        lightColorChange(e) {
            const { Cesium } = this;
            let color = Cesium.Color.fromCssColorString(e);
            let sunLight = new Cesium.SunLight({ color: color });
            viewer.scene.light = sunLight;
        },
    },
};
</script>

<style scoped>
</style>