<template>
  <div>
    <slot>
      <div class="mapgis-widget-contour-analysis">
        <mapgis-ui-group-tab title="参数设置"/>
        <mapgis-ui-setting-form>
          <mapgis-ui-switch-panel layout="horizontal" label="等值线" v-if="switchOptions.indexOf('isogram')>=0" @changeChecked="startIsogram">
            <mapgis-ui-form-item label="等值距" style="width: fit-content">
              <mapgis-ui-input
                  v-model.number="formData1.contourSpacingCopy"
                  type="number"
                  min="0"
                  addon-after="(米)"
                  style="width: fit-content"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="线宽">
              <mapgis-ui-input
                  v-model.number="formData1.contourWidthCopy"
                  type="number"
                  min="0"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="线颜色">
              <mapgis-ui-sketch-color-picker
                  :color.sync="formData1.contourColorCopy"
                  :disableAlpha="false"
              ></mapgis-ui-sketch-color-picker>
            </mapgis-ui-form-item>
          </mapgis-ui-switch-panel>

          <mapgis-ui-switch-panel layout="horizontal" label="等值面" v-if="switchOptions.indexOf('isosurface')>=0" @changeChecked="startIsosurface">
            <mapgis-ui-form-item label="等值面透明度">
              <mapgis-ui-input
                  v-model.number="formData2.bandTransparencyCopy"
                  type="number"
                  min="0"
                  max="1"
                  :step="0.1"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="等值面宽度">
              <mapgis-ui-input
                  v-model.number="formData2.bandThicknessCopy"
                  type="number"
                  min="0"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-model-item label="是否渐变">
              <mapgis-ui-switch checked-children="开启" un-checked-children="关闭" v-model="formData2.isGradient">
              </mapgis-ui-switch>
            </mapgis-ui-form-model-item>
            <mapgis-ui-colors-setting
                v-model="formData2.bandColorArray"
                :rangeField="'高度'"
                :singleNumber="true"
            ></mapgis-ui-colors-setting>
          </mapgis-ui-switch-panel>
        </mapgis-ui-setting-form>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="analysis"
          >分析
          </mapgis-ui-button
          >
          <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {colorToCesiumColor} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-analysis-contour",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    /**
     * @type Array
     * @default ["isogram", "isosurface"]
     * @description 等值线和等值面的面板展示开关
     */
    switchOptions: {
      type: Array,
      default: () => {
        return ["isogram", "isosurface"]
      }
    },
    /**
     * @type Number
     * @default 150
     * @description 等值线间距
     */
    contourSpacing: {
      type: Number,
      default: 150
    },
    /**
     * @type Number
     * @default 2
     * @description 等值线宽度
     */
    contourWidth: {
      type: Number,
      default: 10
    },
    /**
     * @type String
     * @default "rgb(255,0,0)"
     * @description 等值线颜色
     */
    contourColor: {
      type: String,
      default: "rgb(255,0,0)"
    },
    /**
     * @type Number
     * @default 200
     * @description 等值面宽度
     */
    bandThickness: {
      type: Number,
      default: 200
    },
    /**
     * @type Array
     * @default []
     * @description 等值面高度数组
     */
    bandPosition: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * @type Array
     * @default []
     * @description 等值面颜色数组，与高度数组的等值面一一对应
     */
    colorsArray: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  watch: {
    contourSpacing: {
      handler() {
        this.formData1.contourSpacingCopy = this.contourSpacing;
      },
      immediate: true
    },
    contourWidth: {
      handler() {
        this.formData1.contourWidthCopy = this.contourWidth;
      },
      immediate: true
    },
    contourColor: {
      handler() {
        this.formData1.contourColorCopy = this.contourColor;
      },
      immediate: true
    },
    bandThickness: {
      handler() {
        this.formData2.bandThicknessCopy = this.bandThickness;
      },
      immediate: true
    },
    bandPosition: {
      handler() {
        this.bandPositionCopy = this.bandPosition;
      },
      immediate: true
    },
    colorsArray: {
      handler() {
        this.colorsArrayCopy = this.colorsArray;
      },
      immediate: true
    },
    isogram: {
      handler(next) {
        let options = this._findOptions();
        let {contourAnalysis} = options;
        if (contourAnalysis) {
          if (next) {
            contourAnalysis.enableContour = true;
          } else {
            contourAnalysis.enableContour = false;
          }
        }
      }
    },
    formData1: {
      deep: true,
      handler(next) {
        let vm = this;
        let options = this._findOptions();
        let {contourAnalysis} = options;
        if (contourAnalysis) {
          let color = this._edgeColor();
          contourAnalysis.changeContours(next.contourSpacingCopy, next.contourWidthCopy, color);
          if (vm.isogram && !vm.isosurface) {
            contourAnalysis.updateMaterial("none");
          } else if (vm.isosurface) {
            contourAnalysis.selectedShading = 'elevationBand';
            contourAnalysis.updateElevationBandMaterial(vm.bandPositionCopy, vm.formData2.isGradient, vm.formData2.bandThicknessCopy, vm.formData2.bandTransparencyCopy, vm.backgroundTransparency, vm.colorsArrayCopy);
          }
        }
      }
    },
    formData2: {
      deep: true,
      handler(next) {
        let vm = this;
        let options = this._findOptions();
        if (options) {
          let {contourAnalysis} = options;
          if (contourAnalysis) {
            vm.getHeightAndColor();
            contourAnalysis.selectedShading = 'elevationBand';
            contourAnalysis.updateElevationBandMaterial(vm.bandPositionCopy, vm.formData2.isGradient, vm.formData2.bandThicknessCopy, vm.formData2.bandTransparencyCopy, vm.backgroundTransparency, vm.colorsArrayCopy);
          }
        }
      }
    }

  },
  data() {
    return {
      //等值线开关
      isogram: false,
      maxIsogram: undefined,
      maxIsosurface: undefined,
      padVal: undefined,
      padVal1: undefined,
      //等值面开关
      isosurface: false,
      formData1: {
        contourSpacingCopy: 150,
        contourWidthCopy: 10,
        contourColorCopy: "rgb(255,0,0)",
      },
      formData2: {
        bandColorArray: [
          {min: 0, max: 60, color: "rgba(244, 67, 54, 0.5)"},
          {min: 60, max: 120, color: "rgba(233, 30, 99, 0.5)"},
          {min: 120, max: 180, color: "rgba(156, 39, 176, 0.5)"}
        ],
        bandTransparencyCopy: 0.5,
        bandThicknessCopy: 200,
        isGradient: false
      },
      bandPositionCopy: [],
      colorsArrayCopy: [],
      backgroundTransparency: 0.6
    };
  },

  created() {
    let vm = this;
    vm.$nextTick(() => {
      // 轮询获取地形高度差
      this.isTerrianReady().then((zIndex) => {
        // 高度差
        let heightIntercept = Math.abs(zIndex.zMin - zIndex.zMax);
        for (let i = 0; i < 3; i++) {
          let heightUnit = heightIntercept / 3;
          if (i === 0) {
            vm.formData2.bandColorArray[i].min = Number(zIndex.zMin);
            vm.formData2.bandColorArray[i].max = Number((zIndex.zMin + heightUnit).toFixed(2))
          } else {
            vm.formData2.bandColorArray[i].min = Number((zIndex.zMin + heightUnit * i).toFixed(2))
            vm.formData2.bandColorArray[i].max = Number((zIndex.zMin + heightUnit * (i + 1)).toFixed(2))
          }
        }
      })
    })
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
          resolve => {
            resolve();
          },
          reject => {
          }
      );
    },
    mount() {
      const {viewer, vueCesium, vueKey, vueIndex, Cesium} = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", vm);
        vueCesium.ContourAnalysisManager.addSource(
            vueKey,
            vueIndex,
            dataSource,
            {
              drawElement: null,
              contourAnalysis: null
            }
        );
      });
      let utc = Cesium.JulianDate.fromDate(new Date('2019/11/04 15:00:00')); //UTC
      viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate()); //北京时间=UTC+8=GMT+8
    },
    unmount() {
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.ContourAnalysisManager.findSource(
          vueKey,
          vueIndex
      );
      if (find) {
        this.remove();
        let {options} = find;
        let {contourAnalysis} = options;

        // 判断是否已有等值线分析结果
        if (contourAnalysis) {
          contourAnalysis.destroy();
        }
      }
      vueCesium.ContourAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    _findOptions() {
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        return find.options;
      }
    },
    /**
     * @description rgba值转cesium内部color对象
     * @return {Object} cesium内部color对象
     */
    _edgeColor() {
      return colorToCesiumColor(this.formData1.contourColorCopy, this.viewer);
    },

    startIsogram(isogram) {
      let vm = this;
      vm.isogram = isogram;
    },

    startIsosurface(isosurface) {
      let vm = this
      vm.isosurface = isosurface;
      if (isosurface) {
      } else {
        let options = this._findOptions();
        if (options) {
          let {contourAnalysis} = options;
          if (contourAnalysis) {
            contourAnalysis.selectedShading = 'none';
            contourAnalysis = null
          }
        }
      }
    },

    isTerrianReady() {
      const {viewer} = this;
      return new Promise((resolve, reject) => {
        if (viewer) {
          let interval = setInterval(function () {
            let range3D = viewer.terrainProvider.range3D;
            if (range3D) {
              clearInterval(interval);
              resolve(range3D);
            }
          }, 50);
        } else {
          reject(null);
        }
      });
    },

    /**
     * @description 开始绘制并分析
     */
    analysis() {
      let {vueCesium, vueKey, vueIndex, Cesium, viewer} = this;
      let vm = this;
      let find = vueCesium.ContourAnalysisManager.findSource(
          vueKey,
          vueIndex
      );
      let {options} = find;
      let {contourAnalysis, drawElement} = options;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      vueCesium.ContourAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "drawElement",
          drawElement
      );
      const {contourWidthCopy, contourSpacingCopy} = this.formData1;
      const color = this._edgeColor();

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: result => {
          // 分支判断
          this.remove();
          contourAnalysis =
              contourAnalysis || new Cesium.TerrainAnalyse(viewer);
          if (vm.isogram && !vm.isosurface) {
            contourAnalysis.enableContour = true;
            // contourAnalysis.updateMaterial("none");
            contourAnalysis.changeContours(contourSpacingCopy, contourWidthCopy, color);
            contourAnalysis.changeAnalyseArea(result.positions);
          } else if (vm.isosurface) {
            let {isGradient, bandThicknessCopy, bandTransparencyCopy} = vm.formData2;
            // 获取高度数组和颜色数组
            vm.getHeightAndColor();
            if (vm.isogram) {
              contourAnalysis.enableContour = true;
              contourAnalysis.changeContours(contourSpacingCopy, contourWidthCopy, color);
            }
            contourAnalysis.changeAnalyseArea(result.positions);
            contourAnalysis.selectedShading = 'elevationBand';
            contourAnalysis.updateElevationBandMaterial(vm.bandPositionCopy, isGradient, bandThicknessCopy, bandTransparencyCopy, vm.backgroundTransparency, vm.colorsArrayCopy);
          } else {
            this.$message.warning("请先开启分析类型");
          }
          vueCesium.ContourAnalysisManager.changeOptions(
              vueKey,
              vueIndex,
              "contourAnalysis",
              contourAnalysis
          );
        }
      });
    },
    getHeightAndColor() {
      let vm = this;
      vm.bandPositionCopy = [];
      vm.colorsArrayCopy = [];
      for (let i = 0; i < vm.formData2.bandColorArray.length; i++) {
        vm.bandPositionCopy.push(vm.formData2.bandColorArray[i].max);
        // color 转换成Cesium
        let cesiumColor = Cesium.Color.fromCssColorString(vm.formData2.bandColorArray[i].color);
        vm.colorsArrayCopy.push(cesiumColor);
      }
    },
    /**
     * @description 移除等值线分析结果，取消交互式绘制事件激活状态
     */
    remove() {
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.ContourAnalysisManager.findSource(
          vueKey,
          vueIndex
      );
      let {options} = find;
      let {contourAnalysis, drawElement} = options;

      // 判断是否已有等值线分析结果
      if (contourAnalysis) {
        // 移除等值线分析显示结果
        contourAnalysis.enableContour = false;
        contourAnalysis.updateMaterial("none");
        // 移除等值面分析显示结果
        contourAnalysis.selectedShading = 'none';

        vueCesium.ContourAnalysisManager.changeOptions(
            vueKey,
            vueIndex,
            "contourAnalysis",
            null
        );
      }

      if (drawElement) {
        // 取消交互式绘制矩形事件激活状态
        drawElement.stopDrawing();
        vueCesium.ContourAnalysisManager.changeOptions(
            vueKey,
            vueIndex,
            "drawElement",
            null
        );
      }
    }
  }
};
</script>
<style scoped>
::v-deep .mapgis-ui-form-item {
  margin-bottom: 0;
}

::v-deep .mapgis-ui-form label {
  font-size: 12px;
}

::v-deep .mapgis-ui-form-item-label {
  line-height: 40px;
}

::v-deep .mapgis-ui-input {
  padding: 4px 11px;
}

.parameter {
  background: #F1F1F1;
  border-radius: 4px;
  /*margin-bottom: 10px;*/
  overflow: hidden;
  max-height: 0px;
  transition: max-height .5s;
  -moz-transition: max-height .5s; /* Firefox 4 */
  -webkit-transition: max-height .5s; /* Safari and Chrome */
  -o-transition: max-height .5s; /* Opera */
}
</style>
