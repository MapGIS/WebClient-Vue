<template>
  <div class="mapgis-3d-scene-effect">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout" labelAlign="left" class="formStyle" :colon="false">

<!--      <mapgis-ui-form-model-item label="天气特效" >-->
<!--          <mapgis-ui-checkbox :checked="sunlight" @change="enableSunlight">太阳-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="sceneSkybox" @change="enableSceneSkybox" >星空-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="clouds" @change="$_enableClouds" >云图-->
<!--          </mapgis-ui-checkbox>-->
<!--      </mapgis-ui-form-model-item>-->

<!--      <mapgis-ui-switch-panel layout="horizontal" label="太阳ceshi" :checked="sunlight" @changeChecked="enableSunlight">-->
<!--      </mapgis-ui-switch-panel>-->

      <mapgis-ui-form-model-item label="太阳光照" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="sunlight" @change="enableSunlight">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{ maxHeight: sunlightParams }">

        <mapgis-ui-form-model-item label="光照颜色">
          <mapgis-ui-sketch-color-picker
              size="small"
              :color.sync="lightColor"
              :disableAlpha="false"
              :style="{padding:'8px 0'}"
              @input="
                val =>
                  (lightColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
              "
          />
        </mapgis-ui-form-model-item>

      </div>

      <mapgis-ui-form-model-item label="星空" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="sceneSkybox" @change="enableSceneSkybox">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="云图" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="clouds" @change="$_enableClouds">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{ maxHeight: cloudsParams }">

        <mapgis-ui-form-model-item label="周期/秒">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="cloudsduration"
                :max="10"
                :min="1"
                @change="cloudsDurationChange"
            />
            <mapgis-ui-input-number
                v-model="cloudsduration"
                :max="10"
                :min="1"
                @change="cloudsDurationChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

      </div>

      <mapgis-ui-form-model-item label="雨" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="rain" @change="$_enableRain">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{ maxHeight: rainParams }">

        <mapgis-ui-form-model-item label="雨速度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="speed"
                :max="20.0"
                :min="1.0"
                @change="speedChange"
            />
            <mapgis-ui-input-number
                v-model="speed"
                :max="20.0"
                :min="1.0"
                @change="speedChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

        <mapgis-ui-form-model-item label="雨透明度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="rainOpacity"
                :max="1"
                :min="0"
                :step="0.1"
                @change="rainOpacityChange"
            />
            <mapgis-ui-input-number
                v-model="rainOpacity"
                :max="1"
                :min="0"
                :step="0.1"
                @change="rainOpacityChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

        <mapgis-ui-form-model-item label="雨角度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="angle"
                :max="90"
                :min="0"
                :step="10"
                @change="angleChange"
            />
            <mapgis-ui-input-number
                v-model="angle"
                :max="90"
                :min="0"
                :step="10"
                @change="angleChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

      </div>

      <mapgis-ui-form-model-item label="雪" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="snow" @change="$_enableSnow">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{ maxHeight: snowParams }">

        <mapgis-ui-form-model-item label="雪粒大小" >
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="size"
                :max="20"
                :min="5"
                :step="5"
                @change="szChange"
            />
            <mapgis-ui-input-number
                v-model="size"
                :max="20"
                :min="5"
                :step="5"
                @change="szChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

        <mapgis-ui-form-model-item label="雪密度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="density"
                :max="20"
                :min="5"
                :step="5"
                @change="dstChange"
            />
            <mapgis-ui-input-number
                v-model="density"
                :max="20"
                :min="5"
                :step="5"
                @change="dstChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

      </div>

      <mapgis-ui-form-model-item label="雾" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="fog" @change="$_enableFog">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{ maxHeight: fogParams }">

        <mapgis-ui-form-model-item label="雾透明度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="fogOpacity"
                :max="1"
                :min="0"
                :step="0.1"
                @change="fogOpacityChange"
            />
            <mapgis-ui-input-number
                v-model="fogOpacity"
                :max="1"
                :min="0"
                :step="0.1"
                @change="fogOpacityChange"
                size="small"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>

      </div>

      <mapgis-ui-form-model-item label="天空盒" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="skybox" @change="$_enableSkyBox">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

<!--      <mapgis-ui-form-model-item :wrapperCol="{span: 24}">-->
<!--          <mapgis-ui-checkbox :checked="rain" @change="$_enableRain" >雨-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="snow" @change="$_enableSnow" >雪-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="fog" @change="$_enableFog" >雾-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="skybox" @change="$_enableSkyBox">天空盒-->
<!--          </mapgis-ui-checkbox>-->
<!--      </mapgis-ui-form-model-item>-->

      <mapgis-ui-form-model-item label="黑白照片" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="blckWhite" @change="blackAndWhiteChange">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="夜视效果" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="ntVision" @change="nightVision">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

<!--      <mapgis-ui-form-model-item label="其它特效">-->
<!--        <mapgis-ui-space>-->
<!--          <mapgis-ui-checkbox :checked="blckWhite" @change="blackAndWhiteChange">黑白照片-->
<!--          </mapgis-ui-checkbox>-->
<!--          <mapgis-ui-checkbox :checked="ntVision" @change="nightVision" >夜视效果-->
<!--          </mapgis-ui-checkbox>-->
<!--        </mapgis-ui-space>-->
<!--      </mapgis-ui-form-model-item>-->

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
      sunlight: false,
      sunlightParams:undefined,
      lightColor: 'rgba(255,255,255,255)', // 光照颜色


      sceneSkybox: true,
      clouds: false,
      cloudsduration: 5,
      cloudsParams:undefined,
      weather: undefined,
      rain: false,
      speed: 1.0,
      rainOpacity: 1.0,
      angle: 0,
      rainParams:undefined,
      snow: false,
      size: 5,
      density: 5,
      snowParams:undefined,
      fog: false,
      fogOpacity: 0.5,
      color: "#FFFFFF",
      fogParams:undefined,
      skybox: false,

      blckWhite: false,
      ntVision: false,

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
  watch:{
    lightColor:{
      handler:function(newColor){
        this.lightColorChange(newColor);
      },
      deep:true
    }
  },
  methods: {
    //太阳
    enableSunlight(e) {
      const { viewer } = this;
      this.sunlight = e;
      this.$emit('updateSpin',true);
      let vm = this;

      if(vm.sunlight){ this.sunlightParams = "40px" }else{ this.sunlightParams = "0px" }

      setTimeout(function () {
        viewer.scene.globe.enableLighting = vm.sunlight;
        // var sunLight = new Cesium.SunLight({color:Cesium.Color.RED});
        // viewer.scene.light = sunLight
        vm.$emit('updateSpin',false);
      },400)

    },
    //光照颜色
    lightColorChange(e){
      const {Cesium} = this;
      let color = Cesium.Color.fromCssColorString(e);
      let sunLight = new Cesium.SunLight({color:color});
      viewer.scene.light = sunLight;
    },
    //星空
    enableSceneSkybox(e) {
      const { viewer } = this;
      viewer.scene.skyBox.show = this.sceneSkybox; //背景，星空
    },

    //云图
    $_enableClouds(e) {
      this.$emit('updateSpin',true);
      let vm = this;

      if(vm.clouds){ this.cloudsParams = "40px" }else{ this.cloudsParams = "0px" }

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
      let vm = this;

      if(vm.rain){
        this.rainParams = "120px"
      }else{
        this.rainParams = "0px";
      }

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
      if (this.rain) {
        vm.enableRain();
      }
    },
    rainOpacityChange(e) {
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    angleChange(e) {
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    //雪
    $_enableSnow(e) {
      this.$emit('updateSpin',true);
      let vm = this;

      if(vm.snow){
        this.snowParams = "80px";
      }else{
        this.snowParams = "0px"
      }

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
      if (this.snow) {
        vm.enableSnow();
      }
    },
    dstChange(e) {
      let vm = this;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    //雾
    $_enableFog(e) {
      this.$emit('updateSpin',true);
      let vm = this;
      if(vm.fog){
        this.fogParams = "40px"
      }else{
        this.fogParams = "0px"
      }
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

    //天空盒
    $_enableSkyBox(e) {
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

    //黑白照片
    blackAndWhiteChange(e) {
      const { viewer } = this;
      let vm = this;
      if (vm.blckWhite) {
        vm.removeOtherStages();

        let blackAndWhite = viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
        );
        blackAndWhite.uniforms.gradations = 5.0; //(灰度级数)

      } else {
        vm.removeOtherStages();
      }
    },
    //夜视效果
    nightVision(e) {
      const { viewer } = this;
      let vm = this;
      if (vm.ntVision) {
        vm.removeOtherStages();
        viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createNightVisionStage()
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

/* .mapgis-3d-scene-effect {
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

::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label:before{
  content: url("titlew.png");
  margin-right: 6px;
}

/*::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label{*/
/*  padding-left: 11px!important;*/
/*}*/

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

</style>