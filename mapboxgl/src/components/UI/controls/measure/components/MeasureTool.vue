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
        v-model="unit"
        :options="unitOptions"
        :class="`${prefixCls}-unit`"
        size="small"
        placeholder="单位选择"
      />
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
    <!-- 自定义内容区域 -->
    <measure-result :mode="activeMode" :result="result" :unit="unit" />
    <!-- 设置面板 -->
    <measure-setting
      v-if="showSettingPanel"
      @measure-style-change="measureStyleChange"
      :mode="activeMode"
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
    // todo 替换ICON
    modes: [
      {
        mode: measureModeMap.line,
        title: "长度",
        icon: "mapgis-huizhixian1"
      },
      {
        mode: measureModeMap.polygon,
        title: "面积",
        icon: "mapgis-area"
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
      this.$parent.enableMeasure();
      this.$parent.changeMode(this.activeMode);
    },
    clearMeasure() {
      this.$parent.remove();
    },
    measureStyleChange(style) {
      this.$parent.$_changeMapStyle(style);
      this.changeMapStyle;
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
