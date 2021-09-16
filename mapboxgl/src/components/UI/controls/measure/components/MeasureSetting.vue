<template>
  <div class="measure-setting">
    <mapgis-ui-group-tab title="设置">
      <mapgis-ui-toolbar-command
        slot="handle"
        title="重置"
        icon="redo"
        @click="onReset"
      />
    </mapgis-ui-group-tab>
    <mapgis-ui-row-flex type="vertical" label="字体名称">
      <mapgis-ui-select
        v-model="measureStyle.textType"
        :options="textOptions"
        :auto-width="true"
      />
    </mapgis-ui-row-flex>
    <mapgis-ui-row-flex type="vertical" label="字体颜色">
      <mapgis-ui-sketch-color-picker-confirm v-model="measureStyle.textColor" />
    </mapgis-ui-row-flex>
    <mapgis-ui-row-flex type="vertical" label="字体大小">
      <mapgis-ui-input-number :min="12" v-model="measureStyle.textSize" />
    </mapgis-ui-row-flex>
    <mapgis-ui-row-flex type="vertical" label="线样式">
      <mapgis-ui-select
        v-model="measureStyle.lineType"
        :options="lineOptions"
        :auto-width="true"
      />
    </mapgis-ui-row-flex>
    <mapgis-ui-row-flex type="vertical" label="线颜色">
      <mapgis-ui-sketch-color-picker-confirm v-model="measureStyle.lineColor" />
    </mapgis-ui-row-flex>
    <mapgis-ui-row-flex type="vertical" label="线宽度">
      <mapgis-ui-input-number
        :auto-width="true"
        :min="1"
        v-model="measureStyle.lineWidth"
      />
    </mapgis-ui-row-flex>
    <mapgis-ui-row-flex v-show="isAreaMode" type="vertical" label="填充颜色">
      <mapgis-ui-sketch-color-picker-confirm
        v-model="measureStyle.fillColor"
        color-type="rgba"
      />
    </mapgis-ui-row-flex>
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
    }
  },
  data: vm => ({
    measureStyle: dep.getStyles(),
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
      }
    ]
  }),
  computed: {
    isAreaMode({ mode }) {
      return mode === measureModeMap.polygon;
    }
  },
  watch: {
    measureStyle(obj) {
      debugger;
      this.notifyUpdate(obj);
    },
    deep: true
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
      return defaultStyle.map(style => {
        let paint;
        switch (style.type) {
          case paintTypeMap.line:
            paint = {
              "line-color": lineColor,
              "line-width": lineWidth,
              "line-opacity": lineOpacity,
              "line-dasharray":
                lineType === lineTypeMap.dashed ? [0.2, 2] : undefined
            };
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
          ...style,
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
    onColorChange(value, type) {
      this.$set(this.measureStyle, type, value);
    }
  }
};
</script>
<style lang="less" scoped></style>
