<template>
  <div class="weather-setting">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left" class="formStyle" :colon="false">
      
      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="太阳" :checked="sun" @changeChecked="enableSun"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="月亮" :checked="moon" @changeChecked="enableMoon"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-row>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="星空" :checked="sceneSkybox" @changeChecked="enableSceneSkybox"/>
        </mapgis-ui-col>
        <mapgis-ui-col :span="12">
          <mapgis-ui-switch-panel label="天空盒" :checked="skybox" @changeChecked="$_enableSkyBox"/>
        </mapgis-ui-col>
      </mapgis-ui-row>

      <mapgis-ui-switch-panel label="云层" :checked="clouds" @changeChecked="$_enableClouds">
        <mapgis-ui-input-number-panel 
          label="周期/秒" 
          :value="cloudsduration" 
          :range="cloudsRange"
          @change="cloudsDurationChange"
        >
        </mapgis-ui-input-number-panel> 
      </mapgis-ui-switch-panel>

      <mapgis-ui-switch-panel label="雨" :checked="rain" @changeChecked="$_enableRain">
        <mapgis-ui-input-number-panel 
          label="雨速度" 
          :value="speed" 
          :range="speedRange"
          @change="speedChange"
        >
        </mapgis-ui-input-number-panel> 

        <mapgis-ui-input-number-panel 
          label="雨透明度" 
          :value="rainOpacity" 
          :range="rainOpacityRange"
          :step="0.1"
          @change="rainOpacityChange"
        >
        </mapgis-ui-input-number-panel>

        <mapgis-ui-input-number-panel 
          label="雨角度" 
          :value="angle" 
          :range="angleRange"
          :step="10"
          @change="angleChange"
        >
        </mapgis-ui-input-number-panel> 
     </mapgis-ui-switch-panel>

      <mapgis-ui-switch-panel label="雪" :checked="snow" @changeChecked="$_enableSnow">

        <mapgis-ui-input-number-panel 
          label="雪粒大小" 
          :value="size" 
          :range="sizeRange"
          :step="5"
          @change="szChange"
        >
        </mapgis-ui-input-number-panel>

        <mapgis-ui-input-number-panel 
          label="雪密度" 
          :value="density" 
          :range="densityRange"
          :step="5"
          @change="dstChange"
        >
        </mapgis-ui-input-number-panel> 

      </mapgis-ui-switch-panel>

      <mapgis-ui-switch-panel label="雾" :checked="fog" @changeChecked="$_enableFog">
        <mapgis-ui-input-number-panel 
          label="雾透明度" 
          :value="fogOpacity" 
          :range="fogOpacityRange"
          :step="0.1"
          @change="fogOpacityChange"
        >
        </mapgis-ui-input-number-panel>
      </mapgis-ui-switch-panel>

      <mapgis-ui-switch-panel label="雾化效果" :checked="surficialFog" @changeChecked="enableSurficialFog">
        <mapgis-ui-input-number-panel 
          label="密度" 
          :value="surfFogDst" 
          :range="surfFogDstRange"
          :step="0.0002"
          @change="enableSurficialFog"
        >
        </mapgis-ui-input-number-panel>
      </mapgis-ui-switch-panel>

    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
