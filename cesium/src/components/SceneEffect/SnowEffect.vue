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
  inject: ["Cesium", "vueCesium", "viewer"],
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
        let {vueCesium,vueKey, vueIndex} = this;
        let find = vueCesium.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
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
    let {vueCesium,vueKey, vueIndex,enable} = this;
    let find = vueCesium.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
    let snow = find.source;
    snow.enabled = enable;

  },
  destroyed() {
    this.unmount();
  },
  methods: {
    initSnow() {
      const {
        vueCesium,
        vueKey,
        vueIndex,
        viewer,
        // speed,
        // angle,
        // density
      } = this;
      var advancedAnalysisManager = new window.CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: viewer
      });
      //添加下雨特效
      let snow = advancedAnalysisManager.createSnow({
        // speed:speed,
        // angle:angle,
        // density:density
      });
      vueCesium.AdvancedAnalysisManager.addSource(vueKey, vueIndex, snow);
      this.$emit("load", this);
    },
    unmount(){
      let {viewer, vueCesium,vueKey, vueIndex} = this;
      let find = vueCesium.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        // vueCesium.AdvancedAnalysisManager.removeStage(find.source);
        viewer.scene.postProcessStages.remove(find.source);
      }
      vueCesium.AdvancedAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    }
  }
}
</script>
<style scoped>

</style>