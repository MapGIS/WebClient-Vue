<template>
  <div>
    <slot>
      <div class="mapgis-widget-cut-fill-analysis">
        <mapgis-ui-group-tab title="参数设置">
          <mapgis-ui-toolbar slot="handle" :bordered="false">
            <mapgis-ui-toolbar-command
              icon="mapgis-redo"
              title="重新计算"
              @click="refresh"
              :disabled="!recalculate"
            ></mapgis-ui-toolbar-command>
          </mapgis-ui-toolbar>
        </mapgis-ui-group-tab>
        <mapgis-ui-setting-form :layout="layout" size="default">
          <mapgis-ui-row :gutter="8">
            <mapgis-ui-col :span="12">
              <mapgis-ui-form-item label="x方向采样点数">
                <mapgis-ui-input-number-addon
                  v-model.number="xPaneNumCopy"
                  :min="0"
                />
              </mapgis-ui-form-item>
            </mapgis-ui-col>
            <mapgis-ui-col :span="12">
              <mapgis-ui-form-item label="y方向采样点数">
                <mapgis-ui-input-number-addon
                  v-model.number="yPaneNumCopy"
                  :min="0"
                />
              </mapgis-ui-form-item>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-form-item label="填挖规整高度">
            <mapgis-ui-input-number-addon
              v-model.number="heightCopy"
              :min="0"
              addon-after="米"
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="样式设置"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form :layout="layout" size="default">
          <mapgis-ui-form-item label="填方颜色">
            <mapgis-ui-sketch-color-picker
              :color.sync="fillColorCopy"
              :disableAlpha="false"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="挖方颜色">
            <mapgis-ui-sketch-color-picker
              :color.sync="cutColorCopy"
              :disableAlpha="false"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="填挖结果"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form :layout="layout" size="default">
          <mapgis-ui-form-item label="高程范围">
            <mapgis-ui-input
              v-model.number="result.height"
              disabled
              addon-after="米"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="表面积">
            <mapgis-ui-input
              v-model.number="result.surfaceArea"
              disabled
              addon-after="平方米"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="挖体积">
            <mapgis-ui-input
              v-model.number="result.cutVolume"
              disabled
              addon-after="立方米"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="填体积">
            <mapgis-ui-input
              v-model.number="result.fillVolume"
              disabled
              addon-after="立方米"
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
      </div>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button type="primary" @click="analysis"
          >分析</mapgis-ui-button
        >
        <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
      </mapgis-ui-setting-footer>
    </slot>
    <mapgis-ui-mask
      v-if="useMask"
      :parentDivClass="'cesium-map-wrapper'"
      :loading="maskShow"
      :text="maskText"
    ></mapgis-ui-mask>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {
  colorToCesiumColor,
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable,
  isEnabledTranslucency,
  setEnabledTranslucency
} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-analysis-cut-fill",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    /**
     * @type String
     * @default "vertical"
     * @description 表单布局
     */
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    ...VueOptions,
    /**
     * @type Number
     * @default 16
     * @description X坐标方向采样点的个数
     */
    xPaneNum: {
      type: Number,
      default: 16
    },
    /**
     * @type Number
     * @default 16
     * @description Y坐标方向采样点的个数
     */
    yPaneNum: {
      type: Number,
      default: 16
    },
    /**
     * @type Number
     * @default 2000
     * @description 平整高程
     */
    height: {
      type: Number,
      default: 2000
    },
    /**
     * @type String
     * @default "rgba(0, 0, 255, 0.5)"
     * @description 挖方颜色
     */
    cutColor: {
      type: String,
      default: "rgba(0, 0, 255, 0.5)"
    },
    /**
     * @type String
     * @default "rgba(255,165,0,0.5)"
     * @description 填方颜色
     */
    fillColor: {
      type: String,
      default: "rgba(255,165,0,0.5)"
    },
    /**
     * @type Number
     * @default 2.0
     * @description 数据类型,0.0：地形，1.0：模型，2.0：通用
     */
    dataType: {
      type: Number,
      default: 2.0
    },
    /**
     * @type Boolean
     * @default true
     * @description 是否使用内置的遮罩层
     */
    useMask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      xPaneNumCopy: 16,
      yPaneNumCopy: 16,
      heightCopy: 2000,
      cutColorCopy: "rgba(0, 0, 255, 0.5)",
      fillColorCopy: "rgba(255,165,0,0.5)",
      result: {
        height: "",
        surfaceArea: "",
        cutVolume: "",
        fillVolume: ""
      },
      positions: null,
      recalculate: false,
      entityController: null,
      terrainLine: null,
      terrainPolygon: null,
      isDepthTestAgainstTerrainEnable: undefined, // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
      isEnabledTranslucency: undefined, // 地下模式是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
      maskShow: false,
      maskText: "正在分析中, 请稍等..."
    };
  },
  computed: {
    params() {
      const { xPaneNumCopy, yPaneNumCopy, heightCopy } = this;
      return { xPaneNumCopy, yPaneNumCopy, heightCopy };
    }
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    params: {
      handler: function(e) {
        if (this.positions) {
          this.recalculate = true;
        }
      },
      deep: true,
      immediate: true
    },
    xPaneNum: {
      handler() {
        this.xPaneNumCopy = this.xPaneNum;
      },
      immediate: true
    },
    yPaneNum: {
      handler() {
        this.yPaneNumCopy = this.yPaneNum;
      },
      immediate: true
    },
    height: {
      handler() {
        this.heightCopy = this.height;
      },
      immediate: true
    },
    cutColor: {
      handler() {
        this.cutColorCopy = this.cutColor;
      },
      immediate: true
    },
    fillColor: {
      handler() {
        this.fillColorCopy = this.fillColor;
      },
      immediate: true
    }
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        vueCesium.CutFillAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            drawElement: null,
            cutFillAnalysis: null
          }
        );
      });
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.CutFillAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      vueCesium.CutFillAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * @description 获取SourceOptions,以方便获取填挖方分析对象和绘制对象
     * @return SourceOptions对象
     */
    _getSourceOptions() {
      const { vueCesium, vueKey, vueIndex } = this;
      const find = vueCesium.CutFillAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      const { options } = find;
      return options;
    },
    /**
     * @description 开始绘制并分析
     */
    analysis() {
      let { vueCesium, vueKey, vueIndex, Cesium, viewer } = this;

      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
        this.viewer
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.viewer);
      }
      this.isEnabledTranslucency = isEnabledTranslucency(this.viewer);
      if (this.isEnabledTranslucency) {
        // 采样计算不能开启地下模式
        setEnabledTranslucency(false, this.viewer);
      }

      const options = this._getSourceOptions();
      let { cutFillAnalysis, drawElement } = options;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      vueCesium.CutFillAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: result => {
          this.$emit("start");
          this.remove();
          this.positions = result.positions;
          this.maskShow = true;
          this._doAnalysis();
        }
      });
    },
    /**
     * @description 世界坐标转经纬度坐标
     * @param cartesian - {Object} 世界坐标
     * @return {Object} 经纬度坐标
     */
    _cartesianToDegrees(cartesian) {
      const { ellipsoid } = this.viewer.scene.globe;
      // 将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      // 将弧度转为度的十进制度表示
      const longitude = this.Cesium.Math.toDegrees(cartographic.longitude); // 转换后的经度
      const latitude = this.Cesium.Math.toDegrees(cartographic.latitude); // 转换后的纬度
      const coor = {
        lon: longitude,
        lat: latitude,
        height: cartographic.height
      };
      return coor;
    },
    /**
     * @description 进行填挖方分析
     */
    _doAnalysis() {
      const { positions } = this;
      if (!positions) {
        this.$message.warning("请绘制分析区域");
        return;
      }
      this._reset();
      const { xPaneNumCopy, yPaneNumCopy, heightCopy } = this;

      // 创建填挖方实例
      const cutFill = new Cesium.CutFillAnalysis(this.viewer, {
        callBack: this._analysisSuccess
      });

      // 设置x方向采样点个数
      cutFill.xPaneNum = xPaneNumCopy;
      // 设置y方向采样点个数参数
      cutFill.yPaneNum = yPaneNumCopy;
      // 设置填挖规整高度
      cutFill.height = heightCopy;
      // 数据类型
      cutFill.dataType = this.dataType;

      // 开始执行填挖方分析
      this.startCutFill(cutFill, positions);

      let { vueCesium, vueKey, vueIndex } = this;

      vueCesium.CutFillAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "cutFillAnalysis",
        cutFill
      );
    },
    /**
     * @description 分析成功回调
     */
    _analysisSuccess(result) {
      this.result = {
        height: `${result.minHeight.toFixed(2)}~${result.maxHeight.toFixed(2)}`,
        surfaceArea: result.surfaceArea,
        cutVolume: result.cutVolume,
        fillVolume: result.fillVolume
      };
      let polygon = this.positions;
      let height = this.heightCopy;
      this.fillEntity = new this.Cesium.Entity({
        polygon: {
          hierarchy: {
            positions: polygon
          },
          height: height,
          extrudedHeight: result.minHeight,
          material: Cesium.Color.fromCssColorString(this.fillColorCopy)
        }
      });
      // 绘制填方结果
      this.viewer.entities.add(this.fillEntity);
      // 绘制挖方结果
      let polygonGeometry = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(polygon)
      });

      let polygonInstance = new Cesium.GeometryInstance({
        geometry: polygonGeometry,
        id: "polygon",
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString(this.cutColorCopy)
          )
        }
      });
      this.cutVolume = new Cesium.GroundPrimitive({
        geometryInstances: polygonInstance
      });
      this.viewer.scene.primitives.add(this.cutVolume);
      this.maskShow = false;
      this.$emit("success", result);
    },

    /**
     * 开始执行填挖方分析
     * @function module:客户端可视化分析.AdvancedAnalysisManager.prototype.startCutFill
     * @param {Object} cutFill 填挖方实例，使用createCutFill返回的实例
     * @param {Array} positions 填挖区域多边形的顶点数组
     */
    startCutFill(cutFill, positions) {
      debugger;
      const cutfillObject = cutFill;
      cutfillObject._pointsPolygon = positions;
      const minMax = cutfillObject.getMinAndMaxCartesian();
      cutfillObject.start(minMax);
      // this.viewer.scene.requestRender();
    },
    /**
     * @description 重新计算
     */
    refresh() {
      this._doAnalysis();
    },
    /**
     * @description 重置结果显示
     */
    _reset() {
      this.result = {
        height: "",
        surfaceArea: "",
        cutVolume: "",
        fillVolume: ""
      };
    },
    /**
     * @description 恢复Cesium设置
     */
    _restoreCesiumSetting() {
      if (
        this.isDepthTestAgainstTerrainEnable !== undefined &&
        this.isDepthTestAgainstTerrainEnable !==
          isDepthTestAgainstTerrainEnable(this.viewer)
      ) {
        setDepthTestAgainstTerrainEnable(
          this.isDepthTestAgainstTerrainEnable,
          this.viewer
        );
      }
      if (
        this.isEnabledTranslucency !== undefined &&
        this.isEnabledTranslucency !== isEnabledTranslucency(this.viewer)
      ) {
        setEnabledTranslucency(this.isEnabledTranslucency, this.viewer);
      }
    },
    /**
     * @description 移除填挖方分析结果，取消交互式绘制事件激活状态，恢复深度检测设置，重置结果显示
     */
    remove() {
      let { vueCesium, vueKey, vueIndex } = this;
      let options = this._getSourceOptions();
      let { cutFillAnalysis, drawElement } = options;

      // 判断是否已有等值线分析结果
      if (cutFillAnalysis) {
        vueCesium.CutFillAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "cutFillAnalysis",
          null
        );
      }

      if (drawElement) {
        // 取消交互式绘制矩形事件激活状态
        drawElement.stopDrawing();
        vueCesium.CutFillAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "drawElement",
          null
        );
      }

      this.positions = null;
      this.recalculate = false;
      this.maskShow = false;
      this._reset();

      this._restoreCesiumSetting();
      if (this.cutVolume) {
        this.viewer.scene.primitives.remove(this.cutVolume);
        this.viewer.entities.remove(this.fillEntity);
        this.cutVolume = null;
        this.fillEntity = null;
      }
      this.$emit("remove");
    }
  }
};
</script>
<style scoped>
.mapgis-widget-cut-fill-analysis {
  max-height: calc(50vh);
  overflow-y: auto;
  overflow-x: hidden;
}

::v-deep .mapgis-ui-form-item {
  margin-bottom: 0;
}

::v-deep .mapgis-ui-form label {
  /* font-size: 12px; */
}

::v-deep .mapgis-ui-form-item-label {
  /* line-height: 40px; */
}

::v-deep .mapgis-ui-input {
  /* padding: 4px 11px; */
}
</style>
