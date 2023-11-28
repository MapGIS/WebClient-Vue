<template>
  <div class="mapgis-ui-slider-color-picker">
    <div class="color-container">
      <div class="color-content">
        <div
          class="color-div"
          :style="{
            background: `linear-gradient(90deg,${pickColor},transparent)`
          }"
          @click="showSlider = !showSlider"
        ></div>
        <div class="slider-picker-container" v-show="showSlider">
          <slider-picker v-model="pickColor" />
        </div>
      </div>
      <div class="color-arrow" @click="showSlider = !showSlider">
        <mapgis-ui-ant-icon
          :type="showSlider ? 'up' : 'down'"
          style="fontSize:12px"
        ></mapgis-ui-ant-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { Slider } from "vue-color";

export default {
  name: "mapgis-ui-slider-color-picker",
  components: {
    "slider-picker": Slider
  },
  props: {
    color: {
      type: String,
      default: "rgb(102,255,252)"
    }
  },
  data() {
    return {
      showSlider: false
    };
  },
  computed: {
    pickColor: {
      get() {
        return this.color;
      },
      set(val) {
        const color = this.colorObjectToRgba(val.rgba);
        this.$emit("update:color", color);
      }
    }
  },
  methods: {
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

<style scoped lang="scss">
.color-container {
  display: flex;
  height: 20px;
  cursor: pointer;
  .color-content {
    flex: 1;
    border: 1px var(--border-color-base) solid;
    position: relative;
    .color-div {
      width: 99%;
      height: 80%;
      margin: 2px 0 0 2px;
    }
    .slider-picker-container {
      width: 100%;
      border: 1px var(--border-color-base) solid;
      position: absolute;
      bottom: -15px;
    }
  }
  .color-arrow {
    width: 25px;
    border: 1px var(--border-color-base) solid;
    line-height: 20px;
    border-left: none;
    text-align: center;
  }
}

.vc-slider {
  width: 100%;
  ::v-deep .vc-slider-swatches {
    display: none;
  }
  ::v-deep .vc-slider-swatch-picker.vc-slider-swatch-picker--active {
    transform: scaleY(1) !important;
  }
}
</style>
