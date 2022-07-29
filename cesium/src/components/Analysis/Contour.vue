<template>
  <div>
    <slot>
      <div class="mapgis-widget-contour-analysis">
        <mapgis-ui-group-tab title="参数设置"> </mapgis-ui-group-tab>
        <mapgis-ui-input-number-panel
          class="mapgis-ui-number-style"
          label="最大分段数"
          :range="[1, 800]"
          v-model="maxSegmentedValueCopy"
        />
        <mapgis-ui-input-number-panel
          class="mapgis-ui-number-style"
          label="等值距(米)"
          :range="[initSpacing, halfHeight]"
          v-model="contourSpacingCopy"
        />
        <mapgis-ui-switch-panel
          layout="vertical"
          label="等值线"
          v-if="switchOptions.indexOf('isogram') >= 0"
          :checked="isogram"
          @changeChecked="startIsogram"
        >
          <mapgis-ui-form-item label="线宽">
            <mapgis-ui-input-number
              autoWidth
              v-model.number="formData1.contourWidthCopy"
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

        <mapgis-ui-switch-panel
          layout="vertical"
          label="等值面"
          v-if="switchOptions.indexOf('isosurface') >= 0"
          @changeChecked="startIsosurface"
        >
          <mapgis-ui-input-number-panel
            size="large"
            class="mapgis-ui-number-style"
            label="等值面透明度"
            :range="[0, 1]"
            :step="0.1"
            v-model="formData2.bandTransparencyCopy"
          />
          <mapgis-ui-collapse>
            <mapgis-ui-collapse-panel header="图例">
              <mapgis-ui-colors-setting
                v-model="formData2.bandColorArray"
                :rangeField="'高度'"
                :singleNumber="true"
              >
              </mapgis-ui-colors-setting>
            </mapgis-ui-collapse-panel>
          </mapgis-ui-collapse>
        </mapgis-ui-switch-panel>
      </div>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button type="primary" @click="analysis"
          >分析
        </mapgis-ui-button>
        <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
      </mapgis-ui-setting-footer>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import { colorToCesiumColor } from "../WebGlobe/util";
