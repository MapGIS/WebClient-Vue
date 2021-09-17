<template>
  <div class="mapgis-widget-aspect-analysis">
    <mapgis-ui-group-tab
      title="模型"
      :has-top-margin="false"
    ></mapgis-ui-group-tab>
    <mapgis-ui-row class="model">
      <mapgis-ui-radio-group v-if="models.length > 0" v-model="model">
        <mapgis-ui-radio
          v-for="(node, index) in models"
          :style="radioStyle"
          :key="`model-${index}`"
          :value="node"
        >
          {{ node.title }}
        </mapgis-ui-radio>
      </mapgis-ui-radio-group>
      <div v-else>暂无数据！</div>
    </mapgis-ui-row>
    <mapgis-ui-group-tab title="坐标轴"> </mapgis-ui-group-tab>
    <mapgis-ui-row class="axis">
      <mapgis-ui-radio-group v-model="axis">
        <mapgis-ui-radio value="X"> X轴 </mapgis-ui-radio>
        <mapgis-ui-radio value="Y"> Y轴 </mapgis-ui-radio>
        <mapgis-ui-radio value="Z"> Z轴 </mapgis-ui-radio>
      </mapgis-ui-radio-group>
    </mapgis-ui-row>
    <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
    <mapgis-ui-setting-form :label-width="72">
      <a-form-item label="剖面颜色">
        <mapgis-ui-sketch-color-picker
          :color.sync="color"
          :disableAlpha="false"
          class="color-picker"
        >
        </mapgis-ui-sketch-color-picker>
      </a-form-item>
      <a-form-item label="动画时间">
        <mapgis-ui-input-number v-model="time" :min="0" style="width: 100%" />
      </a-form-item>
      <a-form-item label="剖切距离">
        <mapgis-ui-slider
          v-model="distance"
          :min="min"
          :max="max"
          @change="setDistance"
          :disabled="readonly"
        />
      </a-form-item>
    </mapgis-ui-setting-form>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="startClipping">
        分析
      </mapgis-ui-button>
      <mapgis-ui-button type="primary" @click="animation">
        动态效果
      </mapgis-ui-button>
      <mapgis-ui-button @click="stopClipping"> 清除 </mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import { makeColor } from "../Utils/util";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-3d-dynamic-section",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  mixins: [BaseLayer],
  props: {
    // 模型集合
    models: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 选中模型
      model: null,

      // 默认坐标轴
      axis: "X",

      // 默认裁剪边缘颜色
      color: "rgb(200,200,200,0.5)",

      // 默认动画时间
      time: 10,

      // 默认剖切距离
      distance: 0,

      // 剖切图层
      landscapeLayer: [],

      // 最大剖切距离
      max: 10000,

      // 最小剖切距离
      min: -10000,

      // 时间轴
      timer: null,

      // slider滑块是否禁用
      readonly: false,

      // 组件是否已激活
      isActive: false,

      // radio样式
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      }
    };
  },
  watch: {
    models: {
      handler: function(layers) {
        if (layers && layers.length > 0) {
          this.model = layers[layers.length - 1];
          this.m3dIsReady().then(() => {
            this.startClipping();
          });
        } else {
          this.model = null;
        }
      },
      deep: true,
      immediate: true
    },
    model: {
      deep: true,
      immediate: true,
      handler: function() {
        this.changeModel();
      }
    },
    axis: {
      deep: true,
      immediate: true,
      handler: function() {
        this.getMaxMin();
        this.startClipping();
      }
    }
  },
  mounted() {
    this.onOpen();
  },
  destroyed() {
    this.onClose();
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
        CesiumZondy.DynamicSectionAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            dynamicSectionAnalysis: null
          }
        );
      });
    },
    unmount() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.DynamicSectionAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this.removeDynaCut();
      }
      CesiumZondy.DynamicSectionAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },

    /**
     * 打开模块
     */
    onOpen() {
      this.isActive = true;
      this.mount();
      this.changeModel();
    },

    /**
     * 关闭模块
     */
    onClose() {
      this.stopClipping();
      this.isActive = false;
    },

    changeModel() {
      this.m3dIsReady().then(m3d => {
        const { source } = m3d;
        this.zoomToM3dLayerBySource(source[0]);
        this.startClipping();
      });
    },

    /**
     * 判断传入的m3d图层是否加载完毕
     */
    m3dIsReady() {
      const { webGlobe, CesiumZondy, vueKey, vueIndex, model, isActive } = this;
      return new Promise((resolve, reject) => {
        if (isActive && model && model.vueIndex) {
          this.$_getM3DByInterval(
            function(m3ds) {
              if (m3ds && m3ds.length > 0) {
                if (
                  !m3ds[0] ||
                  !m3ds[0].hasOwnProperty("source") ||
                  !m3ds[0].source
                ) {
                  reject(null);
                } else {
                  resolve(m3ds[0]);
                }
              } else {
                reject(null);
              }
            },
            vueKey,
            model.vueIndex
          );
        } else {
          reject(null);
        }
      });
    },

    /**
     * 剖切方向，Cesium.Cartesian3中第一个参数是左右，第二个参数是前后，第三个参数是上下
     */
    clippingDirection() {
      switch (this.axis) {
        case "X":
          return new this.Cesium.Cartesian3(-1.0, 0.0, 0.0);
        case "Y":
          return new this.Cesium.Cartesian3(0.0, -1.0, 0.0);
        case "Z":
          return new this.Cesium.Cartesian3(0.0, 0.0, -1.0);
        default:
          return new this.Cesium.Cartesian3(-1.0, 0.0, 0.0);
      }
    },
    /**
     * 设置剖切距离
     */
    setDistance(value) {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.DynamicSectionAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { dynamicSectionAnalysis } = options;
      if (dynamicSectionAnalysis) {
        // 设置剖切面距离
        dynamicSectionAnalysis.distance = value;
      }
    },
    /**
     * 动画设置
     */
    animation() {
      this.m3dIsReady().then(() => {
        if (this.max == undefined || this.min == undefined) {
          return;
        }
        this.clearTimer();
        this.distance = this.min;
        const self = this;
        this.timer = window.setInterval(() => {
          if (self.readonly === false) {
            self.readonly = true;
          }
          const step = ((self.max - self.min) * 2) / (self.time * 10);
          self.distance += step;
          if (self.distance >= self.max) {
            self.distance = self.min;
          }
          self.setDistance(self.distance);
        }, 100);
      });
    },
    /**
     * 结束分析
     */
    stopClipping() {
      this.clearTimer();
      this.removeDynaCut();
    },

    /**
     * 开始分析分析
     */
    startClipping() {
      this.m3dIsReady().then(m3d => {
        this.clearTimer();
        this.removeDynaCut();
        let { CesiumZondy, vueKey, vueIndex } = this;
        let find = CesiumZondy.DynamicSectionAnalysisManager.findSource(
          vueKey,
          vueIndex
        );
        let { options } = find;
        let { dynamicSectionAnalysis } = options;
        const { viewer } = this.webGlobe;

        dynamicSectionAnalysis =
          dynamicSectionAnalysis ||
          new this.Cesium.CuttingTool(viewer, m3d.source);
        // 剖切方向
        const direction = this.clippingDirection();
        // 创建剖切对象实例
        dynamicSectionAnalysis.createModelCuttingPlane(direction, {
          distance: 0,
          color: this.edgeColor(),
          // 剖切辅助面的宽高缩放比(基于模型球的半径)
          scaleHeight: 2.0,
          scaleWidth: 2.0
        });
        CesiumZondy.DynamicSectionAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "dynamicSectionAnalysis",
          dynamicSectionAnalysis
        );
      });
    },
    /**
     * RGB/RGBA转Cesium内部颜色值
     * @param {string} color rgb/rgba颜色值
     */
    edgeColor() {
      const { color } = this;
      return makeColor(color);
    },
    /**
     * 移除动态剖切对象
     */
    removeDynaCut() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.DynamicSectionAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;
      let { dynamicSectionAnalysis } = options;
      if (dynamicSectionAnalysis) {
        dynamicSectionAnalysis.removeAll();
        dynamicSectionAnalysis = null;
        CesiumZondy.DynamicSectionAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "dynamicSectionAnalysis",
          dynamicSectionAnalysis
        );
      }
    },

    /**
     * 清除时间计时器
     */
    clearTimer() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
        this.readonly = false;
      }
    },

    /**
     * 获取M3DLayer对象
     * @returns M3DLayer对象
     */
    getM3D() {
      const { CesiumZondy, webGlobe } = this;
      const m3d = new CesiumZondy.Layer.M3DLayer({
        viewer: webGlobe.viewer
      });
      return m3d;
    },

    /**
     * 跳转到模型范围，视角不变。基于source
     * @param source
     */
    zoomToM3dLayerBySource(source) {
      const m3d = this.getM3D();
      m3d.zoomToM3dLayer(source);
    },

    /**
     * 获取剖切距离最大最小值
     */
    getMaxMin() {
      let max = 10000;
      let min = -max;
      if (!this.model) return;
      const { range } = this.model;
      switch (this.axis) {
        case "X":
          max = range.xmax;
          min = range.xmin;
          break;
        case "Y":
          max = range.ymax;
          min = range.ymin;
          break;
        case "Z":
          max = range.zmax;
          min = range.zmin;
          break;
        default:
          break;
      }
      this.max = max;
      this.min = min;
      this.distance = (min + max) / 2;
    }
  }
};
</script>
<style scoped>
.dynamic-section-container {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
