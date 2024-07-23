<template>
  <div class="weather-setting">
    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="太阳"
          :checked="weatherSetting.sun"
          @changeChecked="enableSun"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="月亮"
          :checked="weatherSetting.moon"
          @changeChecked="enableMoon"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="星空"
          :checked="weatherSetting.sceneSkybox"
          @changeChecked="enableSceneSkybox"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-switch-panel
          size="small"
          label="天空盒"
          :checked="weatherSetting.skybox"
          @changeChecked="$_enableSkyBox"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-switch-panel
      size="default"
      label="云层"
      :checked="weatherSetting.clouds"
      @changeChecked="$_enableClouds"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="周期/秒"
        :value="weatherSetting.cloudsParams.cloudsduration"
        :range="cloudsRange"
        @change="cloudsDurationChange"
      />
    </mapgis-ui-switch-panel>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-switch-panel
      size="default"
      label="雨"
      :checked="weatherSetting.rain"
      @changeChecked="$_enableRain"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="雨速度"
        :value="weatherSetting.rainParams.speed"
        :range="speedRange"
        @change="speedChange"
      />

      <mapgis-ui-input-number-panel
        size="large"
        label="雨透明度"
        :value="weatherSetting.rainParams.rainOpacity"
        :range="rainOpacityRange"
        :step="0.1"
        @change="rainOpacityChange"
      />

      <mapgis-ui-input-number-panel
        size="large"
        label="雨角度"
        :value="weatherSetting.rainParams.angle"
        :range="angleRange"
        :step="5"
        @change="angleChange"
      />

      <mapgis-ui-input-number-panel
        size="large"
        label="雨丝长度"
        :value="weatherSetting.rainParams.length"
        :range="lengthRange"
        :step="1"
        @change="lengthChange"
      />
    </mapgis-ui-switch-panel>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-switch-panel
      size="default"
      label="雪"
      :checked="weatherSetting.snow"
      @changeChecked="$_enableSnow"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="雪粒大小"
        :value="weatherSetting.snowParams.size"
        :range="sizeRange"
        :step="5"
        @change="szChange"
      />

      <mapgis-ui-input-number-panel
        size="large"
        label="雪密度"
        :value="weatherSetting.snowParams.density"
        :range="densityRange"
        :step="5"
        @change="dstChange"
      />
    </mapgis-ui-switch-panel>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-switch-panel
      size="default"
      label="雾"
      :checked="weatherSetting.fog"
      @changeChecked="$_enableFog"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="雾透明度"
        :value="weatherSetting.fogParams.fogOpacity"
        :range="fogOpacityRange"
        :step="0.1"
        @change="fogOpacityChange"
      />
    </mapgis-ui-switch-panel>

    <!-- <div class="dividerWrapper"><div class="divider" /></div> -->

    <mapgis-ui-switch-panel
      size="default"
      label="雾化效果"
      :checked="weatherSetting.surficialFog"
      @changeChecked="enableSurficialFog"
    >
      <mapgis-ui-input-number-panel
        size="large"
        label="密度"
        :value="weatherSetting.surfFogParams.surfFogDst"
        :range="surfFogDstRange"
        :step="0.0002"
        @change="enableSurficialFog"
      />
    </mapgis-ui-switch-panel>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "WeatherSetting",
  mixins: [ServiceLayer],
  props: {
    initWeatherSetting: {
      type: Object,
      default: () => {
        return {
          sun: true,
          moon: true,
          sceneSkybox: true,
          skybox: false,
          clouds: false,
          cloudsParams: {
            cloudsduration: 5,
          },
          rain: false,
          rainParams: {
            speed: 18,
            rainOpacity: 0.6,
            angle: -30,
            length: 1,
          },
          snow: false,
          snowParams: {
            size: 5,
            density: 5,
          },
          fog: false,
          fogParams: {
            fogOpacity: 0.5,
            color: "#FFFFFF",
          },
          surficialFog: true,
          surfFogParams: {
            surfFogDst: 0.0002,
          },
        };
      },
    },
  },
  computed: {
    weatherSetting: {
      get() {
        return this.initWeatherSetting;
      },
      set() {
        this.$emit("updateWeatherSetting", this.weatherSetting);
      },
    },
  },
  data() {
    return {
      // 云层变化间隔范围
      cloudsRange: [1, 10],
      //雨丝速度范围
      speedRange: [1, 20],
      //雨丝透明度范围
      rainOpacityRange: [0.0, 1.0],
      //雨丝倾斜角度范围
      angleRange: [-30, 30],
      //雨丝附加长度范围
      lengthRange: [0, 10],
      //雪粒大小范围
      sizeRange: [5, 20],
      //雪的密度范围
      densityRange: [5, 20],
      //雾的透明度范围
      fogOpacityRange: [0.0, 1.0],
      surfFogDstRange: [0.0002, 0.002],
    };
  },
  watch: {
    initWeatherSetting: {
      handler(e) {
        this.init();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    const { vueKey, vueIndex } = this;
    window.vueCesium.SettingToolManager.addSource(
      vueKey,
      vueIndex,
      {},
      {
        GlobeCloud: null,
        SkyBox: null,
        Rain: null,
        Fog: null,
        Snow: null,
      }
    );
  },
  methods: {
    init() {
      const {
        sun,
        moon,
        sceneSkybox,
        skybox,
        clouds,
        cloudsParams,
        rain,
        rainParams,
        snow,
        snowParams,
        fog,
        fogParams,
        surficialFog,
        surfFogParams,
      } = this.weatherSetting;
      this.enableSun(sun);
      this.enableMoon(moon);
      this.enableSceneSkybox(sceneSkybox);
      this.$_enableSkyBox(skybox);
      this.$_enableClouds(clouds);
      if (clouds) {
        this.cloudsDurationChange(cloudsParams.cloudsduration);
      }
      this.$_enableRain(rain);
      if (rain) {
        const { speed, rainOpacity, angle, length } = this.rainParams;
        this.speedChange(speed);
        this.rainOpacityChange(rainOpacity);
        this.angleChange(angle);
        this.lengthChange(length);
      }
      this.$_enableSnow(snow);
      if (snow) {
        const { size, density } = snowParams;
        this.szChange(size);
        this.dstChange(density);
      }
      this.$_enableFog(fog);
      if (fog) {
        const { fogOpacity, color } = fogParams;
        this.fogOpacityChange(fogOpacity);
      }
      this.enableSurficialFog(surficialFog);
      if (surficialFog) {
        const { surfFogDst } = surfFogParams;
        this.enableSurficialFog(surfFogDst);
      }
    },
    /*
     * 太阳
     * */
    enableSun(e) {
      const { viewer } = this;
      this.weatherSetting.sun = e;
      if (viewer.scene.sun.show === this.weatherSetting.sun) {
        return;
      }
      viewer.scene.sun.show = this.weatherSetting.sun;
      if (this.weatherSetting.sun) {
        let sunPosition = viewer.scene.sun._boundingVolume.center;
        if (sunPosition.x !== 0 && sunPosition.y !== 0 && sunPosition !== 0) {
          viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(
              -sunPosition.x / 2000,
              -sunPosition.y / 2000,
              -sunPosition.z / 4000
            ),
            orientation: {
              heading: Cesium.Math.toRadians(90),
              pitch: Cesium.Math.toRadians(-90),
              roll: Cesium.Math.toRadians(-20),
            },
            duration: 0.5,
          });
        } else {
          viewer.camera.flyHome(0.5);
        }
      } else {
        viewer.camera.flyHome(0.5);
      }
    },
    /*
     * 月亮
     * */
    enableMoon(e) {
      const { viewer } = this;
      this.weatherSetting.moon = e;
      if (viewer.scene.moon.show === this.weatherSetting.moon) {
        return;
      }
      viewer.scene.moon.show = this.weatherSetting.moon;

      if (this.weatherSetting.moon) {
        let moonPosition =
          viewer.scene.moon._ellipsoidPrimitive._boundingSphere.center;
        if (
          moonPosition.x !== 0 &&
          moonPosition.y !== 0 &&
          moonPosition !== 0
        ) {
          viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(
              -moonPosition.x / 4,
              -moonPosition.y / 4,
              -moonPosition.z / 8
            ),
            orientation: {
              heading: Cesium.Math.toRadians(90),
              pitch: Cesium.Math.toRadians(-90),
              roll: Cesium.Math.toRadians(-20),
            },
            duration: 0.5,
          });
        } else {
          viewer.camera.flyHome(0.5);
        }
      } else {
        viewer.camera.flyHome(0.5);
      }
    },

    //星空
    enableSceneSkybox(e) {
      const { viewer } = this;
      this.weatherSetting.sceneSkybox = e;
      viewer.scene.skyBox.show = this.weatherSetting.sceneSkybox; //背景，星空
    },

    //天空盒
    $_enableSkyBox(e) {
      this.weatherSetting.skybox = e;
      let vm = this;
      if (vm.weatherSetting.skybox) {
        vm.enableSkyBox();
      } else {
        vm.removeSkyBox();
      }
    },
    enableSkyBox() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let skyBox = new Cesium.GlobeEffect(viewer, {
        cloudsDuration: 100000,
      });
      skyBox.addDefaultSkyBox("SkyBox3"); //添加天空盒默认样式1
      // skyBox.addDefaultSkyBox('SkyBox2'); //添加天空盒默认样式2

      window.vueCesium.SettingToolManager.changeOptions(
        vueKey,
        vueIndex,
        "SkyBox",
        skyBox
      );
    },
    removeSkyBox() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let manager = window.vueCesium["SettingToolManager"].findSource(
        vueKey,
        vueIndex
      );
      if (manager && manager.options && manager.options.SkyBox) {
        manager.options.SkyBox.removeSkyBox();
        window.vueCesium["SettingToolManager"].changeOptions(
          vueKey,
          vueIndex,
          "SkyBox",
          null
        );
      }
      // viewer.scene.camera.flyTo({
      //   destination: new Cesium.Cartesian3(-4957554.172258782, 19883663.751066618, 10885451.402250132),
      //   orientation: {
      //     heading: 6.283185307179586,
      //     pitch: -1.5707963267948966,
      //     roll: 0
      //   },
      //   duration: 1.0
      // })
    },
    //云图
    $_enableClouds(e) {
      this.$emit("updateSpin", true);

      this.weatherSetting.clouds = e;

      let vm = this;

      setTimeout(function () {
        if (vm.weatherSetting.clouds) {
          vm.enableClouds();
        } else {
          vm.removeClouds();
        }
        vm.$emit("updateSpin", false);
      }, 400);
    },

    cloudsDurationChange(e) {
      let vm = this;
      this.weatherSetting.cloudsParams.cloudsduration = e;
      if (this.weatherSetting.clouds) {
        vm.removeClouds();
        vm.enableClouds();
      }
    },
    enableClouds() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      /*
       * cloudsDuration的单位是毫秒
       * */
      let durationInms = this.weatherSetting.cloudsParams.cloudsduration * 1000;
      let clouds = new Cesium.GlobeEffect(viewer, {
        cloudsDuration: durationInms,
        cloudsImgSource: Cesium.buildModuleUrl("Assets/Images/clouds.png"),
      });
      clouds.addGlobeClouds(); //添加云层
      window.vueCesium["SettingToolManager"].changeOptions(
        vueKey,
        vueIndex,
        "GlobeCloud",
        clouds
      );
    },
    removeClouds() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let manager = window.vueCesium["SettingToolManager"].findSource(
        vueKey,
        vueIndex
      );
      if (manager && manager.options && manager.options.GlobeCloud) {
        manager.options.GlobeCloud.removeGlobeClouds();
        window.vueCesium["SettingToolManager"].changeOptions(
          vueKey,
          vueIndex,
          "GlobeCloud",
          null
        );
      }
    },

    //雨
    $_enableRain(e) {
      this.$emit("updateSpin", true);

      this.weatherSetting.rain = e;

      let vm = this;

      setTimeout(function () {
        if (vm.weatherSetting.rain) {
          vm.enableRain();
        } else {
          vm.removeWeather("Rain");
        }
        vm.$emit("updateSpin", false);
      }, 400);
    },
    speedChange(e) {
      let vm = this;
      this.weatherSetting.rainParams.speed = e;
      if (this.weatherSetting.rain) {
        vm.enableRain();
      }
    },
    rainOpacityChange(e) {
      let vm = this;
      this.weatherSetting.rainParams.rainOpacity = e;
      if (this.weatherSetting.rain) {
        vm.enableRain();
      }
    },
    angleChange(e) {
      let vm = this;
      this.weatherSetting.rainParams.angle = e;
      if (this.weatherSetting.rain) {
        vm.enableRain();
      }
    },
    lengthChange(e) {
      let vm = this;
      this.weatherSetting.rainParams.length = e;
      if (this.weatherSetting.rain) {
        vm.enableRain();
      }
    },
    //雪
    $_enableSnow(e) {
      this.$emit("updateSpin", true);

      this.weatherSetting.snow = e;

      let vm = this;

      setTimeout(function () {
        if (vm.weatherSetting.snow) {
          vm.enableSnow();
        } else {
          vm.removeWeather("Snow");
        }
        vm.$emit("updateSpin", false);
      }, 400);
    },
    szChange(e) {
      let vm = this;
      this.weatherSetting.snowParams.size = e;
      if (this.weatherSetting.snow) {
        vm.enableSnow();
      }
    },
    dstChange(e) {
      let vm = this;
      this.weatherSetting.snowParams.density = e;
      if (this.weatherSetting.snow) {
        vm.enableSnow();
      }
    },
    //雾
    $_enableFog(e) {
      this.$emit("updateSpin", true);

      this.weatherSetting.fog = e;

      let vm = this;

      setTimeout(function () {
        if (vm.weatherSetting.fog) {
          vm.enableFog();
        } else {
          vm.removeWeather("Fog");
        }
        vm.$emit("updateSpin", false);
      }, 400);
    },
    fogOpacityChange(e) {
      let vm = this;
      this.weatherSetting.fogParams.fogOpacity = e;
      if (this.weatherSetting.fog) {
        vm.enableFog();
      }
    },

    enableRain() {
      const { speed, angle, length, rainOpacity } =
        this.weatherSetting.rainParams;
      let rainOptions = {
        speed,
        angle,
        rainLength: length,
        alpha: rainOpacity,
      };
      this.$_enableWeather("Rain", rainOptions);
    },
    enableSnow() {
      const { density, size } = this.weatherSetting.snowParams;
      let snowOptions = {
        size: density,
        scale: size,
      };
      this.$_enableWeather("Snow", snowOptions);
    },
    enableFog() {
      const { Cesium } = this;
      let color = Cesium.Color.fromCssColorString(
        this.weatherSetting.fogParams.color
      );
      let fogOptions = {
        fogcolor: color,
        alpha: this.weatherSetting.fogParams.fogOpacity,
      };
      this.$_enableWeather("Fog", fogOptions);
    },
    $_enableWeather(WeatherName, options) {
      const { vueKey, vueIndex, viewer, Cesium } = this;

      this.removeWeather(WeatherName);

      // let manager = window.vueCesium['SettingToolManager'].findSource(vueKey, vueIndex );
      // if(manager && manager.options && manager.options[WeatherName] && manager.options[WeatherName] !== null){
      //   this.removeWeather(WeatherName);
      // }
      let weather = new Cesium.WeatherEffect(viewer);
      switch (WeatherName) {
        case "Rain":
          weather.addRain(options);
          window.vueCesium["SettingToolManager"].changeOptions(
            vueKey,
            vueIndex,
            "Rain",
            weather
          );
          break;
        case "Snow":
          weather.addSnow(options);
          window.vueCesium["SettingToolManager"].changeOptions(
            vueKey,
            vueIndex,
            "Snow",
            weather
          );
          break;
        case "Fog":
          weather.addFog(options);
          window.vueCesium["SettingToolManager"].changeOptions(
            vueKey,
            vueIndex,
            "Fog",
            weather
          );
          break;
        default:
          weather.log("传参错误");
          break;
      }
    },
    removeWeather(WeatherName) {
      const { vueKey, vueIndex } = this;
      let manager = window.vueCesium["SettingToolManager"].findSource(
        vueKey,
        vueIndex
      );
      if (manager && manager.options) {
        Object.keys(manager.options).forEach(function (name) {
          if (name === WeatherName && manager.options[WeatherName]) {
            switch (WeatherName) {
              case "Rain":
                manager.options.Rain.removeRain();
                break;
              case "Snow":
                manager.options.Snow.removeSnow();
                break;
              case "Fog":
                manager.options.Fog.removeFog();
                break;
            }
            window.vueCesium["SettingToolManager"].changeOptions(
              vueKey,
              vueIndex,
              WeatherName,
              null
            );
          }
        });
      }
    },

    /*
     * 雾化效果
     * */
    enableSurficialFog(e) {
      const { viewer } = this;
      let vm = this;

      if (typeof e === "boolean") {
        vm.weatherSetting.surficialFog = e;
      } else {
        vm.weatherSetting.surfFogParams.surfFogDst = e;
      }

      viewer.scene.fog.density = this.weatherSetting.surfFogParams.surfFogDst;
      // viewer.scene.fog.minimumBrightness = this.surfFogMinBrt;
      viewer.scene.fog.enabled = this.weatherSetting.surficialFog;
    },
  },
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
  background: #f0f0f0;
}
</style>