import * as d3 from "d3-scale-chromatic";
import {
  isEnableLighting,
  setEnableLighting,
  getLight,
  setLight,
  getDynamicAtmosphereLighting,
  setDynamicAtmosphereLighting,
  getDynamicAtmosphereLightingFromSun,
  setDynamicAtmosphereLightingFromSun
} from "../WebGlobe/util";

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
        return ["isogram", "isosurface"];
      }
    },
    /**
     * @type Number
     * @default 400
     * @description 最大分段数，设置其值可以相对设置等值距的最小值
     */
    maxSegmentedValue: {
      type: Number,
      default: 400
    },
    /**
     * @type Number
     * @default 150
     * @description 等间距
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
      default: 200
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
     * @type Array
     * @default []
     * @description 等值面高度数组
     */
    bandPosition: {
      type: Array,
      default: () => {
        return [];
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
        return [];
      }
    }
  },
  watch: {
    maxSegmentedValue: {
      handler(next) {
        this.maxSegmentedValueCopy = next;
      },
      immediate: true
    },
    contourSpacing: {
      handler(next) {
        this.contourSpacingCopy = this.contourSpacing;
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
        let { contourAnalysis } = options;
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
        let { contourAnalysis } = options;
        if (contourAnalysis) {
          vm.updateContourAnalysis(contourAnalysis);
        }
      }
    },
    formData2: {
      deep: true,
      handler(next) {
        let vm = this;
        let options = this._findOptions();
        if (options) {
          let { contourAnalysis } = options;
          if (contourAnalysis) {
            vm.getHeightAndColor();
            if (vm.isosurface) {
              contourAnalysis.selectedShading = "elevationBand";
              contourAnalysis.updateElevationBandMaterial(
                vm.bandPositionCopy,
                vm.formData2.isGradient,
                vm.bandThicknessCopy,
                vm.formData2.bandTransparencyCopy,
                vm.backgroundTransparency,
                vm.colorsArrayCopy
              );
            }
          }
        }
      }
    },
    contourSpacingCopy: {
      immediate: true,
      handler(next) {
        let vm = this;
        if (next < vm.initSpacing) return;
        vm.bandThicknessCopy = next * 2;
        let options = this._findOptions();
        if (options) {
          let { contourAnalysis } = options;
          if (contourAnalysis) {
            vm.updateContourAnalysis(contourAnalysis);
          }
        }
        // 重新计算颜色表
        this.calculateHeightAndColor();
      }
    },
    maxSegmentedValueCopy: {
      handler(next) {
        let vm = this;
        if (vm.zMax) {
          // 根据最大分段值计算可设置的最小等间距
          vm.initSpacing = Math.round(vm.zMax / next);
        }
      }
    }
  },
  data() {
    return {
      //等值线开关
      isogram: true,
      maxIsogram: undefined,
      maxIsosurface: undefined,
      padVal: undefined,
      padVal1: undefined,
      //最大分段值
      maxSegmentedValueCopy: 100,
      //等值面开关
      isosurface: false,
      //修改等间距
      contourSpacingCopy: 150,
      //等值面宽度
      bandThicknessCopy: 300,
      formData1: {
        contourWidthCopy: 10,
        contourColorCopy: "rgb(255,0,0)"
      },
      formData2: {
        bandColorArray: [],
        bandTransparencyCopy: 0.5,
        isGradient: false
      },
      //等值面数组，高度，单位米
      bandPositionCopy: [],
      //等值面颜色数组(数组长度不小于bandPositions)
      colorsArrayCopy: [],
      //等值面背景透明度
      backgroundTransparency: 0.6,
      zMax: undefined,
      halfHeight: undefined,
      initSpacing: 1,
      isEnableLighting: undefined, // 光照是否已开启
      light: undefined, // 是否有light对象
      dynamicAtmosphereLighting: undefined,
      dynamicAtmosphereLightingFromSun: undefined
    };
  },

  created() {},
  mounted() {
    let vm = this;
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
        reject => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex, Cesium } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
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
      // viewer.scene.globe.enableLighting = true;
      // let utc = Cesium.JulianDate.fromDate(new Date("2019/11/04 15:00:00")); //UTC
      // // 北京时间=UTC+8=GMT+8
      // viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(
      //   utc,
      //   8,
      //   new Cesium.JulianDate()
      // );
      // 获取颜色表
      vm.calculateHeightAndColor();
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      viewer.scene.globe.enableLighting = false;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
        let { options } = find;
        let { contourAnalysis } = options;

        // 判断是否已有等值线分析结果
        if (contourAnalysis) {
          contourAnalysis.destroy();
        }
      }
      vueCesium.ContourAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * @description 开启光照
     */
    _enableBrightness() {
      // 开启光照，不然放大地图，分析结果显示异常

      this.isEnableLighting = isEnableLighting(this.viewer);
      if (!this.isEnableLighting) {
        // 未开启光照，开启
        setEnableLighting(true, this.viewer);
      }
      // 调高亮度
      const { viewer } = this;
      this.light = getLight(viewer);
      this.dynamicAtmosphereLighting = getDynamicAtmosphereLighting(viewer);
      this.dynamicAtmosphereLightingFromSun = getDynamicAtmosphereLightingFromSun(
        viewer
      );
      const searchLight = new this.Cesium.DirectionalLight({
        direction: viewer.scene.camera.directionWC, // Updated every frame
        intensity: 2.0
      });
      setLight(searchLight, viewer);
      setDynamicAtmosphereLighting(false, viewer);
      setDynamicAtmosphereLightingFromSun(false, viewer);
    },
    _findOptions() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        return find.options;
      }
    },
    updateContourAnalysis(contourAnalysis) {
      let vm = this;
      let color = this._edgeColor();
      contourAnalysis.changeContours(
        vm.contourSpacingCopy,
        this.formData1.contourWidthCopy,
        color
      );
      if (vm.isogram && !vm.isosurface) {
        contourAnalysis.updateMaterial("none");
      } else if (vm.isosurface) {
        contourAnalysis.selectedShading = "elevationBand";
        contourAnalysis.updateElevationBandMaterial(
          vm.bandPositionCopy,
          vm.formData2.isGradient,
          vm.bandThicknessCopy,
          vm.formData2.bandTransparencyCopy,
          vm.backgroundTransparency,
          vm.colorsArrayCopy
        );
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
      let vm = this;
      vm.isosurface = isosurface;
      let options = this._findOptions();
      if (options) {
        let { contourAnalysis } = options;
        if (contourAnalysis) {
          if (isosurface) {
            vm.getHeightAndColor();
            contourAnalysis.selectedShading = "elevationBand";
            contourAnalysis.updateElevationBandMaterial(
              vm.bandPositionCopy,
              vm.formData2.isGradient,
              vm.bandThicknessCopy,
              vm.formData2.bandTransparencyCopy,
              vm.backgroundTransparency,
              vm.colorsArrayCopy
            );
          } else {
            contourAnalysis.selectedShading = "none";
            contourAnalysis = null;
          }
        }
      }
    },
    isTerrianReady() {
      const { viewer } = this;
      return new Promise((resolve, reject) => {
        if (viewer) {
          let interval = setInterval(function() {
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
      let { vueCesium, vueKey, vueIndex, Cesium, viewer } = this;
      let vm = this;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { contourAnalysis, drawElement } = options;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      vueCesium.ContourAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );
      const { contourWidthCopy } = this.formData1;
      const color = this._edgeColor();

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: result => {
          // 分支判断
          this.remove();
          this._enableBrightness();
          if (vm.isogram && !vm.isosurface) {
            contourAnalysis =
              contourAnalysis || new Cesium.TerrainAnalyse(viewer);
            contourAnalysis.enableContour = true;
            // contourAnalysis.updateMaterial("none");
            contourAnalysis.changeContours(
              vm.contourSpacingCopy,
              contourWidthCopy,
              color
            );
            contourAnalysis.changeAnalyseArea(result.positions);
          } else if (vm.isosurface) {
            contourAnalysis =
              contourAnalysis || new Cesium.TerrainAnalyse(viewer);
            let { isGradient, bandTransparencyCopy } = vm.formData2;
            // 获取高度数组和颜色数组
            vm.getHeightAndColor();
            if (vm.isogram) {
              contourAnalysis.enableContour = true;
              contourAnalysis.changeContours(
                vm.contourSpacingCopy,
                contourWidthCopy,
                color
              );
            }
            contourAnalysis.changeAnalyseArea(result.positions);
            contourAnalysis.selectedShading = "elevationBand";
            contourAnalysis.updateElevationBandMaterial(
              vm.bandPositionCopy,
              isGradient,
              vm.bandThicknessCopy,
              bandTransparencyCopy,
              vm.backgroundTransparency,
              vm.colorsArrayCopy
            );
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
        let cesiumColor = Cesium.Color.fromCssColorString(
          vm.formData2.bandColorArray[i].color
        );
        vm.colorsArrayCopy.push(cesiumColor);
      }
    },

    calculateHeightAndColor() {
      let vm = this;
      this.isTerrianReady().then(zIndex => {
        vm.formData2.bandColorArray = [];
        // 高度差
        vm.zMax = zIndex.zMax;
        vm.initSpacing = Math.round(vm.zMax / vm.maxSegmentedValueCopy);
        vm.halfHeight = Math.round(vm.zMax / 2);
        let heightIntercept = Math.abs(zIndex.zMin - zIndex.zMax);
        let space = vm.contourSpacingCopy;
        let heightUnit = Math.round(heightIntercept / space);
        for (let i = 0; i <= heightUnit; i++) {
          let unit = {};
          if (i === 0) {
            unit.min = Number(zIndex.zMin);
            unit.max = Number((zIndex.zMin + space).toFixed(2));
          } else {
            unit.min = Number((zIndex.zMin + space * i).toFixed(2));
            unit.max = Number((zIndex.zMin + space * (i + 1)).toFixed(2));
          }
          unit = this.calculateColor(unit, i, heightUnit);
          vm.formData2.bandColorArray.push(unit);
        }
      });
    },
    /**
     * @description 计算每个高度对应的颜色
     */
    calculateColor(unit, index, heightUnit) {
      let vm = this;
      let color;
      // 把Cesium.Color分为三段，每段分别设置r、g、b
      for (let i = 0; i < heightUnit; i++) {
        //第一段从低高度设置g
        let onePoint = parseInt(heightUnit / 3);
        let twoPoint = parseInt(onePoint * 2);
        let a = parseInt(255 / onePoint);
        if (i <= onePoint) {
          if (i === index) {
            color = new this.Cesium.Color(255 / 255, (a * i) / 255, 0);
            this.colorsArrayCopy[i] = color;
          }
          //第二段从低高度设置r和b
        } else if (onePoint < i && i <= twoPoint) {
          if (i === index) {
            color = new this.Cesium.Color(
              (255 - a * (i - onePoint)) / 255,
              255 / 255,
              (a * (i - onePoint)) / 255
            );
            this.colorsArrayCopy[i] = color;
          }
        } else if (twoPoint < i && i <= heightUnit) {
          if (i === index) {
            color = new this.Cesium.Color(
              0,
              (255 - a * (i - onePoint * 2)) / 255,
              255 / 255
            );
            this.colorsArrayCopy[i] = color;
          }
        }
      }
      unit.color = color ? color.toCssColorString() : "#ff0000";
      return unit;
    },
    /**
     * @description 移除等值线分析结果，取消交互式绘制事件激活状态
     */
    remove() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { contourAnalysis, drawElement } = options;

      // 判断是否已有等值线分析结果
      if (contourAnalysis) {
        // 移除等值线分析显示结果
        contourAnalysis.enableContour = false;
        contourAnalysis.updateMaterial("none");
        // 移除等值面分析显示结果
        contourAnalysis.selectedShading = "none";

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

      // 恢复光照设置
      this._restoreEnableLighting();
    },
    /***
     * 恢复光照设置
     */
    _restoreEnableLighting() {
      const { viewer } = this;
      // 恢复光照开启状态设置
      if (this.isEnableLighting !== undefined) {
        setEnableLighting(this.isEnableLighting, viewer);
      }

      // 恢复brightness参数设置
      if (this.light !== undefined) {
        setLight(this.light, viewer);
      }
      setDynamicAtmosphereLighting(this.dynamicAtmosphereLighting, viewer);
      setDynamicAtmosphereLightingFromSun(
        this.dynamicAtmosphereLightingFromSun,
        viewer
      );
    }
  }
};
</script>
<style scoped>
.mapgis-widget-contour-analysis {
  max-height: calc(60vh);
  overflow-y: auto;
}
::v-deep
  .mapgis-ui-collapse
  > .mapgis-ui-collapse-item
  > .mapgis-ui-collapse-header {
  border-left: unset !important;
  font-size: 13px;
  padding: 7px 27px;
}
::v-deep .mapgis-ui-table-body {
  max-height: 167px !important;
}
::v-deep
  .mapgis-ui-collapse
  > .mapgis-ui-collapse-item
  > .mapgis-ui-collapse-header
  .mapgis-ui-collapse-arrow {
  left: 10px;
}
</style>
