<template>
  <div
    :class="[
      'modelflatten',
      { right: position === 'right', left: position === 'left' }
    ]"
  >
    <mapgis-ui-card>
      <div class="mapgis-3d-model-flatten-container">
        <mapgis-ui-select-row-left
          title="M3D模型"
          :dataSource="dataSource"
          :titleStyle="titleStyle"
          :selectStyle="selectStyle"
          @change="$_chooseM3D"
        />
        <mapgis-ui-select-row-left
          title="是否贴模型"
          :dataSource="classify"
          :titleStyle="titleStyle"
          :selectStyle="selectStyle"
          v-model="mode"
          @change="$_chooseMode"
        />
        <mapgis-ui-button
          type="primary"
          style="float: right;margin-left: 10px;"
          @click="clearModelFlatten">
          还原
        </mapgis-ui-button>
        <mapgis-ui-button
          type="primary"
          style="float: right"
          @click="startModelFlatten">
          开始绘制
        </mapgis-ui-button>
      </div>
    </mapgis-ui-card>
  </div>
</template>

<script>
import BaseMixin from "./BaseLayer"
import GraphicLayerService from "../Layer/Graphic/GraphicLayerService";

const Managger = "AnalysisModelFlattenManager";
export default {
  name: "mapgis-3d-model-flatten",
  mixins: [BaseMixin, GraphicLayerService],
  props: {
    position: {
      type: String,
      default: "right"
    },
    M3Ds: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  inject: ["Cesium", "vueCesium", "viewer"],
  data() {
    return {
      dataSource: [],
      m3dVueIndex: undefined,
      titleStyle: {
        paddingLeft: 0,
        fontsize: "14px"
      },
      selectStyle: {
        paddingRight: 0
      },
      classify: [{
        key: 1,
        value: "贴模型"
      }, {
        key: 0,
        value: "贴地"
      }, {
        key: 2,
        value: "贴模型和贴地"
      }, {
        key: -1,
        value: "都不贴"
      }],
      mode: 1,
      isStartDrawing: false
    };
  },
  watch: {
    M3Ds: {
      handler: function () {
        for (let i = 0; i < this.M3Ds.length; i++) {
          this.dataSource.push({
            key: this.M3Ds[i].guid,
            value: this.M3Ds[i].name
          });
        }
      },
      deep: true
    },
  },
  mounted() {
    this.$_newGraphicLayer({
      vueIndex: this.vueIndex,
      vueKey: this.vueKey,
      getGraphic: this.getDrawResult
    });
  },
  destroyed() {
    this.clearModelFlatten();
    this.$_stopDrawing();
    this.$_destroy();
    this.$_deleteManager(Managger);
  },
  methods: {
    $_chooseMode() {
      if (this.isStartDrawing) {
        this.$_stopDrawing();
        this.$_startDrawing({
          type: "polygon",
          style: {
            classificationType: this.mode
          }
        });
      }
    },
    $_chooseM3D(e) {
      this.m3dVueIndex = e;
    },
    findSource() {
      return this.$_getManager(Managger);
    },
    startModelFlatten() {
      const {vueKey, vueIndex} = this;
      this.isStartDrawing = true;
      this.$_startDrawing({
        type: "polygon",
        style: {
          classificationType: this.mode
        }
      });
      let m3d = vueCesium.G3DManager.findSource(this.vueKey, this.m3dVueIndex);
      if (m3d) {
        m3d = m3d.options.m3ds[0];
        const {_arrayLength, _height, _isFlatten, _positionArray} = m3d;
        window.vueCesium[Managger].addSource(vueKey, vueIndex, {}, {
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
      const {viewer} = this;
      let find = this.findSource();
      if (find && find.source) {
        let m3d = vueCesium.G3DManager.findSource(this.vueKey, this.m3dVueIndex);
        let origin = find.options.origin;
        m3d = m3d.options.m3ds[0];
        m3d._height = origin._height;
        m3d._isFlatten = origin._isFlatten;
        m3d._arrayLength = origin._arrayLength;
        m3d._positionArray = origin._positionArray;
        viewer.scene.requestRender();
      }
    },
    getDrawResult(result) {
      const {Cesium, vueCesium, viewer} = this;
      let m3d = vueCesium.G3DManager.findSource(this.vueKey, this.m3dVueIndex);
      if (m3d) {
        m3d = m3d.options.m3ds[0];
      }

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
      this.$_removeAllGraphic();
      this.$_stopDrawing();
      this.isStartDrawing = false;
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

.mapgis-3d-model-flatten-container {
  width: 238px;
}
</style>
