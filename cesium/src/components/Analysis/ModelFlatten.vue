<template>
  <div
      :class="[
      'modelflatten',
      { right: position === 'right', left: position === 'left' },
      {'mapgis--3d-model-flatten-box': noOneMap}
    ]"
  >
    <div class="mapgis-3d-model-flatten-container">
      <mapgis-ui-select-row-left
          title="M3D模型"
          :dataSource="dataSource"
          :value="selectDefaultValue"
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
      <mapgis-ui-input-row-left
          title="压平高度"
          type="Number"
          v-model="flattenHeight"
          paddingRight="0"
          width="calc(100% - 74px)"
          @change="$_change"
      />
      <mapgis-ui-button
          type="primary"
          style="float: right;margin-left: 10px;"
          @click="clearModelFlatten(true)"
      >
        还原
      </mapgis-ui-button>
      <mapgis-ui-button
          type="primary"
          style="float: right"
          @click="startModelFlatten"
      >
        开始绘制
      </mapgis-ui-button>
    </div>
  </div>
</template>

<script>
import BaseMixin from "./BaseLayer";
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
    },
    heightOffset: {
      type: Number,
      default: 0
    },
    noOneMap: {
      type: Boolean,
      default: false
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
      containerStyle: {
        paddingRight: 0
      },
      classify: [
        {
          key: "1",
          value: "贴模型"
        },
        {
          key: "0",
          value: "贴地"
        },
        {
          key: "2",
          value: "贴模型和贴地"
        },
        {
          key: "-1",
          value: "都不贴"
        }
      ],
      mode: "2",
      isStartDrawing: false,
      flattenHeight: 0,
      max: 100,
      min: 0,
      selectDefaultValue: undefined
    };
  },
  watch: {
    M3Ds: {
      handler: function () {
        this.dataSource = this.M3Ds;
        if (this.dataSource.length > 0) {
          this.selectDefaultValue = this.dataSource[0].key;
          this.m3dVueIndex = this.dataSource[0].key;
        }
      },
      deep: true
    }
  },
  mounted() {
    this.dataSource = this.M3Ds;
    if (this.dataSource.length > 0) {
      this.selectDefaultValue = this.dataSource[0].key;
      this.m3dVueIndex = this.dataSource[0].key;
      console.log("this.selectDefaultValue", this.selectDefaultValue)
    }
    this.$_newGraphicLayer({
      vueIndex: this.vueIndex,
      vueKey: this.vueKey,
      getGraphic: this.getDrawResult
    });
  },
  destroyed() {
    this.clearModelFlatten();
    if (!window.__graphicsLayer__) {
      return;
    }
    window.__graphicsLayer__.stopDrawing();
    window.__graphicsLayer__.destroy();
    window.__graphicsLayer__ = undefined;
    delete window.__graphicsLayer__;
    this.$_deleteManager(Managger);
  },
  methods: {
    $_change() {
      this.clearModelFlatten();
      if (window._result_) {
        this.getDrawResult(window._result_);
      }
    },
    $_getClassificationType(type) {
      type = Number(type);
      switch (type) {
        case -1:
          return undefined;
        case 0:
          return Cesium.ClassificationType.TERRAIN;
        case 1:
          return Cesium.ClassificationType.CESIUM_3D_TILE;
        case 2:
          return Cesium.ClassificationType.BOTH;
      }
    },
    $_chooseMode() {
      if (this.isStartDrawing) {
        window.__graphicsLayer__.stopDrawing();
        let options = {
          type: "polygon",
          style: {
            color: Cesium.Color.RED.withAlpha(0.8),
            height: 0,
            isPlanePolygon: false,
            classificationType: this.$_getClassificationType(this.mode)
          }
        };
        window.__graphicsLayer__.startDrawing(options);
      }
    },
    $_chooseM3D(e) {
      this.m3dVueIndex = e;
    },
    findSource() {
      return this.$_getManager(Managger);
    },
    $_getM3D() {
      //G3D为true，M3D为false
      let isG3D = true;
      let m3d = vueCesium.G3DManager.findSource(this.vueKey, this.m3dVueIndex);
      if (!m3d) {
        isG3D = false;
        m3d = vueCesium.M3DIgsManager.findSource(this.vueKey, this.m3dVueIndex);
      }
      if (!m3d) {
        return;
      }
      if (isG3D) {
        m3d = m3d.options.m3ds[0];
      } else {
        m3d = m3d.source[0];
      }
      return m3d;
    },
    startModelFlatten() {
      const {vueKey, vueIndex} = this;
      this.isStartDrawing = true;
      let options = {
        type: "polygon",
        style: {
          color: Cesium.Color.fromAlpha(
              Cesium.Color.fromCssColorString("#F04155"),
              0.8
          ),
          height: 0,
          isPlanePolygon: false,
          classificationType: this.$_getClassificationType(this.mode)
        }
      };
      //无法通过manager获取graphicLayer，否则贴地贴模型失效，暂时只能这样
      if (!window.hasOwnProperty("__graphicsLayer__")) {
        window.__graphicsLayer__ = new Cesium.GraphicsLayer(viewer, {
          getGraphic: this.getDrawResult
        });
      }
      window.__graphicsLayer__.startDrawing(options);
      let m3d = this.$_getM3D(this.vueKey, this.m3dVueIndex);
      if (m3d) {
        const {_arrayLength, _height, _isFlatten, _positionArray} = m3d;
        window.vueCesium[Managger].addSource(
            vueKey,
            vueIndex,
            {},
            {
              m3d: m3d,
              origin: {
                _arrayLength,
                _height,
                _isFlatten,
                _positionArray
              }
            }
        );
      }
    },
    clearModelFlatten(clearPosition) {
      const {viewer} = this;
      let find = this.findSource();
      if (clearPosition) {
        window._result_ = undefined;
      }
      if (find && find.source) {
        let m3d = this.$_getM3D(
            this.vueKey,
            this.m3dVueIndex
        );
        if(m3d){
          let origin = find.options.origin;
          m3d._height = origin._height;
          m3d._isFlatten = origin._isFlatten;
          m3d._arrayLength = origin._arrayLength;
          m3d._positionArray = origin._positionArray;
          viewer.scene.requestRender();
        }
      }
    },
    getDrawResult(result) {
      const {vueCesium} = this;
      let m3d = this.$_getM3D(this.vueKey, this.m3dVueIndex);

      if(m3d){
        //模型压平
        if (
            result.positions[0] != result.positions[result.positions.length - 1]
        ) {
          result.positions.push(result.positions[0]);
        }
        m3d.modelFlatten(
            result.positions,
            this.flattenHeight + this.heightOffset
        );
        window.__graphicsLayer__.removeAllGraphic();
        window.__graphicsLayer__.stopDrawing();
        window._result_ = result;
        this.isStartDrawing = false;
      }
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

.mapgis--3d-model-flatten-box {
  padding: 10px;
  border-radius: 4px;
}
</style>
