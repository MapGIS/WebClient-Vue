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
        <mapgis-ui-tab-pane key="1" tab="基本设置" class="control-content">
          <basic-setting
            ref="attr"
            @updateSpin="changeSpinning"
            :initBasicSetting.sync="initBasicSetting"
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
            :initCameraSetting.sync="initCameraSetting"
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
            :initLightSetting.sync="initLightSetting"
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
            :initWeatherSetting.sync="initWeatherSetting"
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
            :initEffectSetting.sync="initEffectSetting"
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
    initParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    initFavoritesParams: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    initBasicSetting() {
      return (
        this.initFavoritesParams.basicSetting ||
        this.initParams.basicSetting || {
          earth: true,
          skyAtmosphere: true,
          shadow: false,
          depthTest: false,
          FPS: false,
          timeline: false,
          compass: false,
          zoom: false,
          statebar: true,
          sceneMode: false,
          layerbrightness: 1.0,
          layercontrast: 1.0,
          layerhue: 0.0,
          layersaturation: 1.0
        }
      );
    },
    initCameraSetting() {
      return (
        this.initFavoritesParams.cameraSetting ||
        this.initParams.cameraSetting || {
          undgrd: false,
          undgrdParams: {
            groundAlpha: 0.5
          },
          fov: 60
        }
      );
    },
    initLightSetting() {
      return (
        this.initFavoritesParams.lightSetting ||
        this.initParams.lightSetting || {
          sunlight: false,
          sunlightParams: {
            lightingMode: "DAYNIGHT_SHADING",
            lightColor: "rgba(255,255,255,255)"
          },
          lightIntensity: 10
        }
      );
    },
    initWeatherSetting() {
      return (
        this.initFavoritesParams.weatherSetting ||
        this.initParams.weatherSetting || {
          sun: true,
          moon: true,
          sceneSkybox: true,
          skybox: false,
          clouds: false,
          cloudsParams: {
            cloudsduration: 5
          },
          rain: false,
          rainParams: {
            speed: 18,
            rainOpacity: 0.6,
            angle: -30,
            length: 1
          },
          snow: false,
          snowParams: {
            size: 5,
            density: 5
          },
          fog: false,
          fogParams: {
            fogOpacity: 0.5,
            color: "#FFFFFF"
          },
          surficialFog: true,
          surfFogParams: {
            surfFogDst: 0.0002
          }
        }
      );
    },
    initEffectSetting() {
      return (
        this.initFavoritesParams.effectSetting ||
        this.initParams.effectSetting || {
          blckWhite: false,
          ntVision: false,
          bloom: false,
          bloomParams: {
            bloomBrt: -0.3,
            bloomCtrst: 128
          }
        }
      );
    }
  },
  data() {
    return {
      modelBloom: false,
      transform: undefined,
      tabBarStyle: {
        margin: "0px",
        textAlign: "center"
        // borderBottom: "1px solid #F0F0F0"
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
