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
  inject: ["Cesium", "vueCesium", "viewer"],
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
      const { vueKey, vueIndex, viewer} = this;
      let m3d;
      let find = this.findSource();
      if (!find) {
        // 创建交互式绘制工具
        var tool = new Cesium.DrawElement(viewer);
        // 激活交互式绘制工具
        tool.startDrawingPolygon({ callback: this.getDrawResult });
        let m3ds = this.$_getManager("M3DIgsManager");
        if (m3ds && m3ds.source && m3ds.source.length > 0) {
          m3d = m3ds.source[0];
        }
        const { _arrayLength, _height, _isFlatten, _positionArray } = m3d;
        window.vueCesium[Managger].addSource(vueKey, vueIndex, tool, {
          m3d: m3d,
          origin: {
            _arrayLength,
            _height,
            _isFlatten,
            _positionArray
          }
        });
      }
    },
    clearModelFlatten() {
      const { viewer } = this;
      let find = this.findSource();
      if (find && find.source) {
        let tool = find.source;
        let m3d = find.options.m3d;
        let origin = find.options.origin;
        m3d._height = origin._height;
        m3d._isFlatten = origin._isFlatten;
        m3d._arrayLength = origin._arrayLength;
        m3d._positionArray = origin._positionArray;
        viewer.scene.requestRender();
      }
    },
    getDrawResult(result) {
      const { Cesium, vueCesium, viewer } = this;
      let find = this.findSource();
      if (!find) return;
      let m3d = find.options.m3d;
      if (!m3d) return;

      //获取绘制多边形区域的定点（这是三维的点xyz）
      let positionsArray = result.positions;
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
      m3d.isFlatten = true;
      m3d.height = 0.0;
      m3d.positionArray = array;
      //场景渲染（渲染最新的压平效果）
     viewer.scene.requestRender();
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
