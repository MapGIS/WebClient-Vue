<template>
<div class="mapgis-ui-borderbox10" :ref="ref" :style="`box-shadow: inset 0 0 25px 3px ${mergedColor[0]}`">
    <svg class="mapgis-ui-border-svg-container" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        4, 0 ${width - 4}, 0 ${width}, 4 ${width}, ${height - 4} ${width - 4}, ${height}
        4, ${height} 0, ${height - 4} 0, 4
      `" />
    </svg>

    <svg
      width="150px"
      height="150px"
      :key="item"
      v-for="item in border"
      :class="`${item} mapgis-ui-border-svg-container`"
    >
      <polygon
        :fill="mergedColor[1]"
        points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import autoResize from "../../mixin/AutoResize";
import clonedeep from "lodash.clonedeep";

export default {
  name: "mapgis-ui-borderbox10",
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  data () {
    return {
      ref: 'border-box-10',

      border: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],

      defaultColor: ['#1d48c4', '#d3e1f8'],

      mergedColor: []
    }
  },
  watch: {
    color() {
      const { mergeColor } = this;

      mergeColor();
    },
  },
  methods: {
    mergeColor() {
      const { color, defaultColor } = this;
      let colors = color || [];
      this.mergedColor = colors.concat(clonedeep(defaultColor));
    },
  },
  mounted() {
    const { mergeColor } = this;

    mergeColor();
  },
};
</script>
