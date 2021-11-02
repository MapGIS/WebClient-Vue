<template>
  <div class="mapgis-3d-scene-attr">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">

      <mapgis-ui-form-model-item label="大气渲染" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="skyAtmosphere" @change="enableSkyAtmosphere">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="全局泛光" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="bloom" @change="enableBloom">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" v-show="bloom">

        <mapgis-ui-form-model-item label="泛光亮度">
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

        <mapgis-ui-form-model-item label="泛光对比度">
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

      <mapgis-ui-form-model-item label="地下模式" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="undgrd" @change="enableUndgrd">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="罗盘控件" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="compass" @change="enableNavigation">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="缩放控件" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="zoom" @change="enableNavigation">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <!--      <mapgis-ui-form-model-item label="stage亮度">-->
      <!--        <mapgis-ui-space>-->
      <!--          <mapgis-ui-slider-->
      <!--              v-model="brightness"-->
      <!--              :max="2"-->
      <!--              :min="0"-->
      <!--              :step="0.2"-->
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

      <mapgis-ui-form-model-item label="亮度">
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layerbrightness"
              :max="3"
              :min="0"
              :step="0.2"
              @change="layerBrtChange"
          />
          <mapgis-ui-input-number
              v-model="layerbrightness"
              :max="3"
              :min="0"
              :step="0.2"
              size="small"
              @change="layerBrtChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="对比度">
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layercontrast"
              :max="3"
              :min="0"
              :step="0.2"
              @change="layerCtrstChange"
          />
          <mapgis-ui-input-number
              v-model="layercontrast"
              :max="3"
              :min="0"
              :step="0.2"
              size="small"
              @change="layerCtrstChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="色调">
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layerhue"
              :max="1"
              :min="-1"
              :step="0.1"
              @change="layerHueChange"
          />
          <mapgis-ui-input-number
              v-model="layerhue"
              :max="1"
              :min="-1"
              :step="0.1"
              size="small"
              @change="layerHueChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="饱和度">
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="layersaturation"
              :max="3"
              :min="0"
              :step="0.2"
              @change="layerSaturationChange"
          />
          <mapgis-ui-input-number
              v-model="layersaturation"
              :max="3"
              :min="0"
              :step="0.2"
              size="small"
              @change="layerSaturationChange"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>


    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
// import "@mapgis/cesium/dist/MapGIS/css/mapgis.css"
import "@mapgis/cesium/dist/MapGIS/Tools/Navigation/Styles/navigation-all.css"

export default {
  name: "SceneAttribute",
  mixins: [ServiceLayer],
  props: {
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data() {
    return {
      skyAtmosphere: true,
      bloom: false,
      bloomBrt: -0.3,
      bloomCtrst: 128,
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
    formItemLayout({layout}) {
      return layout === "horizontal"
          ? {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
          }
          : {};
    },
  },
  mounted() {
    const {viewer} = this;
    let bright = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createBrightnessStage()
    );
    bright.uniforms.brightness = this.brightness;
  },
  methods: {
    /*
    * 大气渲染
    * */
    enableSkyAtmosphere() {
      const {viewer} = this;
      viewer.scene.skyAtmosphere.show = this.skyAtmosphere;
    },
    /*
    * 全局泛光
    * */
    enableBloom() {
      const {viewer} = this;
      viewer.scene.postProcessStages.bloom.enabled = this.bloom;
    },
    /*
    * 地下模式
    * */
    enableUndgrd() {
      const {viewer} = this;
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = !this.undgrd;
      viewer.scene.globe.translucency.enabled = this.undgrd;
      viewer.scene.globe.translucency.backFaceAlpha = 1;
      viewer.scene.globe.translucency.frontFaceAlpha = 0.5;
    },

    /*
    * 导航控件（罗盘控件和缩放控件的状态控制）
    * */
    enableNavigation(e) {
      const {viewer} = this;
      if (viewer.cesiumNavigation) {
        viewer.cesiumNavigation.destroy();
      }
      let options = {};
      options.enableCompass = this.compass;
      options.enableZoomControls = this.zoom;
      viewer.createNavigationTool(options);
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
    /*
    * stage亮度
    * */
    brtChange(e) {
      const {viewer} = this;
      this.brightness = e;
      viewer.scene.postProcessStages._activeStages[0]._actualUniforms.brightness = this.brightness;
      // console.log("viewer.scene.postProcessStages",viewer.scene.postProcessStages._activeStages[0])
      // console.log("brt.e",e)
    },
    /*
    * 图层亮度
    * */
    layerBrtChange(e) {
      const {viewer} = this;
      this.layerbrightness = e;
      viewer.scene.imageryLayers._layers[0].brightness = this.layerbrightness;
    },
    /*
    * 图层对比度
    * */
    layerCtrstChange(e) {
      const {viewer} = this;
      this.layercontrast = e;
      viewer.scene.imageryLayers._layers[0].contrast = this.layercontrast;
    },
    /*
    * 图层色调
    */
    layerHueChange(e) {
      const {viewer} = this;
      this.layerhue = e;
      viewer.scene.imageryLayers._layers[0].hue = this.layerhue;
    },
    /*
    * 图层饱和度
    * */
    layerSaturationChange(e) {
      const {viewer} = this;
      this.layersaturation = e;
      viewer.scene.imageryLayers._layers[0].saturation = this.layersaturation;
    },
  },

}
</script>

<style scoped>

.mapgis-3d-scene-attr {
  padding: 10px 0px;
}

.mapgis-ui-form-item {
  margin: 0;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  padding: 0 10px;
}

::v-deep .mapgis-ui-form-item-control{
  text-align: right;
}

::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label:before{
  content: url("titlew.png");
  margin-right: 6px;
}

.mapgis-ui-input-number{
  /*margin-left: 10px;*/
  width: 60px;
}

.mapgis-ui-slider{
  width: 120px;
  min-width: 100px;
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

/*!*设置tab头宽度为80px*!

.mapgis-ui-tabs-nav .mapgis-ui-tabs-tab{
  padding: 12px;
}

.mapgis-ui-tabs-ink-bar[style]{
  width: 80px!important;
}*/

.parameter{
  background: #F1F1F1;
  border-radius: 4px;
  margin-bottom: 10px;
}



</style>