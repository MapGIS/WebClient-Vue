<template>
    <div class="camera-setting">
        <mapgis-ui-switch-panel
            size="default"
            label="地下模式"
            :checked="undgrd"
            @changeChecked="enableUndgrd"
        >
            <mapgis-ui-input-number-panel
                size="large"
                label="地表透明度"
                :value="groundAlpha"
                :range="range"
                :step="0.1"
                @change="enableUndgrd"
            />
        </mapgis-ui-switch-panel>
        
        <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

        <mapgis-ui-input-number-panel
            size="large"
            label="FOV设置"
            :value="fov"
            :range="fovRange"
            :step="15"
            @change="fovChange"
        />
    </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";

export default {
    name: "CameraSetting",
    mixins: [ServiceLayer],
    data() {
        return {
            undgrd: false,
            undgrdParams: undefined,
            groundAlpha: 0.5,
            range: [0, 1],

            fov: 60.0,
            fovRange: [0, 180],
        };
    },
    methods: {
        /*
         * 地下模式
         * */
        enableUndgrd(e) {
            const { viewer } = this;
            if (typeof e === "boolean") {
                this.undgrd = e;
            } else {
                this.groundAlpha = e;
            }
            this.$emit("updateSpin", true);
            let vm = this;

            setTimeout(function () {
                viewer.scene.screenSpaceCameraController.enableCollisionDetection =
                    !vm.undgrd;
                viewer.scene.globe.translucency.enabled = vm.undgrd;
                //设置地表透明度
                viewer.scene.globe.translucency.backFaceAlpha = vm.groundAlpha;
                viewer.scene.globe.translucency.frontFaceAlpha = vm.groundAlpha;

                //最小缩放距离
                //viewer.scene.screenSpaceCameraController.minimumZoomDistance = ;

                vm.$emit("updateSpin", false);
            }, 300);
        },
        /*
         * FOV设置
         * */
        fovChange(e) {
            const { viewer, Cesium } = this;
            this.fov = e;
            //   console.log('default fov',Cesium.Math.toDegrees(1.0471975511965976));
            viewer.scene.camera.frustum.fov = Cesium.Math.toRadians(this.fov);
        },
    },
};
</script>

<style scoped>
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