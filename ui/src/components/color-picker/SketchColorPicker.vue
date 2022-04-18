<template>
  <div
    :style="{ ...colorStyle }"
    class="mapgis-ui-sketch-color-picker"
    :class="{
      colorContainerLarge: size === 'large',
      colorContainerSmall: size === 'small'
    }"
  >
    <mapgis-ui-popover trigger="click">
      <template slot="content">
        <sketch-picker
          class="sketch-color"
          :disableAlpha="disableAlpha"
          :value="pickColor"
          @input="onColorChange"
        />
      </template>
      <mapgis-ui-row class="color-row">
        <span
          v-if="hasAddonBefore"
          class="mapgis-ui-input-group-addon addon-before"
        >
          <slot name="addonBefore">{{addonBefore}}</slot>
        </span>
        <div
          class="color-container"
          :style="{
            padding: showBorder ? '4px 8px' : '0',
            border: showBorder
              ? 'border: 1px solid $border-color-base;'
              : 'none',
            flex: '1',
            'border-radius': hasAddonBefore ? '0 4px 4px 0px' : '4px'
          }"
        >
          <div
            :title="color"
            class="color-div"
            :style="{
              background: pickColor,
              width: showColorText ? '16px' : '100%',
              height: '16px'
            }"
          ></div>
          <div v-if="showColorText" style="line-height:22px;margin-left:8px;">{{color}}</div>
        </div>
      </mapgis-ui-row>
    </mapgis-ui-popover>
  </div>
</template>

<script>
import { Sketch } from "vue-color";

export default {
  name: "mapgis-ui-sketch-color-picker",
  components: { "sketch-picker": Sketch },
  props: {
    showColorText: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      required: true,
      default: "rgb(255,255,102)"
    },
    disableAlpha: {
      type: Boolean,
      required: false,
      default: true
    },
    extraValue: {
      type: [Object, String, Number, Boolean]
    },
    size: {
      type: String
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    colorStyle: {
      type: Object
    },
    addonBefore: {
      type: String
    }
  },
  computed: {
    pickColor: {
      get() {
        return this.color;
      },
      set(val) {
        this.$emit("update:color", val);
      }
    },
    hasAddonBefore() {
      return (this.addonBefore && this.addonBefore.length > 0) || (this.$slots && this.$slots.addonBefore);
    }
  },
  methods: {
    onColorChange(val) {
      this.getPickColor(val);
      this.$emit("input", val, this.extraValue);
    },
    // 颜色拾取器选中事件回调
    getPickColor(val) {
      this.pickColor = this.colorObjectToRgba(val.rgba, this.disableAlpha);
    },
    colorObjectToRgba(rgba, disableAlpha) {
      let colorStr = "";
      if (rgba.a !== undefined) {
        colorStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
        // 已传入disableAlpha，并且为true
        if (disableAlpha) {
          colorStr = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
        }
      } else {
        colorStr = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
      }
      return colorStr;
    }
  }
};
</script>
<style scoped>
.color-row {
  display: flex;
}

.addon-before {
  height: 32px;
  line-height: 32px;
  width: fit-content;
}
</style>
