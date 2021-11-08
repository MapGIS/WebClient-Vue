<template>
  <mapgis-ui-dropdown :visible="visible" :trigger="['click']" :class="colorPickerDropdown">
    <slot>
      <span
        @click.prevent="showPicker"
        :title="color"
        :style="colorPickerBtnStyle"
        :class="colorPickerBtnCls"
        >{{ color }}</span
      >
    </slot>
    <div :class="`${prefixCls}-content`" slot="overlay">
      <chrome-picker v-if="isChrome" @input="colorChange" :value="color" />
      <sketch-picker v-else @input="colorChange" :value="color" />
      <div :class="`${prefixCls}-content-btns`">
        <mapgis-ui-button size="small" @click="cancel">取消</mapgis-ui-button>
        <mapgis-ui-button type="primary" size="small" @click="confirm"
          >确定</mapgis-ui-button
        >
      </div>
    </div>
  </mapgis-ui-dropdown>
</template>
<script>
import { ColorUtil, CommonUtil } from "../../util/common";
import { Sketch, Chrome } from "vue-color";

export default {
  name: "mapgis-ui-sketch-color-picker-confirm",
  components: {
    SketchPicker: Sketch,
    ChromePicker: Chrome
  },
  props: {
    type: {
      type: String,
      default: "chrome",
      validator(v) {
        return CommonUtil.oneOf(v, ["sketch", "chrome"]);
      }
    },
    colorType: {
      type: String,
      default: "rgb",
      validator(v) {
        return CommonUtil.oneOf(v, ["hex", "rgb", "rgba"]);
      }
    },
    size: {
      type: String,
      validator(v) {
        return CommonUtil.oneOf(v, ["large", "small"]);
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    borderRadius: {
      type: Boolean,
      default: true
    },
    defaultValue: {
      type: String,
      default: "rgb(24, 144, 255)",
      validator: v =>
        ColorUtil.isHex(v) || ColorUtil.isRgb(v) || ColorUtil.isRgba(v)
    },
    value: {
      type: String,
      validator: v =>
        !v || ColorUtil.isHex(v) || ColorUtil.isRgb(v) || ColorUtil.isRgba(v)
    },
    autoWidth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const prefixCls = "mapgis-ui-sketch-color-picker-confirm";
    return {
      prefixCls,
      color: "",
      visible: false
    };
  },
  computed: {
    isChrome({ type }) {
      return type === "chrome";
    },
    colorPickerBtnCls({ prefixCls, size, border, borderRadius, disabled }) {
      return [
        `${prefixCls}-btn`,
        {
          [`${prefixCls}-${size}`]: !!size,
          [`${prefixCls}-bordered`]: !!border,
          [`${prefixCls}-border-radius`]: !!borderRadius,
          [`${prefixCls}-disabled`]: !!disabled
        }
      ];
    },
    colorPickerBtnStyle({ defaultValue, value = defaultValue, border }) {
      return {
        background: value,
        borderColor: border ? value : "transparent"
      };
    },
    colorPickerDropdown() {
      return this.autoWidth
        ? 'mapgis-ui-sketch-color-picker-auto-width'
        : '';
    },
  },
  watch: {
    value(nV) {
      this.color = nV;
    }
  },
  methods: {
    resolveDefaultValue() {
      switch (this.colorType) {
        case "hex":
          return "rgb(24, 144, 255)";
        case "rgba":
          return "rgb(24, 144, 255, 1)";
        default:
          return "#1890ff";
      }
    },
    /**
     * 展示颜色选择器
     */
    showPicker() {
      this.visible = !this.disabled;
    },
    /**
     * 隐藏颜色选择器
     */
    hidePicker() {
      this.visible = false;
    },
    /**
     * 颜色选择变化
     */
    colorChange({ rgba: { r, g, b, a }, hex }) {
      let _color = hex;
      switch (this.colorType) {
        case "rgb":
          _color = `rgb(${r}, ${g}, ${b})`;
          break;
        case "rgba":
          _color = `rgba(${r}, ${g}, ${b}, ${a})`;
          break;
        default:
          break;
      }
      this.color = _color;
    },
    /**
     * 往上更新
     */
    dispatchColor() {
      this.$emit("input", this.color);
      this.$emit("change", this.color);
    },
    /**
     * 取消
     */
    cancel() {
      this.color = this.value || this.defaultValue;
      this.hidePicker();
    },
    /**
     * 确认
     */
    confirm() {
      this.dispatchColor();
      this.visible = false;
    }
  },
  created() {
    this.resolveDefaultValue();
    if (this.value) {
      this.color = this.value;
    } else {
      this.color = this.defaultValue;
      this.$emit("input", this.color);
    }
  }
};
</script>
