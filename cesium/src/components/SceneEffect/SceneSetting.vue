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
      >
        <mapgis-ui-tab-pane
          key="1"
          tab="基本设置"
          class="control-content"
        >
          <basic-setting
            ref="attr"
            @updateSpin="changeSpinning"
            :initialStatebar="initialStatebar"
            :initialDepthTest="depthTest"
            :initial-scene-mode="sceneMode"
          ></basic-setting>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane
          key="2"
          force-render
          tab="相机"
          class="control-content"
        >
          <camera-setting
            ref="effect"
            @updateSpin="changeSpinning"
          ></camera-setting>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane
          key="3"
          force-render
          tab="光照"
          class="control-content"
        >
          <light-setting
            ref="effect"
            @updateSpin="changeSpinning"
          ></light-setting>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane
          key="4"
          force-render
          tab="天气"
          class="control-content"
        >
          <weather-setting
            ref="effect"
            @updateSpin="changeSpinning"
          ></weather-setting>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane
          key="5"
          force-render
          tab="特效"
          class="control-content"
        >
          <effect-setting
            ref="effect"
            @updateSpin="changeSpinning"
          ></effect-setting>
        </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
    </div>
    <!-- <mapgis-ui-button class="openButton" shape="circle" type="primary" @click="togglePanel">
      <mapgis-ui-iconfont type="mapgis-setting"/>
    </mapgis-ui-button> -->
    <mapgis-ui-spin
      :spinning="spinning"
      size="large"
      style="top: 50%; left: 50%"
    />
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import BasicSetting from "./components/BasicSetting";
import CameraSetting from "./components/CameraSetting";
import LightSetting from "./components/LightSetting";
import WeatherSetting from "./components/WeatherSetting";
import EffectSetting from "./components/EffectSetting";
import { isDepthTestAgainstTerrainEnable } from "../WebGlobe/util";

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
     * 面板样式
     */
    panelStyle: {
      type: Object
    },
    //默认状态栏的开启
    initialStatebar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modelBloom: false,
      transform: undefined,
      tabBarStyle: {
        margin: "0px",
        textAlign: "center",
        borderBottom: "1px solid #F0F0F0"
      },
      show: true,
      hover: false,
      spinning: false,
      depthTest: undefined,
      sceneMode: undefined
    };
  },

  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      const { viewer } = this;

      this.depthTest = isDepthTestAgainstTerrainEnable(viewer);
      this.sceneMode = viewer.scene.mode !== 3;

      this.$emit("loaded", this);
    },
    unmount() {
      this.$_deleteManger("SettingToolManager", function(manager) {
        console.log("destroyed");
      });
      this.$emit("unload");
    },
    togglePanel() {
      this.show = !this.show;
    },

    closePanel() {
      this.show = false;
    },

    changeSpinning(e) {
      this.spinning = e;
    }
  }
};
</script>

<style scoped>
.setting-control {
  height: fit-content;
  background: var(--card-background);
}

.control-content {
  max-height: 580px;
  overflow: auto;
  padding: 4px;
}

::v-deep .mapgis-ui-spin-spinning {
  position: absolute;
}
</style>
