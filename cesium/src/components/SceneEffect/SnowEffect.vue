<template>
  <div>
    <!--      <mapgis-ui-row>-->
    <!--        <mapgis-ui-col :span="8">-->
    <!--          状态-->
    <!--        </mapgis-ui-col>-->
    <!--        <mapgis-ui-col :span="16">-->
    <!--          <mapgis-ui-checkbox>开启效果</mapgis-ui-checkbox>-->
    <!--        </mapgis-ui-col>-->
    <!--      </mapgis-ui-row>-->
    <!--      <mapgis-ui-row>-->
    <!--        <mapgis-ui-col :span="8">-->
    <!--          速度-->
    <!--        </mapgis-ui-col>-->
    <!--        <mapgis-ui-col :span="16">-->
    <!--          <mapgis-ui-slider-->
    <!--              defaultValue="30"-->
    <!--              min="0"-->
    <!--              max="100"/>-->
    <!--        </mapgis-ui-col>-->
    <!--      </mapgis-ui-row>-->
  </div>
</template>

<script>

import BaseMixin from "../UI/Controls/ServiceLayer";

export default {
  name: "mapgis-3d-snow-effect",
  mixins: [BaseMixin],
  props: {
    enable:{
      type: Boolean,
      default: true
    }
    // density: {
    //   type: Number,
    //   default: 0.001
    // },
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  watch: {
    // density: {
    //   handler(next){
    //     // this.changeDensity(next);
    //     this.density = next;
    //     this.unmount();
    //     this.initSnow();
    //   }
    // },
    enable: {
      handler(stag){
        // this.changeDensity(next);
        let {CesiumZondy,vueKey, vueIndex} = this;
        let find = CesiumZondy.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
        let snow = find.source;
        snow.enabled = stag;
      }
    },
  },
  data() {
    return {
      waitManagerName: "M3DIgsManager",
    };
  },
  mounted() {
    let vm = this;
    vm.$_init(vm.initSnow());
    let {CesiumZondy,vueKey, vueIndex,enable} = this;
    let find = CesiumZondy.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
    let snow = find.source;
    snow.enabled = enable;

  },
  destroyed() {
    this.unmount();
  },
  methods: {
    initSnow() {
      const {
        CesiumZondy,
        vueKey,
        vueIndex,
        webGlobe,
        // speed,
        // angle,
        // density
      } = this;
      var advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: webGlobe.viewer
      });
      //添加下雨特效
      let snow = advancedAnalysisManager.createSnow({
        // speed:speed,
        // angle:angle,
        // density:density
      });
      CesiumZondy.AdvancedAnalysisManager.addSource(vueKey, vueIndex, snow);
      this.$emit("load", this);
    },
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
  }
}
</script>
<style scoped>

</style>