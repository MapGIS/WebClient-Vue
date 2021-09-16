<template>
  <div :class="prefixCls">
    <!-- 测量控制按钮 -->
    <mapgis-ui-toolbar>
      <!-- 面积或长度设置按钮 -->
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          v-for="{ title, mode, icon } in modes"
          :key="title"
          :title="title"
          :icon="icon"
          :active="activeMode === mode"
          @click="beforeMeasure(mode)"
        />
      </mapgis-ui-toolbar-command-group>
      <mapgis-ui-toolbar-space />
      <!-- 面积或长度单位选择 -->
      <mapgis-ui-select
        size="small"
        v-model="unit"
        :options="unitOptions"
        :class="`${prefixCls}-unit`"
      />
      <mapgis-ui-toolbar-space />
      <!-- 清除或设置 -->
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          title="清除"
          icon="delete"
          @click="clearMeasure"
        />
        <mapgis-ui-toolbar-command
          title="设置"
          icon="setting"
          :active="showSettingPanel"
          @click="showSettingPanel = !showSettingPanel"
        />
      </mapgis-ui-toolbar-command-group>
    </mapgis-ui-toolbar>
    <!-- 自定义内容区域 -->
    <measure-result :mode="activeMode" :result="result" :unit="unit" />
    <!-- 设置面板 -->
    <measure-setting
      v-if="showSettingPanel"
      @measure-style-change="measureStyleChange"
    />
  </div>
</template>
<script>
import { measureModeMap } from "../store/enums";
import MeasureSetting from "./MeasureSetting.vue";
import MeasureResult from "./MeasureResult.vue";

export default {
  name: "measure-tool",
  components: {
    MeasureResult,
    MeasureSetting
  },
  props: {
    result: {
      type: Object
    }
  },
  data: vm => ({
    prefixCls: "measure-tool",
    showSettingPanel: false,
    activeMode: "",
    modes: [
      {
        mode: measureModeMap.line,
        title: "长度",
        icon: "line-chart"
      },
      {
        mode: measureModeMap.polygon,
        title: "面积",
        icon: "area-chart"
      }
    ],
    unit: "",
    unitOptions: [],
    unitMap: {
      [measureModeMap.line]: [
        {
          label: "m",
          value: "m"
        },
        {
          label: "km",
          value: "km"
        },
        {
          label: "米",
          value: "米"
        },
        {
          label: "千米",
          value: "千米"
        }
      ],
      [measureModeMap.polygon]: [
        {
          label: "m²",
          value: "m²"
        },
        {
          label: "km²",
          value: "km²"
        },
        {
          label: "平方米",
          value: "平方米"
        },
        {
          label: "平方千米",
          value: "平方千米"
        }
      ]
    }
  }),
  methods: {
    beforeMeasure(mode) {
      this.activeMode = mode;
      this.unitOptions = this.unitMap[mode];
      this.unit = this.unitOptions[0].value;
      this.measure();
    },
    measure() {
      this.$parent.changeMode(this.activeMode);
      this.$parent.enableMeasure();
    },
    clearMeasure() {
      this.$parent.clear();
    },
    measureStyleChange(style) {
      this.$parent.combineStyle(style);
    }
  }
};
</script>
<style lang="scss" scoped>
.measure-tool {
  &-unit {
    width: 120px;
  }
}
</style>
