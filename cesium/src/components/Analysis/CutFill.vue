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
                  min="0"
                />
              </mapgis-ui-form-item>
            </mapgis-ui-col>
            <mapgis-ui-col :span="12">
              <mapgis-ui-form-item label="y方向采样点数">
                <mapgis-ui-input-number-addon
                  v-model.number="yPaneNumCopy"
                  min="0"
                />
              </mapgis-ui-form-item>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-form-item label="填挖规整高度">
            <mapgis-ui-input-number-addon
              v-model.number="heightCopy"
              min="0"
              addon-after="米"
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="样式设置"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form :layout="layout" size="default">
          <mapgis-ui-form-item label="边线">
            <mapgis-ui-sketch-color-picker
              :color.sync="lineColorCopy"
              :disableAlpha="false"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="填充">
            <mapgis-ui-sketch-color-picker
              :color.sync="fillColorCopy"
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
  setDepthTestAgainstTerrainEnable
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
     * @default "rgba(0,255,0,1)"
     * @description 分析区域边界颜色
     */
    lineColor: {
      type: String,
      default: "rgba(0,255,0,1)"
    },
    /**
     * @type String
     * @default "rgba(0,0,255,0.3)"
     * @description 分析区域面颜色
     */
    fillColor: {
      type: String,
      default: "rgba(0,0,255,0.3)"
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
      lineColorCopy: "rgba(0,255,0,1)",
      fillColorCopy: "rgba(0,0,255,0.3)",
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
    lineColor: {
      handler() {
        this.lineColorCopy = this.lineColor;
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
      let find = vueCesium.CutFillAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this.remove();
      }
      vueCesium.CutFillAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * @description rgba值转cesium内部color对象
     * @param rgba - {String} rgba值
     * @return {Object} cesium内部color对象
     */
    _getColor(rgba) {
      return colorToCesiumColor(rgba);
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
      const lineColor = this._getColor(this.lineColorCopy);
      const fillColor = this._getColor(this.fillColorCopy);

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: result => {
          this.$emit("start");
          this.remove();
          this.positions = result.positions;
          this.maskShow = true;

          const linePointArr = [];
          const polygonPointArr = [];
          this.positions.forEach(element => {
            const { lon, lat, height } = this._cartesianToDegrees(element);
            linePointArr.push(lon);
            linePointArr.push(lat);
            polygonPointArr.push(lon);
            polygonPointArr.push(lat);
            polygonPointArr.push(height);
          });

          // 构造几何绘制控制对象
          this.entityController = new window.CesiumZondy.Manager.EntityController({
            viewer
          });

          // 绘制贴地形线
          this.terrainLine = this.entityController.appendLine(
            // 名称
            "贴地形线",
            // 点数组
            linePointArr,
            // 线宽
            3,
            // 线颜色
            lineColor,
            // 是否识别带高度的坐标
            false,
            // 是否贴地形
            true,
            // 附加属性
            {}
          );

          // 构造区对象
          const polygon = {
            // 区
            polygon: {
              // 坐标
              hierarchy: this.Cesium.Cartesian3.fromDegreesArrayHeights(
                polygonPointArr
              ),
              // 颜色
              material: fillColor,
              // 分类类型：地形类型
              classificationType: this.Cesium.ClassificationType.TERRAIN
            }
          };
          // 绘制图形通用方法：对接Cesium原生特性
          this.terrainPolygon = this.entityController.appendGraphics(polygon);

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

      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
        this.viewer
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.viewer);
      }
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
      let polygon = [];
      let height = 100;
      // 绘制填方结果
      this.viewer.entities.add({
        polygon: {
          hierarchy: {
            positions: polygon
          },
          height: height,
          extrudedHeight: result.minHeight,
          material: Cesium.Color.ORANGE
        }
      });
      // 绘制挖方结果
      let polygonGeometry = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(polygon)
      });
      // var geometry = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
      let polygonInstance = new Cesium.GeometryInstance({
        geometry: polygonGeometry,
        id: 'polygon',
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.8)
        }
      });
      this.viewer.scene.primitives.add(
          new Cesium.GroundPrimitive({
            geometryInstances: polygonInstance
          })
      );
      this.maskShow = false;
      this.$emit("success", result);
    },

    /**
     * 开始执行填挖方分析
     * @function module:客户端可视化分析.AdvancedAnalysisManager.prototype.startCutFill
     * @param {Object} cutFill 填挖方实例，使用createCutFill返回的实例
     * @param {Array} positions 填挖区域多边形的顶点数组
     */
    startCutFill(cutFill, positions){
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
     * @description 恢复深度检测设置
     */
    _restoreDepthTestAgainstTerrain() {
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

      this._restoreDepthTestAgainstTerrain();
      if (this.terrainLine) {
        this.entityController.removeEntity(this.terrainLine);
        this.entityController.removeEntity(this.terrainPolygon);
        this.terrainLine = null;
        this.terrainPolygon = null;
        this.entityController = null;
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
