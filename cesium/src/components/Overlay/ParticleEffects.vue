<template>
  <div>
    <slot>
      <div class="mapgis-widget-particle-effects">
        <mapgis-ui-setting-form class="particle-effects-setting">
          <mapgis-ui-form-item label="发射速率(个/秒)">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="emissionRateCopy"
                  :min="0"
                  :max="100"
                  @change="val => onChangeEffect(val, 'emissionRate')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="emissionRateCopy"
                  :min="0"
                  :max="100"
                  @change="val => onChangeEffect(val, 'emissionRate')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="尺寸(像素)">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="imageSizeCopy"
                  :min="2"
                  :max="60"
                  @change="val => onChangeEffect(val, 'imageSize')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="imageSizeCopy"
                  :min="2"
                  :max="60"
                  @change="val => onChangeEffect(val, 'imageSize')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="最小存在时间(秒)">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="minimumParticleLifeCopy"
                  :min="0.1"
                  :max="30.0"
                  :step="0.1"
                  @change="val => onChangeEffect(val, 'minimumParticleLife')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="minimumParticleLifeCopy"
                  :min="0.1"
                  :max="30.0"
                  :step="0.1"
                  @change="val => onChangeEffect(val, 'minimumParticleLife')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="最大存在时间(秒)">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="maximumParticleLifeCopy"
                  :min="0.1"
                  :max="30.0"
                  :step="0.1"
                  @change="val => onChangeEffect(val, 'maximumParticleLife')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="maximumParticleLifeCopy"
                  :min="0.1"
                  :max="30.0"
                  :step="0.1"
                  @change="val => onChangeEffect(val, 'maximumParticleLife')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="最小速度(个/秒)">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="minimumSpeedCopy"
                  :min="0"
                  :max="30"
                  @change="val => onChangeEffect(val, 'minimumSpeed')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="minimumSpeedCopy"
                  :min="0"
                  :max="30"
                  @change="val => onChangeEffect(val, 'minimumSpeed')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="最大速度(个/秒)">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="maximumSpeedCopy"
                  :min="0"
                  :max="30"
                  @change="val => onChangeEffect(val, 'maximumSpeed')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="maximumSpeedCopy"
                  :min="0"
                  :max="30"
                  @change="val => onChangeEffect(val, 'maximumSpeed')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="初始比例">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="startScaleCopy"
                  :min="0.0"
                  :max="10.0"
                  :step="0.5"
                  @change="val => onChangeEffect(val, 'startScale')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="startScaleCopy"
                  :min="0.0"
                  :max="10.0"
                  :step="0.5"
                  @change="val => onChangeEffect(val, 'startScale')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="结束比例">
            <mapgis-ui-row>
              <mapgis-ui-col :span="15">
                <mapgis-ui-slider
                  class="slider-body"
                  v-model="endScaleCopy"
                  :min="0.0"
                  :max="10.0"
                  :step="0.5"
                  @change="val => onChangeEffect(val, 'endScale')"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="9">
                <mapgis-ui-input-number
                  class="slider-number"
                  v-model="endScaleCopy"
                  :min="0.0"
                  :max="10.0"
                  :step="0.5"
                  @change="val => onChangeEffect(val, 'endScale')"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="发射类型">
            <mapgis-ui-select
              v-model="emitterTypeCopy"
              @change="onEmitterChange"
            >
              <mapgis-ui-select-option
                v-for="item in emitterOptions"
                :key="item"
              >
                {{ item }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable
} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-particle-effects",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    /**
     * @type Number
     * @default 20.0
     * @description 发射速率
     */
    emissionRate: { type: Number, default: 20.0 },
    /**
     * @type Number
     * @default 5.0
     * @description 尺寸
     */
    imageSize: { type: Number, default: 5.0 },
    /**
     * @type Number
     * @default 2.0
     * @description 粒子最小存在时间
     */
    minimumParticleLife: { type: Number, default: 2.0 },
    /**
     * @type Number
     * @default 3.0
     * @description 粒子最大存在时间
     */
    maximumParticleLife: { type: Number, default: 3.0 },
    /**
     * @type Number
     * @default 9.0
     * @description 最小速度
     */
    minimumSpeed: { type: Number, default: 9.0 },
    /**
     * @type Number
     * @default 9.5
     * @description 最大速度
     */
    maximumSpeed: { type: Number, default: 9.5 },
    /**
     * @type Number
     * @default 1.0
     * @description 初始比例
     */
    startScale: { type: Number, default: 1.0 },
    /**
     * @type Number
     * @default 4.0
     * @description 结束比例
     */
    endScale: { type: Number, default: 4.0 },
    /**
     * @type Stirng
     * @default 圆形放射
     * @description 发射类型:可选 '盒状放射', '圆形放射', '锥形放射', '球形放射'
     */
    emitterType: { type: String, default: "圆形放射" },
    /**
     * @type String
     * @required true
     * @description 显示效果图片路径
     */
    imgUrl: { type: String, required: true }
  },
  watch: {
    emissionRate: {
      handler() {
        this.emissionRateCopy = this.emissionRate;
      },
      immediate: true
    },
    imageSize: {
      handler() {
        this.imageSizeCopy = this.imageSize;
      },
      immediate: true
    },
    minimumParticleLife: {
      handler() {
        this.minimumParticleLifeCopy = this.minimumParticleLife;
      },
      immediate: true
    },
    maximumParticleLife: {
      handler() {
        this.maximumParticleLifeCopy = this.maximumParticleLife;
      },
      immediate: true
    },
    minimumSpeed: {
      handler() {
        this.minimumSpeedCopy = this.minimumSpeed;
      },
      immediate: true
    },
    maximumSpeed: {
      handler() {
        this.maximumSpeedCopy = this.maximumSpeed;
      },
      immediate: true
    },
    startScale: {
      handler() {
        this.startScaleCopy = this.startScale;
      },
      immediate: true
    },
    endScale: {
      handler() {
        this.endScaleCopy = this.endScale;
      },
      immediate: true
    },
    emitterType: {
      handler() {
        this.emitterTypeCopy = this.emitterType;
      },
      immediate: true
    }
  },
  data() {
    return {
      emissionRateCopy: 2.0, // 发射速率
      imageSizeCopy: 5.0, // 尺寸
      minimumParticleLifeCopy: 2.0, // 粒子最小存在时间
      maximumParticleLifeCopy: 3.0, //粒子最大存在时间
      minimumSpeedCopy: 9.0, // 最小速度
      maximumSpeedCopy: 9.5, // 最大速度
      startScaleCopy: 1.0, // 初始比例
      endScaleCopy: 4.0, // 结束比例
      emitterTypeCesium: undefined, // 发射类型
      emitterTypeCopy: "圆形放射", // 发射类型下拉值
      emitterOptions: ["盒状放射", "圆形放射", "锥形放射", "球形放射"], // 发射类型下拉项
      particleArr: [], // 粒子特效集
      isLogarithmicDepthBufferEnable: undefined, // 记录对数深度缓冲区状态
      handlerAction:undefined
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
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
      });
    },
    unmount() {
      this.onClearParticle();
      this.$emit("unload", this);
    },
    onClearParticle() {
      if (this.particleArr.length > 0) {
        this.particleArr.forEach(item => {
          item.remove();
        });
      }
      if (this.handlerAction) {
        this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      // this.webGlobe.unRegisterMouseEvent("LEFT_CLICK");
      this.particleArr = [];
      if (
        this.isLogarithmicDepthBufferEnable !==
        isLogarithmicDepthBufferEnable(this.viewer)
      ) {
        setLogarithmicDepthBufferEnable(
          this.isLogarithmicDepthBufferEnable,
          this.viewer
        );
      }
    },
    onCreateParticle() {
      this._addEventListener();
      this.isLogarithmicDepthBufferEnable = isLogarithmicDepthBufferEnable(
        this.viewer
      );
      if (this.isLogarithmicDepthBufferEnable === true) {
        setLogarithmicDepthBufferEnable(false, this.viewer);
      }
    },
    _addEventListener() {
      this.handlerAction = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.handlerAction.setInputAction(event => {
        this._registerMouseLClickEvent(event);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // this.webGlobe.registerMouseEvent("LEFT_CLICK", event => {
      //   this._registerMouseLClickEvent(event);
      // });
    },
    _registerMouseLClickEvent(event) {
      // 获取点击点的笛卡尔坐标
      const cartesian = this.viewer.getCartesian3Position(
        event.position
      );
      // 获取当前坐标系标准
      const ellipsoid = this.viewer.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);

      // 获取该位置的经纬度坐标
      const centerLon = parseFloat(
        this.Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
      );
      const centerLat = parseFloat(
        this.Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
      );

      // 初始化高级分析功能管理类
      const advancedAnalysisManager = new window.vueCesium.Manager.AdvancedAnalysisManager(
        {
          viewer: this.viewer
        }
      );

      const options = {
        startColor: new this.Cesium.Color(1, 1, 1, 1),
        emissionRate: this.emissionRateCopy,
        imageSize: new this.Cesium.Cartesian2(
          this.imageSizeCopy,
          this.imageSizeCopy
        ),
        minimumParticleLife: this.minimumParticleLifeCopy,
        maximumParticleLife: this.maximumParticleLifeCopy,
        minimumSpeed: this.minimumSpeedCopy,
        maximumSpeed: this.maximumSpeedCopy,
        startScale: this.startScaleCopy,
        endScale: this.endScaleCopy,
        emitter: this.emitterTypeCesium,
        gravity: 0.5,
        heading: 0.0,
        pitch: 0.0,
        roll: 0.0
      };

      // 创建粒子特效
      const particle = advancedAnalysisManager.createStableParticle(
        this.imgUrl,
        [centerLon, centerLat, cartographic.height],
        options
      );

      this.particleArr.push(particle);

      // 开启计时
      this.viewer.clock.shouldAnimate = true;
      // 粒子特效初始参数
      const viewModel = {
        emissionRate: this.emissionRateCopy,
        minimumParticleLife: this.minimumParticleLifeCopy,
        maximumParticleLife: this.maximumParticleLifeCopy,
        minimumSpeed: this.minimumSpeedCopy,
        maximumSpeed: this.maximumSpeedCopy,
        startScale: this.startScaleCopy,
        endScale: this.endScaleCopy,
        imageSize: new this.Cesium.Cartesian2(
          this.imageSizeCopy,
          this.imageSizeCopy
        )
      };
      // 粒子参数设置绑定UI
      this.Cesium.knockout.track(viewModel);

      // 注销鼠标的各项监听事件
      if (this.handlerAction) {
        this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      // this.webGlobe.unRegisterMouseEvent("LEFT_CLICK");
    },
    onEmitterChange(value) {
      let emitter;
      switch (value) {
        case "盒状放射":
          emitter = new this.Cesium.BoxEmitter(
            new this.Cesium.Cartesian3(5.0, 5.0, 5.0)
          );
          break;
        case "圆形放射":
          emitter = new this.Cesium.CircleEmitter(5.0);
          break;
        case "锥形放射":
          emitter = new this.Cesium.ConeEmitter(
            this.Cesium.Math.toRadians(30.0)
          );
          break;
        case "球形放射":
          emitter = new this.Cesium.SphereEmitter(5.0);
          break;

        default:
          break;
      }

      this.particleArr.forEach(item => {
        item.emitter = emitter;
      });

      this.emitterTypeCesium = emitter;
    },
    onChangeEffect(val, key) {
      if (this.particleArr.length > 0) {
        this.particleArr.forEach(item => {
          if (key === "imageSize") {
            item.maximumImageSize = new this.Cesium.Cartesian2(val, val);
            item.minimumImageSize = new this.Cesium.Cartesian2(val, val);
          } else {
            item[key] = val;
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.mapgis-widget-particle-effects {
  max-height: calc(50vh);
  overflow-y: auto;
}

::v-deep .mapgis-ui-input-number {
  width: 60px;
}
</style>
