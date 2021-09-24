<template>
  <div>
    <slot>
      <div class="mapgis-widget-contour-analysis">
        <mapgis-ui-group-tab title="参数设置" />
        <mapgis-ui-setting-form>
          <mapgis-ui-form-item label="等值距">
            <mapgis-ui-input
              v-model.number="contourSpacingCopy"
              type="number"
              min="0"
              addon-after="(米)"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="线宽">
            <mapgis-ui-input
              v-model.number="contourWidthCopy"
              type="number"
              min="0"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="线颜色">
            <mapgis-ui-sketch-color-picker
              :color.sync="contourColorCopy"
              :disableAlpha="true"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
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
import { colorToCesiumColor } from "../WebGlobe/util";

export default {
  name: "mapgis-3d-analysis-contour",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions,
    /**
     * @type Number
     * @default 150
     * @description 等高线间距
     */
    contourSpacing: {
      type: Number,
      default: 150
    },
    /**
     * @type Number
     * @default 2
     * @description 等高线宽度
     */
    contourWidth: {
      type: Number,
      default: 2
    },
    /**
     * @type String
     * @default "rgb(255,0,0)"
     * @description 等高线颜色
     */
    contourColor: {
      type: String,
      default: "rgb(255,0,0)"
    }
  },
  watch: {
    contourSpacing: {
      handler() {
        this.contourSpacingCopy = this.contourSpacing;
      },
      immediate: true
    },
    contourWidth: {
      handler() {
        this.contourWidthCopy = this.contourWidth;
      },
      immediate: true
    },
    contourColor: {
      handler() {
        this.contourColorCopy = this.contourColor;
      },
      immediate: true
    }
  },
  data() {
    return {
      contourSpacingCopy: 150,
      contourWidthCopy: 2,
      contourColorCopy: "rgb(255,0,0)"
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
        CesiumZondy.ContourAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            drawElement: null,
            contourAnalysis: null
          }
        );
      });
    },
    unmount() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.ContourAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this.remove();
      }
      CesiumZondy.ContourAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    _edgeColor() {
      return colorToCesiumColor(this.contourColorCopy, this.webGlobe);
    },
    analysis() {
      let { CesiumZondy, vueKey, vueIndex, Cesium } = this;
      let find = CesiumZondy.ContourAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { contourAnalysis, drawElement } = options;
      const { viewer } = this.webGlobe;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      CesiumZondy.ContourAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );
      const { contourWidthCopy, contourSpacingCopy } = this;
      const color = this._edgeColor();

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          this.remove();
          contourAnalysis =
            contourAnalysis || new Cesium.TerrainAnalyse(viewer, {});
          contourAnalysis.enableContour(true);
          contourAnalysis.updateMaterial("none");
          contourAnalysis.changeContourWidth(contourWidthCopy);
          contourAnalysis.changeContourSpacing(contourSpacingCopy);
          contourAnalysis.changeContourColor(color);
          contourAnalysis.changeAnalyseArea(positions);
          CesiumZondy.ContourAnalysisManager.changeOptions(
            vueKey,
            vueIndex,
            "contourAnalysis",
            contourAnalysis
          );
        }
      });
    },
    remove() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.ContourAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { contourAnalysis, drawElement } = options;

      // 判断是否已有等值线分析结果
      if (contourAnalysis) {
        // 移除等值线分析显示结果
        contourAnalysis.updateMaterial("none");
        CesiumZondy.ContourAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "contourAnalysis",
          null
        );
      }

      if (drawElement) {
        // 取消交互式绘制矩形事件激活状态
        drawElement.stopDrawing();
        CesiumZondy.ContourAnalysisManager.changeOptions(
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
</style>
