<template>
  <div class="mapgis-3d-measure">
    <slot v-if="initial"> </slot>
    <slot name="measureTool">
      <measure-3d-tool />
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
      deafult: function() {
        return {
          lineColor: "#1890ff"
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
    const vm = this;
    this.$_init(function() {
      vm.initStyles.call(vm);
      vm.initial = true;
      vm.$emit("load", vm);
    });
  },
  destroyed() {
    this.remove();
    this.$emit("unload");
  },
  methods: {
    initStyles(nStyle = this.styles, oStyle = this.measureStyles) {
      this.measureStyles = {
        ...this.measureStyles,
        lineColor: this.Cesium.Color.fromCssColorString(
          nStyle.lineColor,
          oStyle.lineColor
        )
      };
    },
    measureCallBack(result) {
      if (result instanceof Array) {
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i] / 1000;
        }
      }
      this.$emit("measured", result);
    },
    $_enableMeasure(MeasureName, callback) {
      const { vueKey, vueIndex } = this;
      const webGlobe = this.$_getObject(
        this.waitManagerName,
        this.deleteMeasure
      );
      const measure = new this.Cesium[MeasureName](webGlobe.viewer, {
        lineColor: this.measureStyles.lineColor,
        callBack: result => {
          if (typeof callback === "function") {
            callback(result);
          } else {
            this.measureCallBack(result);
          }
        }
      });
      this.CesiumZondy.MeasureToolManager.addSource(vueKey, vueIndex, measure);
      measure.startTool();
    },
    deleteMeasure() {
      this.$_deleteManger("MeasureToolManager", function(manager) {
        if (manager.source) {
          manager.source.stopTool();
        }
      });
    },
    remove() {
      this.deleteMeasure();
    }
  }
};
</script>