export default {
  name: "WeatherSetting",
  mixins: [ServiceLayer],
  props:{
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    }
  },
  data (){
    return {
      sun:true,
      moon:true,
      //星空
      sceneSkybox: true,
      //天空盒
      skybox: false,
      //云层
      clouds: false,
      cloudsParams:undefined,
      cloudsduration: 5,
      cloudsRange:[1,10],

      weather: undefined,
      rain: false,
      rainParams:undefined,
      speed: 1.0,
      speedRange:[1,20],
      rainOpacity: 1.0,
      rainOpacityRange:[0.0,1.0],
      angle: 0,
      angleRange:[0,90],
      snow: false,
      snowParams:undefined,
      size: 5,
      sizeRange:[5,20],
      density: 5,
      densityRange:[5,20],
      fog: false,
      fogParams:undefined,
      fogOpacity: 0.5,
      fogOpacityRange:[0.0,1.0],
      color: "#FFFFFF",
      
      //雾化效果
      surficialFog:true,
      surfFogParams:"80px",
      surfFogDst:0.0002,
      surfFogDstRange:[0.0002,0.002],
      // surfFogMinBrt:1,

    }
  },
  computed: {
    formItemLayout({ layout }) {
      return layout === "horizontal"
          ? {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
          }
          : {};
    }
  },
  mounted() {
    const { vueKey, vueIndex } = this;
    window.vueCesium.SettingToolManager.addSource(vueKey,vueIndex,{},{
      GlobeCloud: null,
      SkyBox:null,
      Rain:null,
      Fog:null,
      Snow:null
    });
  },
  methods: {
    /*
    * 太阳
    * */
    enableSun(e){
      const {viewer} = this;
      this.sun = e;
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
    enableMoon(e){
      const {viewer} = this;
      this.moon = e;
      viewer.scene.moon.show = this.moon;
      
      if(this.moon){
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
    
    //星空
    enableSceneSkybox(e) {
      const { viewer } = this;
      this.sceneSkybox = e;
      viewer.scene.skyBox.show = this.sceneSkybox; //背景，星空
    },
    
    //天空盒
    $_enableSkyBox(e) {
      this.skybox = e;
      let vm = this;
      if (vm.skybox) {
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

      window.vueCesium.SettingToolManager.changeOptions(vueKey, vueIndex, 'SkyBox', skyBox);
    },
    removeSkyBox() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let manager = window.vueCesium['SettingToolManager'].findSource(vueKey, vueIndex );
      if (manager.options && manager.options.SkyBox) {
        manager.options.SkyBox.removeSkyBox();
        window.vueCesium['SettingToolManager'].changeOptions(vueKey, vueIndex, 'SkyBox',null);
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
      this.$emit('updateSpin',true);

      this.clouds = e;

      let vm = this;

      setTimeout(function () {
        if (vm.clouds) {
          vm.enableClouds();
        } else {
          vm.removeClouds();
        }
        vm.$emit('updateSpin',false);
      },400)

    },

    cloudsDurationChange(e){
      let vm = this;
      this.cloudsduration = e;
      if (this.clouds) {
        vm.removeClouds();
        vm.enableClouds();
      }
    },
    enableClouds() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      /*
      * cloudsDuration的单位是毫秒
      * */
      let durationInms = this.cloudsduration * 1000;
      let clouds = new Cesium.GlobeEffect(viewer, {
        cloudsDuration: durationInms,
        cloudsImgSource: Cesium.buildModuleUrl("Assets/Images/clouds.png")
      });
      clouds.addGlobeClouds(); //添加云层
      window.vueCesium['SettingToolManager'].changeOptions(vueKey, vueIndex, 'GlobeCloud', clouds);
    },
    removeClouds() {
      const { vueKey, vueIndex, viewer, Cesium } = this;
      let manager = window.vueCesium['SettingToolManager'].findSource(vueKey, vueIndex );
      if (manager.options && manager.options.GlobeCloud) {
        manager.options.GlobeCloud.removeGlobeClouds();
        window.vueCesium['SettingToolManager'].changeOptions(vueKey, vueIndex, 'GlobeCloud', null);
      }
    },

    //雨
    $_enableRain(e) {
      this.$emit('updateSpin',true);

      this.rain = e;

      let vm = this;

      setTimeout(function () {
        if (vm.rain) {
          vm.enableRain();
        } else {
          vm.removeWeather('Rain');
        }
        vm.$emit('updateSpin',false);
      },400)

    },
    speedChange(e) {
      let vm = this;
      this.speed = e;
      if (this.rain) {
        vm.enableRain();
      }
    },
    rainOpacityChange(e) {
      let vm = this;
      this.rainOpacity = e;
      if (this.rain) {
        vm.enableRain();
      }
    },
    angleChange(e) {
      let vm = this;
      this.angle = e;
      if (this.rain) {
        vm.enableRain();
      }
    },
    //雪
    $_enableSnow(e) {
      this.$emit('updateSpin',true);

      this.snow = e;

      let vm = this;

      setTimeout(function () {
        if (vm.snow) {
          vm.enableSnow();
        } else {
          vm.removeWeather('Snow');
        }
        vm.$emit('updateSpin',false);
      },400)

    },
    szChange(e) {
      let vm = this;
      this.size = e;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    dstChange(e) {
      let vm = this;
      this.density = e;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    //雾
    $_enableFog(e) {
      this.$emit('updateSpin',true);

      this.fog = e;
      
      let vm = this;
      
      setTimeout(function () {
        if (vm.fog) {
          vm.enableFog();
        } else {
          vm.removeWeather('Fog');
        }
        vm.$emit('updateSpin',false);
      },400)

    },
    fogOpacityChange(e) {
      let vm = this;
      this.fogOpacity = e;
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
    $_enableWeather(WeatherName, options) {
      const { vueKey, vueIndex, viewer, Cesium } = this;

      this.removeWeather(WeatherName);

      // let manager = window.vueCesium['SettingToolManager'].findSource(vueKey, vueIndex );
      // if(manager && manager.options && manager.options[WeatherName] && manager.options[WeatherName] !== null){
      //   this.removeWeather(WeatherName);
      // }
      let weather = new Cesium.WeatherEffect(viewer);
      switch(WeatherName) {
        case 'Rain':
          weather.addRain(options);
          window.vueCesium['SettingToolManager'].changeOptions(vueKey,vueIndex,'Rain',weather);
          break;
        case 'Snow':
          weather.addSnow(options);
          window.vueCesium['SettingToolManager'].changeOptions(vueKey,vueIndex,'Snow',weather);
          break;
        case 'Fog':
          weather.addFog(options);
          window.vueCesium['SettingToolManager'].changeOptions(vueKey,vueIndex,'Fog',weather);
          break;
        default:
          weather.log('传参错误');
          break;
      }
    },
    removeWeather(WeatherName) {
      const { vueKey, vueIndex } = this;
      let manager = window.vueCesium['SettingToolManager'].findSource(vueKey, vueIndex );
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
            window.vueCesium['SettingToolManager'].changeOptions(vueKey, vueIndex, WeatherName,null);
          }
        });
      }
    },
     
    /*
    * 雾化效果
    * */
    enableSurficialFog(e){
      const {viewer} = this;
      let vm = this;

      if(typeof e ==='boolean'){
        vm.surficialFog = e;
      }else{
        vm.surfFogDst = e;
      }

      viewer.scene.fog.density = this.surfFogDst;
      // viewer.scene.fog.minimumBrightness = this.surfFogMinBrt;
      viewer.scene.fog.enabled = this.surficialFog;
    },

  },
}
</script>

<style scoped>

/* .weather-setting {
} */

.mapgis-ui-form-item{
  margin: 0;
  padding: 0 10px;
}

::v-deep .mapgis-ui-form-item-control{
  text-align: right;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
}

.mapgis-ui-input-number{
  /* margin-right: 12px; */
  width: 60px;
}

.mapgis-ui-slider{
  width: 110px;
}

::v-deep .mapgis-ui-slider-rail{
  background-color: #F0F0F0;
}

::v-deep .mapgis-ui-slider-track{
  background-color: #91D5FF;
}

::v-deep .mapgis-ui-slider-handle{
  border: 2px solid #91D5FF;
}

</style>