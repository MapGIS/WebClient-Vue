<template>
  <div>
    <slot>
      <div class="mapgis-path-roaming">
        <div class="header" @click="onGotoHome">
          <div>
            <mapgis-ui-iconfont class="return" type="mapgis-left" />
          </div>
          <div class="name">{{ pathCopy.name }}</div>
        </div>
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
            :checked="pathCopy.para.isLoop"
            @change="e => onCheckBoxChange(e, 'isLoop')"
          >
            循环
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox
            :checked="pathCopy.para.showPath"
            @change="e => onCheckBoxChange(e, 'showPath')"
          >
            显示路径
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox
            :checked="pathCopy.para.showInfo"
            @change="e => onCheckBoxChange(e, 'showInfo')"
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
                  v-model.number="pathCopy.para.speed"
                  type="number"
                  min="1"
                  addon-after="公里/小时"
                  @change="onSpeedChange"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="附加高程">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-input-number
                  v-model="pathCopy.para.exHeight"
                  :min="0"
                  :disabled="isStart ? true : false"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item
            label="方位角"
            v-show="pathCopy.para.animationType !== 1"
          >
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="pathCopy.para.heading"
                  :min="-180"
                  :max="180"
                  :disabled="pathCopy.para.animationType === 1 ? true : false"
                  @change="val => onEffectsChange(val, 'heading')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="pathCopy.para.heading"
                  :min="-180"
                  :max="180"
                  :disabled="pathCopy.para.animationType === 1 ? true : false"
                  @change="val => onEffectsChange(val, 'heading')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item
            label="俯仰角"
            v-show="pathCopy.para.animationType === 2"
          >
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="pathCopy.para.pitch"
                  :min="-180"
                  :max="180"
                  :disabled="pathCopy.para.animationType !== 2 ? true : false"
                  @change="val => onEffectsChange(val, 'pitch')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="pathCopy.para.pitch"
                  :min="-180"
                  :max="180"
                  :disabled="pathCopy.para.animationType !== 2 ? true : false"
                  @change="val => onEffectsChange(val, 'pitch')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item
            label="距离"
            v-show="pathCopy.para.animationType !== 1"
          >
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="pathCopy.para.range"
                  :min="0"
                  :max="200"
                  :disabled="pathCopy.para.animationType === 1 ? true : false"
                  @change="val => changeRange(val)"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="pathCopy.para.range"
                  :min="0"
                  :max="200"
                  :disabled="pathCopy.para.animationType === 1 ? true : false"
                  @change="val => changeRange(val)"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="视角">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-select
                  v-model="pathCopy.para.animationType"
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
                  v-model="pathCopy.para.interpolationAlgorithm"
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
export default {
  name: "mapgis-3d-path-roaming",
  inject: ["Cesium", "CesiumZondy", "viewer"],
  props: {
    path: {
      type: Object,
      required: true,
      default: () => {}
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
    path: {
      handler() {
        this.pathCopy = this.path;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      pathCopy: {
        speed: 10,
        exHeight: 1,
        heading: 90,
        pitch: 0,
        range: 0,
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
  created() {
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
  },
  methods: {
    onGotoHome() {
      this.onClickStop();
      this.$emit("goto-home");
    },
    onClickStartOrPauseOrResume() {
      if (!this.isStart) {
        // 设置播放动画的各项属性
        if (this.pathCopy.path.length > 0) {
          window.SceneWanderManager.animation.positions = this.Cesium.Cartesian3.fromDegreesArrayHeights(
            this.pathCopy.path
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
        this.pathCopy.para.speed * 0.28
      ).toFixed(2);
      window.SceneWanderManager.animation.exHeight = this.pathCopy.para.exHeight;
      window.SceneWanderManager.animation.heading = this.pathCopy.para.heading;
      window.SceneWanderManager.animation.pitch = this.pathCopy.para.pitch;
      window.SceneWanderManager.animation.animationType = this.pathCopy.para.animationType;
      window.SceneWanderManager.animation.isLoop = this.pathCopy.para.isLoop;
      window.SceneWanderManager.animation.isShowPath = this.pathCopy.para.showPath;
      window.SceneWanderManager.animation.showInfo = this.pathCopy.para.showInfo;

      switch (this.pathCopy.para.interpolationAlgorithm) {
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
        this.pathCopy.para.range = 200;
      } else {
        this.pathCopy.para.range = 0;
      }
      window.SceneWanderManager.animation.range = this.pathCopy.para.range;
    },
    onCheckBoxChange(e, key) {
      this.pathCopy.para[key] = e.target.checked;

      if (key === "showPath") {
        if (
          window.SceneWanderManager.animation &&
          window.SceneWanderManager.animation.animationModel
        ) {
          window.SceneWanderManager.animation.animationModel.pathCopy.show._value =
            e.target.checked;
        }
      } else {
        window.SceneWanderManager.animation[key] = e.target.checked;
      }
    },
    onSpeedChange(e) {
      window.SceneWanderManager.animation.speed = parseFloat(
        e.target.value * 0.28
      ).toFixed(2);
      // TODO 临时解决办法，cesium1.8已解决这个问题
      // speed默认值是10
      window.SceneWanderManager.animation.speedupFactor = e.target.value
        ? e.target.value / 10
        : 1;
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
        this.pathCopy.para.range = 200;
      } else {
        this.pathCopy.para.range = 0;
      }
      window.SceneWanderManager.animation.range = this.pathCopy.para.range;
    },
    onModelChange(value) {
      window.SceneWanderManager.animation._modelUrl = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.mapgis-path-roaming {
  .header {
    cursor: pointer;
    display: flex;
    align-content: center;
    .return {
      // color: @primary-color;
      margin: 0 10px 0 0;
    }
    .name {
      flex: 1;
    }
  }
  .roaming-actions {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    .roaming-action {
      width: calc(50% - 4px);
    }
  }
  .roaming-options {
    padding-bottom: 12px;
  }
  .mapgis-ui-checkbox-wrapper {
    font-size: 12px;
  }
  .roadming-setting {
    padding-top: 8px;
    .slider-body {
      margin-right: 10px;
    }
    .slider-number {
      width: 100%;
    }
    .ant-input-number {
      width: 100%;
    }
  }
}
</style>
