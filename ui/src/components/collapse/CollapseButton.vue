<template>
  <div class="mapgis-ui-collapse-indicator-wrapper">
    <span
      :class="['indicator', direction]"
      :style="{ 'z-index': zIndex }"
      @click="onClick"
    >
      <mapgis-ui-iconfont :type="iconType" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'mapgis-ui-collapse-button',
  props: {
    direction: {
      validator(value) {
        const allowedValues = ['left', 'right', 'top', 'bottom']
        return typeof value === 'string' && allowedValues.includes(value)
      },
      default: 'right'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    zIndex: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  computed: {
    // 同步属性visible
    syncedCollapsed: {
      get() {
        return this.collapsed
      },
      set(value) {
        this.$emit('update:collapsed', value)
      }
    },
    iconType() {
      let icon
      switch (this.direction) {
        case 'left':
          icon = `vertical-${this.syncedCollapsed ? 'mapgis-right' : 'mapgis-left'}`
          break
        case 'right':
          icon = `vertical-${this.syncedCollapsed ? 'mapgis-left' : 'mapgis-right'}`
          break
        case 'top':
          icon = `${this.syncedCollapsed ? 'mapgis-up' : 'mapgis-down'}`
          break
        default:
          icon = `${this.syncedCollapsed ? 'mapgis-down' : 'mapgis-up'}`
          break
      }
      return icon
    }
  },
  methods: {
    onClick() {
      this.syncedCollapsed = !this.syncedCollapsed
    }
  }
}
</script>
