<template>
  <div>
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left">

      <mapgis-ui-form-model-item :wrapperCol="{span: 24}">
          <mapgis-ui-checkbox :checked="enableSkyAtmosphere" @change="skyAtChange">大气渲染
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="enableBloom" @change="bloomChange" >全局泛光
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="undgrd" @change="undgrdChange" >地下模式
          </mapgis-ui-checkbox>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item :wrapperCol="{span: 24}">
          <mapgis-ui-checkbox :checked="compass" @change="enableCmps">罗盘控件
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="zoom" @change="enableZm">缩放控件
          </mapgis-ui-checkbox>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="对比度bloom" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="contrast"
              :disabled="disabled"
              :max="255"
              :min="-255"
              :step="10"
              :style="{ minWidth: '100px' }"
              size="small"
              @change="ctrstChange"
          />
          <mapgis-ui-input-number
              v-model="contrast"
              :disabled="disabled"
              :max="255"
              :min="-255"
              :step="10"
              style="marginLeft: 16px"
              size="small"
              @change="ctrstChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="亮度layer" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layerbrightness"
              :max="3"
              :min="0"
              :step="0.2"
              :style="{ minWidth: '100px' }"
              size="small"
              @change="layerBrtChange"
          />
          <mapgis-ui-input-number
              v-model="layerbrightness"
              :max="3"
              :min="0"
              :step="0.2"
              style="marginLeft: 16px"
              size="small"
              @change="layerBrtChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="对比度layer" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layercontrast"
              :max="3"
              :min="0"
              :step="0.2"
              :style="{ minWidth: '100px' }"
              size="small"
              @change="layerCtrstChange"
          />
          <mapgis-ui-input-number
              v-model="layercontrast"
              :max="3"
              :min="0"
              :step="0.2"
              style="marginLeft: 16px"
              size="small"
              @change="layerCtrstChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="色调layer" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layerhue"
              :max="1"
              :min="-1"
              :step="0.1"
              :style="{ minWidth: '100px' }"
              size="small"
              @change="layerHueChange"
          />
          <mapgis-ui-input-number
              v-model="layerhue"
              :max="1"
              :min="-1"
              :step="0.1"
              style="marginLeft: 16px"
              size="small"
              @change="layerHueChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="饱和度layer" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layersaturation"
              :max="3"
              :min="0"
              :step="0.2"
              :style="{ minWidth: '100px' }"
              size="small"
              @change="layerSaturationChange"
          />
          <mapgis-ui-input-number
              v-model="layersaturation"
              :max="3"
              :min="0"
              :step="0.2"
              style="marginLeft: 16px"
              size="small"
              @change="layerSaturationChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <!--      <mapgis-ui-form-model-item label="亮度stage" >-->
      <!--        <mapgis-ui-space>-->
      <!--          <mapgis-ui-slider-->
      <!--              v-model="brightness"-->
      <!--              :max="2"-->
      <!--              :min="0"-->
      <!--              :step="0.2"-->
      <!--              :style="{ minWidth: '100px' }"-->
      <!--              size="small"-->
      <!--              @change="brtChange"-->
      <!--          />-->
      <!--          <mapgis-ui-input-number-->
      <!--              v-model="brightness"-->
      <!--              :max="2"-->
      <!--              :min="0"-->
      <!--              :step="0.2"-->
      <!--              size="small"-->
      <!--              @change="brtChange"-->
      <!--          />-->
      <!--        </mapgis-ui-space>-->
      <!--      </mapgis-ui-form-model-item>-->


    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";

export default {
  name: "SceneAttribute",
  mixins: [ServiceLayer],
  props:{
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data(){
    return{
      enableSkyAtmosphere: true,
      enableBloom: false,
      contrast: 128,
      disabled: !this.enableBloom,
      undgrd: false,
      compass: false,
      zoom: false,

      brightness: 1,
      layerbrightness: 1,
      layercontrast: 1,
      layerhue: 0,
      layersaturation: 1,
    }
  },
  computed: {
    formItemLayout({ layout }) {
      return layout === "horizontal"
          ? {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }
          : {};
    }
  },
  mounted() {
    const { viewer } = this;
    let bright = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createBrightnessStage()
    );
    bright.uniforms.brightness = this.brightness;
  },
  methods:{
    skyAtChange(e) {
      const { viewer } = this;
      // console.log(`checked = ${e.target.checked}`);
      this.enableSkyAtmosphere = e.target.checked;
      viewer.scene.skyAtmosphere.show = this.enableSkyAtmosphere;
    },
    bloomChange(e) {
      const { viewer } = this;
      // console.log(`checked = ${e.target.checked}`);
      this.enableBloom = e.target.checked;
      viewer.scene.postProcessStages.bloom.enabled = this.enableBloom;
      this.disabled = !this.enableBloom;
    },
    undgrdChange(e) {
      const { viewer } = this;
      this.undgrd = e.target.checked;
      viewer.scene.globe.translucency.enabled = this.undgrd;
      viewer.scene.globe.translucency.backFaceAlpha = 1;
      viewer.scene.globe.translucency.frontFaceAlpha = 0.5;
    },

    enableCmps(e){
      const {viewer} = this;
      this.compass = e.target.checked;
      viewer.createNavigationTool({ enableCompass: true, enableZoomControls: true, enableDistanceLegend: true });
    },
    enableZm(e){
      const {viewer} = this;
      this.zoom = e.target.checked;
      let pos;
      if(this.zoom){
        viewer.createNavigationTool({ enableCompass: true, enableZoomControls: this.zoom, enableDistanceLegend: true });
      }else{
        viewer.createNavigationTool({ enableCompass: true, enableZoomControls: this.zoom, enableDistanceLegend: true });
      }
    },
    ctrstChange(e) {
      const { viewer } = this;
      this.contrast = e;
      console.log("wwww", e);
      viewer.scene.postProcessStages.bloom.uniforms.contrast = this.contrast;
      console.log(
          "viewer.scene.postProcessStages.bloom.uniforms.contrast",
          viewer.scene.postProcessStages.bloom.uniforms.contrast
      );
    },

    brtChange(e) {
      const { viewer } = this;
      this.brightness = e;
      viewer.scene.postProcessStages._activeStages[0]._actualUniforms.brightness = this.brightness;
      // console.log("viewer.scene.postProcessStages",viewer.scene.postProcessStages._activeStages[0])
      // console.log("brt.e",e)
    },
    layerBrtChange(e) {
      const { viewer } = this;
      this.layerbrightness = e;
      viewer.scene.imageryLayers._layers[0].brightness = this.layerbrightness;
    },
    layerCtrstChange(e) {
      const { viewer } = this;
      this.layercontrast = e;
      viewer.scene.imageryLayers._layers[0].contrast = this.layercontrast;
    },

    layerHueChange(e) {
      const { viewer } = this;
      this.layerhue = e;
      viewer.scene.imageryLayers._layers[0].hue = this.layerhue;
    },
    layerSaturationChange(e) {
      const { viewer } = this;
      this.layersaturation = e;
      viewer.scene.imageryLayers._layers[0].saturation = this.layersaturation;
    },
  },

}
</script>

<style scoped>
.mapgis-ui-form-item{
  margin: 0;
}
</style>