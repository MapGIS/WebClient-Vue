<template>
  <div>
    <!-- slot for toolbar -->
    <slot name="toolbar" />
    <!-- slot for toolbar-item -->
    <slot v-if="control" />
  </div>
</template>

<script>
import controlMixin from "../controlMixin";

export default {
  name: "mapbox-fps-control",
  mixins: [controlMixin],

  props: {
    options: {
      type: Object,
      default: () => {
        return {
          background: "rgba(0,0,0,0.9)",
          barWidth: 4,
          color: "#7cf859",
          font: "Monaco, Consolas, Courier, monospace",
          graphHeight: 60,
          graphWidth: 120,
          graphTop: 0,
          graphRight: 5,
          width: 130
        }
      }
    }
  },

  created () {
    let { options } = this;
    this.control = new this.mapbox.FpsControl(options);
    this.$_addControl();
  }
};
</script>
