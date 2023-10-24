<template>
  <div class="autonomous-roaming">
    <mapgis-ui-switch-row-left
      title="鼠标控制模式"
      :disabled="isRunning"
      v-model="roamingSettings.enableMouseLook"
      @change="enableEnableMouseLook"
    />
    <mapgis-ui-switch-row-left
      title="碰撞检测"
      v-model="roamingSettings.enableCollisionDetection"
      @change="enableCollisionDetectionChange"
    />
    <mapgis-ui-input-number-panel
      style="padding-left: 10px"
      size="large"
      label="移动步长"
      :range="[0, 10]"
      v-model="roamingSettings.moveStep"
      @change="moveStepChange"
    />
    <slot />
  </div>
</template>

<script>
export default {
  name: "AutonomousRoaming",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    isRunning: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roamingSettings: {
        enableCollisionDetection: false,
        enableMouseLook: false,
        moveStep: 1
      }
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
      const {
        enableCollisionDetection,
        enableMouseLook,
        moveStep
      } = this.roamingSettings;
      this.roamingTool = new Cesium.KeyboardCameraController(viewer, {
        // 是否开启鼠标控制模式，开启后将进入全屏模式，此时相机视角可通过鼠标移动进行操作
        // 由于浏览器限制，不允许自动全屏，需通过用户操作切换全屏，所以这里初始化设置为false
        enableMouseLook: enableMouseLook,
        // 鼠标灵敏度，该参数仅在鼠标控制模式下有效
        mouseSensitivity: 6,
        // 是否开启动态移动步长，开启后将根据视角距离地面高度动态计算移动步长，moveStep参数将不再生效
        enableDynamicMoveStep: false,
        // 移动步长，单位为米
        moveStep: moveStep,
        // 旋转步长，单位为度
        rotateStep: 1,
        // 是否开启碰撞检测
        enableCollisionDetection: enableCollisionDetection
        // 初始视角，开始漫游时视角将重置到该视角，若不设置则默认从当前视角开始漫游
        // initView: initViewOfIndoor
      });
      this.$emit("load", this.roamingTool);
    },
    unmount() {
      if (this.roamingTool) {
        this.roamingTool = null;
      }
      this.$emit("unload", this.roamingTool);
    },
    enableCollisionDetectionChange(val) {
      this.roamingTool.enableCollisionDetection = val;
    },
    moveStepChange(val) {
      this.roamingTool.moveStep = val;
    },
    enableEnableMouseLook(val) {
      this.roamingTool.enableMouseLook = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.autonomous-roaming {
  padding: 6px;
}
</style>
