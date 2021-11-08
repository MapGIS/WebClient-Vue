<template>
  <div class="mapgis-ui-group-tab" :class="classes">
    <hr />
    <span class="title">
      <slot name="title">{{ title }}</slot>
    </span>
    <slot name="handle"></slot>
  </div>
</template>

<script>
export default {
  name: 'mapgis-ui-group-tab',
  props: {
    title: String,
    background: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'mini',
      validator(val) {
        return ['default', 'large', 'small', 'mini'].includes(val)
      }
    },
    hasTopMargin: {
      type: Boolean,
      default: true
    },
    hasBottomMargin: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classes() {
      return [
        {
          'is-background': this.background,
          [`is-${this.size}`]: !!this.size,
          'has-top-margin': this.hasTopMargin,
          'has-bottom-margin': this.hasBottomMargin
        }
      ]
    }
  }
}
</script>