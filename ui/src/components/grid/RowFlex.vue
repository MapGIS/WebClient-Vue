<template>
  <mapgis-ui-row
    type="flex"
    :align="align"
    :justify="justify"
    :gutter="gutter"
    :class="rowFlexCls"
  >
    <mapgis-ui-col
      :span="labelSpan"
      :title="label"
      :style="labelStyle"
      :class="`${prefixCls}-col-left`"
    >
      <slot name="label" v-if="$slots.label || label">
        {{ label }}{{ isColon }}</slot
      >
    </mapgis-ui-col>
    <mapgis-ui-col :span="contentSpan" :style="contentStyle">
      <slot />
    </mapgis-ui-col>
  </mapgis-ui-row>
</template>

<script>
import { CommonUtil } from "../../util/common";

export default {
  name: "mapgis-ui-row-flex",
  props: {
    /**
     * 排列方向，"horizontal", "vertical", 默认'horizontal'
     */
    type: {
      type: String,
      default: "horizontal",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["horizontal", "vertical"]);
      }
    },
    /**
     * align 靠拢方向，"top", "middle", "bottom", 默认'middle'
     */
    align: {
      type: String,
      default: "middle",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["top", "middle", "bottom"]);
      }
    },
    /**
     * justify 对齐方向，"start", "end", "center", "space-between", "space-around", 默认'start'
     */
    justify: {
      type: String,
      default: "start",
      validator: function(value) {
        return CommonUtil.oneOf(value, [
          "start",
          "end",
          "center",
          "space-between",
          "space-around"
        ]);
      }
    },
    /**
     * 间隔， 默认0
     */
    gutter: {
      type: [Array, Number],
      default: 0
    },
    /**
     * 文本 和 内容的比例分割， 默认[5, 19]
     */
    span: {
      type: Array,
      default: () => [5, 19]
    },
    /**
     * 是否显示冒号， 默认`true`
     */
    colon: {
      type: Boolean,
      default: true
    },
    /**
     * 标题
     */
    label: {
      type: String
    },
    /**
     * 标题宽度，如果激活了该宽度，则 type = 'vertical'时无效
     */
    labelWidth: {
      type: Number
    },
    /**
     * 标题对齐方向， "left", "center", "right", 默认'left'
     */
    labelAlign: {
      type: String,
      default: "left",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["left", "center", "right"]);
      }
    },
    /**
     * 内容对齐方向， "left", "center", "right", 默认'left'
     */
    contentAlign: {
      type: String,
      default: "left",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["left", "center", "right"]);
      }
    }
  },
  data() {
    const prefixCls = "mapgis-ui-row-flex";
    return {
      prefixCls
    };
  },
  computed: {
    rowFlexCls({ prefixCls, type }) {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${type}`]: !!type
        }
      ];
    },
    isVertical({ type }) {
      return type === "vertical";
    },
    isColon({ isVertical, colon }) {
      return (isVertical ? false : colon) ? "：" : "";
    },
    labelSpan({ isVertical, span }) {
      return isVertical ? 24 : span[0];
    },
    contentSpan({ isVertical, span }) {
      return isVertical ? 24 : span[1];
    },
    labelStyle({ labelWidth, labelSpan, labelAlign }) {
      let style = {
        textAlign: labelAlign
      };
      if (labelWidth) {
        style = {
          ...style,
          width: `${labelWidth}px`
        };
      }
      return style;
    },
    contentStyle({ labelWidth, contentAlign }) {
      let style = {
        textAlign: contentAlign
      };
      if (labelWidth) {
        style = {
          ...style,
          flex: 1
        };
      }
      return style;
    }
  }
};
</script>
