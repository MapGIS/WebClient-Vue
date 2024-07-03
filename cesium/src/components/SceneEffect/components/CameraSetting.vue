<template>
  <div class="camera-setting">
    <mapgis-ui-switch-panel
      size="default"
      label="地表自适应透明"
      :checked="cameraSetting.selfAdaption"
      @changeChecked="enableSelfAdaption"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="阈值"
        :value="cameraSetting.selfAdaptionParams.maxHeigh"
        :range="[0, 1000000]"
        :step="100"
        @change="enableSelfAdaption"
      />
    </mapgis-ui-switch-panel>
    <mapgis-ui-switch-panel
      size="default"
      label="地下模式"
      :checked="cameraSetting.undgrd"
      @changeChecked="enableUndgrd"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="地表透明度"
        :value="cameraSetting.undgrdParams.groundAlpha"
        :range="range"
        :step="0.1"
        @change="enableUndgrd"
      />
    </mapgis-ui-switch-panel>

    <mapgis-ui-input-number-panel
      size="large"
      label="FOV设置"
      :value="cameraSetting.fov"
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
  props: {
    initCameraSetting: {
      type: Object,
      default: () => {
        return {
          selfAdaption: false,
          selfAdaptionParams: {
            maxHeigh: 400000
          },
          undgrd: false,
          undgrdParams: {
            groundAlpha: 0.5
          },
          fov: 60
        };
      }
    },
    boundingSphereRadius: {
      type: Number,
      default: 0
    },
    baseLayerIds: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    cameraSetting: {
      get() {
        return this.initCameraSetting;
      },
      set() {
        this.$emit("updateCameraSetting", this.cameraSetting);
      }
    }
  },
  data() {
    return {
      range: [0, 1],
      fovRange: [0, 180],
      beforeGroundAlpha: undefined,
      beforeUndgrd: undefined
    };
  },
  watch: {
    initCameraSetting: {
      handler(e) {
        this.init();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      if (!this.cameraSetting) {
        return;
      }
      if (this.cameraSetting.selfAdaption == undefined) {
        this.cameraSetting.selfAdaption = false;
      }
      if (
        !this.cameraSetting.selfAdaptionParams ||
        !this.cameraSetting.selfAdaptionParams.maxHeigh
      ) {
        this.cameraSetting.selfAdaptionParams = {
          maxHeigh: 400000
        };
      }
      const { selfAdaption, fov, undgrdParams, undgrd } = this.cameraSetting;
      this.enableSelfAdaption(selfAdaption);
      this.fovChange(fov);
      this.enableUndgrd(undgrd);
      this.enableUndgrd(undgrdParams.groundAlpha);
    },
    /*
     * 地下模式
     * */
    enableUndgrd(e) {
      const { viewer, Cesium } = this;
      if (typeof e === "boolean") {
        if (this.beforeUndgrd && this.beforeUndgrd === e) {
          return;
        }
        this.cameraSetting.undgrd = e;
        this.beforeUndgrd = e;
      } else {
        if (this.beforeGroundAlpha && this.beforeGroundAlpha === e) {
          return;
        }
        this.cameraSetting.undgrdParams.groundAlpha = e;
        this.beforeGroundAlpha = e;
      }
      this.$emit("updateSpin", true);
      let vm = this;

      setTimeout(function() {
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = !vm
          .cameraSetting.undgrd;
        viewer.scene.globe.translucency.enabled = vm.cameraSetting.undgrd;
        if (vm.cameraSetting.undgrd) {
          //设置地表透明度
          vm.setGlobeBackFaceAlpha(
            vm.cameraSetting.undgrdParams.groundAlpha,
            false
          );
        } else {
          // 不开启地表透明度，地表透明度应该为1
          vm.setGlobeBackFaceAlpha(1, false);
        }
        vm.$emit("updateSpin", false);
      }, 300);
    },
    /*
     * 地表自适应透明
     *
     */
    enableSelfAdaption(e) {
      const { viewer, Cesium } = this;
      let vm = this;
      if (typeof e === "boolean") {
        vm.cameraSetting.selfAdaption = e;
        if (vm.cameraSetting.selfAdaption) {
          //设置地表自适应透明
          viewer.camera.changed.addEventListener(() => {
            if (vm.cameraSetting.selfAdaption) {
              vm._changeAlphaByCamera();
            }
          });
        } else {
          viewer.camera.changed.removeEventListener();
          // 不开启地表自适应透明，地表透明度应该为设置的值
          vm.setGlobeBackFaceAlpha(1, true);
        }
      } else {
        vm.cameraSetting.selfAdaptionParams.maxHeigh = e;
      }
      if (vm.cameraSetting.selfAdaption) {
        vm._changeAlphaByCamera();
      }
    },
    _changeAlphaByCamera() {
      let max = this.boundingSphereRadius || 0;
      // 当出现包围球大于400km的图层时，使用400km的阈值
      const maxHeigh = this.cameraSetting.selfAdaptionParams.maxHeigh || 400000;
      max = Math.min(max, this.cameraSetting.selfAdaptionParams.maxHeigh);
      let startDis = max * 5;
      let stopDis = max;

      // 当前高度
      let height = this.viewer.camera.positionCartographic.height;
      // 当进入图层高度调整视高阈值内
      if (height < startDis) {
        const imageryLayerAlpha =
          height < stopDis ? 0 : 1 - (startDis - height) / startDis;
        this.setGlobeBackFaceAlpha(imageryLayerAlpha, true);
      } else {
        this.setGlobeBackFaceAlpha(1, true);
      }
    },
    /**
     * 设置地表透明度
     */
    setGlobeBackFaceAlpha(groundAlpha, isSelfAdaption) {
      const { viewer, Cesium } = this;

      if (isSelfAdaption) {
        // 当透明度为1时，关闭地表自适应透明
        const enableTranslucency = groundAlpha !== 1;
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = !enableTranslucency;
        viewer.scene.globe.translucency.enabled = enableTranslucency;
        const layers = viewer.imageryLayers._layers;
        for (let i = 1; i < layers.length; i++) {
          if (this.baseLayerIds.includes(layers[i].id)) {
            layers[i].alpha = groundAlpha;
          }
        }
      }

      viewer.scene.globe.translucency.backFaceAlpha = groundAlpha;
      // 下面这一句会给所有二维图层都设置透明度
      // viewer.scene.globe.translucency.frontFaceAlpha = groundAlpha;
      // 只把Cesium自带的天地图底图设置透明，其他图层透明度保持不变
      const defaultColor = Cesium.Color.clone(viewer.scene.globe.baseColor);
      defaultColor.alpha = groundAlpha;
      viewer.scene.globe.baseColor = defaultColor;
      viewer.imageryLayers._layers[0].alpha = groundAlpha;
    },
    /*
     * FOV设置
     * */
    fovChange(e) {
      const { viewer, Cesium } = this;
      this.cameraSetting.fov = e;
      //   console.log('default fov',Cesium.Math.toDegrees(1.0471975511965976));
      viewer.scene.camera.frustum.fov = Cesium.Math.toRadians(
        this.cameraSetting.fov
      );
    }
  }
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
