<template>
  <div>
    <slot>
      <div class="mapgis-widget-flood-analysis">
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
          <mapgis-ui-form-item label="淹没最低高度">
            <mapgis-ui-input-number-addon
              v-model.number="startHeightCopy"
              addon-after="米"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="淹没最高高度">
            <mapgis-ui-input-number-addon
              v-model.number="maxHeightCopy"
              addon-after="米"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="洪水上涨速度">
            <mapgis-ui-input-number-addon
              v-model.number="floodSpeedCopy"
              :min="0"
              addon-after="米/秒"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="颜色">
            <mapgis-ui-sketch-color-picker
              :color.sync="floodColorCopy"
              :disableAlpha="false"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
          <mapgis-ui-switch-row-left
            title="开启水面倒影"
            v-model="isWaterReflectionMode"
          ></mapgis-ui-switch-row-left>
        </mapgis-ui-setting-form>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="analysis"
            >分析</mapgis-ui-button
          >
          <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {
  colorToCesiumColor,
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../WebGlobe/util";
import { getPolygonSamplePoints } from "../Utils/util";

export default {
  name: "mapgis-3d-analysis-flood",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    /**
     * @type String
     * @default "vertical"
     * @description 表单布局
     */
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    /**
     * @type Number
     * @default 0
     * @description 洪水淹没水体起始高度
     */
    startHeight: {
      type: Number,
      default: 0
    },
    /**
     * @type Number
     * @default 0
     * @description 淹没动画高度起始点
     */
    minHeight: {
      type: Number,
      default: 0
    },
    /**
     * @type Number
     * @default 2000
     * @description 最大淹没高度，淹没动画高度终止点
     */
    maxHeight: {
      type: Number,
      default: 2000
    },
    /**
     * @type String
     * @default "rgba(149,232,249,0.5)"
     * @description 洪水颜色
     */
    floodColor: {
      type: String,
      default: "rgba(149,232,249,0.5)"
    },
    /**
     * @type Number
     * @default 80
     * @description 洪水淹没速度，单位 米/秒
     */
    floodSpeed: {
      type: Number,
      default: 80
    },
    /**
     * @type Number
     * @default 2
     * @description 反射光线强度
     */
    specularIntensity: {
      type: Number,
      default: 2
    },
    /**
     * @type Number
     * @default 10
     * @description 水波高度
     */
    amplitude: {
      type: Number,
      default: 10
    },
    /**
     * @type Number
     * @default 0.01
     * @description 水纹速度
     */
    animationSpeed: {
      type: Number,
      default: 0.01
    },
    /**
     * @type Number
     * @default 500
     * @description 水纹频率
     */
    frequency: {
      type: Number,
      default: 500
    },
    /**
     * @type Number
     * @default 500
     * @description 采样点个数
     */
    step: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      startHeightCopy: 0, //洪水淹没水体起始高度
      maxHeightCopy: 2000,
      floodColorCopy: "rgba(149,232,249,0.5)",
      floodSpeedCopy: 80,
      positions: null,
      recalculate: false,
      isDepthTestAgainstTerrainEnable: undefined, // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
      mHeight: 2000, // 淹没最高高度变化前的值
      timer: null,
      changeMaxHeight: false,
      changeStartHeight: false,
      isWaterReflectionMode: false
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  computed: {
    params() {
      const { startHeightCopy, speedCopy, floodColorCopy } = this;
      return { startHeightCopy, speedCopy, floodColorCopy };
    }
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
    startHeight: {
      handler() {
        this.startHeightCopy = this.startHeight;
      },
      immediate: true
    },
    startHeightCopy: {
      handler() {
        const options = this._getSourceOptions();
        if (!options) return;
        const { floodAnalysis } = options;
        if (!floodAnalysis) return;
        this.changeStartHeight = true;
      },
      immediate: true
    },
    maxHeight: {
      handler() {
        this.maxHeightCopy = this.maxHeight;
      },
      immediate: true
    },
    floodColor: {
      handler() {
        this.floodColorCopy = this.floodColor;
      },
      immediate: true
    },
    floodSpeed: {
      handler() {
        this.floodSpeedCopy = this.floodSpeed;
      },
      immediate: true
    },
    maxHeightCopy: {
      handler: function(e) {
        const { viewer, vueCesium, vueKey, vueIndex } = this;
        const options = this._getSourceOptions();
        const { floodAnalysis } = options;
        if (!floodAnalysis) {
          return;
        }
        this.changeMaxHeight = true;
        if (!this.timer) {
          this.timer = setTimeout(() => {
            if (this.timer) clearTimeout(this.timer);
            this.timer = null;
            const { maxHeightCopy } = this;
            floodAnalysis.maxHeight = maxHeightCopy;
            if (this.mHeight > maxHeightCopy) {
              // 下降
              floodAnalysis.isDownFlood = true;
            } else if (this.mHeight < maxHeightCopy) {
              // 上升
              floodAnalysis.isDownFlood = false;
            }
            this.mHeight = maxHeightCopy;
            viewer.scene.requestRender();
          }, 1000);
        }
      }
    },
    isWaterReflectionMode() {
      this.remove();
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
        vueCesium.FloodAnalysisManager.addSource(vueKey, vueIndex, dataSource, {
          drawElement: null,
          floodAnalysis: null,
          floodAnalysisReflection: null,
          waterReflection: null
        });
      });
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.FloodAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      vueCesium.FloodAnalysisManager.deleteSource(vueKey, vueIndex);
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
     * @description 开始绘制并分析
     */
    analysis() {
      const { vueCesium, vueKey, vueIndex } = this;
      const options = this._getSourceOptions();
      let { drawElement } = options;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(this.viewer);
      vueCesium.FloodAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: result => {
          this.remove();
          this.positions = result.positions;
          // let cartP = [];
          // let max = 0;
          // let min = 0;
          // for (let i = 0; i < result.positions.length; i++) {
          //   let cartPosition = Cesium.Cartographic.fromCartesian(
          //     result.positions[i]
          //   );
          //   let lnglatTocartographic = Cesium.Cartographic.fromRadians(
          //     cartPosition.longitude,
          //     cartPosition.latitude
          //   );
          //   let height = this.viewer.scene.sampleHeight(lnglatTocartographic);
          //   if (max < height) {
          //     max = height;
          //   }
          //   if (min > height) {
          //     min = height;
          //   }
          //   this.startHeightCopy = min;
          // cartP.push([
          //   Cesium.Math.toDegrees(cartPosition.longitude),
          //   Cesium.Math.toDegrees(cartPosition.latitude)
          // ]);
          //}
          // let positions = getPolygonSamplePoints({
          //   positions: cartP,
          //   step: this.step
          // });
          // let positionsC = [],
          //   that = this;
          // for (let i = 0; i < positions.length; i++) {
          //   positionsC.push(
          //     Cesium.Cartesian3.fromDegrees(positions[i][0], positions[i][1], 0)
          //   );
          // }
          // let sampleElevationTool = new Cesium.SampleElevationTool(
          //   viewer,
          //   positionsC,
          //   "terrain",
          //   function(sampleResult) {
          //     let max = sampleResult[0].height;
          //     let min = sampleResult[0].height;
          //     for (let i = 1; i < sampleResult.length; i++) {
          //       if (max < sampleResult[i].height) {
          //         max = sampleResult[i].height;
          //       }
          //       if (min > sampleResult[i].height) {
          //         min = sampleResult[i].height;
          //       }
          //     }
          this.$emit("showProgress", {
            startHeightCopy: this.startHeightCopy,
            maxHeightCopy: this.maxHeightCopy,
            floodSpeedCopy: this.floodSpeedCopy
          });
          //   },
          //   { level: 12 }
          // );
          // sampleElevationTool.start();
        }
      });
    },
    /**
     * @description 进行洪水淹没分析
     */
    _doAnalysis() {
      this._removeFlood();
      const { positions } = this;
      if (!positions) {
        this.$message.warning("请绘制分析区域");
        return;
      }
      const { vueCesium, vueKey, vueIndex } = this;
      const options = this._getSourceOptions();
      let { floodAnalysis, floodAnalysisReflection, waterReflection } = options;
      if (this.isWaterReflectionMode) {
        const positionsArr = [];
        for (let position of positions) {
          positionsArr.push(Cesium.Cartographic.fromCartesian(position));
        }
        const {
          minHeight,
          maxHeightCopy,
          floodSpeedCopy,
          floodColorCopy
        } = this;
        const waterColor = this._getColor(floodColorCopy);
        waterReflection =
          waterReflection ||
          new Cesium.WaterReflection({
            viewer: this.viewer,
            positions: positionsArr,
            distortionScale: 2.0,
            waterColor
          });
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "waterReflection",
          waterReflection
        );
        floodAnalysisReflection =
          floodAnalysisReflection ||
          new Cesium.FloodAnalysisReflection({
            viewer: this.viewer,
            water: waterReflection,
            minHeight,
            maxHeight: maxHeightCopy,
            floodSpeed: Number(floodSpeedCopy) / 60,
            closeBorder: true
          });
        floodAnalysisReflection.start();
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "floodAnalysisReflection",
          floodAnalysisReflection
        );
      } else {
        const {
          startHeightCopy,
          minHeight,
          maxHeightCopy,
          floodColorCopy,
          floodSpeedCopy,
          specularIntensity,
          amplitude,
          animationSpeed,
          frequency
        } = this;

        // 初始化洪水淹没分析类
        floodAnalysis =
          floodAnalysis || new Cesium.FloodAnalysis(this.viewer, positions);
        //设置洪水淹没区域最低开始高度
        floodAnalysis.minHeight = Number(startHeightCopy);
        //设置洪水淹没区域最高高度
        floodAnalysis.maxHeight = this.maxHeightCopy || Number(maxHeightCopy);
        // 设置洪水上涨速度
        floodAnalysis.floodSpeed = Number(floodSpeedCopy);
        // 洪水淹没区域最低高度
        floodAnalysis.startHeight = Number(startHeightCopy);
        // 洪水颜色
        floodAnalysis.floodColor = this._getColor(floodColorCopy);
        // 水纹频率 指波浪的个数
        floodAnalysis.frequency = Number(frequency);
        // 水纹速度
        floodAnalysis.animationSpeed = Number(animationSpeed);
        // 水波的高度
        floodAnalysis.amplitude = Number(amplitude);
        // 指定光线强度
        floodAnalysis.specularIntensity = Number(specularIntensity);

        this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
          this.viewer
        );
        if (!this.isDepthTestAgainstTerrainEnable) {
          // 如果深度检测没有开启，则开启
          setDepthTestAgainstTerrainEnable(true, this.viewer);
        }
        // 添加洪水淹没结果显示
        this.viewer.scene.visualAnalysisManager.add(floodAnalysis);
        this.mHeight = maxHeightCopy;
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "floodAnalysis",
          floodAnalysis
        );
      }
    },
    /**
     * @description 获取SourceOptions,以方便获取洪水淹没分析对象和绘制对象
     * @return SourceOptions对象
     */
    _getSourceOptions() {
      const { vueCesium, vueKey, vueIndex } = this;
      const find = vueCesium.FloodAnalysisManager.findSource(vueKey, vueIndex);
      if (!find) return;
      const { options } = find;
      return options;
    },
    /**
     * @description 重新进行洪水淹没分析
     */
    refresh() {
      this._removeFlood();
      this._doAnalysis();
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
     * @description 移除洪水淹没分析结果
     */
    _removeFlood() {
      const { vueCesium, vueKey, vueIndex } = this;
      const options = this._getSourceOptions();
      const {
        floodAnalysis,
        floodAnalysisReflection,
        waterReflection
      } = options;

      // 判断是否已有洪水淹没分析结果
      if (floodAnalysis) {
        // 移除洪水淹没分析显示结果
        this.viewer.scene.visualAnalysisManager.remove(floodAnalysis);
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "floodAnalysis",
          null
        );
      }
      if (floodAnalysisReflection) {
        floodAnalysisReflection.destroy();
        floodAnalysisReflection.destroyWaterCloseBorder();
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "floodAnalysisReflection",
          null
        );
      }
      if (waterReflection) {
        waterReflection.destroy();
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "waterReflection",
          null
        );
      }
      this._restoreDepthTestAgainstTerrain();
    },
    /**
     * @description 移除洪水淹没分析结果，取消交互式绘制事件激活状态，恢复深度检测设置
     */
    remove() {
      this._removeFlood();
      this.$emit("closeProgress");
      const { vueCesium, vueKey, vueIndex } = this;
      const options = this._getSourceOptions();
      const { drawElement } = options;

      if (drawElement) {
        // 取消交互式绘制事件激活状态
        drawElement.stopDrawing();
        vueCesium.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "drawElement",
          null
        );
      }

      this.positions = null;
      this.recalculate = false;
    }
  }
};
</script>
<style scoped>
.mapgis-widget-flood-analysis {
  max-height: calc(50vh);
  overflow-y: auto;
}

::v-deep .mapgis-ui-switch-row-left-title {
  padding-left: 0px;
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
