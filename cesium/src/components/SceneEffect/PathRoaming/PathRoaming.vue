<template>
  <div>
    <slot>
      <div class="mapgis-path-roaming">
        <div class="roaming-actions">
          <mapgis-ui-button
            class="roaming-action"
            :title="playTitle"
            type="primary"
            @click="onClickStartOrPauseOrResume"
          >
            {{ playTitle }}
          </mapgis-ui-button>
          <mapgis-ui-button
            class="roaming-action"
            type="primary"
            :disabled="!isStart"
            @click="onClickStop"
          >
            停止
          </mapgis-ui-button>
        </div>
        <div class="roaming-options">
          <mapgis-ui-checkbox
            :checked="isLoopCopy"
            @change="e => onCheckBoxChange(e.target.checked, 'isLoop')"
          >
            循环
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox
            :checked="showPathCopy"
            @change="e => onCheckBoxChange(e.target.checked, 'showPath')"
          >
            显示路径
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox
            :checked="showInfoCopy"
            @change="e => onCheckBoxChange(e.target.checked, 'showInfo')"
          >
            显示提示信息
          </mapgis-ui-checkbox>
        </div>
        <mapgis-ui-setting-form
          class="roadming-setting"
          :itemLayout="'grid'"
          :labelCol="{ span: 6 }"
          :wrapperCol="{ span: 18 }"
        >
          <mapgis-ui-form-item label="移动速度">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-input
                  v-model.number="speedCopy"
                  type="number"
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
                <mapgis-ui-input
                  v-model.number="exHeightCopy"
                  type="number"
                  :min="0"
                  addon-after="米"
                  :disabled="isStart ? true : false"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="方位角" v-show="animationTypeCopy !== 1">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="headingCopy"
                  :min="-180"
                  :max="180"
                  :disabled="animationTypeCopy === 1 ? true : false"
                  @change="val => onEffectsChange(val, 'heading')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="headingCopy"
                  :min="-180"
                  :max="180"
                  :disabled="animationTypeCopy === 1 ? true : false"
                  @change="val => onEffectsChange(val, 'heading')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="俯仰角" v-show="animationTypeCopy === 2">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="pitchCopy"
                  :min="-180"
                  :max="180"
                  :disabled="animationTypeCopy !== 2 ? true : false"
                  @change="val => onEffectsChange(val, 'pitch')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="pitchCopy"
                  :min="-180"
                  :max="180"
                  :disabled="animationTypeCopy !== 2 ? true : false"
                  @change="val => onEffectsChange(val, 'pitch')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="距离" v-show="animationTypeCopy !== 1">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="rangeCopy"
                  :min="1"
                  :max="200"
                  :disabled="animationTypeCopy === 1 ? true : false"
                  @change="val => changeRange(val)"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="rangeCopy"
                  :min="1"
                  :max="200"
                  :disabled="animationTypeCopy === 1 ? true : false"
                  @change="val => changeRange(val)"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="视角">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-select
                  v-model="animationTypeCopy"
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
                  v-model="interpolationAlgorithmCopy"
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
      </div>
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
    positions: {
      type: Array,
      required: true,
      default: () => []
    },
    speed: {
      type: Number,
      default: 10
    },
    exHeight: {
      type: Number,
      default: 1
    },
    heading: {
      type: Number,
      default: 90
    },
    pitch: {
      type: Number,
      default: 0
    },
    range: {
      type: Number,
      default: 1
    },
    animationType: {
      type: Number,
      default: 1
    },
    interpolationAlgorithm: {
      type: String,
      default: "LagrangePolynomialApproximation"
    },
    isLoop: {
      type: Boolean,
      default: true
    },
    showPath: {
      type: Boolean,
      default: true
    },
    showInfo: {
      type: Boolean,
      default: true
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
          this.modelUrl = this.models[0].value;
        } else {
          this.modelUrl = "";
        }
      },
      deep: true,
      immediate: true
    },
    speed: {
      handler() {
        this.speedCopy = this.speed;
      },
      immediate: true
    },
    exHeight: {
      handler() {
        this.exHeightCopy = this.exHeight;
      },
      immediate: true
    },
    heading: {
      handler() {
        this.headingCopy = this.heading;
      },
      immediate: true
    },
    pitch: {
      handler() {
        this.pitchCopy = this.pitch;
      },
      immediate: true
    },
    range: {
      handler() {
        this.rangeCopy = this.range;
      },
      immediate: true
    },
    animationType: {
      handler() {
        this.animationTypeCopy = this.animationType;
      },
      immediate: true
    },
    interpolationAlgorithm: {
      handler() {
        this.interpolationAlgorithmCopy = this.interpolationAlgorithm;
      },
      immediate: true
    },
    isLoop: {
      handler() {
        this.isLoopCopy = this.isLoop;
      },
      immediate: true
    },
    showPath: {
      handler() {
        this.showPathCopy = this.showPath;
      },
      immediate: true
    },
    showInfo: {
      handler() {
        this.showInfoCopy = this.showInfo;
      },
      immediate: true
    }
  },
  data() {
    return {
      speedCopy: 10,
      exHeightCopy: 1,
      headingCopy: 90,
      pitchCopy: 0,
      rangeCopy: 1, // range<1,信息提示框会闪烁，必须限制大于等于1
      animationTypeCopy: 1,
      interpolationAlgorithmCopy: "LagrangePolynomialApproximation",
      isLoopCopy: true,
      showPathCopy: true,
      showInfoCopy: true,
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
      // modelOptions: [
      //   {
      //     label: "人",
      //     value: "models/CesiumModels/Cesium_Man.glb"
      //   },
      //   {
      //     label: "卡车",
      //     value: "models/CesiumModels/CesiumMilkTruck.glb"
      //   },
      //   {
      //     label: "飞机",
      //     value: "models/CesiumModels/Cesium_Air.gltf"
      //   }
      // ]
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
      this.onClickStop();
      this.$emit("unload", this);
    },
    onClickStartOrPauseOrResume() {
      if (!this.isStart) {
        // 设置播放动画的各项属性
        if (this.positions.length > 0) {
          const path = this.positions
            .map(item => {
              return [item.x, item.y, item.z];
            })
            .reduce(function(a, b) {
              return a.concat(b);
            });
          window.SceneWanderManager.animation.positions = this.Cesium.Cartesian3.fromDegreesArrayHeights(
            path
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
    onClickStop() {
      if (this.isStart) window.SceneWanderManager.animation.stop();
      this.isStart = false;
      this.isPause = false;
    },
    _setAnimationAttr() {
      // 默认速度的单位为m/s，这里将公里每小时转换为m/s
      window.SceneWanderManager.animation.speed = (
        this.speedCopy * 0.28
      ).toFixed(2);
      window.SceneWanderManager.animation.exHeight = this.exHeightCopy;
      window.SceneWanderManager.animation.heading = this.headingCopy;
      window.SceneWanderManager.animation.pitch = this.pitchCopy;
      window.SceneWanderManager.animation.animationType = this.animationTypeCopy;
      window.SceneWanderManager.animation.isLoop = this.isLoopCopy;
      window.SceneWanderManager.animation.isShowPath = this.showPathCopy;
      window.SceneWanderManager.animation.showInfo = this.showInfoCopy;

      switch (this.interpolationAlgorithmCopy) {
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
        this.rangeCopy = 200;
      } else {
        this.rangeCopy = 1;
      }
      window.SceneWanderManager.animation.range = this.rangeCopy;
    },
    onCheckBoxChange(val, key) {
      this[`${key}Copy`] = val;
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
    // onSpeedChange(val) {
    //   window.SceneWanderManager.animation.speed = parseFloat(
    //     val * 0.28
    //   ).toFixed(2);
    // },
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
        this.rangeCopy = 200;
      } else {
        this.rangeCopy = 1;
      }
      window.SceneWanderManager.animation.range = this.rangeCopy;
    },
    onModelChange(value) {
      window.SceneWanderManager.animation._modelUrl = value;
    }
  }
};
</script>

<style scoped>
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
  font-size: 12px;
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
