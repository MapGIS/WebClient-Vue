<template>
  <div class="measure-3d-setting">
    <mapgis-ui-group-tab title="设置">
      <mapgis-ui-toolbar-command
        slot="handle"
        title="重置"
        icon="mapgis-redo"
        @click="onReset"
      />
    </mapgis-ui-group-tab>
    <mapgis-ui-setting-form layout="vertical">
      <mapgis-ui-form-item label="字体名称">
        <mapgis-ui-select
          v-model="measureStyle.textType"
          :options="textOptions"
          :auto-width="true"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="字体颜色">
        <mapgis-ui-sketch-color-picker
          @input="onColorChange($event, 'textColor')"
          :color="measureStyle.textColor"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="字体大小">
        <mapgis-ui-input-number
          v-model="measureStyle.textSize"
          :min="12"
          :auto-width="true"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="线颜色">
        <mapgis-ui-sketch-color-picker
          @input="onColorChange($event, 'lineColor')"
          :color="measureStyle.lineColor"
          :disable-alpha="false"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="线宽度">
        <mapgis-ui-input-number
          v-model="measureStyle.lineWidth"
          :min="1"
          :auto-width="true"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item v-show="isAreaMode" label="填充颜色">
        <mapgis-ui-sketch-color-picker
          @input="onColorChange($event, 'fillColor')"
          :color="measureStyle.fillColor"
          :disable-alpha="false"
        />
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
  </div>
</template>
<script>
import { measureModeMap } from "./MeasureResult.vue";

const initStyle = {
  lineColor: "#1890ff"
};

export default {
  name: "measure-3d-setting",
  props: {
    mode: {
      type: String,
      default: measureModeMap.line,
    },
    measureConfig: {
      type: Object,
      defualt: () => {}
    }
  },
  data: vm => ({
    // measureStyle: { ...initStyle }
    textOptions: [
      {
        label: "宋体",
        value: "宋体",
      },
      {
        label: "楷体",
        value: "楷体",
      },
      {
        label: "微软雅黑",
        value: "微软雅黑",
      },
      {
        label: "华文行楷",
        value: "华文行楷",
      },
      {
        label: "黑体",
        value: "黑体",
      },
      {
        label: "新宋体",
        value: "新宋体",
      },
    ],
  }),
  // watch: {
  //   measureStyle: {
  //     handler(nStyle) {
  //       this.emitStyle(nStyle);
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    measureStyle: {
      get() {
        return this.measureConfig;
      },
      set(nStyle) {
        this.$emit("measure-style-change", nStyle);
      }
    },
    isAreaMode() {
      return this.mode === measureModeMap.MeasureStickAreaTool || this.mode === measureModeMap.MeasureAreaTool;
    },
  },
  methods: {
    /**
     * 抛出事件
     */
    emitStyle(nStyle) {
      this.$emit("measure-style-change", nStyle);
    },
    /**
     * 重置样式
     */
    onReset() {
      this.$emit("measure-style-resize");
      // this.measureStyle = { ...initStyle };
    },
    /**
     * 颜色选择变化
     */
    onColorChange({ hex }, type) {
      // this.$set(this.measureStyle, type, hex);
      const measureStyle = JSON.parse(JSON.stringify(this.measureStyle));
      measureStyle[type] = hex;
      this.measureStyle = measureStyle;
    }
  }
};
</script>
<style lang="less" scoped></style>
