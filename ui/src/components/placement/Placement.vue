<template>
  <div class="mapgis-ui-placement" :class="classes" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'mapgis-ui-placement',
  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: v =>
        [
          'top-right',
          'top-left',
          'bottom-right',
          'bottom-left',
          'top-center',
          'bottom-center',
          'center-right',
          'center-left',
          'center-center'
        ].includes(v)
    },
    offset: {
      type: Array,
      validator: v => v.length === 2
    },
    expand: Boolean,
    // 层级
    zIndex: {
      type: Number,
      default: 1
    }
  },
  computed: {
    style() {
      const css = {}
      if (this.offset) {
        css.margin = `${this.offset[1]}px ${this.offset[0]}px`
      }

      css.zIndex = this.zIndex
      return css
    },
    classes() {
      return `${this.position}`
    }
  }
}
</script>
