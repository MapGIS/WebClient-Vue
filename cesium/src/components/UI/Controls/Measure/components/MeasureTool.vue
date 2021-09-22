<template>
  <div :class="prefixCls">
    <!-- 测量控制按钮 -->
    <mapgis-ui-toolbar :class="`${prefixCls}-toolbar`">
      <!-- 面积或长度设置按钮 -->
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          v-for="{ title, mode, icon } in modes"
          :key="title"
          :title="title"
          :icon="icon"
          :active="activeMode === mode"
          @click="startMeasure(mode)"
        />
      </mapgis-ui-toolbar-command-group>
      <mapgis-ui-toolbar-space />
      <!-- 清除或设置 -->
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          title="清除"
          icon="mapgis-shanchu_dianji"
          @click="clearMeasure"
        />
        <mapgis-ui-toolbar-command
          @click="showSettingPanel = !showSettingPanel"
          :active="showSettingPanel"
          title="设置"
          icon="mapgis-setting"
        />
      </mapgis-ui-toolbar-command-group>
    </mapgis-ui-toolbar>
    <!-- 测量结果 -->
    <measure-3d-result :mode="activeMode" :result="measureResult" />
    <!-- 测量样式设置 -->
    <measure-3d-setting
      v-if="showSettingPanel"
      @measure-style-change="measureStyleChange"
    />
  </div>
</template>
<script>
import { last } from "../../../../Utils/util";
import Measure3dResult, { measureModeMap } from "./MeasureResult.vue";
import Measure3dSetting from "./MeasureSetting.vue";

//  todo 暂不支持样式的实时更改
export default {
  name: "measure-3d-tool",
  inject: ["webGlobe"],
  components: {
    "measure-3d-result": Measure3dResult,
    "measure-3d-setting": Measure3dSetting
  },
  props: {
    result: {
      type: Object
    }
  },
  data: vm => ({
    prefixCls: "measure-3d-tool",
    showSettingPanel: false,
    measureResult: null,
    activeMode: "",
    // todo 替换ICON
    modes: [
      {
        mode: measureModeMap.MeasureLengthTool,
        title: "长度",
        icon: "mapgis-huizhixian1"
      },
      {
        mode: measureModeMap.MeasureAreaTool,
        title: "面积",
        icon: "mapgis-area"
      },
      {
        mode: measureModeMap.TriangulationTool,
        title: "三角",
        icon: "mapgis-sanjiaoceliang"
      }
    ]
  }),
  methods: {
    /**
     * 保留2位小数
     */
    precision(n, p = 2) {
      return n.toFixed(p);
    },
    /**
     * 设置测量结果
     * @param {*} result
     */
    setMeasureResult(result) {
      let _measureResult;
      switch (this.activeMode) {
        case measureModeMap.MeasureLengthTool:
          _measureResult = {
            cesiumLength: this.precision(last(result) / 1000)
          };
          break;
        case measureModeMap.MeasureAreaTool:
          _measureResult = {
            cesiumArea: this.precision(result / Math.pow(1000, 2))
          };
          break;
        case measureModeMap.TriangulationTool:
          _measureResult = {
            horizontalDiatance: this.precision(result.horizontalDiatance),
            verticalDiatance: this.precision(result.verticalDiatance)
          };
          break;
        default:
          break;
      }
      this.measureResult = _measureResult;
    },
    /**
     * 开始测量
     */
    startMeasure(mode) {
      this.activeMode = mode;
      this.clearMeasure();
      this.enableMeasure(mode);
    },
    /**
     *  关闭测量工具
     */
    clearMeasure() {
      this.activeMode = "";
      this.measureResult = null;
      this.$parent.remove();
    },
    /**
     * 开始测量
     */
    enableMeasure(mode) {
      this.$parent.$_enableMeasure(mode, this.setMeasureResult);
    },
    /**
     * 测量样式变化
     */
    measureStyleChange(style) {
      this.$parent.initStyles(style);
    }
  }
};
</script>
<style lang="scss" scoped>
.measure-3d-tool {
  &-toolbar {
    justify-content: space-between;
  }
}
</style>
