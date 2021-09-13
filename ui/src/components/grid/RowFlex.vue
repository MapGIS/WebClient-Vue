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
  name: "mapgis-ui--row-flex",
  props: {
    type: {
      type: String,
      default: "horizontal",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["horizontal", "vertical"]);
      }
    },
    align: {
      type: String,
      default: "middle",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["top", "middle", "bottom"]);
      }
    },
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
    gutter: {
      type: [Array, Number],
      default: 0
    },
    span: {
      type: Array,
      default: () => [5, 19]
    },
    colon: {
      type: Boolean,
      default: true
    },
    label: {
      type: String
    },
    labelWidth: {
      type: Number
    },
    labelAlign: {
      type: String,
      default: "left",
      validator: function(value) {
        return CommonUtil.oneOf(value, ["left", "center", "right"]);
      }
    },
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
