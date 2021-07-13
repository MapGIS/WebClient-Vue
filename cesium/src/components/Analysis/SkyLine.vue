<template>
  <div :class="['skyl',{ right: position === 'right', left: position === 'left' }]">
    <div
        class="card-title"
        :style="{
                background: 'rgb(38, 151, 204)',
                padding: '5px',
                color: 'white',
            }"
    >
      天际线分析
    </div>
    <mapgis-ui-card>
    <mapgis-ui-button class="content" type="primary" @click="startSkyLine"
    >开始绘制</mapgis-ui-button
    >
    <mapgis-ui-button
        class="content-clear"
        type="primary"
        @click="clearSkyLine"
    >清除</mapgis-ui-button>
    </mapgis-ui-card>
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-skyline",
  props:{
    index: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: "right",
    },
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  data(){
    return{
      //定义天地线分析
      skyLineAn:false
    }
  },
  mounted() {
    window.skyline = window.skyline || [[], []];
  },
  destroyed() {
    const { webGlobe } = this;
    let find = this.findSource();
    webGlobe.viewer.scene.VisualAnalysisManager.remove(
        window.skyline[this.index][find.index]
    );
    delete window.skyline;
    window.skyline = [[], []];
  },
  methods:{
    findSource(){
      const vm = this;
      let index = -1;
      let find = window.skyline[this.index].find((s, i) => {
        let result = false;
        let { layer } = vm;
        if (s instanceof Cesium.SkyLineAnalysis) {
          index = i;
          result = true;
        }
        return result;
      });
      return { index: index, value: find };
    },
    startSkyLine(){
      let that = this;
      let viewer = that.webGlobe.viewer;
      viewer.scene.globe.depthTestAgainstTerrain = true;

      viewer.scene.globe.enableTransparent = false;
      if (that.skyLineAn === false){
        that.skyLineAn = true;
        window.skyline[that.index].push(
            new Cesium.SkyLineAnalysis(viewer.scene)
        );
      }
      if (that.skyLineAn){
        let find = that.findSource();
        let skyline3d = window.skyline[that.index][find.index];
        //添加天际线分析结果显示
        viewer.scene.VisualAnalysisManager.add(skyline3d);
      }
    },
    clearSkyLine(){
      let that = this;
      let viewer = that.webGlobe.viewer;
      let find = that.findSource();
      viewer.scene.globe.depthTestAgainstTerrain = true;
      if (that.skyLineAn === true){
        //删除分析结果
        viewer.scene.VisualAnalysisManager.remove(
            window.skyline[this.index][find.index]
        );
        delete window.skyline[this.index][find.index];
        that.skyLineAn = false;
      }
    }

  }
}
</script>

<style scoped>
::v-deep .ant-card-body {
  max-height: 300px;
  overflow: auto;
}
  .skyl.right{
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .skyl.left{
    position: absolute;
    top: 20px;
    left: 20px;
  }
</style>