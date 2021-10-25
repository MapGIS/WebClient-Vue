<template>
  <div class="mapgis-3d-setting">
    <slot v-if="initial"></slot>
    <slot name="settingTool">
      <mapgis-ui-tabs default-active-key="1" class="settingControl">
        <mapgis-ui-tab-pane key="1" tab="基本设置">
          <mapgis-ui-row>
            <mapgis-ui-col :span="5" >
              <mapgis-ui-checkbox :checked="enableSkyAtmosphere" @change="skyAtChange">大气渲染
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col :span="5" >
              <mapgis-ui-checkbox :checked="enableBloom" @change="bloomChange">全局泛光
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col :span="5" >
              <mapgis-ui-checkbox :checked="undgrd" @change="undgrdChange">地下模式
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col :span="5" >
              <mapgis-ui-checkbox :checked="enableSunlight" @change="sunChange">太阳光
              </mapgis-ui-checkbox>
          </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4" >
              <span>亮度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="brightness" :min="0" :max="10" @change="brtChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number v-model="brightness" :min="0" :max="10" style="marginLeft: 16px"  @change="brtChange"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4">
              <span>对比度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="contrast" :min="-255" :max="255" :step="10" :disabled="disabled"  @change="ctrstChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number
                  v-model="contrast"
                  :min="-255"
                  :max="255"
                  :step="10"
                  style="marginLeft: 16px"
                  @change="ctrstChange"
                  :disabled="disabled"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane key="2" tab="天气特效" force-render>
          <mapgis-ui-row>
            <mapgis-ui-col  :span="4" >
              <mapgis-ui-checkbox :checked="SkyBox2" @change="skyBoxChange">天空盒
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col  :span="4" >
              <mapgis-ui-checkbox :checked="enableCloud" @change="cloudChange">云图
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col  :span="4" >
              <mapgis-ui-checkbox :checked="rain" @change="rnChange">雨
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col  :span="4" >
              <mapgis-ui-checkbox :checked="snow" @change="snowChange">雪
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col  :span="4" >
              <mapgis-ui-checkbox :checked="fog" @change="fogChange">雾
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4" >
              <span>雨速度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="speed" :min="1.0" :max="20.0" @change="speedChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number v-model="speed" :min="1.0" :max="20.0" style="marginLeft: 16px"  @change="speedChange"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4">
              <span>雨透明度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="rainOpacity" :min="0" :max="1" :step="0.1"  @change="rainOpacityChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number
                  v-model="rainOpacity"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  style="marginLeft: 16px"
                  @change="rainOpacityChange"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4">
              <span>雨角度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="angle" :min="0" :max="90" :step="10" @change="angleChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number
                  v-model="contrast"
                  :min="0"
                  :max="90"
                  :step="10"
                  style="marginLeft: 16px"
                  @change="angleChange"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4">
              <span>雪粒大小</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="size" :min="5" :max="20" :step="5"  @change="szChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number
                  v-model="size"
                  :min="5"
                  :max="20"
                  :step="5"
                  style="marginLeft: 16px"
                  @change="szChange"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4">
              <span>雪密度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="density" :min="5" :max="20" :step="5"   @change="dstChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number
                  v-model="density"
                  :min="5"
                  :max="20"
                  :step="5"
                  style="marginLeft: 16px"
                  @change="dstChange"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="4">
              <span>雾透明度</span>
            </mapgis-ui-col>
            <mapgis-ui-col :span="8">
              <mapgis-ui-slider v-model="fogOpacity" :min="0" :max="1" :step="0.1"  @change="fogOpacityChange"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="4">
              <mapgis-ui-input-number
                  v-model="fogOpacity"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  style="marginLeft: 16px"
                  @change="fogOpacityChange"
              />
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane key="3" tab="其它特效">
          <mapgis-ui-row>
            <mapgis-ui-col  :span="5" >
              <mapgis-ui-checkbox :checked="blckWhite" @change="blackAndWhiteChange">黑白照片
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
            <mapgis-ui-col  :span="5" >
              <mapgis-ui-checkbox :checked="ntVision" @change="nightVision">夜视效果
              </mapgis-ui-checkbox>
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
    </slot>
  </div>
</template>

<style scoped>
.settingControl {
  position: absolute;
  left: 10px;
  top: 10px;
  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
  color: #ffffff;
  background-color: #4c4e5a;
  /*!*圆角的大小 *!*/
  border-radius: 10px;
  padding: 0 10px 10px;
}
.mapgis-ui-row{
  line-height : 36px;
  /*margin-left: 10px*/
}
.mapgis-ui-col{
  text-align: center;
}
</style>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";

