<template>
  <div class="defaultControl">
<!--      <mapgis-ui-row>-->
<!--        <mapgis-ui-col :span="8">-->
<!--          状态-->
<!--        </mapgis-ui-col>-->
<!--        <mapgis-ui-col :span="16">-->
<!--          <mapgis-ui-checkbox>开启效果</mapgis-ui-checkbox>-->
<!--        </mapgis-ui-col>-->
<!--      </mapgis-ui-row>-->
<!--      <mapgis-ui-row>-->
<!--        <mapgis-ui-col :span="5">-->
<!--          <span>速度</span>-->
<!--        </mapgis-ui-col>-->
<!--        <mapgis-ui-col :span="15">-->
<!--          <mapgis-ui-slider-->
<!--              v-model="speed"-->
<!--              :value="parseFloat(speed)"-->
<!--              @change="changeSpeed"-->
<!--              :min="minSpeed"-->
<!--              :max="maxSpeed"-->
<!--              :step="5"-->
<!--          />-->
<!--        </mapgis-ui-col>-->
<!--      </mapgis-ui-row>-->
  </div>
</template>

<script>

import BaseMixin from "../Controls/ServiceLayer";

export default {
  name: "mapgis-3d-rain-effect",
  mixins: [BaseMixin],
  props: {
    speed: {    //[0.0,+无穷大]
      type: Number,
      default: 1.0
    },
    angle: {    //[0,180]
      type: Number,
      default: 0
    },
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  watch: {
    speed: {
      handler(next){
        // this.changeSpeed(next);
        this.speed = next;
        this.unmount();
        this.initRain();
      }
    },
    angle: {
      handler(next){
        // this.changeSpeed(next);
        this.angle = next;
        this.unmount();
        this.initRain();
      }
    }
  },
  data() {
    return {
      waitManagerName: "M3DIgsManager",
      minSpeed:0,
      maxSpeed:200
    };
  },
  mounted() {
    //1.三维模型或地形先加载
    let vm = this;
    vm.$_init(vm.initRain());
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    initRain() {
      const {
        CesiumZondy,
        vueKey,
        vueIndex,
        webGlobe,
        speed,
        angle
      } = this;
      var advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: webGlobe.viewer
      });
      //添加下雨特效
      let rain = advancedAnalysisManager.createRain({
        speed:speed,
        angle:angle
      });
      // console.log('rain',rain);
      CesiumZondy.AdvancedAnalysisManager.addSource(vueKey, vueIndex, rain);
      this.$emit("load", this);
    },
    // changeSpeed(newSpeed){
    //   this.speed = newSpeed;
    //   this.unmount();
    //   this.initRain();
    // },
    unmount(){
      let {webGlobe, CesiumZondy,vueKey, vueIndex} = this;
      let find = CesiumZondy.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        // CesiumZondy.AdvancedAnalysisManager.removeStage(find.source);
        webGlobe.viewer.scene.postProcessStages.remove(find.source);
      }
      CesiumZondy.AdvancedAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    }
  },
}
</script>
<style scoped>
.defaultControl{
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>