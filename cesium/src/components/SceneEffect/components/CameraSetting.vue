<template>
  <div class="camera-setting">
    <mapgis-ui-switch-panel
      size="default"
      label="地表自适应透明"
      :checked="cameraSetting.selfAdaption"
      @changeChecked="enableSelfAdaption"
      ref="selfAdaption"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="阈值"
        :value="cameraSetting.selfAdaptionParams.maxHeigh"
        :range="[0, 1000000]"
        :step="100"
        @change="setSelfAdaption"
      />
    </mapgis-ui-switch-panel>
    <mapgis-ui-switch-panel
      size="default"
      label="地下模式"
      :checked="cameraSetting.undgrd"
      @changeChecked="enableUndgrd"
      ref="Undgrd"
    >
      <mapgis-ui-switch-panel
        size="default"
        label="影像透明度独立控制"
        :checked="cameraSetting.undgrdParams.enableIndependentTranslucency"
        @changeChecked="enableIndependentTranslucency"
      ></mapgis-ui-switch-panel>
      <mapgis-ui-input-number-panel
        size="large"
        label="地表透明度"
        :value="cameraSetting.undgrdParams.groundAlpha"
        :range="range"
        :step="0.1"
        @change="setGlobeBackFaceAlpha"
      />
    </mapgis-ui-switch-panel>

    <mapgis-ui-input-number-panel
      size="large"
      label="FOV设置"
      :value="cameraSetting.fov"
      :range="fovRange"
      :step="15"
      @change="setFOV"
    />
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";

