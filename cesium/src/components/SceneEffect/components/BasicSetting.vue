<template>
  <div class="basic-setting">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">
      
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel size="small" label="地球" :checked="earth" @changeChecked="enableEarth"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel size="small" label="大气层" :checked="skyAtmosphere" @changeChecked="enableSkyAtmosphere"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="阴影效果" :checked="shadow" @changeChecked="enableShadow"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="深度检测" :checked="depthTest" @changeChecked="enableDepthTest"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
          
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="显示帧率" :checked="FPS" @changeChecked="enableFPS"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="时间轴" :checked="timeline" @changeChecked="enableTimeline"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="罗盘控件" :checked="compass" @changeChecked="enableCompass"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="缩放控件" :checked="zoom" @changeChecked="enableZoom"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel class="odd" size="small" label="状态栏" :checked="statebar" @changeChecked="handleChangeStatebar"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <div class="dividerWrapper"><div class="divider"/></div>

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
    <mapgis-3d-statebar v-if="statebar" :frame="60" :bottomMap="true" />
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
    initialStatebar: {
      type: Boolean,
      default: false,
    }
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
      statebar: this.initialStatebar,
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

    handleChangeStatebar(next) {
      console.log(next);
      this.statebar = next;
    }
  },

}
</script>

<style scoped>
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(odd) .mapgis-ui-switch-panel{
  padding-right: 10px;
}
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(even) .mapgis-ui-switch-panel::before{
  content: "";
  display: block;
  width: 1px;
  height: 14px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  background: #DCDCDC;
}
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(even) .mapgis-ui-switch-panel{
  padding-left: 10px;
}
.dividerWrapper{
  height: 13px;
}
.divider{
  display: block;
  height: 1px;
  position: absolute;
  left: 16px;
  right: 16px;
  margin: 6px 0;
  background: #F0F0F0 ;
}
</style>