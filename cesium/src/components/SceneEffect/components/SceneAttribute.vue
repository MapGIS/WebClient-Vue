<template>
  <div class="mapgis-3d-scene-attr">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">

      <mapgis-ui-form-model-item label="地球" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="earth" @change="enableEarth">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="太阳" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="sun" @change="enableSun">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="月亮" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="moon" @change="enableMoon">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="深度检测" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="depthTest" @change="enableDepthTest">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="阴影效果" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="shadow" @change="enableShadow">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雾化效果" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="surficialFog" @change="enableSurficialFog">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{ maxHeight: surfFogParams }">

        <mapgis-ui-form-model-item label="密度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="surfFogDst"
                :max="0.002"
                :min="0"
                :step="0.0002"
                @change="enableSurficialFog"
            />
            <mapgis-ui-input-number
                v-model="surfFogDst"
                :max="0.002"
                :min="0"
                :step="0.0002"
                @change="enableSurficialFog"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

        <!-- <mapgis-ui-form-model-item label="最小亮度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="surfFogMinBrt"
                :max="10"
                :min="0"
                @change="enableSurficialFog"
            />
            <mapgis-ui-input-number
                v-model="surfFogMinBrt"
                :max="10"
                :min="0"
                @change="enableSurficialFog"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item> -->

      </div>

      <mapgis-ui-form-model-item label="显示帧率" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="FPS" @change="enableFPS">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>      

      <mapgis-ui-form-model-item label="时间轴" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="timeline" @change="enableTimeline">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="大气渲染" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="skyAtmosphere" @change="enableSkyAtmosphere">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <!-- <mapgis-ui-switch-panel label="大气渲染" :layout="layout" :checked="skyAtmosphere" @changeChecked="enableSkyAtmosphere">
      </mapgis-ui-switch-panel> -->

      <mapgis-ui-form-model-item label="全局泛光" >
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

      <mapgis-ui-form-model-item label="地下模式" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="undgrd" @change="enableUndgrd">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{maxHeight: undgrdParams}">
        <mapgis-ui-form-model-item label="地表透明度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="groundAlpha"
                :max="1"
                :min="0"
                :step="0.1"
                @change="enableUndgrd"
            />
            <mapgis-ui-input-number
                v-model="groundAlpha"
                  :max="1"
                :min="0"
                :step="0.1"
                size="small"
                @change="enableUndgrd"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>        
      </div>

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
import "./navigation-all.css"

