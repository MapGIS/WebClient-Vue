<template>
  <div class="mapgis-3d-scene-setting">
    <div v-show="show" :style="panelStyle" class="setting-control">
          
      <!-- <div class="control-header" >
            <label class="title">设置</label>
            <div @mouseenter="hover=true" @mouseleave="hover=false">
              <img v-show="!hover" class="closeButton2" src="./components/关闭2.png" @click="closePanel">
              <img v-show="hover" class="closeButton2" src="./components/关闭2hover.png" @click="closePanel">
            </div>
      </div>
       -->
      <mapgis-ui-tabs
              :animated="false"
              :tabBarStyle="tabBarStyle"
              default-active-key="1"
              :tabBarGutter="0"
          >
            <mapgis-ui-tab-pane key="1" tab="基本设置" class="control-content" style="padding:12px">
              <basic-setting ref="attr" :layout="layout" @updateSpin="changeSpinning"></basic-setting>
            </mapgis-ui-tab-pane>
            <mapgis-ui-tab-pane key="2" force-render tab="相机" class="control-content">
              <camera-setting ref="effect" :layout="layout" @updateSpin="changeSpinning"></camera-setting>
            </mapgis-ui-tab-pane>
            <mapgis-ui-tab-pane key="3" force-render tab="光照" class="control-content">
              <light-setting ref="effect" :layout="layout" @updateSpin="changeSpinning"></light-setting>
            </mapgis-ui-tab-pane>
            <mapgis-ui-tab-pane key="4" force-render tab="天气" class="control-content">
              <weather-setting ref="effect" :layout="layout" @updateSpin="changeSpinning"></weather-setting>
            </mapgis-ui-tab-pane>
            <mapgis-ui-tab-pane key="5" force-render tab="特效" class="control-content">
              <effect-setting ref="effect" :layout="layout" @updateSpin="changeSpinning"></effect-setting>
            </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
    </div>
    <!-- <mapgis-ui-button class="openButton" shape="circle" type="primary" @click="openPanel">
      <mapgis-ui-iconfont type="mapgis-setting"/>
    </mapgis-ui-button> -->
    <mapgis-ui-spin :spinning="spinning" size="large" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import BasicSetting from "./components/BasicSetting";
import CameraSetting from "./components/CameraSetting";
import LightSetting from "./components/LightSetting";
import WeatherSetting from "./components/WeatherSetting";
import EffectSetting from "./components/EffectSetting";

export default {
  name: "mapgis-3d-scene-setting",
  components: {
    BasicSetting,
    CameraSetting,
    LightSetting,
    WeatherSetting,
    EffectSetting
  },
  mixins: [ServiceLayer],
  props: {
    /**
    * 组件的布局方式，有'horizontal' 'vertical' 'inline'三种选项。
    */
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    },
    /**
     * 面板样式
     */
    panelStyle: {
      type: Object,
    }
  },
  data() {
    return {
    //   initial: false,
      modelBloom: false,
      transform: undefined,
      tabBarStyle: {
        margin: '0px',
        textAlign: "center",
        borderBottom: "1px solid #F0F0F0",

      },
      show: true,
      hover: false,
      spinning: false
    };
  },

  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount(){
      // this.initial = true;
      this.$emit("load", this);
    },
    unmount(){
      this.$_deleteManger("SettingToolManager", function (manager) {
        console.log('destroyed');
      });
      this.$emit("unload");
    },
    openPanel() {
      this.show = !this.show;
    },

    closePanel() {
      this.show = false;
    },

    changeSpinning(e){
      this.spinning = e;
    }

  }
};
</script>

<style scoped>

.setting-control {
  /* width: 320px; */
  /* max-width: 320px; */
  height: fit-content;
  /* position: absolute;
  top: 30px;
  left: 30px; */
  /* padding: 0 10px; */
  background: #FFFFFF;
  /* box-shadow: 0px 0px 6px 0px rgba(3, 25, 57, 0.2);
  border-radius: 4px; */
}

/* .control-header {
  height: 40px;
  border-bottom: 1px solid #F0F0F0;
  line-height: 40px;
} */

.control-content{
  max-height: 460px;
  overflow: auto;
  padding: 10px;
}

/* .title {
  padding-left: 20px;
  font-size: 16px;
  color: #333333;
} */

/* .closeButton2 {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 16px;
  height: 16px;
} */

/* .openButton {
  position: absolute;
  top: 30px;
  right: 30px;
} */

/* .closeButton {
  width: 33px;
  height: 33px;
  position: absolute;
  top: 0px;
  right: 0px;
  margin-top: -16.5px;
  margin-right: -16.5px;
} */

::v-deep .mapgis-ui-spin-spinning{
  position: absolute;
}
</style>
