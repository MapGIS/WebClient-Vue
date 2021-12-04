<template>
  <div class="basic-setting">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">
      
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="地球" :checked="earth" @changeChecked="enableEarth"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="大气层" :checked="skyAtmosphere" @changeChecked="enableSkyAtmosphere"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="阴影效果" :checked="shadow" @changeChecked="enableShadow"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="深度检测" :checked="depthTest" @changeChecked="enableDepthTest"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
          
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="显示帧率" :checked="FPS" @changeChecked="enableFPS"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="时间轴" :checked="timeline" @changeChecked="enableTimeline"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="罗盘控件" :checked="compass" @changeChecked="enableCompass"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="缩放控件" :checked="zoom" @changeChecked="enableZoom"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="状态栏" :checked="statebar" @changeChecked="enableStatebar"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-input-number-panel 
        size="small"
        label="亮度" 
        :value="layerbrightness" 
        :range="lyrBrtRange"
        :step="0.2" 
        @change="layerBrtChange"
      >
      </mapgis-ui-input-number-panel> 

      <mapgis-ui-input-number-panel 
        size="small"
        label="对比度" 
        :value="layercontrast" 
        :range="lyrBrtRange"
        :step="0.2" 
        @change="layerCtrstChange"
      >
      </mapgis-ui-input-number-panel>

      <mapgis-ui-input-number-panel 
        size="small"
        label="色调" 
        :value="layerhue" 
        :range="lyrHueRange"
        :step="0.1" 
        @change="layerHueChange"
      >
      </mapgis-ui-input-number-panel>  

      <mapgis-ui-input-number-panel 
        size="small"
        label="饱和度" 
        :value="layersaturation" 
        :range="lyrBrtRange"
        :step="0.2" 
        @change="layerSaturationChange"
      >
      </mapgis-ui-input-number-panel>  

    </mapgis-ui-form-model>
  </div> 
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
// import "@mapgis/cesium/dist/MapGIS/css/mapgis.css"
import "./navigation-all.css"
import StateBar from "../../UI/Controls/State/StateControl.vue"

