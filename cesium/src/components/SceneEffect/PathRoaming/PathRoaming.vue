<template>
  <div>
    <slot>
      <div class="mapgis-path-roaming">
        <mapgis-ui-setting-form :layout="layout" size="default">
          <mapgis-ui-form-item label="移动速度">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-input-number-addon
                  v-model.number="settingCopy.speed"
                  :min="1"
                  addon-after="公里/小时"
                  :disabled="isStart ? true : false"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="附加高程">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-input-number-addon
                  v-model.number="settingCopy.exHeight"
                  :min="0"
                  addon-after="米"
                  :disabled="isStart ? true : false"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-input-number-panel
            v-show="settingCopy.animationType !== 1"
            size="large"
            label="方位角"
            :range="[-180, 180]"
            v-model="settingCopy.heading"
            :disabled="settingCopy.animationType === 1 ? true : false"
            @change="val => onEffectsChange(val, 'heading')"
          />
          <mapgis-ui-input-number-panel
            v-show="settingCopy.animationType === 2"
            size="large"
            label="俯仰角"
            :range="[-180, 180]"
            v-model="settingCopy.pitch"
            :disabled="settingCopy.animationType !== 2 ? true : false"
            @change="val => onEffectsChange(val, 'pitch')"
          />
          <mapgis-ui-input-number-panel
            v-show="settingCopy.animationType !== 1"
            size="large"
            label="距离"
            :range="[1, 200]"
            v-model="settingCopy.range"
            :disabled="settingCopy.animationType === 1 ? true : false"
            @change="val => changeRange(val)"
          />
          <mapgis-ui-form-item label="视角">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-select
                  v-model="settingCopy.animationType"
                  @change="onTypeChange"
                >
                  <mapgis-ui-select-option
                    v-for="item in perspectiveOptions"
                    :key="item.value"
                  >
                    {{ item.label }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col></mapgis-ui-row
            >
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="插值">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-select
                  v-model="settingCopy.interpolationAlgorithm"
                  :disabled="isStart ? true : false"
                >
                  <mapgis-ui-select-option
                    v-for="item in interpolationOptions"
                    :key="item.value"
                  >
                    {{ item.label }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="模型">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-select
                  v-model="modelUrl"
                  @change="onModelChange"
                  :disabled="isStart"
                >
                  <mapgis-ui-select-option
                    v-for="item in models"
                    :key="item.value"
                  >
                    {{ item.label }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col></mapgis-ui-row
            >
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <div>
          <mapgis-ui-checkbox
            style="line-height:32px;"
            :checked="settingCopy.isLoop"
            @change="e => onCheckBoxChange(e.target.checked, 'isLoop')"
          >
            循环
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox
            style="line-height:32px;"
            :checked="settingCopy.showPath"
            @change="e => onCheckBoxChange(e.target.checked, 'showPath')"
          >
            显示路径
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox
            style="line-height:32px;"
            :checked="settingCopy.showInfo"
            @change="e => onCheckBoxChange(e.target.checked, 'showInfo')"
          >
            显示提示信息
          </mapgis-ui-checkbox>
        </div>
      </div>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button
          type="primary"
          :title="playTitle"
          @click="onClickStartOrPauseOrResume"
          >{{ playTitle }}</mapgis-ui-button
        >
        <mapgis-ui-button
          type="primary"
          :disabled="!isStart"
          @click="onClickStop(false)"
          >停止</mapgis-ui-button
        >
      </mapgis-ui-setting-footer>
    </slot>
  </div>
</template>
<script>
import VueOptions from "../../Base/Vue/VueOptions";
export default {
  name: "mapgis-3d-path-roaming",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    setting: {
      type: Object,
      default: () => {
        return {
          speed: 10,
          exHeight: 1,
          heading: 90,
          pitch: 0,
          range: 1,
          animationType: 1,
          interpolationAlgorithm: "LagrangePolynomialApproximation",
          isLoop: true,
          showPath: true,
          showInfo: true,
          modelUrl: ""
        };
      }
    },
    positions: {
      type: Array,
      required: true,
      default: () => []
    },
    models: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    playTitle: function() {
      if (!this.isStart) {
        return "开始";
      } else {
        return this.isPause ? "继续" : "暂停";
      }
    }
  },
  watch: {
    models: {
      handler() {
        if (this.models.length > 0 && this.models[0].value) {
          if (this.modelUrl === "" || !this.models.includes(this.modelUrl)) {
            this.modelUrl = this.models[0].value;
          }
        } else {
          this.modelUrl = "";
        }
      },
      deep: true,
      immediate: true
    },
    setting: {
      handler() {
        this.settingCopy = JSON.parse(JSON.stringify(this.setting));
        // 确保this.settingCopy.modelUrl非空
        this.modelUrl =
          this.settingCopy.modelUrl && this.settingCopy.modelUrl !== ""
            ? this.settingCopy.modelUrl
            : "";
      },
      immediate: true
    }
  },
  data() {
    return {
      settingCopy: {
        speed: 10,
        exHeight: 1,
        heading: 90,
        pitch: 0,
        range: 1,
        animationType: 1,
        interpolationAlgorithm: "LagrangePolynomialApproximation",
        isLoop: true,
        showPath: true,
        showInfo: true
      },
      isStart: false,
      isPause: false,
      perspectiveOptions: [
        {
          label: "跟随",
          value: 1
        },
        {
          label: "锁定第一视角",
          value: 2
        },
        {
          label: "上帝视角",
          value: 3
        }
      ],
      interpolationOptions: [
        {
          label: "拉格朗日插值",
          value: "LagrangePolynomialApproximation"
        },
        {
          label: "线性近似",
          value: "LinearApproximation"
        },
        {
          label: "埃尔米特插值",
          value: "HermitePolynomialApproximation"
        }
      ],
      modelUrl: ""
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      window.SceneWanderManager = {
        animation: null
      };

      //  初始化漫游动画
      window.SceneWanderManager.animation = new this.Cesium.AnimationTool(
        this.viewer,
        {
          modelUrl: this.modelUrl
        }
      );
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
      });
    },
    unmount() {
      this.onClickStop(true);
      this.$emit("unload", this);
    },
    onClickStartOrPauseOrResume() {
      if (!this.isStart) {
        // 隐藏绘制的路线
        this.$emit("remove-road");
        // 设置播放动画的各项属性
        if (this.positions.length > 0) {
          const positions = JSON.parse(JSON.stringify(this.positions));
          window.SceneWanderManager.animation.positions = this.Cesium.Cartesian3.fromDegreesArrayHeights(
           positions
          );
          this._setAnimationAttr();

          window.SceneWanderManager.animation.start();

          this.isStart = true;
          this.isPause = false;
        }
      } else {
        if (!this.isPause) window.SceneWanderManager.animation.pause = true;
        else window.SceneWanderManager.animation.pause = false;

        this.isPause = !this.isPause;
      }
    },
    onClickStop(flag) {
      if (this.isStart) window.SceneWanderManager.animation.stop();
      this.isStart = false;
      this.isPause = false;
      if (!flag) {
        // 显示绘制的路线
        this.$emit("show-road");
      } else {
        // 退出配置界面时，触发以下函数
        this.$emit("update-setting", this.settingCopy);
      }
    },
    _setAnimationAttr() {
      const {
        speed,
        exHeight,
        heading,
        pitch,
        animationType,
        interpolationAlgorithm,
        isLoop,
        showPath,
        showInfo
      } = this.settingCopy;
      // 默认速度的单位为m/s，这里将公里每小时转换为m/s
      window.SceneWanderManager.animation.speed = (speed * 0.28).toFixed(2);
      window.SceneWanderManager.animation.exHeight = exHeight;
      window.SceneWanderManager.animation.heading = heading;
      window.SceneWanderManager.animation.pitch = pitch;
      window.SceneWanderManager.animation.animationType = animationType;
      window.SceneWanderManager.animation.isLoop = isLoop;
      window.SceneWanderManager.animation.isShowPath = showPath;
      window.SceneWanderManager.animation.showInfo = showInfo;

      switch (interpolationAlgorithm) {
        case "LagrangePolynomialApproximation":
          window.SceneWanderManager.animation.interpolationAlgorithm = this.Cesium.LagrangePolynomialApproximation; // 拉格朗日插值
          break;
        case "LinearApproximation":
          window.SceneWanderManager.animation.interpolationAlgorithm = this.Cesium.LinearApproximation; // 线性近似
          break;
        case "HermitePolynomialApproximation":
          window.SceneWanderManager.animation.interpolationAlgorithm = this.Cesium.HermitePolynomialApproximation; // 埃尔米特插值
          break;
        default:
          break;
      }

      // 若是上帝视角，设置动画的视角高度为200
      if (window.SceneWanderManager.animation.animationType === 3) {
        this.settingCopy.range = 200;
      } else {
        this.settingCopy.range = 1;
      }
      window.SceneWanderManager.animation.range = this.settingCopy.range;
    },
    onCheckBoxChange(val, key) {
      this.settingCopy[key] = val;
      if (key === "showPath") {
        if (
          window.SceneWanderManager.animation &&
          window.SceneWanderManager.animation.animationModel
        ) {
          window.SceneWanderManager.animation.animationModel.pathCopy.show._value = val;
        }
      } else {
        window.SceneWanderManager.animation[key] = val;
      }
    },
    onEffectsChange(val, key) {
      window.SceneWanderManager.animation[key] = this.Cesium.Math.toRadians(
        parseInt(val)
      );
    },
    changeRange(val) {
      window.SceneWanderManager.animation.range = parseInt(val);
    },
    onTypeChange(value) {
      window.SceneWanderManager.animation.animationType = value;
      // 若是上帝视角，设置动画的视角高度为200
      if (window.SceneWanderManager.animation.animationType === 3) {
        this.settingCopy.range = 200;
      } else {
        this.settingCopy.range = 1;
      }
      window.SceneWanderManager.animation.range = this.settingCopy.range;
    },
    onModelChange(value) {
      window.SceneWanderManager.animation._modelUrl = value;
      this.settingCopy.modelUrl = value;
    }
  }
};
</script>

<style scoped>
.mapgis-path-roaming {
  max-height: calc(80vh);
  overflow-y: auto;
  overflow-x: hidden;
}
.roaming-actions {
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
}
.roaming-action {
  width: calc(50% - 4px);
}
.roaming-options {
  padding-bottom: 12px;
}
.mapgis-ui-checkbox-wrapper {
  /* font-size: 12px; */
}
.roadming-setting {
  padding-top: 8px;
}
.slider-body {
  margin-right: 10px;
}
.slider-number {
  width: 100%;
}
.mapgis-ui-input-number {
  width: 100%;
}
</style>
