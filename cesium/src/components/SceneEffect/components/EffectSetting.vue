<template>
  <div class="effect-setting">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left" class="formStyle" :colon="false">

      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="黑白照片" :checked="blckWhite" @changeChecked="blackAndWhiteChange"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="夜视效果" :checked="ntVision" @changeChecked="nightVision"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-switch-panel label="场景泛光" :checked="bloom" @changeChecked="enableBloom">
        <mapgis-ui-form-model-item label="亮度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="bloomBrt"
                :max="0.2"
                :min="-0.6"
                :step="0.05"
                @change="bloomBrtChange"
            />
            <mapgis-ui-input-number
                v-model="bloomBrt"
                :max="0.2"
                :min="-0.6"
                :step="0.05"
                size="small"
                @change="bloomBrtChange"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

        <mapgis-ui-form-model-item label="对比度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="bloomCtrst"
                :max="255"
                :min="-255"
                :step="10"
                @change="bloomCtrstChange"
            />
            <mapgis-ui-input-number
                v-model="bloomCtrst"
                :max="255"
                :min="-255"
                :step="10"
                size="small"
                @change="bloomCtrstChange"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>
      </mapgis-ui-switch-panel>

    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "EffectSetting",
  mixins: [ServiceLayer],
  props:{
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data (){
    return {
      bloom: false,
      bloomParams:undefined,
      bloomBrt: -0.3,
      bloomCtrst: 128,

      blckWhite: false,
      ntVision: false,

    }
  },
  computed: {
    formItemLayout({ layout }) {
      return layout === "horizontal"
          ? {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
          }
          : {};
    }
  },
  methods: {
    /*
    * 场景泛光
    * */
    enableBloom(e) {
      const {viewer} = this;
      this.bloom = e;
      this.$emit('updateSpin',true);
      let vm = this;

      setTimeout(function () {
        viewer.scene.postProcessStages.bloom.enabled = vm.bloom;
        vm.$emit('updateSpin',false);
      },400)
    },
    /*
    * 泛光亮度
    * */
    bloomBrtChange() {
      const {viewer} = this;
      viewer.scene.postProcessStages.bloom.uniforms.brightness = this.bloomBrt;
    },
    /*
    * 泛光对比度
    * */
    bloomCtrstChange() {
      const {viewer} = this;
      viewer.scene.postProcessStages.bloom.uniforms.contrast = this.bloomCtrst;
    },

    //黑白照片
    blackAndWhiteChange(e) {
      const { viewer,Cesium } = this;
      this.blckWhite = e;
      let vm = this;
      if (vm.blckWhite) {
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
      const { viewer,Cesium } = this;
      this.ntVision = e;
      let vm = this;
      if (vm.ntVision) {
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
  },
}
</script>

<style scoped>

/* .effect-setting {
} */

.mapgis-ui-form-item{
  margin: 0;
  padding: 0 10px;
}

::v-deep .mapgis-ui-form-item-control{
  text-align: right;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
}

/*::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label{*/
/*  padding-left: 11px!important;*/
/*}*/

.mapgis-ui-input-number{
  /* margin-right: 12px; */
  width: 60px;
}

.mapgis-ui-slider{
  width: 110px;
}

::v-deep .mapgis-ui-slider-rail{
  background-color: #F0F0F0;
}

::v-deep .parameter .mapgis-ui-slider-rail{
  background-color: #FFFFFF;
}
::v-deep .mapgis-ui-slider-track{
  background-color: #91D5FF;
}
::v-deep .mapgis-ui-slider-handle{
  border: 2px solid #91D5FF;
}

</style>