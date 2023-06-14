<template>
  <div class="effect-setting">
    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="黑白照片"
          :checked="effectSetting.blckWhite"
          @changeChecked="blackAndWhiteChange"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="夜视效果"
          :checked="effectSetting.ntVision"
          @changeChecked="nightVision"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-switch-panel
      size="default"
      label="场景泛光"
      :checked="effectSetting.bloom"
      @changeChecked="enableBloom"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="亮度"
        :value="effectSetting.bloomParams.bloomBrt"
        :range="bloomBrtRange"
        :step="0.05"
        @change="bloomBrtChange"
      />

      <mapgis-ui-input-number-panel
        size="large"
        label="对比度"
        :value="effectSetting.bloomParams.bloomCtrst"
        :range="bloomCtrstRange"
        :step="10"
        @change="bloomCtrstChange"
      />
    </mapgis-ui-switch-panel>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "EffectSetting",
  mixins: [ServiceLayer],
  props: {
    initEffectSetting: {
      type: Object,
      default: () => {
        return {
          blckWhite: false,
          ntVision: false,
          bloom: false,
          bloomParams: {
            bloomBrt: -0.3,
            bloomCtrst: 128
          }
        };
      }
    },
    initFavoritesEffectSetting: { type: Object }
  },
  computed: {
    effectSetting: {
      get() {
        return this.initEffectSetting;
      },
      set() {
        this.$emit("updateEffectSetting", this.effectSetting);
      }
    }
  },
  data() {
    return {
      bloomBrtRange: [-0.6, 0.2],
      bloomCtrstRange: [-255, 255]
    };
  },
  watch: {
    initEffectSetting: {
      handler(e) {
        this.init();
      },
      deep: true,
      immediate: true
    },
    initFavoritesEffectSetting: {
      handler(e) {
        this.setFavoritesConfig();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      if (!this.effectSetting) {
        return;
      }
      const { blckWhite, ntVision, bloom, bloomParams } = this.effectSetting;
      const { bloomBrt, bloomCtrst } = bloomParams;
      this.enableBloom(bloom);
      if (bloom) {
        this.bloomBrtRange(bloomBrt);
        this.bloomCtrstRange(bloomCtrst);
      }
      this.blackAndWhiteChange(blckWhite);
      this.nightVision(ntVision);
    },
    /*
     * 场景泛光
     * */
    enableBloom(e) {
      const { viewer } = this;
      this.effectSetting.bloom = e;
      this.$emit("updateSpin", true);
      let vm = this;

      setTimeout(function() {
        viewer.scene.postProcessStages.bloom.enabled = vm.effectSetting.bloom;
        vm.$emit("updateSpin", false);
      }, 400);
    },
    /*
     * 泛光亮度
     * */
    bloomBrtChange(e) {
      const { viewer } = this;
      this.effectSetting.bloomParams.bloomBrt = e;
      viewer.scene.postProcessStages.bloom.uniforms.brightness = this.effectSetting.bloomParams.bloomBrt;
    },
    /*
     * 泛光对比度
     * */
    bloomCtrstChange(e) {
      const { viewer } = this;
      this.effectSetting.bloomParams.bloomCtrst = e;
      viewer.scene.postProcessStages.bloom.uniforms.contrast = this.effectSetting.bloomParams.bloomCtrst;
    },

    //黑白照片
    blackAndWhiteChange(e) {
      const { viewer, Cesium } = this;
      this.effectSetting.blckWhite = e;
      let vm = this;
      if (vm.effectSetting.blckWhite) {
        vm.removeOtherStages();

        let blackAndWhite = viewer.scene.postProcessStages.add(
          Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
        );
        blackAndWhite.uniforms.gradations = 5.0; //(灰度级数)
      } else {
        vm.removeOtherStages();
      }
    },
    //夜视效果
    nightVision(e) {
      const { viewer, Cesium } = this;
      this.effectSetting.ntVision = e;
      let vm = this;
      if (vm.effectSetting.ntVision) {
        vm.removeOtherStages();
        viewer.scene.postProcessStages.add(
          Cesium.PostProcessStageLibrary.createNightVisionStage()
        );
      } else {
        vm.removeOtherStages();
      }
    },
    removeOtherStages() {
      const { viewer } = this;
      let length = viewer.scene.postProcessStages._activeStages.length;

      if (length > 0) {
        viewer.scene.postProcessStages.removeAll();
      }
    },
    setFavoritesConfig() {
      if (this.initFavoritesEffectSetting) {
        Object.keys(this.initFavoritesEffectSetting).forEach(item => {
          if (
            this.initFavoritesEffectSetting[item] !== this.effectSetting[item]
          ) {
            this.effectSetting[item] = this.initFavoritesEffectSetting[item];
          }
        });
      }
    }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(odd) .mapgis-ui-switch-panel {
  padding-right: 10px;
}

::v-deep
  .mapgis-ui-row
  .mapgis-ui-col:nth-child(even)
  .mapgis-ui-switch-panel::before {
  content: "";
  display: block;
  width: 1px;
  height: 14px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  background: #dcdcdc;
}

::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(even) .mapgis-ui-switch-panel {
  padding-left: 10px;
}

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
