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

import BaseMixin from "../Controls/ServiceLayer";

export default {
  name: "mapgis-3d-fog-effect",
  mixins: [BaseMixin],
  props: {
    alpha: {    //[0,1]
      type: Number,
      default: 0.1
    },
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  watch: {

  },
  data() {
    return {
      waitManagerName: "M3DIgsManager",
    };
  },
  mounted() {
    let vm = this;
    vm.$_init(vm.initFog());
  },
  destroyed() {
    let {webGlobe, vueKey, vueIndex} = this;
    let find = CesiumZondy.AdvancedAnalysisManager.findSource(vueKey, vueIndex);
    if (find && find.options && find.options.fog) {
      webGlobe.scene.VisualAnalysisManager.remove(find.options.fog);
    }
    this.$emit("unload", this);
  },
  methods: {
    initFog() {
      const {
        CesiumZondy,
        vueKey,
        vueIndex,
        webGlobe,
          alpha
      } = this;
      var advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager({
        viewer: webGlobe.viewer
      });
      //添加雾特效
      let fog = advancedAnalysisManager.createFog({
        // speed:speed,
        // angle:angle,
        alpha:alpha
      });
      CesiumZondy.AdvancedAnalysisManager.addSource(vueKey, vueIndex, fog);
      this.$emit("load", this);
    },
  },

}
</script>
<style scoped>

</style>