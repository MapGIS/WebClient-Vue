<template>
  <div>
    <slot v-if="initial"></slot>
  </div>
</template>

<style></style>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-measure",
  mixins: [ServiceLayer],
  props: {
    styles: {
      type: Object,
      default() {
        return {
          lineColor: "black"
        };
      }
    }
  },
  data() {
    return {
      measure: undefined,
      initial: false,
      measureStyles: {},
      waitManagerName: "GlobesManager"
    };
  },
  watch: {
    styles: {
      handler: function() {
        this.initStyles();
      },
      deep: true
    }
  },
  mounted() {
    let vm = this;
    this.$_init(function() {
      vm.initStyles();
      vm.initial = true;
      vm.$emit("load", vm);
    });
  },
  destroyed() {
    this.deleteMeasure();
    this.$emit("unload");
  },
  methods: {
    initStyles() {
      this.measureStyles.lineColor = Cesium.Color.fromCssColorString(
        this.styles.lineColor,
        this.measureStyles.lineColor
      );
    },
    measureCallBack(result) {
      if (result instanceof Array) {
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i] / 1000;
        }
      }
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
    $_enableMeasure(MeasureName) {
      const { vueKey, vueIndex } = this;
      let webGlobe = this.$_getObject(this.waitManagerName, this.deleteMeasure);
      let measure = new Cesium[MeasureName](webGlobe.viewer, {
        lineColor: this.measureStyles.lineColor,
        callBack: this.measureCallBack
      });
      window.CesiumZondy.MeasureToolManager.addSource(
        vueKey,
        vueIndex,
        measure
      );
      measure.startTool();
    },
    deleteMeasure() {
      this.$_deleteManger("MeasureToolManager", function(manager) {
        if (manager.source) {
          manager.source.stopTool();
        }
      });
    }
  }
};
</script>
