<template>
  <div class="effect-setting">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left" class="formStyle" :colon="false">
      <mapgis-ui-form-model-item label="场景泛光" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="bloom" @change="enableBloom">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{maxHeight: bloomParams}">
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
      </div>

      <mapgis-ui-form-model-item label="黑白照片" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="blckWhite" @change="blackAndWhiteChange">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="夜视效果" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="ntVision" @change="nightVision">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

<!--      <mapgis-ui-form-model-item label="其它特效">-->
<!--        <mapgis-ui-space>-->
<!--          <mapgis-ui-checkbox :checked="blckWhite" @change="blackAndWhiteChange">黑白照片-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="ntVision" @change="nightVision" >夜视效果-->
<!--          </mapgis-ui-checkbox>-->
<!--        </mapgis-ui-space>-->
<!--      </mapgis-ui-form-model-item>-->

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

      if(vm.bloom){
        vm.bloomParams = "80px"
      }else{
        vm.bloomParams = "0px"
      }

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

      if (length > 1) {
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

::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label:before{
  content: url("titlew.png");
  margin-right: 6px;
}

/*::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label{*/
/*  padding-left: 11px!important;*/
/*}*/

.mapgis-ui-input-number{
  margin-right: 12px;
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

.parameter{
  background: #F1F1F1;
  border-radius: 4px;
  /*margin-bottom: 10px;*/
  overflow: hidden;
  max-height: 0px;
  transition:max-height .5s;
  -moz-transition:max-height .5s; /* Firefox 4 */
  -webkit-transition:max-height .5s; /* Safari and Chrome */
  -o-transition:max-height .5s; /* Opera */
}

</style>