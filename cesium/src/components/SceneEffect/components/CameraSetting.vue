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
        :checked="cameraSetting.independentTranslucency"
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
        return this.cameraSetting;
      },
    },
    boundingSphereRadius: {
      type: Number,
      default: 0,
    },
    baseLayerIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      range: [0, 1],
      fovRange: [0, 180],
      cameraSetting: {
        selfAdaption: false,
        selfAdaptionParams: {
          maxHeigh: 400000,
        },
        undgrd: false,
        // 是否开启图层透明度独立控制
        independentTranslucency: false,
        undgrdParams: {
          groundAlpha: 0.5,
        },
        fov: 60,
      },
    };
  },
  watch: {
    initCameraSetting: {
      handler(e) {
        this.cameraSetting = JSON.parse(JSON.stringify(this.initCameraSetting));
        this.init();
      },
      deep: true,
      immediate: true,
    },
    cameraSetting: {
      handler(e) {
        this.$emit("updateCameraSetting", this.cameraSetting);
      },
      deep: true,
    },
    // 如果boundingSphereRadius发生变化，重新设置地表自适应透明度
    boundingSphereRadius: {
      handler(e) {
        this.boundingSphereRadius = e
        // 确保boundingSphereRadius大于0，才能设置地表自适应透明度，这个是一张图业务
        if (this.boundingSphereRadius > 0) {
          // 设置地表自适应透明度
          this.setSelfAdaption()
          this.openSelfAdaptionPanel()
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 初始化组件
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
      this.initImageLayersTranslucencyManager()
      // 确保boundingSphereRadius大于0，才能设置地表自适应透明度，这个是一张图业务
      if (this.boundingSphereRadius > 0) {
        this.enableSelfAdaption(selfAdaption);
      }
      this.fovChange(fov);
      // 初始化地下模式设置
      this.enableUndgrd(undgrd);
    },
    /**
     * 开启或关闭图层透明度独立控制，开启后图层透明度和地表透明度分开控制
     * @param {Boolean} e 开启或关闭图层透明度独立控制
     * */
    enableIndependentTranslucency(e) {
      // 1 获取透明度工具
      const _independentTranslucency = this.getImageLayersTranslucencyManager();

      // 2 设置不受地表透明影响的影像图层
      if (_independentTranslucency) {
        const imageryLayers = [];
        // 2.1 开启地表透明度独立控制
        if (e) {
          // i从1开始，因为第0个是Cesium初始底图
          for (let i = 1; i < viewer.imageryLayers._layers.length; i++) {
            imageryLayers.push(viewer.imageryLayers._layers[i]);
          }
          // 开启影像图层透明度独立控制，则通过globeFaceAlpha设置球体透明度
          _independentTranslucency.globeFaceAlpha = this.cameraSetting.undgrdParams.groundAlpha;
        }
        // 2.2 关闭开启地表透明度独立控制
        else {
          // 关闭开启影像图层透明度独立控制，则通过frontFaceAlpha和backFaceAlpha设置球体透明度
          _independentTranslucency.frontFaceAlpha = this.cameraSetting.undgrdParams.groundAlpha;
          _independentTranslucency.backFaceAlpha = this.cameraSetting.undgrdParams.groundAlpha;
        }
        // 2.3 当imageryLayers数组的长度大于0，开启影像透明度独立控制，否则不开启
        _independentTranslucency.imageryLayers = imageryLayers;
      }
    },
    /**
     * 开启或关闭地下模式，开启后地表半透明，视角可以穿梭到地下
     * @param {Boolean} e 开启或关闭地下模式
     * */
    enableUndgrd(e) {
      this.cameraSetting.undgrd = e;
      this.$emit("updateSpin", true);
      let vm = this;
      // 给一个延迟，方便外部给一个遮罩，由于是对外事件，不进行更改
      setTimeout(function () {
        if (vm.cameraSetting.undgrd) {
          // 设置地表透明度
          vm.setGlobeBackFaceAlpha(
            vm.cameraSetting.undgrdParams.groundAlpha
          );
        } else {
          // 不开启地表透明度，地表透明度应该为1
          vm.setGlobeBackFaceAlpha(1);
        }
        vm.$emit("updateSpin", false);
      }, 300);
    },
    /**
     * 地表自适应透明
     * @param {Boolean} e 是否开启或关闭地表自适应透明
     */
    enableSelfAdaption(e) {
      // 1 确保boundingSphereRadius大于0，才能设置地表自适应透明度，这个是一张图业务
      if (this.boundingSphereRadius <= 0) {
        this.closeSelfAdaptionPanel()
        this.$message.warning("场景中未添加符合要求的模型数据！");
        return
      }

      // 2 开启或关闭地表自适应透明
      let _independentTranslucency = this.getImageLayersTranslucencyManager();
      if (_independentTranslucency) {
        if (e) {
          this.setSelfAdaption();
        } else {
          this.closeSelfAdaption();
        }
      }
    },
    /**
     * 设置地表透明度
     * @param {Number} groundAlpha 地表透明度
     */
    setGlobeBackFaceAlpha(groundAlpha) {
      // 1 获取透明度工具
      const _independentTranslucency = this.getImageLayersTranslucencyManager()

      // 2 设置地表透明度
      if (_independentTranslucency) {
        // 2.1 imageryLayers数组的长度大于0，表示开启图层透明度独立控制
        if (_independentTranslucency.imageryLayers.length > 0) {
          _independentTranslucency.globeFaceAlpha = groundAlpha
        }
        // 2.1 否则同意控制球体和影像图层的透明度
        else {
          _independentTranslucency.frontFaceAlpha = groundAlpha
          _independentTranslucency.backFaceAlpha = groundAlpha
        }
      }
    },
    /**
     * FOV设置
     * @param {Number} e 相机的开合角度
     * */
    fovChange(e) {
      const { viewer, Cesium } = this;
      this.cameraSetting.fov = e;
      viewer.scene.camera.frustum.fov = Cesium.Math.toRadians(
        this.cameraSetting.fov
      );
    },
    /**
     * 设置地表自适应透明的值
     * */
    setSelfAdaption() {
      // 1 获取地表自适应透明度的间隔高度，自适应透明度范围为[stepHeight, stepHeight * 5]
      const _stepHeight = this._getStepHeight();

      // 2 获取透明度工具
      let _independentTranslucency = this.getImageLayersTranslucencyManager()

      // 3 设置地表自适应透明的值
      if (_independentTranslucency) {
        const { imageryLayers } = _independentTranslucency
        // imageryLayers数组的长度大于0时，表示开启图层透明度独立控制，使用globeFaceAlphaByDistance设置地表自适应透明的值
        if (imageryLayers.length > 0) {
          _independentTranslucency.globeFaceAlphaByDistance = new Cesium.NearFarScalar(_stepHeight, 0, _stepHeight * 5, 1)
        }
        // 否则，使用frontFaceAlphaByDistance设置地表自适应透明的值
        else {
          _independentTranslucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(_stepHeight, 0, _stepHeight * 5, 1)
        }
      }
    },
    /**
     * 关闭地表自适应透明面板
     * */
    closeSelfAdaptionPanel() {
      this.cameraSetting.selfAdaption = false
      if (this.$refs.selfAdaption) {
        this.$refs.selfAdaption.innerChecked = false
        this.$refs.selfAdaption.maxHeight = "0px"
      }
    },
    /**
     * 开启地表自适应透明面板
     * */
    openSelfAdaptionPanel() {
      this.cameraSetting.selfAdaption = true
      if (this.$refs.selfAdaption) {
        this.$refs.selfAdaption.innerChecked = true
        this.$refs.selfAdaption.maxHeight = "fit-content"
      }
    },
    /**
     * 关闭地表自适应透明功能
     * */
    closeSelfAdaption() {
      let _independentTranslucency = this.getImageLayersTranslucencyManager()
      if (_independentTranslucency) {
        _independentTranslucency.globeFaceAlphaByDistance = new Cesium.NearFarScalar(0, 1, 1, 1)
        _independentTranslucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(0, 1, 1, 1)
        _independentTranslucency.backFaceAlphaByDistance = new Cesium.NearFarScalar(0, 1, 1, 1)
      }
    },
    /**
     * 获取控制地表透明度的工具对象
     * @private
     * @return {Cesium.GlobeIndependentTranslucency} 控制地表透明度的工具对象
     * */
    getImageLayersTranslucencyManager() {
      const { vueCesium, vueIndex, vueKey } = this;
      const _independentTranslucency = vueCesium.ImageLayersTranslucencyManager.findSource(vueKey, vueIndex)
      if (_independentTranslucency && _independentTranslucency.source) {
        return _independentTranslucency.source
      }
      return undefined
    },
    /**
     * 初始化控制地表透明度的工具对象
     * @return {Cesium.GlobeIndependentTranslucency} 控制地表透明度的工具对象
     * */
    initImageLayersTranslucencyManager() {
      const { Cesium, vueCesium, vueKey, vueIndex } = this
      let _independentTranslucency = vueCesium.ImageLayersTranslucencyManager.findSource(vueKey, vueIndex);
      if (!_independentTranslucency) {
        _independentTranslucency = new Cesium.GlobeIndependentTranslucency(
          viewer
        )
        // 开启地表透明
        _independentTranslucency.enabled = true
        vueCesium.ImageLayersTranslucencyManager.addSource(vueKey, vueIndex, _independentTranslucency)
      }
      return _independentTranslucency
    },
    /**
     * 获取地表自适应透明高度值
     * @private
     * @return {Number} 地表自适应透明高度值
     * */
    _getStepHeight() {
      let _boundingSphereRadius = this.boundingSphereRadius || 0;
      // 当出现包围球大于400km的图层时，使用400km的阈值
      const _selfAdaptionMaxHeight = this.cameraSetting.selfAdaptionParams.maxHeigh || 400000;
      return  Math.min(_selfAdaptionMaxHeight, _boundingSphereRadius);
    }
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
