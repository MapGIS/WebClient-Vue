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
      deep: true
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
    }
  }
};
</script>
<style lang="less" scoped></style>
