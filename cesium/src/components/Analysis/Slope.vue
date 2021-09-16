<template>
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
      v-model="params"
      :rangeField="'坡度范围'"
    ></mapgis-ui-colors-setting>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="add">分析</mapgis-ui-button>
      <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import { Util } from "@mapgis/webclient-vue-ui";
import VueOptions from "../Base/Vue/VueOptions";
const { ColorUtil } = Util;

export default {
  name: "mapgis-3d-analysis-slope",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions
  },
  data() {
    return {
      params: [
        { min: 0, max: 15, color: "rgba(244, 67, 54, 0.5)" },
        { min: 15, max: 30, color: "rgba(233, 30, 99, 0.5)" },
        { min: 30, max: 45, color: "rgba(156, 39, 176, 0.5)" },
        { min: 45, max: 60, color: "rgba(255, 235, 59, 0.5)" },
        { min: 60, max: 75, color: "rgba(96, 125, 139, 0.5)" },
        { min: 75, max: 90, color: "rgba(76, 175, 80, 0.5)" }
      ],

      brightnessEnabled: false, // 光照是否已开启

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
      // return new Cesium.GeoJsonDataSource.load(baseUrl, options);
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
        vm.$emit("load", { component: this });
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
     * 开启光照
     */
    enableBrightness() {
      if (this.brightnessEnabled) {
        return;
      }
      // 开启光照，不然放大地图，分析结果显示异常
      const { viewer } = this.webGlobe;
      viewer.scene.globe.enableLighting = true;
      // 调高亮度
      const stages = viewer.scene.postProcessStages;
      viewer.scene.brightness =
        viewer.scene.brightness ||
        stages.add(this.Cesium.PostProcessStageLibrary.createBrightnessStage());
      viewer.scene.brightness.enabled = true;
      viewer.scene.brightness.uniforms.brightness = 1.2;
    },

    active() {
      const { viewer } = this.webGlobe;
      if (viewer.scene.globe.enableLighting && viewer.scene.brightness) {
        this.brightnessEnabled = true;
      }
    },

    add() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.SlopeAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { slopeAnalysis, drawElement } = options;
      this.active();
      const { viewer } = this.webGlobe;
      // 初始化交互式绘制控件
      drawElement = drawElement || new this.Cesium.DrawElement(viewer);
      CesiumZondy.SlopeAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );

      const { params } = this;

      const colors = [];
      const ramp = [];
      params.forEach(({ max, color }) => {
        ramp.push((max / 360).toFixed(2));
        colors.push(color);
      });
      const rampColor = this.transformColor(colors);

      const self = this;

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          this.remove();
          this.enableBrightness(); // 开启光照
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

    transformColor(arrayColor) {
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

      // 关闭光照
      const { viewer } = this.webGlobe;
      if (viewer.scene.brightness && !this.brightnessEnabled) {
        viewer.scene.globe.enableLighting = false;
        viewer.scene.brightness.enabled = false;
      }
    }
  }
};
</script>
