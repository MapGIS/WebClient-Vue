<template>
  <div class="mapgis-widget-contour-analysis">
    <mapgis-ui-group-tab title="等值线参数设置" />
    <mapgis-ui-form-model :model="formData" v-bind="layout">
      <mapgis-ui-form-model-item label="等值距">
        <mapgis-ui-input
          v-model.number="formData.contourSpacing"
          type="number"
          min="0"
          addon-after="(米)"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="线宽">
        <mapgis-ui-input
          v-model.number="formData.contourWidth"
          type="number"
          min="0"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="线颜色">
        <mapgis-ui-sketch-color-picker
          :color.sync="formData.contourColor"
          :disableAlpha="true"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="add">分析</mapgis-ui-button>
      <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import { colorToCesiumColor } from "../WebGlobe/util";

export default {
  name: "mapgis-3d-analysis-contour",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions
  },
  data() {
    return {
      formData: {
        contourSpacing: 150,
        contourWidth: 2,
        contourColor: "rgb(255,0,0)"
      },
      layout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 }
      }
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
        vm.$emit("load", { component: this });
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
    edgeColor() {
      return colorToCesiumColor(this.formData.contourColor, this.webGlobe);
    },
    add() {
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
      const { contourWidth, contourSpacing } = this.formData;
      const color = this.edgeColor();

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          this.remove();
          contourAnalysis =
            contourAnalysis || new Cesium.TerrainAnalyse(viewer, {});
          contourAnalysis.enableContour(true);
          contourAnalysis.updateMaterial("none");
          contourAnalysis.changeContourWidth(contourWidth);
          contourAnalysis.changeContourSpacing(contourSpacing);
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