export default {
  name: "SceneAttribute",
  mixins: [ServiceLayer],
  props: {
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    },
  },
  data() {
    return {
      earth:true,
      sun:true,
      moon:true,
      depthTest:true,
      shadow:false,
      surficialFog:true,
      surfFogParams:"80px",
      surfFogDst:0.0002,
      // surfFogMinBrt:1,
    
      FPS:false,
      timeline:false,
      skyAtmosphere: true,
      bloom: false,
      bloomParams:undefined,
      bloomBrt: -0.3,
      bloomCtrst: 128,
      
      undgrd: false,
      undgrdParams:undefined,
      groundAlpha:0.5,

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
            labelCol: {span: 7},
            wrapperCol: {span: 17}
          }
          : {};
    },
  },
  mounted() {
    const {viewer, vueKey, vueIndex} = this;
    let bright = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createBrightnessStage()
    );
    bright.uniforms.brightness = this.brightness;

    window.vueCesium.SettingToolManager.addSource(vueKey,vueIndex,null,{
      timeline: null,
    });

  },
  methods: {
    /*
    * 地球
    * */
    enableEarth(){
      const {viewer} = this;
      if(this.earth){
        viewer.scene.skyAtmosphere.show = this.skyAtmosphere
      }else{
        viewer.scene.skyAtmosphere.show = true;
      }
      viewer.scene.globe.show = this.earth;
    },
    /*
    * 太阳
    * */
    enableSun(){
      const {viewer} = this;
      viewer.scene.sun.show = this.sun;
      if(this.sun){
        let sunPosition = viewer.scene.sun._boundingVolume.center;
        viewer.camera.flyTo({
          destination:new Cesium.Cartesian3(-sunPosition.x/1000,-sunPosition.y/1000,-sunPosition.z/2000),
          orientation:{heading:0,pitch:Cesium.Math.toRadians(-90),roll:0},
          duration:0.5
        })
      }else{
        viewer.camera.flyHome(0.5);
      }
    },
    /*
    * 月亮
    * */
    enableMoon(){
      const {viewer} = this;
      viewer.scene.moon.show = this.moon;
      
      if(this.moon){
        console.log("iiiiimmmmiiiii",viewer.scene.moon);
        let moonPosition = viewer.scene.moon._ellipsoidPrimitive._boundingSphere.center;
        viewer.camera.flyTo({
          destination:new Cesium.Cartesian3(moonPosition.x/1.2,moonPosition.y/1.2,moonPosition.z/1.2),
          orientation:{heading:0,pitch:Cesium.Math.toRadians(90),roll:0},
          duration:0.5
        })
      }else{
        viewer.camera.flyHome(0.5);
      }
    },
    /*
    * 深度检测
    * */
    enableDepthTest(){
      const {viewer} = this;
      viewer.scene.globe.depthTestAgainstTerrain = this.depthTest;
    },
    /*
    * 阴影效果
    * */
    enableShadow(){
      const {viewer,Cesium} = this;
      viewer.shadows = this.shadow;
      // viewer.terrainShadows = this.shadow ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
      // viewer.scene.globe.shadows = this.shadow ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
    },
    
    /*
    * 雾化效果
    * */
    enableSurficialFog(){
      const {viewer} = this;
      let vm = this;

      if(vm.surficialFog){
        this.surfFogParams = "40px"
      }else{
        this.surfFogParams = "0px"
      }
      viewer.scene.fog.density = this.surfFogDst;
      // viewer.scene.fog.minimumBrightness = this.surfFogMinBrt;
      viewer.scene.fog.enabled = this.surficialFog;
    },
    /*
    * 显示帧率
    * */
    enableFPS(){
      const {viewer} = this;
      viewer.scene.debugShowFramesPerSecond = this.FPS;
    },
    /*
    * 开启时间轴 
    * */
    enableTimeline(){
      const {viewer,Cesium,vueKey, vueIndex} = this;
      let vm = this;
      if(vm.timeline){
        
        let list = document.getElementsByClassName('cesium-viewer-timelineContainer');
        console.log("list",list);

        if(list.length > 0){
          list[0].parentNode.removeChild(list[0]);
          // let list = document.getElementsByClassName('cesium-viewer-timelineContainer');
          // console.log("listdelete",list);
          // document.removeChild(document.getElementsByClassName('cesium-viewer-timelineContainer')[0]);
        }

        var viewerContainer = viewer.container;
        var timelineContainer = document.createElement('div');
        timelineContainer.className = 'cesium-viewer-timelineContainer';

        viewerContainer.appendChild(timelineContainer);
        let timeline = new Cesium.Timeline(timelineContainer, viewer.clock);
        timeline.addEventListener('settime', vm.onTimelineScrubfunction, false);
        timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
        window.vueCesium['SettingToolManager'].changeOptions(vueKey, vueIndex, 'timeline', timeline);

      }else{
        const { vueKey, vueIndex} = this;
        let manager = window.vueCesium['SettingToolManager'].findSource(vueKey, vueIndex );
        if (manager.options && manager.options.timeline) {
          manager.options.timeline.destroy();
          window.vueCesium['SettingToolManager'].changeOptions(vueKey, vueIndex, 'timeline', null);
        }
      }
    },

    onTimelineScrubfunction(e) {
        var clock = e.clock;
        console.log("e",e);
        clock.currentTime = e.timeJulian;
        clock.shouldAnimate = false;
    },
    /*
    * 大气渲染
    * */
    enableSkyAtmosphere(e) {
      const {viewer} = this;
      this.skyAtmosphere = e;
      viewer.scene.skyAtmosphere.show = this.skyAtmosphere;
    },
    /*
    * 全局泛光
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
    * 地下模式
    * */
    enableUndgrd() {
      const {viewer} = this;
      this.$emit('updateSpin',true);
      let vm = this;
      

     if(vm.undgrd){
        vm.undgrdParams = "40px"
      }else{
        vm.undgrdParams = "0px"
      }

      setTimeout(function () {
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = !vm.undgrd;
        viewer.scene.globe.translucency.enabled = vm.undgrd;
        //设置地表透明度
        viewer.scene.globe.translucency.backFaceAlpha = vm.groundAlpha;
        viewer.scene.globe.translucency.frontFaceAlpha = vm.groundAlpha;



        //最小缩放距离
        //viewer.scene.screenSpaceCameraController.minimumZoomDistance = ;

        vm.$emit('updateSpin',false);
      },300)
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

/* .mapgis-3d-scene-attr {
} */

.mapgis-ui-form-item {
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
  /*margin-bottom: 10px;*/
  overflow: hidden;
  max-height: 0px;
  transition:max-height .5s;
  -moz-transition:max-height .5s; /* Firefox 4 */
  -webkit-transition:max-height .5s; /* Safari and Chrome */
  -o-transition:max-height .5s; /* Opera */
}

/*::v-deep .mapgis-ui-col-6{*/
/*  padding-right: 16px;*/
/*}*/
</style>