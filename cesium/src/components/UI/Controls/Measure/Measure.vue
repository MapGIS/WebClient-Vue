<template>
  <div class="mapgis-3d-measure">
    <slot v-if="initial"></slot>
    <slot name="measureTool">
      <measure-3d-tool :result="result" :measureConfig="measureConfig" />
    </slot>
  </div>
</template>

<style></style>

<script>
import ServiceLayer from "../ServiceLayer";
import Measure3dTool from "./components/MeasureTool.vue";

export default {
  name: "mapgis-3d-measure",
  mixins: [ServiceLayer],
  components: {
    "measure-3d-tool": Measure3dTool
  },
  props: {
    styles: {
      type: Object,
      default() {
        return {
          lineColor: "#1890ff",
          fillColor: "#1890ff"
        };
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    // 管理平台配置的绘制图形样式
    featureConfig: {
      type: Object,
      defalut: () => {}
    }
  },
  data() {
    return {
      // 测量结果
      result: undefined,
      // 测量对象
      // measure: undefined,
      initial: false,
      measureStyles: {},
      waitManagerName: "GlobesManager",
      measureConfig: {}
    };
  },
  watch: {
    styles: {
      handler: function() {
        this.initStyles(this.styles);
      },
      deep: true
    },
    measureOptions: {
      handler: function() {
        this.measureOptions = this.$_formatOptions(this.measureOptions);
      },
      deep: true
    },
    featureConfig: {
      handler(val) {
        if (val) {
          this.measureConfig.lineColor = val?.feature?.line?.color || "#1890ff";
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    let vm = this;
    this.$_init(function() {
      vm.initStyles(vm.styles);
      vm.initial = true;
      vm.$emit("load", vm);
    });
  },
  destroyed() {
    this.deleteMeasure();
    this.$emit("unload");
  },
  methods: {
    onChange(e) {
      // 获取等高线开关
      this.changeContour = e.target.checked;
    },
    // 获取量算模式
    // handleChange(value) {
    //   if (value === "WGS84") {
    //     this.isShow = true;
    //   }
    // },
    initStyles(style) {
      this.measureStyles.lineColor = Cesium.Color.fromCssColorString(
        style.lineColor
      );
    },
    measureCallBack(result) {
      var resultData = null;
      if (result instanceof Array) {
        // 长度计算和贴地距离的结果都是数组，
        // cesium内核中长度计算，每个节点的值是整个长度值，不是每一段的长度值，这里不需要叠加
        resultData = result[result.length - 1];
      } else {
        resultData = result;
      }
      this.result = resultData;
      this.$emit("measured", result);
    },
    enableMeasureLength() {
      this.$_enableMeasure("MeasureLengthTool");
    },
    enableMeasureArea() {
      this.$_enableMeasure("MeasureAreaTool");
    },
    enableMeasureTriangle() {
      this.$_enableMeasure("TriangulationTool");
    },
    enableMeasureSlope() {
      this.$_enableMeasure("MeasureSlopeTool");
    },
    async $_enableMeasure(MeasureName, MeasureType) {
      const lineConfig = this.featureConfig?.feature?.line || {
        color: "rgba(255,0,0,1)",
        size: "3"
      };
      const labelConfig = this.featureConfig?.label?.text || {
        color: "rgba(255,0,102,1)",
        fontSize: "14",
        fontFamily: "华文行楷"
      };
      const areaConfig = this.featureConfig?.feature?.reg || {
        color: "rgba(255,255,0,0.5)"
      };
      if (this.measureConfig.lineColor) {
        this.measureStyles.lineColor = Cesium.Color.fromCssColorString(
          this.measureConfig.lineColor
        );
      }

      // 对应量算工具的参数设置对象
      let MeasureObject = {};
      if (lineConfig && lineConfig.size && this.measureConfig.lineColor) {
        const lineStyle = {
          width: Number(lineConfig.size),
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.15,
            color: Cesium.Color.fromCssColorString(this.measureConfig.lineColor)
          }),
          depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.15,
            color: Cesium.Color.fromCssColorString(this.measureConfig.lineColor)
          })
        };
        MeasureObject.lineStyle = lineStyle;
      }

      if (labelConfig) {
        if (labelConfig.color) {
          MeasureObject.fillColor = Cesium.Color.fromCssColorString(
            labelConfig.color
          );
        }
        if (labelConfig.fontSize && labelConfig.fontFamily) {
          MeasureObject.font = `${labelConfig.fontSize}px ${labelConfig.fontFamily}`;
        }
      }
      if (MeasureName === "MeasureLengthTool") {
        MeasureObject.paneNum = 256;
      } else if (MeasureName === "MeasureAreaTool") {
        (MeasureObject.xPaneNum = 64), (MeasureObject.yPaneNum = 64);
        if (areaConfig && areaConfig.color) {
          MeasureObject.areaColor = Cesium.Color.fromCssColorString(
            areaConfig.color
          );
        }
      }
      const { vueKey, vueIndex } = this;
      let viewer = this.$_getObject(this.waitManagerName, this.deleteMeasure);
      this.viewer = viewer;
      // 地形测量参数对象
      let measureObject = {
        lineColor: this.measureStyles.lineColor,
        callBack: async result => {
          if (!result) {
            result = await this.waitAreaResult();
            console.log(result);
          }
          if (typeof callback === "function") {
            callback(result);
          } else {
            this.measureCallBack(result);
          }
        },
        // 地形开启贴地量算：true
        isTerrain: MeasureType === "tostick" ? true : false
      };
      // 添加量算工具的参数设置到cesium测量对象当中
      for (let element of Object.keys(MeasureObject)) {
        measureObject[element] = MeasureObject[element];
      }
      measureObject = Object.assign(measureObject, this.options);
      // 贴底线面接口一致
      if (MeasureName === "MeasureStickLengthTool") {
        MeasureName = "MeasureLengthTool";
      } else if (MeasureName === "MeasureStickAreaTool") {
        MeasureName = "MeasureAreaTool";
      }
      let measure = new Cesium[MeasureName](viewer, measureObject);
      this.measure = measure;
      window.vueCesium.MeasureToolManager.addSource(vueKey, vueIndex, measure);
      measure.startTool();
    },
    deleteMeasure() {
      this.$_deleteManger("MeasureToolManager", function(manager) {
        if (manager.source) {
          manager.source.stopTool();
        }
      });
    },
    // 获取贴地面结果
    async waitAreaResult() {
      return new Promise(resolve => {
        setTimeout(() => {
          const result = this.measure._area;
          resolve(result);
        }, 100);
      });
    },
    remove() {
      this.deleteMeasure();
    },
    resizeStyles() {
      this.measureConfig.lineColor =
        this.featureConfig?.feature?.line?.color || "#1890ff";
    }
  }
};
</script>
