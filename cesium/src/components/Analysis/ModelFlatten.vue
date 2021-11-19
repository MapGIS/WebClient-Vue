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
      <mapgis-ui-button-group>
        <mapgis-ui-button
          class="content"
          type="primary"
          @click="startModelFlatten"
          >开始绘制</mapgis-ui-button
        >
        <mapgis-ui-button class="content-clear" @click="clearModelFlatten"
          >还原</mapgis-ui-button
        >
      </mapgis-ui-button-group>
    </mapgis-ui-card>
  </div>
</template>

<script>
import BaseMixin from "./BaseLayer";

const Managger = "AnalysisModelFlattenManager";
export default {
  name: "mapgis-3d-model-flatten",
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
    this.clearModelFlatten();
    let find = this.findSource();
    if (find && find.source) {
      let tool = find.source;
      tool.destroy();
    }
    this.$_deleteManager(Managger);
  },
  methods: {
    findSource() {
      return this.$_getManager(Managger);
    },
    startModelFlatten() {
      const { vueKey, vueIndex, webGlobe } = this;
      const { viewer } = webGlobe;
      let m3d;
      let find = this.findSource();
      if (!find) {
        // 创建交互式绘制工具
        var tool = new Cesium.DrawElement(viewer);
        // 激活交互式绘制工具
        tool.startDrawingPolygon({ callback: this.getDrawResult });
        console.log("tool", tool);
        let m3ds = this.$_getManager("M3DIgsManager");
        if (m3ds && m3ds.source && m3ds.source.length > 0) {
          m3d = m3ds.source[0];
        }
        const { u_arrayLength, u_height, u_isFlatten, u_positionArray } = m3d;
        window.CesiumZondy[Managger].addSource(vueKey, vueIndex, tool, {
          m3d: m3d,
          origin: {
            u_arrayLength,
            u_height,
            u_isFlatten,
            u_positionArray
          }
        });
      }
    },
    clearModelFlatten() {
      const { webGlobe } = this;
      let find = this.findSource();
      if (find && find.source) {
        let tool = find.source;

        let m3d = find.options.m3d;
        let origin = find.options.origin;
        m3d.u_isFlatten = origin.u_isFlatten;
        m3d.u_height = origin.u_height;
        m3d.u_arrayLength = origin.u_arrayLength;
        m3d.u_positionArray = origin.u_positionArray;
        webGlobe.viewer.scene.requestRender();
      }
    },
    getDrawResult(positions) {
      const { Cesium, CesiumZondy, webGlobe } = this;

      let find = this.findSource();
      if (!find) return;
      let m3d = find.options.m3d;
      if (!m3d) return;

      //获取绘制多边形区域的定点（这是三维的点xyz）
      let positionsArray = positions;
      /*对绘制区域的顶点循环处理一下，以便用于模型压平参数的赋值*/
      var array = [];
      for (let i = 0; i < positionsArray.length; i++) {
        let point = positionsArray[i];
        let resPoint = new Cesium.Cartesian3();
        let invserTran = new Cesium.Matrix4();
        Cesium.Matrix4.inverse(m3d._root.transform, invserTran);
        Cesium.Matrix4.multiplyByPoint(invserTran, point, resPoint);
        resPoint.y = -resPoint.y;
        array.push(new Cesium.Cartesian2(resPoint.x, resPoint.y));
      }
      array.push(array[0]);
      //初始化高级分析功能管理类
      var advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager(
        {
          viewer: webGlobe.viewer
        }
      );
      advancedAnalysisManager.createModelFlatten(m3d, {
        //是否进行压平。值为true时执行压平
        isFlatten: true,
        //将高度压到0
        height: 0,
        //压平多边形的顶点序列长度
        arrayLength: positionsArray.length,
        //顶点序列。顶点序列需要闭合，也就是说，例如一个矩形是四个顶点ABCD，那序列就应该是【ABCDA】
        array: array
      });
      //场景渲染（渲染最新的压平效果）
      webGlobe.viewer.scene.requestRender();
    }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-card-body {
  max-height: 300px;
  width: fit-content;
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