export default {
  name: "CameraSetting",
  mixins: [ServiceLayer],
  props: {
    /**
     * 外部传入的场景设置参数
     * @type {Object}
     * @default this.cameraSetting
     * */
    initCameraSetting: {
      type: Object,
      default: () => {
        return this.cameraSetting;
      },
    },
    /**
     * 所有参与地表半透明的模型的包围球合并后半径
     * @type {Number}
     * @default 0
     * */
    boundingSphereRadius: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 地表透明度的范围
      range: [0, 1],
      // 相机开合角设置的范围
      fovRange: [0, 180],
      // 默认的场景设置参数
      cameraSetting: {
        // 是否开启地表自适应透明
        selfAdaption: false,
        // 地表自适应透明设置
        selfAdaptionParams: {
          // 自适应起始高度，自适应变化高度在[height, height * 5]，注意height取maxHeigh和boundingSphereRadius的最小值
          maxHeigh: 400000,
        },
        // 是否开启地下模式
        undgrd: false,
        // 地下模式参数
        undgrdParams: {
          // 地表透明度，0到1之间的值
          groundAlpha: 0.5,
          // 是否开启图层透明度独立控制
          enableIndependentTranslucency: false,
        },
        // 相机开合角度
        fov: 60,
      },
    };
  },
  watch: {
    /**
     * 外部传入的场景设置参数，传入后更新场景设置参数，并重新初始化设置
     * @type {Object}
     * */
    initCameraSetting: {
      handler(e) {
        this.cameraSetting = JSON.parse(JSON.stringify(this.initCameraSetting));
        this.init();
      },
      deep: true,
      immediate: true,
    },
    /**
     * 更新场景设置参数后，发起事件通知父组件进行更新
     * @type {Object}
     * */
    cameraSetting: {
      handler(e) {
        this.$emit("updateCameraSetting", this.cameraSetting);
      },
      deep: true,
    },
    /**
     * 如果boundingSphereRadius发生变化，重新设置地表自适应透明度
     * @type {Object}
     * */
    boundingSphereRadius: {
      handler(e) {
        this.boundingSphereRadius = e;
        // 确保boundingSphereRadius大于0，才能设置地表自适应透明度，这个是一张图业务
        if (this.boundingSphereRadius > 0) {
          // 设置地表自适应透明度
          this._setSelfAdaption();
          this.openSelfAdaptionPanel();
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * 初始化场景设置
     * */
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
          maxHeigh: 400000,
        };
      }
      const { selfAdaption, fov, undgrd } = this.cameraSetting;
      // 初始化透明度工具
      this.initImageLayersTranslucencyManager();
      // 增加延时，不然初始化的时候，设置无效(解决一张图初始化后，球半透明问题)
      setTimeout(() => {
        // 确保boundingSphereRadius大于0，才能设置地表自适应透明度，这个是一张图业务
        if (this.boundingSphereRadius > 0) {
          this._enableSelfAdaption(selfAdaption);
        }
        // 设置相机开合角度
        this._setFOV(fov);
        // 初始化地下模式设置
        this._enableUndgrd(undgrd);
      }, 1000);
    },
    /**
     * 开启或关闭图层透明度独立控制，开启后图层透明度和地表透明度分开控制，会触发设置更新事件
     * @param {Boolean} value 开启或关闭图层透明度独立控制
     * */
    enableIndependentTranslucency(value) {
      // 1 更新设置参数，并触发设置更新事件
      this.cameraSetting.undgrdParams.enableIndependentTranslucency = value;
      // 2 开启或关闭图层透明度独立控制
      this._enableIndependentTranslucency(
        this.cameraSetting.undgrdParams.enableIndependentTranslucency
      );
    },
    /**
     * 开启或关闭图层透明度独立控制，开启后图层透明度和地表透明度分开控制，不会触发设置更新事件
     * @param {Boolean} value 开启或关闭图层透明度独立控制
     * @private
     * */
    _enableIndependentTranslucency(value) {
      // 1 获取透明度工具
      const _independentTranslucency = this.getImageLayersTranslucencyManager();

      // 2 设置不受地表透明影响的影像图层
      if (_independentTranslucency) {
        const imageryLayers = [];
        // 修改说明：地表透明度设置必须在开启地下模式后进行
        // 修改人：龚跃健-20241220
        if (this.cameraSetting.undgrd) {
          // 2.1 开启地表透明度独立控制
          if (value) {
            // i从1开始，因为第0个是Cesium初始底图
            for (let i = 1; i < viewer.imageryLayers._layers.length; i++) {
              imageryLayers.push(viewer.imageryLayers._layers[i]);
            }
            // 当imageryLayers数组的长度大于0，开启影像透明度独立控制，否则不开启，开启操做必须在设置透明度之前执行
            _independentTranslucency.imageryLayers = imageryLayers;
            // 开启影像图层透明度独立控制，则通过globeFaceAlpha设置球体透明度
            _independentTranslucency.globeFaceAlpha =
              this.cameraSetting.undgrdParams.groundAlpha;
          }
          // 2.2 关闭开启地表透明度独立控制
          else {
            // 关闭开启影像图层透明度独立控制，则通过frontFaceAlpha和backFaceAlpha设置球体透明度
            _independentTranslucency.frontFaceAlpha =
              this.cameraSetting.undgrdParams.groundAlpha;
            _independentTranslucency.backFaceAlpha =
              this.cameraSetting.undgrdParams.groundAlpha;
            // 当imageryLayers数组的长度等于0，关闭影像透明度独立控制
            _independentTranslucency.imageryLayers = imageryLayers;
          }
        }
      }
    },
    /**
     * 更新二维影像图层独立控制影响的图层
     * */
    updateIndependentTranslucency() {
      this._enableIndependentTranslucency(
        this.cameraSetting.undgrdParams.enableIndependentTranslucency
      );
    },
    /**
     * 开启或关闭地下模式，开启后地表半透明，视角可以穿梭到地下，会触发设置更新事件
     * @param {Boolean} value 开启或关闭地下模式
     * */
    enableUndgrd(value) {
      // 1 更新设置
      this.cameraSetting.undgrd = value;
      // 2 开启或关闭地下模式
      this._enableUndgrd(this.cameraSetting.undgrd);
    },
    /**
     * 开启或关闭地下模式，开启后地表半透明，视角可以穿梭到地下，不会触发设置更新事件
     * @param {Boolean} value 开启或关闭地下模式
     * @private
     * */
    _enableUndgrd(value) {
      const { viewer } = this;
      // 1 设置相机视角是否可以穿梭到地下
      viewer.scene.screenSpaceCameraController.enableCollisionDetection =
        !this.cameraSetting.undgrd;
      // 2 设置地表透明度
      if (this.cameraSetting.undgrd) {
        // 2.1 设置地表透明度
        this._setGlobeBackFaceAlpha(
          this.cameraSetting.undgrdParams.groundAlpha
        );
      } else {
        // 2.2 不开启地表透明度，地表透明度应该为1
        this._setGlobeBackFaceAlpha(1);
      }
    },
    /**
     * 开启或关闭地表自适应透明，会触发设置更新事件
     * @param {Boolean} value 开启或关闭地表自适应透明
     */
    enableSelfAdaption(value) {
      // 1 更新设置
      this.cameraSetting.selfAdaption = value;
      // 2 开启或关闭地表自适应透明
      this._enableSelfAdaption(this.cameraSetting.selfAdaption);
    },
    /**
     * 开启或关闭地表自适应透明，不会触发设置更新事件
     * @param {Boolean} value 开启或关闭地表自适应透明
     * @private
     */
    _enableSelfAdaption(value) {
      // 1 确保boundingSphereRadius大于0，才能设置地表自适应透明度，这个是一张图业务
      if (this.boundingSphereRadius <= 0) {
        this.closeSelfAdaptionPanel();
        this.$message.warning("场景中未添加符合要求的模型数据！");
        return;
      }

      // 2 开启或关闭地表自适应透明
      let _independentTranslucency = this.getImageLayersTranslucencyManager();
      if (_independentTranslucency) {
        if (value) {
          this._setSelfAdaption();
        } else {
          this.closeSelfAdaption();
        }
      }
    },
    /**
     * 设置地表透明度，会触发设置更新事件
     * @param {Number} groundAlpha 地表透明度，0到1之间的值，0表示完全透明，1表示完全不透明
     */
    setGlobeBackFaceAlpha(groundAlpha) {
      // 1 更新设置值
      this.cameraSetting.undgrdParams.groundAlpha = groundAlpha;
      // 2 设置地表透明度
      this._setGlobeBackFaceAlpha(this.cameraSetting.undgrdParams.groundAlpha);
    },
    /**
     * 设置地表透明度，不会触发设置更新事件
     * @param {Number} groundAlpha 地表透明度，0到1之间的值，0表示完全透明，1表示完全不透明
     * @private
     */
    _setGlobeBackFaceAlpha(groundAlpha) {
      // 1 获取透明度工具
      const _independentTranslucency = this.getImageLayersTranslucencyManager();

      // 2 设置地表透明度
      if (_independentTranslucency) {
        // 2.1 imageryLayers数组的长度大于0，表示开启图层透明度独立控制
        if (_independentTranslucency.imageryLayers.length > 0) {
          _independentTranslucency.globeFaceAlpha = groundAlpha;
        }
        // 2.1 否则同意控制球体和影像图层的透明度
        else {
          _independentTranslucency.frontFaceAlpha = groundAlpha;
          _independentTranslucency.backFaceAlpha = groundAlpha;
        }
      }
    },
    /**
     * 设置相机的FOV值，会触发设置更新事件
     * @param {Number} degree 相机的开合角度
     * */
    setFOV(degree) {
      // 1 更新设置
      this.cameraSetting.fov = degree;
      // 2 设置相机的FOV值
      this._setFOV(this.cameraSetting.fov);
    },
    /**
     * 设置相机的FOV值，不会触发设置更新事件
     * @param {Number} degree 相机的开合角度
     * @private
     * */
    _setFOV(degree) {
      const { viewer, Cesium } = this;
      viewer.scene.camera.frustum.fov = Cesium.Math.toRadians(
        this.cameraSetting.fov
      );
    },
    /**
     * 设置地表自适应透明的值，会触发设置更新事件
     * @param {Number} value
     * */
    setSelfAdaption(value) {
      // 1 更新设置
      this.cameraSetting.selfAdaptionParams.maxHeigh = value;
      // 2 设置地表自适应透明的值
      this._setSelfAdaption();
    },
    /**
     * 设置地表自适应透明的值，不会触发设置更新事件
     * @private
     * */
    _setSelfAdaption() {
      // 1 获取地表自适应透明度的间隔高度，自适应透明度范围为[stepHeight, stepHeight * 5]
      const _stepHeight = this._getStepHeight();

      // 2 获取透明度工具
      let _independentTranslucency = this.getImageLayersTranslucencyManager();

      // 3 设置地表自适应透明的值
      if (_independentTranslucency) {
        const { imageryLayers } = _independentTranslucency;
        // imageryLayers数组的长度大于0时，表示开启图层透明度独立控制，使用globeFaceAlphaByDistance设置地表自适应透明的值
        if (imageryLayers.length > 0) {
          _independentTranslucency.globeFaceAlphaByDistance =
            new Cesium.NearFarScalar(_stepHeight, 0, _stepHeight * 5, 1);
        }
        // 否则，使用frontFaceAlphaByDistance设置地表自适应透明的值
        else {
          _independentTranslucency.frontFaceAlphaByDistance =
            new Cesium.NearFarScalar(_stepHeight, 0, _stepHeight * 5, 1);
        }
      }
    },
    /**
     * 关闭地表自适应透明面板
     * */
    closeSelfAdaptionPanel() {
      this.cameraSetting.selfAdaption = false;
      if (this.$refs.selfAdaption) {
        this.$refs.selfAdaption.innerChecked = false;
        this.$refs.selfAdaption.maxHeight = "0px";
      }
    },
    /**
     * 开启地表自适应透明面板
     * */
    openSelfAdaptionPanel() {
      this.cameraSetting.selfAdaption = true;
      if (this.$refs.selfAdaption) {
        this.$refs.selfAdaption.innerChecked = true;
        this.$refs.selfAdaption.maxHeight = "fit-content";
      }
    },
    /**
     * 关闭地表自适应透明功能
     * */
    closeSelfAdaption() {
      let _independentTranslucency = this.getImageLayersTranslucencyManager();
      if (_independentTranslucency) {
        _independentTranslucency.globeFaceAlphaByDistance =
          new Cesium.NearFarScalar(0, 1, 1, 1);
        _independentTranslucency.frontFaceAlphaByDistance =
          new Cesium.NearFarScalar(0, 1, 1, 1);
        _independentTranslucency.backFaceAlphaByDistance =
          new Cesium.NearFarScalar(0, 1, 1, 1);
      }
    },
    /**
     * 获取控制地表透明度的工具对象
     * @return {Cesium.GlobeIndependentTranslucency} 控制地表透明度的工具对象
     * */
    getImageLayersTranslucencyManager() {
      const { vueCesium, vueIndex, vueKey } = this;
      const _independentTranslucency =
        vueCesium.ImageLayersTranslucencyManager.findSource(vueKey, vueIndex);
      if (_independentTranslucency && _independentTranslucency.source) {
        return _independentTranslucency.source;
      }
      return undefined;
    },
    /**
     * 初始化控制地表透明度的工具对象
     * @return {Cesium.GlobeIndependentTranslucency} 控制地表透明度的工具对象
     * */
    initImageLayersTranslucencyManager() {
      const { vueCesium, vueKey, vueIndex } = this;
      let _independentTranslucency =
        vueCesium.ImageLayersTranslucencyManager.findSource(vueKey, vueIndex);

      if (!_independentTranslucency) {
        _independentTranslucency = new zondy.cesium.GlobeIndependentTranslucency(
          viewer
        );

        // 开启地表透明
        _independentTranslucency.enabled = true;
        vueCesium.ImageLayersTranslucencyManager.addSource(
          vueKey,
          vueIndex,
          _independentTranslucency
        );
      }
      return _independentTranslucency;
    },
    /**
     * 获取地表自适应透明高度值
     * @private
     * @return {Number} 地表自适应透明高度值
     * */
    _getStepHeight() {
      let _boundingSphereRadius = this.boundingSphereRadius || 0;
      // 当出现包围球大于400km的图层时，使用400km的阈值
      const _selfAdaptionMaxHeight =
        this.cameraSetting.selfAdaptionParams.maxHeigh || 400000;
      return Math.min(_selfAdaptionMaxHeight, _boundingSphereRadius);
    },
  },
};
</script>

<style scoped></style>
