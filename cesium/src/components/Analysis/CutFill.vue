<template>
  <div class="mapgis-widget-cut-fill-analysis">
    <mapgis-ui-group-tab title="参数设置">
      <mapgis-ui-toolbar slot="handle" :bordered="false">
        <mapgis-ui-toolbar-command
          icon="mapgis-redo"
          title="重新计算"
          @click="startFill"
          :disabled="!recalculate"
        ></mapgis-ui-toolbar-command>
      </mapgis-ui-toolbar>
    </mapgis-ui-group-tab>
    <mapgis-ui-form-model :model="formData" v-bind="formDataLayout">
      <mapgis-ui-form-model-item label="x方向采样点数">
        <mapgis-ui-input v-model.number="formData.x" type="number" min="0" />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="y方向采样点数">
        <mapgis-ui-input v-model.number="formData.y" type="number" min="0" />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="填挖规整高度">
        <mapgis-ui-input
          v-model.number="formData.z"
          type="number"
          min="0"
          addon-after="(米)"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-group-tab title="样式设置"></mapgis-ui-group-tab>
    <mapgis-ui-form-model :model="style" v-bind="layout">
      <mapgis-ui-form-model-item label="边线">
        <mapgis-ui-sketch-color-picker
          :color.sync="style.lineColor"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="填充">
        <mapgis-ui-sketch-color-picker
          :color.sync="style.fillColor"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-group-tab title="填挖结果"></mapgis-ui-group-tab>
    <mapgis-ui-form-model :model="result" v-bind="layout">
      <mapgis-ui-form-model-item label="高程范围">
        <mapgis-ui-input
          v-model.number="result.height"
          disabled
          addon-after="(米)"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="表面积">
        <mapgis-ui-input
          v-model.number="result.surfaceArea"
          disabled
          addon-after="(平方米)"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="挖体积">
        <mapgis-ui-input
          v-model.number="result.cutVolume"
          disabled
          addon-after="(立方米)"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="填体积">
        <mapgis-ui-input
          v-model.number="result.fillVolume"
          disabled
          addon-after="(立方米)"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="analysis">分析</mapgis-ui-button>
      <mapgis-ui-button @click="stopCutFillM">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import { colorToCesiumColor } from "../WebGlobe/util";

export default {
  name: "mapgis-3d-analysis-cut-fill",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions
  },
  data() {
    return {
      formData: {
        x: 16,
        y: 16,
        z: 2000
      },
      style: {
        lineColor: "rgba(0,255,0,1)",
        fillColor: "rgba(0,0,255,0.3)"
      },
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
      depthTestAgainstTerrain: false, // 深度检测是否已开启
      formDataLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 13 }
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
  watch: {
    formData: {
      handler: function(e) {
        if (this.positions) {
          this.recalculate = true;
        }
      },
      deep: true
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
      const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", { component: this });
        CesiumZondy.CutFillAnalysisManager.addSource(
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
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.CutFillAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this.remove();
      }
      CesiumZondy.CutFillAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    getColor(rgba) {
      return colorToCesiumColor(rgba, this.webGlobe);
    },
    active() {
      const { viewer } = this.webGlobe;
      if (viewer.scene.globe.enableLighting && viewer.scene.brightness) {
        this.brightnessEnabled = true;
      }
    },
    analysis() {
      let { CesiumZondy, vueKey, vueIndex, Cesium } = this;
      let find = CesiumZondy.CutFillAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { cutFillAnalysis, drawElement } = options;
      this.active();
      const { viewer } = this.webGlobe;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      CesiumZondy.CutFillAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );
      const lineColor = this.getColor(this.style.lineColor);
      const fillColor = this.getColor(this.style.fillColor);

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          this.remove();
          this.positions = positions;

          const linePointArr = [];
          const polygonPointArr = [];
          positions.forEach(element => {
            const { lon, lat, height } = this.cartesianToDegrees(element);
            linePointArr.push(lon);
            linePointArr.push(lat);
            polygonPointArr.push(lon);
            polygonPointArr.push(lat);
            polygonPointArr.push(height);
          });

          // 构造几何绘制控制对象
          this.entityController = new CesiumZondy.Manager.EntityController({
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

          this.startFill();
        }
      });
    },
    cartesianToDegrees(cartesian) {
      const { ellipsoid } = this.webGlobe.scene.globe;
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

    // 开始分析
    startFill() {
      const { positions } = this;
      if (!positions) {
        this.$message.warning("请绘制分析区域");
        return;
      }
      this.reset();
      const { viewer } = this.webGlobe;
      const { x, y, z } = this.formData;

      if (!this.depthTestAgainstTerrain) {
        viewer.scene.globe.depthTestAgainstTerrain = true;
      }

      // 初始化高级分析功能管理类
      const cutFillAnalysis = new this.CesiumZondy.Manager.AdvancedAnalysisManager(
        {
          viewer
        }
      );
      // 创建填挖方实例
      const cutFill = cutFillAnalysis.createCutFill(2.0, {
        // 设置x方向采样点个数
        xPaneNum: x <= 0 ? 16 : x,
        // 设置y方向采样点个数参数
        yPaneNum: y <= 0 ? 16 : y,
        // 设置填挖规整高度
        height: z,
        // 返回结果的回调函数
        callback: this.analysisSuccess
      });
      // 开始执行填挖方分析
      cutFillAnalysis.startCutFill(cutFill, positions);

      let { CesiumZondy, vueKey, vueIndex } = this;

      CesiumZondy.CutFillAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "cutFillAnalysis",
        cutFillAnalysis
      );
    },

    analysisSuccess(result) {
      this.result = {
        height: `${result.minHeight.toFixed(2)}~${result.maxHeight.toFixed(2)}`,
        surfaceArea: result.surfaceArea,
        cutVolume: result.cutVolume,
        fillVolume: result.fillVolume
      };
    },

    // 移除填挖方计算
    stopCutFillM() {
      this.reset();
      this.remove();
    },

    reset() {
      this.result = {
        height: "",
        surfaceArea: "",
        cutVolume: "",
        fillVolume: ""
      };
    },
    remove() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.CutFillAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { cutFillAnalysis, drawElement } = options;

      // 判断是否已有等值线分析结果
      if (cutFillAnalysis) {
        CesiumZondy.CutFillAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "cutFillAnalysis",
          null
        );
      }

      if (drawElement) {
        // 取消交互式绘制矩形事件激活状态
        drawElement.stopDrawing();
        CesiumZondy.CutFillAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "drawElement",
          null
        );
      }

      this.positions = null;
      this.recalculate = false;

      if (!this.depthTestAgainstTerrain) {
        this.webGlobe.viewer.scene.globe.depthTestAgainstTerrain = false;
      }
      if (this.terrainLine) {
        this.entityController.removeEntity(this.terrainLine);
        this.entityController.removeEntity(this.terrainPolygon);
        this.terrainLine = null;
        this.terrainPolygon = null;
        this.entityController = null;
      }
    }
  }
};
</script>
<style scoped>
.mapgis-widget-cut-fill-analysis {
  max-height: calc(50vh);
  overflow-y: auto;
}

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
