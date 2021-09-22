<template>
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
    <mapgis-ui-setting-form>
      <mapgis-ui-form-item label="淹没最低高度">
        <mapgis-ui-input
          v-model.number="formData.minHeight"
          type="number"
          :max="formData.maxHeight"
          addon-after="(米)"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="淹没最高高度">
        <mapgis-ui-input
          v-model.number="formData.maxHeight"
          type="number"
          :min="formData.minHeight"
          addon-after="(米)"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="洪水上涨速度">
        <mapgis-ui-input
          v-model.number="formData.speed"
          type="number"
          min="0"
          addon-after="(米/秒)"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="颜色">
        <mapgis-ui-sketch-color-picker
          :color.sync="formData.floodColor"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
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
  name: "mapgis-3d-analysis-flood",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions
  },
  data() {
    return {
      formData: {
        minHeight: 0,
        maxHeight: 2000,
        speed: 500,
        frequency: 1000,
        animationSpeed: 0.01,
        amplitude: 10,
        floodColor: "rgba(149,232,249,0.5)"
      },
      positions: null,
      recalculate: false,
      depthTestAgainstTerrain: false, // 深度检测是否已开启
      mHeight: 2000, // 淹没最高高度变化前的值
      timer: null
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
      const { minHeight, speed, floodColor } = this.formData;
      return { minHeight, speed, floodColor };
    },
    maxHeight() {
      return this.formData.maxHeight;
    }
  },
  watch: {
    params: {
      handler: function(e) {
        if (this.positions) {
          this.recalculate = true;
        }
      },
      deep: true
    },
    maxHeight: {
      handler: function(e) {
        const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
        let find = CesiumZondy.FloodAnalysisManager.findSource(
          vueKey,
          vueIndex
        );
        let { options } = find;
        let { floodAnalysis, drawElement } = options;
        if (!floodAnalysis) {
          return;
        }
        if (!this.timer) {
          this.timer = setTimeout(() => {
            if (this.timer) clearTimeout(this.timer);
            this.timer = null;
            const { maxHeight } = this.formData;
            floodAnalysis.maxHeight = maxHeight;
            if (this.mHeight > maxHeight) {
              // 下降
              floodAnalysis.isDownFlood = true;
            } else if (this.mHeight < maxHeight) {
              // 上升
              floodAnalysis.isDownFlood = false;
            }
            this.mHeight = maxHeight;
            webGlobe.scene.requestRender();
          }, 1000);
        }
      }
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
        CesiumZondy.FloodAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            drawElement: null,
            floodAnalysis: null
          }
        );
      });
    },
    unmount() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.FloodAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      CesiumZondy.FloodAnalysisManager.deleteSource(vueKey, vueIndex);
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
    add() {
      let { CesiumZondy, vueKey, vueIndex, Cesium } = this;
      let find = CesiumZondy.FloodAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { floodAnalysis, drawElement } = options;
      this.active();
      const { viewer } = this.webGlobe;
      // 初始化交互式绘制控件
      drawElement = drawElement || new Cesium.DrawElement(viewer);
      CesiumZondy.FloodAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "drawElement",
        drawElement
      );

      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          this.remove();
          this.positions = positions;
          this.analysis(floodAnalysis);
        }
      });
    },

    /**
     * 分析
     */
    analysis(floodAnalysis) {
      const { positions } = this;
      if (!positions) {
        this.$message.warning("请绘制分析区域");
        return;
      }
      const { viewer } = this.webGlobe;
      const {
        minHeight,
        maxHeight,
        speed,
        frequency,
        animationSpeed,
        amplitude,
        floodColor
      } = this.formData;
      // 初始化高级分析功能管理类
      const advancedAnalysisManager = new this.CesiumZondy.Manager.AdvancedAnalysisManager(
        {
          viewer: viewer
        }
      );
      // 初始化洪水淹没分析类
      floodAnalysis =
        floodAnalysis ||
        advancedAnalysisManager.createFlood(positions, {
          // 设置洪水淹没区域动画最低高度
          minHeight: Number(minHeight >= 0 ? 0 : minHeight), // 设置洪水淹没区域动画最低高度
          // 设置洪水淹没区域最高高度
          maxHeight: Number(maxHeight <= 0 ? 2000 : maxHeight),
          // 设置洪水上涨速度
          floodSpeed: Number(speed <= 0 ? 1 : speed)
        });

      // 洪水淹没区域最低高度
      floodAnalysis.startHeight = Number(minHeight <= 0 ? 0 : minHeight);
      // 洪水颜色
      floodAnalysis.floodColor = this.getColor(floodColor);
      // 水纹频率 指波浪的个数
      floodAnalysis.frequency = Number(frequency <= 0 ? 1000 : frequency);
      // 水纹速度
      floodAnalysis.animationSpeed = Number(
        animationSpeed <= 0 ? 0.01 : animationSpeed
      );
      // 水波的高度
      floodAnalysis.amplitude = Number(amplitude <= 0 ? 10 : amplitude);
      // 指定光线强度
      floodAnalysis.specularIntensity = 3.0;

      if (!this.depthTestAgainstTerrain) {
        viewer.scene.globe.depthTestAgainstTerrain = true;
      }
      // 添加洪水淹没结果显示
      this.webGlobe.scene.VisualAnalysisManager.add(floodAnalysis);
      this.mHeight = maxHeight;
      let { CesiumZondy, vueKey, vueIndex } = this;
      CesiumZondy.FloodAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "floodAnalysis",
        floodAnalysis
      );
    },
    /**
     * 重新计算
     */
    refresh() {
      this.removeFlood();
      this.analysis();
    },
    removeFlood() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.FloodAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { floodAnalysis } = options;

      // 判断是否已有洪水淹没分析结果
      if (floodAnalysis) {
        // 移除洪水淹没分析显示结果
        this.webGlobe.scene.VisualAnalysisManager.remove(floodAnalysis);
        CesiumZondy.FloodAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "floodAnalysis",
          null
        );
      }
    },
    remove() {
      this.removeFlood();
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.FloodAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { drawElement } = options;

      if (drawElement) {
        // 取消交互式绘制事件激活状态
        drawElement.stopDrawing();
        CesiumZondy.FloodAnalysisManager.changeOptions(
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
    }
  }
};
</script>
<style scoped>
.mapgis-widget-flood-analysis {
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
