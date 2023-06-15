<template>
  <div class="basic-setting">
    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="地球"
          :checked="basicSetting.earth"
          @changeChecked="enableEarth"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="大气层"
          :checked="basicSetting.skyAtmosphere"
          @changeChecked="enableSkyAtmosphere"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="阴影效果"
          :checked="basicSetting.shadow"
          @changeChecked="enableShadow"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="深度检测"
          :checked="basicSetting.depthTest"
          @changeChecked="enableDepthTest"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="显示帧率"
          :checked="basicSetting.FPS"
          @changeChecked="enableFPS"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="时间轴"
          :checked="basicSetting.timeline"
          @changeChecked="enableTimeline"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="罗盘控件"
          :checked="basicSetting.compass"
          @changeChecked="enableCompass"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="缩放控件"
          :checked="basicSetting.zoom"
          @changeChecked="enableZoom"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="状态栏"
          :checked="basicSetting.statebar"
          @changeChecked="handleChangeStatebar"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          class="odd"
          size="small"
          label="平面模式"
          :checked="basicSetting.sceneMode"
          @changeChecked="handleChangeSceneMode"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-input-number-panel
      size="large"
      label="亮度"
      :value="basicSetting.layerbrightness"
      :range="lyrBrtRange"
      :step="0.2"
      @change="layerBrtChange"
    />

    <mapgis-ui-input-number-panel
      size="large"
      label="对比度"
      :value="basicSetting.layercontrast"
      :range="lyrBrtRange"
      :step="0.2"
      @change="layerCtrstChange"
    />

    <mapgis-ui-input-number-panel
      size="large"
      label="色调"
      :value="basicSetting.layerhue"
      :range="lyrHueRange"
      :step="0.1"
      @change="layerHueChange"
    />

    <mapgis-ui-input-number-panel
      size="large"
      label="饱和度"
      :value="basicSetting.layersaturation"
      :range="lyrBrtRange"
      :step="0.2"
      @change="layerSaturationChange"
    />

    <mapgis-3d-statebar
      v-if="basicSetting.statebar"
      :frame="60"
      :bottomMap="true"
    />
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
// import "@mapgis/cesium/dist/MapGIS/css/mapgis.css"
import "./navigation-all.css";
import StateBar from "../../UI/Controls/State/StateControl.vue";

