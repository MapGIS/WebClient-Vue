<template>
  <div
    :class="[
      'modelflatten',
      { right: position === 'right', left: position === 'left' }
    ]"
  >
    <div
      class="card-title"
      :style="{
        background: 'rgb(38, 151, 204)',
        padding: '5px',
        color: 'white'
      }"
    >
      模型压平
    </div>
    <mapgis-ui-card>
      <mapgis-ui-button
        class="content"
        type="primary"
        @click="startModelFlatten"
        >开始绘制</mapgis-ui-button
      >
      <mapgis-ui-button
        class="content-clear"
        type="primary"
        @click="clearModelFlatten"
        >清除</mapgis-ui-button
      >
    </mapgis-ui-card>
  </div>
</template>

<script>
import BaseMixin from "./ServiceLayer";

const Managger = "AnalysisModelFlattenManager";
export default {
  name: "mapgis-3d-modelflatten",
  mixins: [BaseMixin],
  props: {
    position: {
      type: String,
      default: "right"
    }
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  data() {
    return {};
  },
  mounted() {},
  destroyed() {
    const { webGlobe } = this;
    let find = this.findSource();
    if (find.source) {
      webGlobe.viewer.scene.VisualAnalysisManager.remove(find.source);
    }
    this.$_deleteManager(Managger);
  },
  methods: {
    findSource() {
      return this.$_getManager(Managger);
    },
    startModelFlatten() {
      let that = this;
      let viewer = that.webGlobe.viewer;
      // viewer.scene.globe.depthTestAgainstTerrain = true;
      const { vueKey, vueIndex } = this;
      let skyline3d;

      // viewer.scene.globe.enableTransparent = false;

      let find = this.findSource();
      if (!find) {
        skyline3d = new Cesium.SkyLineAnalysis(viewer.scene);
        window.CesiumZondy[Managger].addSource(vueKey, vueIndex, skyline3d, {});
        //添加天际线分析结果显示
        viewer.scene.VisualAnalysisManager.add(skyline3d);
      }
    },
    clearModelFlatten() {
      let viewer = this.webGlobe.viewer;
      let find = this.findSource();
      // viewer.scene.globe.depthTestAgainstTerrain = true;
      //删除分析结果
      if (find.source) {
        viewer.scene.VisualAnalysisManager.remove(find.source);
      }
    }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-card-body {
  max-height: 300px;
  overflow: auto;
}
.modelflatten.right {
  position: absolute;
  top: 20px;
  right: 20px;
}
.modelflatten.left {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