export default {
  name: "mapgis-3d-setting",
  mixins: [ServiceLayer],
  inject: ["viewer"],
  // props: {
  //   speed: {
  //     type: Number,
  //     default: 1.0,//雨丝速度，【1.0,20.0】
  //   },
  //   rainOpacity: {
  //     type: Number,
  //     default: 1.0,//alpha，雨透明度，值域【0,1】
  //   },
  //   angle: {
  //     type: Number,
  //     default: 0.0,//雨倾斜角度，值域【0,90】
  //   },
  //   density: {
  //     type: Number,
  //     default: 5,//size,雪的数量、密度
  //   },
  //   size: {
  //     type: Number,
  //     default: 5,//scale，雪粒子的大小
  //   },
  //   color: {
  //     type: String,
  //     default: '#FFFFFF',//雾的颜色，Cesium.Color(red, green, blue, alpha)
  //   },
  //   fogOpacity: {
  //     type: Number,
  //     default: 0.5,//雾的透明度,alpha
  //   },
  // },
  data() {
    return {
      weather: undefined,
      initial: false,
      enableSkyAtmosphere: true,
      enableSunlight:false,
      enableBloom: false,
      undgrd:false,
      brightness:1,
      contrast:128,
      disabled:!this.enableBloom,
      SkyBox2: false,
      enableCloud:false,
      rain : false,
      speed:1.0,
      rainOpacity:1.0,
      angle:0,
      snow : false,
      density:5,
      size:5,
      fog : false,
      color:'#FFFFFF',
      fogOpacity:0.5,
      blckWhite:false,
      ntVision:false,
    };
  },
  // watch: {
  //   speed: {
  //     handler: function (next) {
  //       this.speed = next;
  //       // this.$_removeWeather();
  //       // this.enableRain()
  //     },
  //   },
  //   rainOpacity: {
  //     handler: function (next) {
  //       this.rainOpacity = next;
  //       // this.$_removeWeather();
  //       // this.enableRain()
  //     },
  //   },
  //   angle: {
  //     handler: function (next) {
  //       this.angle = next;
  //       // this.$_removeWeather();
  //       // this.enableRain()
  //     },
  //   },
  //   density: {
  //     handler: function (next) {
  //       this.density = next;
  //       // this.$_removeWeather();
  //       // this.enableSnow()
  //     },
  //   },
  //   size: {
  //     handler: function (next) {
  //       this.size = next;
  //       // this.$_removeWeather();
  //       // this.enableSnow()
  //     },
  //   },
  //   color: {
  //     handler: function (next) {
  //       this.color = next;
  //       // this.$_removeWeather();
  //       // this.enableFog()
  //     },
  //   },
  //   fogOpacity: {
  //     handler: function (next) {
  //       this.fogOpacity = next;
  //       // this.$_removeWeather();
  //       // this.enableFog()
  //     },
  //   },
  // },
  mounted() {
    const { viewer }=this;
    let bright = viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createBrightnessStage()
    );
    bright.uniforms.brightness = this.brightness;

    this.initial = true;
    this.$emit("load", this);
  },
  destroyed() {
    // this.removeWeather();
    this.$emit("unload");
  },
  methods: {
    enableRain() {
      let rainOptions = {
        speed: this.speed,
        angle: this.angle,
        alpha: this.rainOpacity
      };
      this.$_enableWeather("addRain", rainOptions);
    },
    enableSnow() {
      let snowOptions = {
        size: this.density,
        scale: this.size
      };
      this.$_enableWeather("addSnow", snowOptions);
    },
    enableFog() {
      let color = Cesium.Color.fromCssColorString(this.color);
      let fogOptions = {
        fogcolor: color,
        alpha: this.fogOpacity
      };
      this.$_enableWeather("addFog", fogOptions);
    },
    //积雪？？


    $_enableWeather(WeatherName, options) {
      const {vueKey, vueIndex, viewer, Cesium} = this;
      this.$_removeWeather();
      let weather = new Cesium.WeatherEffect(viewer);
      weather[WeatherName](options);
      window.CesiumZondy.MeasureToolManager.addSource(
          vueKey,
          vueIndex,
          weather
      );
    },
    $_removeWeather() {
      this.$_deleteManger("MeasureToolManager", function (manager) {
        if (manager.source) {
          manager.source.removeAll();
        }
      });
    },
    removeWeather() {
      this.$_removeWeather();
    },
    rnChange(e){
      this.rain = e.target.checked;
      let vm = this;
      if(vm.rain){
        vm.enableRain();
      }else{
        vm.removeWeather();
      }
    },
    speedChange(e){
      this.speed = e;
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    rainOpacityChange(e){
      this.rainOpacity = e;
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    angleChange(e){
      this.angle = e;
      let vm = this;
      if (this.rain) {
        vm.enableRain();
      }
    },
    snowChange(e){
      this.snow = e.target.checked;
      let vm = this;
      if(vm.snow){
        vm.enableSnow();
      }else{
        vm.removeWeather();
      }
    },
    szChange(e){
      this.size = e;
      let vm = this;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    dstChange(e){
      this.density = e;
      let vm = this;
      if (this.snow) {
        vm.enableSnow();
      }
    },
    fogChange(e){
      this.fog = e.target.checked;
      let vm = this;
      if(vm.fog){
        vm.enableFog();
      }else{
        vm.removeWeather();
      }
    },
    fogOpacityChange(e){
      this.fogOpacity = e;
      let vm = this;
      if (this.fog) {
        vm.enableFog();
      }
    },


    //全球云
    enableClouds() {
      const {vueKey, vueIndex, viewer, Cesium} = this;
      //云层效果验证
      var clouds = new Cesium.GlobeEffect(viewer, {
        cloudsDuration: 10000,
        cloudsImgSource: Cesium.buildModuleUrl('Assets/Images/clouds.png')
      });
      clouds.addGlobeClouds(); //添加云层
      window.CesiumZondy.MeasureToolManager.addSource(
          vueKey,
          vueIndex,
          clouds
      );
    },
    removeClouds() {
      this.$_deleteManger("MeasureToolManager", function (manager) {
        if (manager.source) {
          manager.source.removeGlobeClouds();
        }
      });
    },
    cloudChange(e){
      this.enableCloud = e.target.checked;
      let vm = this;
      if(vm.enableCloud){
        vm.enableClouds();
      }else{
        vm.removeClouds();
      }
    },
    //天空盒
    enableSkyBox() {
      //天空盒样式更改
      const {vueKey, vueIndex, viewer, Cesium} = this;
      //云层效果验证
      let skyBox = new Cesium.GlobeEffect(viewer, {
        cloudsDuration: 10000,
        cloudsImgSource: Cesium.buildModuleUrl('Assets/Images/clouds.png')
      });
      skyBox.addskyBox(); //添加天空盒
      viewer.scene.camera.flyTo({
        destination: new Cesium.Cartesian3(-2179825.7788852383, 4380581.427298224, 4091538.107446992),
        orientation: {
          heading: 0.005352643897039933,
          pitch: -0.03880119222393663,
          roll: 6.2831853071795845
        },
        duration:1,
      })
      window.CesiumZondy.MeasureToolManager.addSource(vueKey, vueIndex, skyBox);
    },
    removeSkyBox() {
      const {vueKey, vueIndex, viewer, Cesium} = this;
      this.$_deleteManger('MeasureToolManager', function (manager) {
        if (manager.source) {
          manager.source.removeSkyBox();
        }
      })
      viewer.scene.camera.flyTo({
        destination: new Cesium.Cartesian3(-4957554.172258782, 19883663.751066618, 10885451.402250132),
        orientation: {
          heading: 6.283185307179586,
          pitch: -1.5707963267948966,
          roll: 0
        },
        duration: 1.0
      })
    },
    skyBoxChange(e) {
      this.SkyBox2 = e.target.checked;
      let vm = this;
      if (vm.SkyBox2) {
        vm.enableSkyBox();
      } else {
        vm.removeSkyBox();
      }
    },
    //模型泛光
    enableFloodLight(transfm) {
      const {vueKey, vueIndex, viewer, Cesium} = this;
      let floodLight = new Cesium.BloomEffect(viewer, [], transfm);//position传空数组表示对全部模型泛光处理
      floodLight.add();
      console.log('floodLight', floodLight);
      window.CesiumZondy.MeasureToolManager.addSource(vueKey, vueIndex, floodLight);
    },
    removeFloodLight() {
      this.$_deleteManger('MeasureToolManager', function (manager) {
        if (manager.source) {
          manager.source.remove();
        }
      })
    },
    sceneSetting() {
      const {vueKey, vueItndex, viewer, Cesium} = this;
      // console.log('viewer.scene.globe', viewer.scene.globe);
      // console.log('viewer.scene', viewer.scene);
      // console.log('viewer.scene.postProcessStages', viewer.scene.postProcessStages);
      // console.log('viewer.scene.postProcessStages.bloom', viewer.scene.postProcessStages.bloom);

      //sunlight
      viewer.scene.globe.enableLighting = true;

      //monochrome黑白照片
      var blackAndWhite = viewer.scene.postProcessStages.add(
          Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
      );
      blackAndWhite.uniforms.gradations = 5.0;//(灰度级数)

      //夜视效果
      var nightVision = viewer.scene.postProcessStages.add(
          Cesium.PostProcessStageLibrary.createNightVisionStage()
      );

      //是否开启大气渲染
      let atmosphere = viewer.scene.skyAtmosphere;
      viewer.scene.skyAtmosphere.show = true;
      atmosphere.brightnessShift  = 0; //-1全黑
      atmosphere.hueShift  = 0;
      atmosphere.saturationShift  = 0; //-1 黑白照片的模式

      //地下模式
      console.log("viewer.scene.cameraUnderground",viewer.scene.cameraUnderground);
      console.log("viewer.scene.globe.translucency",viewer.scene.globe.translucency);
      viewer.scene.globe.translucency.enabled = true;
      viewer.scene.globe.translucency.backFaceAlpha  = 1;
      viewer.scene.globe.translucency.frontFaceAlpha   = 0;
      // viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(1.5e2, 0, 8.0e6, 0.5);

      //场景亮度
      var bright = viewer.scene.postProcessStages.add(
          Cesium.PostProcessStageLibrary.createBrightnessStage()
      );
      bright.brightness = 1; //0为全黑

      // 场景对比度, [-255.0, 255.0]
      viewer.scene.postProcessStages.bloom.enabled = true;
      viewer.scene.postProcessStages.bloom.uniforms.contrast = 128;

      viewer.scene.sun.show = true ; //太阳
      viewer.scene.moon.show = true ; //月亮
      viewer.scene.skyBox.show = true ; //背景，星空

      //全局泛光
      let bloom = viewer.scene.postProcessStages.bloom;
      bloom.enabled = true;

    },
    brtChange(e){
      const {viewer} = this;
      this.brightness = e;
      viewer.scene.postProcessStages._activeStages[0]._actualUniforms.brightness = this.brightness;
      // console.log("viewer.scene.postProcessStages",viewer.scene.postProcessStages._activeStages[0])
      // console.log("brt.e",e)
    },
    ctrstChange(e){
      const {viewer} = this;
      this.contrast = e;
      console.log('wwww',e);
      viewer.scene.postProcessStages.bloom.uniforms.contrast = this.contrast;
      console.log("viewer.scene.postProcessStages.bloom.uniforms.contrast",viewer.scene.postProcessStages.bloom.uniforms.contrast)

    },
    skyAtChange(e) {
      const {viewer} = this;
      // console.log(`checked = ${e.target.checked}`);
      this.enableSkyAtmosphere = e.target.checked;
      viewer.scene.skyAtmosphere.show = this.enableSkyAtmosphere;
    },
    bloomChange(e) {
      const {viewer} = this;
      // console.log(`checked = ${e.target.checked}`);
      this.enableBloom = e.target.checked;
      viewer.scene.postProcessStages.bloom.enabled = this.enableBloom;
      this.disabled = !this.enableBloom;
    },
    sunChange(e){
      const {viewer} = this;
      this.enableSunlight = e.target.checked;
      viewer.scene.globe.enableLighting = this.enableSunlight;
    },
    undgrdChange(e){
      const {viewer} = this;
      this.undgrd = e.target.checked;
      viewer.scene.globe.translucency.enabled = this.undgrd;
      viewer.scene.globe.translucency.backFaceAlpha = 1;
      viewer.scene.globe.translucency.frontFaceAlpha = 0;
    },
    removeOtherStages(){
      const { viewer } = this;
      let length = viewer.scene.postProcessStages._activeStages.length ;
      if(length > 1){
        let i = 1;
        for(i ; i < length ; i++){
          let stage = viewer.scene.postProcessStages.get(i);
          viewer.scene.postProcessStages.remove(stage);
        }
      }
    },
    blackAndWhiteChange(e){
      const { viewer } = this;
      this.blckWhite = e.target.checked;
      let vm = this;
      if (vm.blckWhite) {
        vm.removeOtherStages();

        let blackAndWhite = viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
        );
        blackAndWhite.uniforms.gradations = 5.0;//(灰度级数)

        console.log('viewer.scene.postProcessStages',viewer.scene.postProcessStages)

      } else {
        vm.removeOtherStages();
      }
    },
    nightVision(e){
      const { viewer } = this;
      this.ntVision = e.target.checked;
      let vm = this;
      if (vm.ntVision) {
        vm.removeOtherStages();
        viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createNightVisionStage()
        );
        console.log('viewer.scene.postProcessStages',viewer.scene.postProcessStages)
      } else {
        vm.removeOtherStages();
      }

    }
  }
};
</script>
