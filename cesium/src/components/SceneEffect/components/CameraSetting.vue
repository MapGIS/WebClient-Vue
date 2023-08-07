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
        :value="cameraSetting.undgrdParams.maxHeigh || 400000"
        :range="[0, 1000000]"
        :step="100"
      />
    </mapgis-ui-switch-panel>
    <mapgis-ui-input-number-panel
      size="large"
      label="地表透明度"
      :value="cameraSetting.undgrdParams.groundAlpha"
      :range="range"
      :step="0.1"
      v-show="!cameraSetting.selfAdaption"
      @change="enableSelfAdaption"
    />

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
          undgrdParams: {
            groundAlpha: 1,
            maxHeigh: 400000
          },
          fov: 60
        };
      }
    },
    initFavoritesCameraSetting: {
      type: Object
    },
    boundingSphereRadius: {
      type: Number,
      default: 0
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
      fovRange: [0, 180]
    };
  },
  watch: {
    initCameraSetting: {
      handler(e) {
        this.init();
      },
      deep: true,
      immediate: true
    },
    initFavoritesCameraSetting: {
      handler(e) {
        this.setFavoritesConfig();
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
      const { selfAdaption, fov } = this.cameraSetting;
      this.enableSelfAdaption(selfAdaption);
      this.fovChange(fov);
    },
    /*
     * 地表自适应透明
     *
     */
    enableSelfAdaption(e) {
      const { viewer, Cesium } = this;
      if (typeof e === "boolean") {
        this.cameraSetting.selfAdaption = e;
      } else {
        this.cameraSetting.undgrdParams.groundAlpha = e;
      }
      this.$emit("updateSpin", true);
      let vm = this;

      setTimeout(function() {
        if (vm.cameraSetting.selfAdaption) {
          //设置地表自适应透明
          viewer.camera.changed.addEventListener(() =>
            vm._changeAlphaByCamera()
          );
        } else {
          viewer.camera.changed.removeEventListener(() =>
            vm._changeAlphaByCamera()
          );
          // 不开启地表自适应透明，地表透明度应该为设置的值
          vm.setGlobeBackFaceAlpha(vm.cameraSetting.undgrdParams.groundAlpha);
        }
        vm.$emit("updateSpin", false);
      }, 300);
    },
    _changeAlphaByCamera() {
      let max = this.boundingSphereRadius;
      if (max) {
        // 当出现包围球大于400km的图层时，使用400km的阈值
        max = Math.min(max, 400000);
        let startDis = max * 5;
        let stopDis = max;

        // 当前高度
        let height = this.viewer.camera.positionCartographic.height;
        // 当进入图层高度调整视高阈值内
        if (height < startDis) {
          const imageryLayerAlpha =
            height < stopDis ? 0 : 1 - (startDis - height) / startDis;
          this.setGlobeBackFaceAlpha(imageryLayerAlpha);
        }
      }
    },
    /**
     * 设置地表透明度
     */
    setGlobeBackFaceAlpha(groundAlpha) {
      const { viewer, Cesium } = this;

      // 当透明度为1时，关闭地表自适应透明
      const enableTranslucency = groundAlpha !== 1;
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = !enableTranslucency;
      viewer.scene.globe.translucency.enabled = enableTranslucency;

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
    },
    setFavoritesConfig() {
      if (this.initFavoritesCameraSetting) {
        Object.keys(this.initFavoritesCameraSetting).forEach(item => {
          if (
            this.initFavoritesCameraSetting[item] !== this.cameraSetting[item]
          ) {
            this.cameraSetting[item] = this.initFavoritesCameraSetting[item];
          }
        });
      }
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
