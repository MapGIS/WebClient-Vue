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
  name: "mapgis-3d-fog-effect",
  mixins: [BaseMixin],
  props: {
    alpha: {    //[0.0,1.0]
      type: Number,
      default: 0.1
    },
    enable:{
      type: Boolean,
      default: true
    }
  },
  inject: ["Cesium", "vueCesium", "viewer"],
  watch: {
    alpha: {
      handler(next){
        // this.changeSpeed(next);
        this.alpha = next;
        this.unmount();
        this.initFog();
      }
    },
    enable: {
      handler(stag){
        // this.changeDensity(next);
        let {vueCesium,vueKey, vueIndex} = this;
        let find = vueCesium.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
        let fog = find.source;
        fog.enabled = stag;
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
    vm.$_init(vm.initFog());
    let {vueCesium,vueKey, vueIndex,enable} = this;
    let find = vueCesium.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
    let fog = find.source;
    fog.enabled = enable;
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    initFog() {
      const {
        vueCesium,
        vueKey,
        vueIndex,
        viewer,
          alpha
      } = this;
      var advancedAnalysisManager = new window.CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: viewer
      });
      //添加雾特效
      let fog = advancedAnalysisManager.createFog({
        alpha:alpha
      });
      vueCesium.AdvancedAnalysisManager.addSource(vueKey, vueIndex, fog);
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
  },

}
</script>
<style scoped>

</style>