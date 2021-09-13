<template>
  <div transition="fade" :class="prefixCls">
    <slot />
    <div :class="spinCls" :style="spinStyle" v-show="visible">
      <slot name="spin">
        <div :class="`${prefixCls}-dots`">
          <span>{{ tip }}</span>
          <span class="dots">
            <span class="dot dot-1">.</span>
            <span class="dot dot-2">.</span>
            <span class="dot dot-3">.</span>
          </span>
          <slot name="suffix" />
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
import { ColorUtil, CommonUtil } from '../../util/common'

export default {
  name: 'mapgis-ui-map-spin',
  props: {
    spinning: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: '正在加载, 请稍等'
    },
    size: {
      type: String,
      validator(v) {
        return CommonUtil.oneOf(v, ['large', 'small'])
      }
    },
    background: {
      type: String,
      default: 'rgba(255, 255, 255, .3)',
      validator: v =>
        ColorUtil.isHex(v) || ColorUtil.isRgb(v) || ColorUtil.isRgba(v)
    },
    zIndex: {
      type: Number,
      default: 1
    }
  },
  data() {
    const prefixCls = 'mapgis-ui-map-spin'
    return {
      visible: false,
      prefixCls
    }
  },
  computed: {
    spinCls({ prefixCls, size }) {
      return [
        `${prefixCls}-spin`,
        {
          [`${prefixCls}-${size}`]: !!size
        }
      ]
    },
    spinStyle({ background, zIndex }) {
      return {
        background,
        zIndex
      }
    }
  },
  watch: {
    spinning(nV) {
      this.visible = nV
    },
    immediate: true
  }
}
</script>
