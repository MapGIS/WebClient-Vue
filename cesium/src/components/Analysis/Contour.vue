<template>
  <div>
    <slot>
      <div class="mapgis-widget-contour-analysis">
        <mapgis-ui-group-tab title="参数设置"/>
        <mapgis-ui-input-number-panel
            size="small"
            class="mapgis-ui-number-style"
            label="等值距(米)"
            :range="[0,zMax/2]"
            v-model="contourSpacingCopy"/>
        <mapgis-ui-switch-panel
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }"
            layout="horizontal"
            label="等值线"
            :height="'154px'"
            v-if="switchOptions.indexOf('isogram') >= 0"
            @changeChecked="startIsogram"
        >
          <mapgis-ui-form-item label="线宽">
            <mapgis-ui-input
                size="small"
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

        <mapgis-ui-switch-panel
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }"
            :height="'312px'"
            layout="horizontal"
            label="等值面"
            v-if="switchOptions.indexOf('isosurface') >= 0"
            @changeChecked="startIsosurface"
        >

          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="等值面透明度"
              :range="[0,1]"
              :step="0.1"
              v-model="formData2.bandTransparencyCopy"/>

        </mapgis-ui-switch-panel>
        <mapgis-ui-switch-panel
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 16 }"
            layout="horizontal"
            label="颜色表">
          <mapgis-ui-colors-setting
              v-model="formData2.bandColorArray"
              :rangeField="'高度'"
              :singleNumber="true"
          >
          </mapgis-ui-colors-setting>
        </mapgis-ui-switch-panel>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="analysis"
          >分析
          </mapgis-ui-button>
          <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {colorToCesiumColor} from "../WebGlobe/util";
import * as d3 from "d3-scale-chromatic";

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
    bandThickness: {
      handler() {
        this.bandThicknessCopy = this.bandThickness;
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
          let {contourAnalysis} = options;
          if (contourAnalysis) {
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
          }
        }
      }
    },
    contourSpacingCopy: {
      immediate: true,
      handler(next) {
        let vm = this;
        this.bandThicknessCopy = next * 2;
        let options = this._findOptions();
        if (options) {
          let {contourAnalysis} = options;
          if (contourAnalysis) {
            vm.updateContourAnalysis(contourAnalysis);
          }
        }
        // 重新计算颜色表
        this.calculateHeightAndColor();
      }
    },

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
      contourSpacingCopy: 150,
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
      bandPositionCopy: [],
      colorsArrayCopy: [],
      backgroundTransparency: 0.6,
      getTerrianHeight: false,
      zMax: undefined
    };
  },

  created() {
  },
  mounted() {
    let vm = this;
    this.mount();
    // 获取颜色表
    this.calculateHeightAndColor();
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
      viewer.scene.globe.enableLighting = true;
      let utc = Cesium.JulianDate.fromDate(new Date("2019/11/04 15:00:00")); //UTC
      viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(
          utc,
          8,
          new Cesium.JulianDate()
      );
      // 北京时间=UTC+8=GMT+8
    },
    unmount() {
      let {vueCesium, vueKey, vueIndex} = this;
      viewer.scene.globe.enableLighting = false;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
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
        let {contourAnalysis} = options;
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
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
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
      const {contourWidthCopy} = this.formData1;
      const color = this._edgeColor();

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: result => {
          // 分支判断
          this.remove();
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
            let {
              isGradient,
              bandTransparencyCopy
            } = vm.formData2;
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
      // vm.colorsArrayCopy = [];
      for (let i = 0; i < vm.formData2.bandColorArray.length; i++) {
        vm.bandPositionCopy.push(vm.formData2.bandColorArray[i].max);
        // color 转换成Cesium
        // let cesiumColor = Cesium.Color.fromCssColorString(
        //     vm.formData2.bandColorArray[i].color
        // );
        // vm.colorsArrayCopy.push(vm.formData2.bandColorArray[i].color);
      }
    },

    calculateHeightAndColor() {
      let vm = this;
      this.isTerrianReady().then(zIndex => {
        vm.formData2.bandColorArray = [];
        // 高度差
        vm.zMax = zIndex.zMax;
        let heightIntercept = Math.abs(zIndex.zMin - zIndex.zMax);
        console.log("heightIntercept", heightIntercept);
        let space = vm.contourSpacingCopy;
        let heightUnit = Math.round(heightIntercept / space);
        for (let i = 0; i <= heightUnit; i++) {
          let unit = {};
          if (i === 0) {
            unit.min = Number(zIndex.zMin);
            unit.max = Number(
                (zIndex.zMin + space).toFixed(2)
            );
          } else {
            unit.min = Number(
                (zIndex.zMin + space * i).toFixed(2)
            );
            unit.max = Number(
                (zIndex.zMin + space * (i + 1)).toFixed(2)
            );
          }
          unit = this.calculateColor(unit, i, heightUnit);
          //   color = d3.interpolateOranges(i
          // if (i % 2 == 0) { / heightUnit);
          // } else {
          //   color = d3.interpolateBlues(i / heightUnit);
          // }
          vm.formData2.bandColorArray.push(unit);
          vm.getTerrianHeight = true;
        }
        console.log("this.colorsArrayCopy", this.colorsArrayCopy);

        // console.log("vm.formData2.bandColorArray",vm.formData2.bandColorArray);
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
            color = new this.Cesium.Color((255 - a * (i - onePoint)) / 255, 255 / 255, (a * (i - onePoint)) / 255);
            this.colorsArrayCopy[i] = color;
          }
        } else if (twoPoint < i && i <= heightUnit) {
          if (i === index) {
            color = new this.Cesium.Color(0, (255 - a * (i - onePoint * 2)) / 255, 255 / 255);
            this.colorsArrayCopy[i] = color;
          }
        }

      }
      unit.color = color.toCssColorString();
      return unit;
    },
    /**
     * @description 移除等值线分析结果，取消交互式绘制事件激活状态
     */
    remove() {
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.ContourAnalysisManager.findSource(vueKey, vueIndex);
      let {options} = find;
      let {contourAnalysis, drawElement} = options;

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
    }
  }
};
</script>
<style scoped>
.mapgis-widget-contour-analysis {
  max-height: calc(50vh);
  overflow-y: auto;
}
</style>
