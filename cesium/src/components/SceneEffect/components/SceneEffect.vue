<template>
  <div class="mapgis-3d-scene-effect">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left">

      <mapgis-ui-form-model-item label="天气特效" >
          <mapgis-ui-checkbox :checked="enableSunlight" @change="sunChange">太阳
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="sceneskybox" @change="sceneSkyboxChange" >星空
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="enableCloud" @change="cloudChange" >云图
          </mapgis-ui-checkbox>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item :wrapperCol="{span: 24}">
          <mapgis-ui-checkbox :checked="rain" @change="rnChange" >雨
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="snow" @change="snowChange" >雪
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="fog" @change="fogChange" >雾
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="SkyBox2" @change="skyBoxChange">天空盒
          </mapgis-ui-checkbox>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雨速度" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="speed"
              :max="20.0"
              :min="1.0"
              @change="speedChange"
              :style="{ minWidth: '100px' }"
              size="small"
          />
          <mapgis-ui-input-number
              v-model="speed"
              :max="20.0"
              :min="1.0"
              @change="speedChange"
              style="marginLeft: 16px"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雨透明度" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="rainOpacity"
              :max="1"
              :min="0"
              :step="0.1"
              @change="rainOpacityChange"
              :style="{ minWidth: '100px' }"
              size="small"
          />
          <mapgis-ui-input-number
              v-model="rainOpacity"
              :max="1"
              :min="0"
              :step="0.1"
              @change="rainOpacityChange"
              style="marginLeft: 16px"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雨角度" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="angle"
              :max="90"
              :min="0"
              :step="10"
              @change="angleChange"
              :style="{ minWidth: '100px' }"
              size="small"
          />
          <mapgis-ui-input-number
              v-model="angle"
              :max="90"
              :min="0"
              :step="10"
              @change="angleChange"
              style="marginLeft: 16px"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雪粒大小" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="size"
              :max="20"
              :min="5"
              :step="5"
              @change="szChange"
              :style="{ minWidth: '100px' }"
              size="small"
          />
          <mapgis-ui-input-number
              v-model="size"
              :max="20"
              :min="5"
              :step="5"
              @change="szChange"
              style="marginLeft: 16px"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雪密度" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="density"
              :max="20"
              :min="5"
              :step="5"
              @change="dstChange"
              :style="{ minWidth: '100px' }"
              size="small"
          />
          <mapgis-ui-input-number
              v-model="density"
              :max="20"
              :min="5"
              :step="5"
              @change="dstChange"
              style="marginLeft: 16px"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="雾透明度" >
        <mapgis-ui-space>
          <mapgis-ui-slider
              v-model="fogOpacity"
              :max="1"
              :min="0"
              :step="0.1"
              @change="fogOpacityChange"
              :style="{ minWidth: '100px' }"
              size="small"
          />
          <mapgis-ui-input-number
              v-model="fogOpacity"
              :max="1"
              :min="0"
              :step="0.1"
              @change="fogOpacityChange"
              style="marginLeft: 16px"
              size="small"
          />
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="其它特效">
        <mapgis-ui-space>
          <mapgis-ui-checkbox :checked="blckWhite" @change="blackAndWhiteChange">黑白照片
          </mapgis-ui-checkbox>
          <mapgis-ui-checkbox :checked="ntVision" @change="nightVision" >夜视效果
          </mapgis-ui-checkbox>
        </mapgis-ui-space>
      </mapgis-ui-form-model-item>

    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "SceneEffect",
  mixins: [ServiceLayer],
  props:{
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data (){
    return {
      enableSunlight: false,
      sceneskybox: true,
      enableCloud: false,
      weather: undefined,
      rain: false,
      speed: 1.0,
      rainOpacity: 1.0,
      angle: 0,
      snow: false,
      size: 5,
      density: 5,
      fog: false,
      fogOpacity: 0.5,
      color: "#FFFFFF",
      SkyBox2: false,

      blckWhite: false,
      ntVision: false,
    }
  },
  computed: {
    formItemLayout({ layout }) {
      return layout === "horizontal"
          ? {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
          }
          : {};
    }
  },
  mounted() {
    const { vueKey, vueIndex } = this;
    window.CesiumZondy.SettingToolManager.addSource(vueKey,vueIndex,{},{
      globeClouds: null,
      skyBox:null,
      Rain:null,
      Fog:null,
      Snow:null
    });
  },
  methods: {
    //太阳
    sunChange(e) {
      const { viewer } = this;
      this.enableSunlight = e.target.checked;
      viewer.scene.globe.enableLighting = this.enableSunlight;
    },

    //星空
    sceneSkyboxChange(e) {
      const { viewer } = this;
      this.sceneskybox = e.target.checked;
      viewer.scene.skyBox.show = this.sceneskybox; //背景，星空
    },

    //云图
    cloudChange(e) {
      this.enableCloud = e.target.checked;
      let vm = this;
      if (vm.enableCloud) {
        vm.enableClouds();
      } else {
        vm.removeClouds();
      }
    },
    enableClouds() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      //云图效果验证
      var clouds = new Cesium.GlobeEffect(viewer, {
        cloudsDuration: 10000,
        cloudsImgSource: Cesium.buildModuleUrl("Assets/Images/clouds.png")
      });
      clouds.addGlobeClouds(); //添加云层
      window.CesiumZondy['SettingToolManager'].changeOptions(vueKey, vueIndex, 'globeClouds',clouds);
    },
    removeClouds() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let manager = window.CesiumZondy['SettingToolManager'].findSource(vueKey, vueIndex );
      if (manager.options && manager.options.globeClouds) {
        manager.options.globeClouds.removeGlobeClouds();
        window.CesiumZondy['SettingToolManager'].changeOptions(vueKey, vueIndex, 'globeClouds',null);
      }
    },

    //雨
    rnChange(e) {
      this.rain = e.target.checked;
      let vm = this;
      if (vm.rain) {
        vm.enableRain();
      } else {
        vm.removeWeather('Rain');
      }
    },
    speedChange(e) {
      this.speed = e;
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    rainOpacityChange(e) {
      this.rainOpacity = e;
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    angleChange(e) {
      this.angle = e;
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    //雪
    snowChange(e) {
      this.snow = e.target.checked;
      let vm = this;
      if (vm.snow) {
        vm.enableSnow();
      } else {
        vm.removeWeather('Snow');
      }
    },
    szChange(e) {
      this.size = e;
      let vm = this;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    dstChange(e) {
      this.density = e;
      let vm = this;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    //雾
    fogChange(e) {
      this.fog = e.target.checked;
      let vm = this;
      if (vm.fog) {
        vm.enableFog();
      } else {
        vm.removeWeather('Fog');
      }
    },
    fogOpacityChange(e) {
      this.fogOpacity = e;
      let vm = this;
      if (this.fog) {
        vm.enableFog();
      }
    },

    enableRain() {
      let rainOptions = {
        speed: this.speed,
        angle: this.angle,
        alpha: this.rainOpacity
      };
      this.$_enableWeather("Rain", rainOptions);
    },
    enableSnow() {
      let snowOptions = {
        size: this.density,
        scale: this.size
      };
      this.$_enableWeather("Snow", snowOptions);
    },
    enableFog() {
      const { Cesium }=this;
      let color = Cesium.Color.fromCssColorString(this.color);
      let fogOptions = {
        fogcolor: color,
        alpha: this.fogOpacity
      };
      this.$_enableWeather("Fog", fogOptions);
    },
    //积雪？？
    $_enableWeather(WeatherName, options) {
      const { vueKey, vueIndex, viewer, Cesium } = this;

      this.removeWeather(WeatherName);

      // let manager = window.CesiumZondy['SettingToolManager'].findSource(vueKey, vueIndex );
      // if(manager && manager.options && manager.options[WeatherName] && manager.options[WeatherName] !== null){
      //   this.removeWeather(WeatherName);
      // }
      let weather = new Cesium.WeatherEffect(viewer);
      switch(WeatherName) {
        case 'Rain':
          weather.addRain(options);
          window.CesiumZondy['SettingToolManager'].changeOptions(vueKey,vueIndex,'Rain',weather);
          break;
        case 'Snow':
          weather.addSnow(options);
          window.CesiumZondy['SettingToolManager'].changeOptions(vueKey,vueIndex,'Snow',weather);
          break;
        case 'Fog':
          weather.addFog(options);
          window.CesiumZondy['SettingToolManager'].changeOptions(vueKey,vueIndex,'Fog',weather);
          break;
        default:
          weather.log('传参错误');
          break;
      }
    },

    removeWeather(WeatherName) {
      const { vueKey, vueIndex } = this;
      let manager = window.CesiumZondy['SettingToolManager'].findSource(vueKey, vueIndex );
      if (manager && manager.options) {
        Object.keys(manager.options).forEach(function(name) {
          if (name === WeatherName && manager.options[WeatherName]) {
            switch(WeatherName) {
              case 'Rain':
                manager.options.Rain.removeRain();
                break;
              case 'Snow':
                manager.options.Snow.removeSnow();
                break;
              case 'Fog':
                manager.options.Fog.removeFog();
                break;
            };
            window.CesiumZondy['SettingToolManager'].changeOptions(vueKey, vueIndex, WeatherName,null);
          }
        });
      }
    },

    //天空盒
    skyBoxChange(e) {
      this.SkyBox2 = e.target.checked;
      let vm = this;
      if (vm.SkyBox2) {
        vm.enableSkyBox();
      } else {
        vm.removeSkyBox();
      }
    },
    enableSkyBox() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let skyBox = new Cesium.GlobeEffect(viewer, { cloudsDuration: 100000 });
      skyBox.addDefaultSkyBox("skyBox3"); //添加天空盒默认样式1
      // skyBox.addDefaultSkyBox('skyBox2'); //添加天空盒默认样式2

      // //自定义天空盒的样式
      // skyBox.removeSkyBox();
      // let newskybox = new Cesium.SkyBox({
      //   sources: {
      //     positiveX: Cesium.buildModuleUrl('Assets/Textures/SkyBox2/front.jpg'),
      //     negativeX: Cesium.buildModuleUrl('Assets/Textures/SkyBox2/back.jpg'),
      //     positiveY: Cesium.buildModuleUrl('Assets/Textures/SkyBox2/right.jpg'),
      //     negativeY: Cesium.buildModuleUrl('Assets/Textures/SkyBox2/left.jpg'),
      //     positiveZ: Cesium.buildModuleUrl('Assets/Textures/SkyBox2/top.jpg'),
      //     negativeZ: Cesium.buildModuleUrl('Assets/Textures/SkyBox2/down.jpg')
      //   },
      //   nearGround: true
      // });
      // skyBox.changeSkyBox(newskybox)

      // viewer.scene.camera.flyTo({
      //   destination: new Cesium.Cartesian3(-2179825.7788852383, 4380581.427298224, 4091538.107446992),
      //   orientation: {
      //     heading: 0.005352643897039933,
      //     pitch: -0.03880119222393663,
      //     roll: 6.2831853071795845
      //   },
      //   duration:1,
      // })

      window.CesiumZondy.SettingToolManager.changeOptions(vueKey, vueIndex, 'skyBox', skyBox);
    },
    removeSkyBox() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let manager = window.CesiumZondy['SettingToolManager'].findSource(vueKey, vueIndex );
      if (manager.options && manager.options.skyBox) {
        manager.options.skyBox.removeSkyBox();
        window.CesiumZondy['SettingToolManager'].changeOptions(vueKey, vueIndex, 'skyBox',null);
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

    //黑白照片
    blackAndWhiteChange(e) {
      const { viewer } = this;
      this.blckWhite = e.target.checked;
      let vm = this;
      if (vm.blckWhite) {
        vm.removeOtherStages();

        let blackAndWhite = viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
        );
        blackAndWhite.uniforms.gradations = 5.0; //(灰度级数)

        console.log(
            "viewer.scene.postProcessStages",
            viewer.scene.postProcessStages
        );
      } else {
        vm.removeOtherStages();
      }
    },
    //夜视效果
    nightVision(e) {
      const { viewer } = this;
      this.ntVision = e.target.checked;
      let vm = this;
      if (vm.ntVision) {
        vm.removeOtherStages();
        viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createNightVisionStage()
        );
        console.log(
            "viewer.scene.postProcessStages",
            viewer.scene.postProcessStages
        );
      } else {
        vm.removeOtherStages();
      }
    },
    removeOtherStages() {
      const { viewer } = this;
      let length = viewer.scene.postProcessStages._activeStages.length;
      if (length > 1) {
        let i = 1;
        for (i; i < length; i++) {
          let stage = viewer.scene.postProcessStages.get(i);
          viewer.scene.postProcessStages.remove(stage);
        }
      }
    },
  },
}
</script>

<style scoped>
.mapgis-3d-scene-effect {
  padding: 0px 8px;
}
.mapgis-ui-form-item{
  margin: 0px;
}
</style>