<template>
  <div>
    <slot>
      <div class="mapgis-widget-slope-analysis">
        <mapgis-ui-group-tab title="坡度图例设置">
          <mapgis-ui-tooltip slot="handle" placement="bottomRight">
            <template slot="title">
              <span>{{ info }}</span>
            </template>
            <mapgis-ui-iconfont type="mapgis-info"></mapgis-ui-iconfont>
          </mapgis-ui-tooltip>
        </mapgis-ui-group-tab>
        <mapgis-ui-colors-setting
          v-model="rampColorsCopy"
          :rangeField="'坡度范围'"
        ></mapgis-ui-colors-setting>
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
import { Util } from "@mapgis/webclient-vue-ui";
import VueOptions from "../Base/Vue/VueOptions";
import {
  isEnableLighting,
  setEnableLighting,
  getBrightness,
  getBrightnessStatusAndUniformsBrightness,
  setBrightnessStatusAndUniformsBrightness
} from "../WebGlobe/util";
const { ColorUtil } = Util;

export default {
  name: "mapgis-3d-analysis-slope",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions,
    /**
     * @type Object
     * @description 坡度分析角度颜色数组
     */
    rampColors: {
      type: Array,
      default: () => {
        return [
          { min: 0, max: 15, color: "rgba(244, 67, 54, 0.5)" },
          { min: 15, max: 30, color: "rgba(233, 30, 99, 0.5)" },
          { min: 30, max: 45, color: "rgba(156, 39, 176, 0.5)" },
          { min: 45, max: 60, color: "rgba(255, 235, 59, 0.5)" },
          { min: 60, max: 75, color: "rgba(96, 125, 139, 0.5)" },
          { min: 75, max: 90, color: "rgba(76, 175, 80, 0.5)" }
        ];
      }
    }
  },
  watch: {
    rampColors: {
      handler() {
        this.rampColorsCopy = this.rampColors;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      rampColorsCopy: [
        { min: 0, max: 15, color: "rgba(244, 67, 54, 0.5)" },
        { min: 15, max: 30, color: "rgba(233, 30, 99, 0.5)" },
        { min: 30, max: 45, color: "rgba(156, 39, 176, 0.5)" },
        { min: 45, max: 60, color: "rgba(255, 235, 59, 0.5)" },
        { min: 60, max: 75, color: "rgba(96, 125, 139, 0.5)" },
        { min: 75, max: 90, color: "rgba(76, 175, 80, 0.5)" }
      ],

      isEnableLighting: undefined, // 光照是否已开启

      noBrightness: undefined, // 是否有brightness对象

      brightnessStatusAndUniformsBrightness: undefined, // 光照参数

      info: "坡度分析需要带法线地形。"
    };
  },

  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        CesiumZondy.SlopeAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            drawElement: null,
            slopeAnalysis: null
          }
        );
      });
    },
    unmount() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.SlopeAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      CesiumZondy.SlopeAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * @description 开启光照
     */
    _enableBrightness() {
      // 开启光照，不然放大地图，分析结果显示异常

      this.isEnableLighting = isEnableLighting(this.webGlobe);
      if (!this.isEnableLighting) {
        // 未开启光照，开启
        setEnableLighting(true, this.webGlobe);
      }
      // 调高亮度
      const { viewer } = this.webGlobe;
      const stages = viewer.scene.postProcessStages;
      const brightness = getBrightness(this.webGlobe);
      if (!brightness) {
        // 初始没有brightness对象
        this.noBrightness = true;
        viewer.scene.brightness = stages.add(
          this.Cesium.PostProcessStageLibrary.createBrightnessStage()
        );
      }
      // 设置前记录原有光照参数
      this.brightnessStatusAndUniformsBrightness = getBrightnessStatusAndUniformsBrightness(
        this.webGlobe
      );
      const statusAndUniformsBrightness = {
        enabled: true,
        brightness: 1.2
      };
      setBrightnessStatusAndUniformsBrightness(
        statusAndUniformsBrightness,
        this.webGlobe
      );
    },
    /**
     * @description 开始绘制并分析
     */
    analysis() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.SlopeAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { slopeAnalysis, drawElement } = options;
      const { viewer } = this.webGlobe;
      // 初始化交互式绘制控件
      drawElement = drawElement || new this.Cesium.DrawElement(viewer);
      CesiumZondy.SlopeAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );

      const { rampColorsCopy } = this;

      const colors = [];
      const ramp = [];
      rampColorsCopy.forEach(({ max, color }) => {
        ramp.push((max / 360).toFixed(2));
        colors.push(color);
      });
      const rampColor = this._transformColor(colors);

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          this.remove();
          this._enableBrightness(); // 开启光照
          slopeAnalysis =
            slopeAnalysis ||
            new this.Cesium.TerrainAnalyse(viewer, {
              slopeRampColor: rampColor,
              slopeRamp: ramp
            });
          slopeAnalysis.enableContour(false);
          slopeAnalysis.updateMaterial("slope");
          slopeAnalysis.changeAnalyseArea(positions);
          CesiumZondy.SlopeAnalysisManager.changeOptions(
            vueKey,
            vueIndex,
            "slopeAnalysis",
            slopeAnalysis
          );
        }
      });
    },
    /**
     * @description rgba数组转hex数组
     * @param arrayColor - {Array} rgba数组
     * @return hex数组
     */
    _transformColor(arrayColor) {
      let isNull = false;
      const arr = arrayColor.map(color => {
        if (color) {
          return ColorUtil.rgbaToHex(color);
        }
        isNull = true;
        return null;
      });
      if (isNull) {
        return [];
      }
      return arr;
    },
    /**
     * @description 移除坡度分析结果，取消交互式绘制事件激活状态
     */
    remove() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.SlopeAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { slopeAnalysis, drawElement } = options;

      // 判断是否已有坡度分析结果
      if (slopeAnalysis) {
        // 移除坡度分析显示结果
        slopeAnalysis.updateMaterial("none");
        CesiumZondy.SlopeAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "slopeAnalysis",
          null
        );
      }

      if (drawElement) {
        // 取消交互式绘制矩形事件激活状态
        drawElement.stopDrawing();
        CesiumZondy.SlopeAnalysisManager.changeOptions(
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
      // 恢复光照开启状态设置
      if (
        this.isEnableLighting !== undefined &&
        this.isEnableLighting !== isEnableLighting(this.webGlobe)
      ) {
        setEnableLighting(this.isEnableLighting, this.webGlobe);
      }
      const stages = this.webGlobe.viewer.scene.postProcessStages;
      if (this.noBrightness) {
        // 如果开始没有brightness对象，恢复
        stages.remove(this.webGlobe.viewer.scene.brightness);
        this.webGlobe.viewer.scene.brightness = undefined;
      } else {
        // 恢复brightness参数设置
        if (this.brightnessStatusAndUniformsBrightness !== undefined) {
          const brightnessStatusAndUniformsBrightness = getBrightnessStatusAndUniformsBrightness(
            this.webGlobe
          );
          if (
            this.brightnessStatusAndUniformsBrightness.enabled !==
              brightnessStatusAndUniformsBrightness.enabled ||
            this.brightnessStatusAndUniformsBrightness.brightness !==
              brightnessStatusAndUniformsBrightness.brightness
          ) {
            setBrightnessStatusAndUniformsBrightness(
              this.brightnessStatusAndUniformsBrightness,
              this.webGlobe
            );
          }
        }
      }
    }
  }
};
</script>