export default {
  name: "BasicSetting",
  mixins: [ServiceLayer, StateBar],
  props: {
    initialStatebar: {
      type: Boolean,
      default: false
    },
    initialDepthTest: {
      type: Boolean,
      default: false
    },
    initialSceneMode: {
      type: Boolean,
      default: false
    },
    initBasicSetting: {
      type: Object,
      default: () => {
        return {
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
        };
      }
    },
    initFavoritesBasicSetting: {
      type: Object
    }
  },
  computed: {
    basicSetting: {
      get() {
        return this.initBasicSetting;
      },
      set() {
        this.$emit("updateBasicSetting", this.basicSetting);
      }
    }
  },
  data() {
    return {
      lyrBrtRange: [0, 3],
      lyrHueRange: [-1, 1]
    };
  },
  mounted() {
    const { vueKey, vueIndex } = this;
    const manager = window.vueCesium["SettingToolManager"].findSource(
      vueKey,
      vueIndex
    );
    if (!manager) {
      window.vueCesium.SettingToolManager.addSource(vueKey, vueIndex, null, {
        timeline: null
      });
    }
    this.init();
  },
  watch: {
    initialDepthTest: {
      handler(e) {
        this.basicSetting.depthTest = e;
      },
      deep: true,
      immediate: true
    },
    initBasicSetting: {
      handler(e) {
        this.init();
      },
      deep: true,
      immediate: true
    },
    initFavoritesBasicSetting: {
      handler(e) {
        this.setFavoritesConfig();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      if (!this.basicSetting) {
        return;
      }
      const { vueKey, vueIndex } = this;
      const manager = window.vueCesium["SettingToolManager"].findSource(
        vueKey,
        vueIndex
      );
      if (!manager) {
        window.vueCesium.SettingToolManager.addSource(vueKey, vueIndex, null, {
          timeline: null
        });
      }
      const {
        earth,
        skyAtmosphere,
        shadow,
        depthTest,
        FPS,
        timeline,
        compass,
        zoom,
        statebar,
        sceneMode,
        layerbrightness,
        layercontrast,
        layerhue,
        layersaturation
      } = this.basicSetting;
      this.enableEarth(earth);
      this.enableSkyAtmosphere(skyAtmosphere);
      this.enableShadow(shadow);
      this.enableDepthTest(depthTest);
      this.enableFPS(FPS);
      this.enableTimeline(timeline);
      this.enableCompass(compass);
      this.enableZoom(zoom);
      this.layerBrtChange(layerbrightness);
      this.layerCtrstChange(layercontrast);
      this.layerHueChange(layerhue);
      this.layerSaturationChange(layersaturation);
      this.handleChangeStatebar(statebar);
      this.handleChangeSceneMode(sceneMode);
    },
    /*
     * 地球
     *
     */
    enableEarth(e) {
      const { viewer } = this;
      this.basicSetting.earth = e;
      if (this.basicSetting.earth) {
        viewer.scene.skyAtmosphere.show = this.basicSetting.skyAtmosphere;
      } else {
        viewer.scene.skyAtmosphere.show = false;
      }
      viewer.scene.globe.show = this.basicSetting.earth;
    },
    /*
     * 大气层
     * */
    enableSkyAtmosphere(e) {
      const { viewer } = this;
      this.basicSetting.skyAtmosphere = e;
      viewer.scene.skyAtmosphere.show = this.basicSetting.skyAtmosphere;
    },

    /*
     * 阴影效果
     * */
    enableShadow(e) {
      const { viewer, Cesium } = this;
      this.basicSetting.shadow = e;
      viewer.shadows = this.basicSetting.shadow;
    },
    /*
     * 深度检测
     * */
    enableDepthTest(e) {
      const { viewer } = this;
      this.basicSetting.depthTest = e;
      viewer.scene.globe.depthTestAgainstTerrain = this.basicSetting.depthTest;
    },

    /*
     * 显示帧率
     * */
    enableFPS(e) {
      const { viewer } = this;
      this.basicSetting.FPS = e;
      viewer.scene.debugShowFramesPerSecond = this.basicSetting.FPS;
    },

    /*
     * 开启时间轴
     * */
    enableTimeline(e) {
      const { viewer, Cesium, vueKey, vueIndex } = this;
      this.basicSetting.timeline = e;
      let vm = this;
      if (vm.basicSetting.timeline) {
        let list = document.getElementsByClassName(
          "cesium-viewer-timelineContainer"
        );
        // console.log("list",list);

        if (list.length > 0) {
          list[0].parentNode.removeChild(list[0]);
        }

        var viewerContainer = viewer.container;
        var timelineContainer = document.createElement("div");
        timelineContainer.className = "cesium-viewer-timelineContainer";
        timelineContainer.style = "left:0px;right:0px";

        if (vm.basicSetting.statebar) {
          //改变时间轴的上下位置
          vm.$nextTick(function() {
            let list = document.getElementsByClassName("mapgis-3d-statebar");
            let style = window.getComputedStyle(list[0]);
            if (style.bottom === "0px") {
              timelineContainer.style.bottom = "30px";
            }
          });
        }

        viewerContainer.appendChild(timelineContainer);
        let timeline = new Cesium.Timeline(timelineContainer, viewer.clock);
        timeline.addEventListener("settime", vm.onTimelineScrubfunction, false);
        timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
        window.vueCesium["SettingToolManager"].changeOptions(
          vueKey,
          vueIndex,
          "timeline",
          timeline
        );
      } else {
        const { vueKey, vueIndex } = this;
        let manager = window.vueCesium["SettingToolManager"].findSource(
          vueKey,
          vueIndex
        );
        if (manager && manager.options && manager.options.timeline) {
          manager.options.timeline.destroy();
          window.vueCesium["SettingToolManager"].changeOptions(
            vueKey,
            vueIndex,
            "timeline",
            null
          );
        }

        let list = document.getElementsByClassName(
          "cesium-viewer-timelineContainer"
        );
        // console.log("list",list);

        if (list.length > 0) {
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
      const { viewer } = this;
      this.basicSetting.compass = e;
      if (viewer.cesiumNavigation) {
        viewer.cesiumNavigation.destroy();
      }
      let options = {};
      options.enableCompass = this.basicSetting.compass;
      options.enableZoomControls = this.basicSetting.zoom;
      viewer.createNavigationTool(options);
      // this.changeNavPos();
    },
    /*
     * 导航控件（罗盘控件和缩放控件的状态控制）
     * */
    enableZoom(e) {
      const { viewer } = this;
      this.basicSetting.zoom = e;
      if (viewer.cesiumNavigation) {
        viewer.cesiumNavigation.destroy();
      }
      let options = {};
      options.enableCompass = this.basicSetting.compass;
      options.enableZoomControls = this.basicSetting.zoom;
      viewer.createNavigationTool(options);
      // this.changeNavPos();
    },
    /*
     * 图层亮度
     * */
    layerBrtChange(e) {
      this.basicSetting.layerbrightness = e;
      this.layerValueChange("brightness", this.basicSetting.layerbrightness);
    },
    /*
     * 图层对比度
     * */
    layerCtrstChange(e) {
      this.basicSetting.layercontrast = e;
      this.layerValueChange("contrast", this.basicSetting.layercontrast);
    },
    /*
     * 图层色调
     */
    layerHueChange(e) {
      this.basicSetting.layerhue = e;
      this.layerValueChange("hue", this.basicSetting.layerhue);
    },
    /*
     * 图层饱和度
     * */
    layerSaturationChange(e) {
      this.basicSetting.layersaturation = e;
      this.layerValueChange("saturation", this.basicSetting.layersaturation);
    },
    layerValueChange(parameter, value) {
      const { viewer } = this;

      let i;
      let length = viewer.scene.imageryLayers._layers.length;
      for (i = 0; i < length; i++) {
        let layer = viewer.scene.imageryLayers._layers[i];
        layer[parameter] = value;
      }
    },

    handleChangeStatebar(next) {
      // console.log(next);
      const { viewer } = this;
      this.basicSetting.statebar = next;
      const vm = this;
      viewer.statebar = this.basicSetting.statebar;
      let statebars = document.getElementsByClassName("mapgis-3d-statebar");
      if (statebars && statebars.length > 0) {
        if (viewer.statebar) {
          statebars[0].style.display = "block";
        } else {
          statebars[0].style.display = "none";
        }
      }

      // 改变状态栏的上下位置
      if (vm.basicSetting.timeline) {
        vm.$nextTick(function() {
          let list = document.getElementsByClassName(
            "cesium-viewer-timelineContainer"
          );
          let style = window.getComputedStyle(list[0]);
          if (style.bottom === "0px" && vm.basicSetting.statebar) {
            let list = document.getElementsByClassName("mapgis-3d-statebar");
            let stateContainer = list[0];
            stateContainer.style.bottom = "24px";
          }
        });
      } else {
        // 时间轴和状态栏都存在时关闭时间轴，状态栏复原到最下方
        vm.$nextTick(function() {
          let list = document.getElementsByClassName("mapgis-3d-statebar");
          let stateContainer = list[0];
          if (stateContainer) stateContainer.style.bottom = "0px";
        });
      }
    },
    handleChangeSceneMode(next) {
      this.basicSetting.sceneMode = next;
      const vm = this;
      if (next) {
        vm.viewer.scene.mode = 1;
      } else {
        vm.viewer.scene.mode = 3;
        let rectangle3D = vm.viewer.camera.computeViewRectangle();
        // 若地球不在屏幕视野范围内，则恢复初始视角
        if (!rectangle3D) {
          let {
            north,
            south,
            east,
            west
          } = Cesium.Camera.DEFAULT_VIEW_RECTANGLE;
          let lon = Cesium.Math.toDegrees((east + west) / 2);
          let lat = Cesium.Math.toDegrees((north + south) / 2);
          const height = 16846164;
          vm.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
          });
        }
      }
    },
    setFavoritesConfig() {
      if (this.initFavoritesBasicSetting) {
        Object.keys(this.initFavoritesBasicSetting).forEach(item => {
          if (
            this.initFavoritesBasicSetting[item] !== this.basicSetting[item]
          ) {
            this.basicSetting[item] = this.initFavoritesBasicSetting[item];
          }
        });
      }
    }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(odd) .mapgis-ui-switch-panel {
  padding-right: 10px;
}
::v-deep
  .mapgis-ui-row
  .mapgis-ui-col:nth-child(even)
  .mapgis-ui-switch-panel::before {
  content: "";
  display: block;
  width: 1px;
  height: 14px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  background: #dcdcdc;
}
::v-deep .mapgis-ui-row .mapgis-ui-col:nth-child(even) .mapgis-ui-switch-panel {
  padding-left: 10px;
}
.dividerWrapper {
  height: 13px;
}
.divider {
  display: block;
  height: 1px;
  position: absolute;
  left: 16px;
  right: 16px;
  margin: 6px 0;
  /* background: #f0f0f0; */
}
</style>
