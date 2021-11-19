<template>
  <div class="basic-setting">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">

      <mapgis-ui-form-model-item label="地球" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="earth" @change="enableEarth">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="大气层" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="skyAtmosphere" @change="enableSkyAtmosphere">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <!-- <mapgis-ui-switch-panel label="大气层" :layout="layout" :checked="skyAtmosphere" @changeChecked="enableSkyAtmosphere">
      </mapgis-ui-switch-panel> -->
      
      <mapgis-ui-form-model-item label="阴影效果" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="shadow" @change="enableShadow">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="深度检测" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="depthTest" @change="enableDepthTest">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="显示帧率" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="FPS" @change="enableFPS">
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

      <mapgis-ui-form-model-item label="时间轴" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="timeline" @change="enableTimeline">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

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
  name: "BasicSetting",
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
      skyAtmosphere: true,
      
      shadow:false,
      depthTest:true,
      
      FPS:false,
      compass: false,
      zoom: false,
      timeline:false,

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
    const {vueKey, vueIndex} = this;

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
    enableShadow(){
      const {viewer,Cesium} = this;
      viewer.shadows = this.shadow;
    },
    /*
    * 深度检测
    * */
    enableDepthTest(){
      const {viewer} = this;
      viewer.scene.globe.depthTestAgainstTerrain = this.depthTest;
    },

  
    /*
    * 显示帧率
    * */
    enableFPS(){
      const {viewer} = this;
      viewer.scene.debugShowFramesPerSecond = this.FPS;
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
    * 开启时间轴 
    * */
    enableTimeline(){
      const {viewer,Cesium,vueKey, vueIndex} = this;
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
        // console.log("e",e);
        clock.currentTime = e.timeJulian;
        clock.shouldAnimate = false;
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

/* .basic-setting {
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