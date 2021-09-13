<template>
  <div
    :class="[
      'adjust-line-wrapper',
      isLineVertical ? 'adjust-line-wrapper-v' : 'adjust-line-wrapper-h'
    ]"
    @mousedown="onMousedown"
  >
    <div
      :class="[
        'adjust-line',
        isLineVertical ? 'adjust-line-v' : 'adjust-line-h'
      ]"
    ></div>
    <div
      v-if="resizeButton"
      :class="['adjust-button', direction]"
      :style="{ 'z-index': zIndex }"
    >
      <div class="indicator"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MpAdjustLine',
  props: {
    direction: {
      validator(value) {
        const allowedValues = ['left', 'right', 'top', 'bottom']
        return typeof value === 'string' && allowedValues.includes(value)
      },
      default: 'right'
    },
    resizeButton: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 1
    }
  },
  computed: {
    isLineVertical() {
      return this.direction === 'left' || this.direction === 'right'
    },
    isLineHorizonal() {
      return this.direction === 'top' || this.direction === 'bottom'
    }
  },
  methods: {
    onMousedown(e) {
      let startX = e.clientX
      let startY = e.clientY
      const move = moveEvent => {
        moveEvent.preventDefault()
        moveEvent.stopPropagation()

        let offset = 0

        switch (this.direction) {
          case 'left':
            offset = startX - moveEvent.clientX
            startX -= offset
            break
          case 'right':
            offset = moveEvent.clientX - startX
            startX += offset
            break
          case 'top':
            offset = startY - moveEvent.clientY
            startY -= offset
            break
          default:
            offset = moveEvent.clientY - startY
            startY += offset
            break
        }

        this.$emit('line-move', offset)
      }

      const up = moveEvent => {
        document.removeEventListener('mousemove', move, true)
        document.removeEventListener('mouseup', up, true)
      }
      document.addEventListener('mousemove', move, true)
      document.addEventListener('mouseup', up, true)
    }
  }
}
</script>
