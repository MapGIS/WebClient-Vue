<template>
  <div class="camera-setting">
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

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

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
          undgrd: false,
          undgrdParams: {
            groundAlpha: 0.5
          },
          fov: 60
        };
      }
    },
    initFavoritesCameraSetting: {
      type: Object
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
    }
  },
  methods: {
    init() {
      this.setFavoritesConfig();
      if (!this.cameraSetting) {
        return;
      }
      const { undgrd, fov } = this.cameraSetting;
      this.enableUndgrd(undgrd);
      this.fovChange(fov);
    },
    /*
     * 地下模式
     * */
    enableUndgrd(e) {
      const { viewer, Cesium } = this;
      if (typeof e === "boolean") {
        this.cameraSetting.undgrd = e;
      } else {
        this.cameraSetting.undgrdParams.groundAlpha = e;
      }
      this.$emit("updateSpin", true);
      let vm = this;

      setTimeout(function() {
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = !vm
          .cameraSetting.undgrd;
        viewer.scene.globe.translucency.enabled = vm.cameraSetting.undgrd;
        if (vm.cameraSetting.undgrd) {
          //设置地表透明度
          vm.setGlobeBackFaceAlpha(vm.cameraSetting.undgrdParams.groundAlpha);
        } else {
          // 不开启地表透明度，地表透明度应该为1
          vm.setGlobeBackFaceAlpha(1);
        }
        vm.$emit("updateSpin", false);
      }, 300);
    },
    /**
     * 设置地表透明度
     */
    setGlobeBackFaceAlpha(groundAlpha) {
      const { viewer, Cesium } = this;
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
