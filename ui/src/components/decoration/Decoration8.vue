<template>
<div class="mapgis-ui-decoration-8" :ref="ref">
    <svg :width="width" :height="height">
      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        fill="transparent"
        :points="`${xPos(0)}, 0 ${xPos(30)}, ${height / 2}`"
      />

      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        fill="transparent"
        :points="`${xPos(20)}, 0 ${xPos(50)}, ${height / 2} ${xPos(width)}, ${height / 2}`"
      />

      <polyline
        :stroke="mergedColor[1]"
        fill="transparent"
        stroke-width="3"
        :points="`${xPos(0)}, ${height - 3}, ${xPos(200)}, ${height - 3}`"
      />
    </svg>
  </div>
</template>

<script>
import autoResize from "../../mixin/AutoResize";
import clonedeep from "lodash.clonedeep";

export default {
  name: "mapgis-ui-decoration8",
  mixins: [autoResize],
  props: {
    color: {
      type: Array,
      default: () => ([])
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ref: 'decoration-8',

      defaultColor: ['#3f96a5', '#3f96a5'],

      mergedColor: []
    }
  },
  watch: {
    color () {
      const { mergeColor } = this

      mergeColor()
    }
  },
  methods: {
    xPos (pos) {
      const { reverse, width } = this

      if (!reverse) return pos

      return width - pos
    },
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
