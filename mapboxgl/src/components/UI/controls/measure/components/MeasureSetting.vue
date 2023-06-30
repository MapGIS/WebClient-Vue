<template>
  <div class="measure-setting">
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
      <mapgis-ui-form-item label="线样式">
        <mapgis-ui-select
          v-model="measureStyle.lineType"
          :options="lineOptions"
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
import dep from "../store/dep";
import {
  defaultStyle,
  measureModeMap,
  lineTypeMap,
  paintTypeMap
} from "../store/enums";

export default {
  name: "measure-setting",
  props: {
    mode: {
      type: String,
      default: measureModeMap.line
    },
    // 管理平台配置的绘制图形样式
    featureConfig: {
      type: Object,
      defalut: () => {}
    }
  },
  data: vm => ({
    measureStyle: {
      ...dep.getStyles()
    },
    lineOptions: Object.values(lineTypeMap).map(v => ({ label: v, value: v })),
    textOptions: [
      {
        label: "宋体",
        value: "宋体"
      },
      {
        label: "楷体",
        value: "楷体"
      },
      {
        label: "微软雅黑",
        value: "微软雅黑"
      },
      {
        label: "华文行楷",
        value: "华文行楷"
      },
      {
        label: "黑体",
        value: "黑体"
      },
      {
        label: "新宋体",
        value: "新宋体"
      }
    ]
  }),
  computed: {
    isAreaMode({ mode }) {
      return mode === measureModeMap.polygon;
    }
  },
  watch: {
    measureStyle: {
      handler(obj) {
        this.notifyUpdate(obj);
      },
      deep: true,
      immediate: true
    },
    featureConfig: {
      handler(val) {
        val && this.setDrawConfigGraph();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 将设置的样式整合为测量需要的样式
     */
    integrateStyles({
      lineType,
      lineColor,
      lineOpacity,
      lineWidth,
      fillColor,
      fillOpacity
    }) {
      return defaultStyle.map(({ type, ...others }) => {
        let paint;
        switch (type) {
          case paintTypeMap.line:
            paint = {
              "line-color": lineColor,
              "line-width": lineWidth,
              "line-opacity": lineOpacity
            };
            if (lineType === lineTypeMap.dashed) {
              paint = {
                ...paint,
                "line-dasharray": [0.2, 2]
              };
            }
            break;
          case paintTypeMap.circle:
            paint = {
              "circle-color": lineColor,
              "circle-opacity": lineOpacity
            };
            break;
          case paintTypeMap.fill:
            paint = {
              "fill-color": fillColor,
              "fill-opacity": fillOpacity
            };
            break;
          default:
            break;
        }
        return {
          ...others,
          type,
          paint
        };
      });
    },
    /**
     * 样式变化通知更新地图和marker组件
     */
    notifyUpdate(obj) {
      this.$emit("measure-style-change", this.integrateStyles(obj));
      dep.setStyles(obj);
      dep.notify();
    },
    /**
     * 重置样式
     */
    onReset() {
      this.measureStyle = dep.resetStyles();
    },
    /**
     * 颜色选择变化
     */
    onColorChange({ hex }, type) {
      this.$set(this.measureStyle, type, hex);
    },
    /**
     * 初始化配置管理平台配置颜色
     */
    setDrawConfigGraph() {
      const labelConfig = this.featureConfig.label;
      const featureConfig = this.featureConfig.feature;

      const textConfig = labelConfig?.text;
      if (textConfig) {
        this.measureStyle.textColor =
          textConfig.color || this.measureStyle.textColor;
        this.measureStyle.textSize =
          Number(textConfig.fontSize) || this.measureStyle.textSize;
        this.measureStyle.textType =
          textConfig.fontFamily || this.measureStyle.textType;
      }

      const lineConfig = featureConfig?.line;
      if (lineConfig) {
        this.measureStyle.lineColor =
          lineConfig.color || this.measureStyle.lineColor;
        this.measureStyle.lineWidth =
          Number(lineConfig.size) || this.measureStyle.lineWidth;
      }

      const fillConfig = featureConfig?.reg;
      if (fillConfig) {
        this.measureStyle.fillColor =
          fillConfig.color || this.measureStyle.fillColor;
      }
      this.$emit(
        "measure-style-change",
        this.integrateStyles(this.measureStyle)
      );
      dep.setInitConfig(this.measureStyle);
      dep.setStyles(this.measureStyle);
      dep.notify();
    }
  }
};
</script>
<style scoped>
.measure-setting {
  padding: 0 10px;
}
</style>