export default {
  name: "BasicSetting",
  mixins: [ServiceLayer,StateBar],
  props: {
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    },
  },
  data() {
    return {
      earth:true,
      skyAtmosphere: true,
      
      shadow:false,
      depthTest:true,
      
      FPS:false,
      timeline:false,      
      compass: false,
      zoom: false,
      statebar:false,
      // longitude:undefined,
      // latitude:undefined,
      // height:undefined,
      // cameraHeight:undefined,

      layerbrightness: 1,
      lyrBrtRange:[0,3],
      layercontrast: 1,
      layerhue: 0,
      lyrHueRange:[-1,1],
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
    const {vueKey, vueIndex} = this;

    window.vueCesium.SettingToolManager.addSource(vueKey,vueIndex,null,{
      timeline: null,
    });

  },
  watch: {
    longitude:{
      handler:function(){
        this.enableStatebar();
      }
    },
    latitude:{
      handler:function(){
        this.enableStatebar();
      }
    },
    height:{
      handler:function(){
        this.enableStatebar();
      }
    },
    cameraHeight:{
      handler:function(){
        this.enableStatebar();
      }
    }
  },
  methods: {
    /*
    * 地球
    * */
    enableEarth(e){
      const {viewer} = this;
      this.earth = e;
      if(this.earth){
        viewer.scene.skyAtmosphere.show = this.skyAtmosphere
      }else{
        viewer.scene.skyAtmosphere.show = false;
      }
      viewer.scene.globe.show = this.earth;
    },
    /*
    * 大气层
    * */
    enableSkyAtmosphere(e) {
      const {viewer} = this;
      this.skyAtmosphere = e;
      viewer.scene.skyAtmosphere.show = this.skyAtmosphere;
    },

    /*
    * 阴影效果
    * */
    enableShadow(e){
      const {viewer,Cesium} = this;
      this.shadow = e;
      viewer.shadows = this.shadow;
    },
    /*
    * 深度检测
    * */
    enableDepthTest(e){
      const {viewer} = this;
      this.depthTest = e;
      viewer.scene.globe.depthTestAgainstTerrain = this.depthTest;
    },
  
    /*
    * 显示帧率
    * */
    enableFPS(e){
      const {viewer} = this;
      this.FPS = e;
      viewer.scene.debugShowFramesPerSecond = this.FPS;
    },

    /*
    * 开启时间轴 
    * */
    enableTimeline(e){
      const {viewer,Cesium,vueKey, vueIndex} = this;
      this.timeline = e;
      let vm = this;
      if(vm.timeline){

        let list = document.getElementsByClassName('cesium-viewer-timelineContainer');
        // console.log("list",list);

        if(list.length > 0){
          list[0].parentNode.removeChild(list[0]);
        }

        var viewerContainer = viewer.container;
        var timelineContainer = document.createElement('div');
        timelineContainer.className = 'cesium-viewer-timelineContainer'; 
        timelineContainer.style = 'left:0px;right:0px';
        
        if(vm.statebar){
          //改变时间轴的上下位置
          vm.$nextTick(function(){
            let list = document.getElementsByClassName('scene-setting-statebar');
            let style = window.getComputedStyle(list[0]);
            if(style.bottom === '0px'){
              timelineContainer.style.bottom = '30px';
            }  
          });
        }

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
                
        let list = document.getElementsByClassName('cesium-viewer-timelineContainer');
        // console.log("list",list);

        if(list.length > 0){
          list[0].parentNode.removeChild(list[0]);
        }
      }
    },

    onTimelineScrubfunction(e) {
        var clock = e.clock;
        // console.log("e",e);
        clock.currentTime = e.timeJulian;
        clock.shouldAnimate = false;
    },
    /*
    * 导航控件（罗盘控件和缩放控件的状态控制）
    * */
    enableCompass(e) {
      const {viewer} = this;
      this.compass = e;
      if (viewer.cesiumNavigation) {
        viewer.cesiumNavigation.destroy();
      }
      let options = {};
      options.enableCompass = this.compass;
      options.enableZoomControls = this.zoom;
      viewer.createNavigationTool(options);
      // this.changeNavPos();
    },
    /*
    * 导航控件（罗盘控件和缩放控件的状态控制）
    * */
    enableZoom(e) {
      const {viewer} = this;
      this.zoom = e;
      if (viewer.cesiumNavigation) {
        viewer.cesiumNavigation.destroy();
      }
      let options = {};
      options.enableCompass = this.compass;
      options.enableZoomControls = this.zoom;
      viewer.createNavigationTool(options);
      // this.changeNavPos();
    },
    /*
    * 开启状态栏 
    * */
    enableStatebar(e){
      const {viewer} = this;
      
      if(typeof e === 'boolean'){this.statebar = e;}

      let vm = this;

      if(vm.statebar){
        
        let list = document.getElementsByClassName('scene-setting-statebar');
        // console.log("list",list);

        if(list.length > 0){
          list[0].parentNode.removeChild(list[0]);
        }

        vm.showPosition();
        var viewerContainer = viewer.container;
        var stateContainer = document.createElement('div');
        stateContainer.className = 'scene-setting-statebar';
        stateContainer.innerHTML = '经度:'+ vm.longitude + '°，纬度:' + vm.latitude 
          +'°， 海拔高度:' + vm.height + '米，相机高度:' + vm.cameraHeight + '米';
         
        stateContainer.style = 'position: absolute;height: fit-content;line-height: 30px;' 
          + 'text-align:center;color: #f0efef;background-color: rgba(31, 31, 31, 0.6);'
          + 'z-index: 9999;left:0px;right:0px;bottom:0px';

        // 改变状态栏的上下位置
        if(vm.timeline){
          vm.$nextTick(function(){
            let list = document.getElementsByClassName('cesium-viewer-timelineContainer');
            let style = window.getComputedStyle(list[0]);
            if(style.bottom === '0px'){
              stateContainer.style.bottom = '24px';
            }  
          });
        }

        viewerContainer.appendChild(stateContainer);

      }else{
        let list = document.getElementsByClassName('scene-setting-statebar');
        // console.log("list",list);
        if(list.length > 0){
          list[0].parentNode.removeChild(list[0]);
        }
        vm.unmount();
      }
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
</style>