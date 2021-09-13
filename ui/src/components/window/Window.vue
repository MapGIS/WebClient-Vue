<template>
  <mapgis-ui-placement
    class="mapgis-ui-window-wrapper"
    :position="anchor"
    :offset="[currentHorizontalOffset, currentVerticalOffset]"
    v-show="syncedVisible"
    :style="style"
    :z-index="zIndex"
    ref="windowContainer"
  >
    <div
      :class="{ 'window-head': true, shrink: shrink }"
      :style="{
        cursor: canDragable ? 'all-scroll' : 'auto'
      }"
      @mousedown="onMousedown(onDrag, onBeforeDrag, $event)"
      ref="headerContainer"
    >
      <div class="title">
        <slot name="title">{{ title }}</slot>
      </div>
      <slot name="toolbar"> </slot>
      <div :class="toolbarClass">
        <mapgis-ui-iconfont
          v-if="shrinkAction"
          class="action"
          :type="shrink ? 'mapgis-up' : 'mapgis-down'"
          @click="shrink = !shrink"
        />
        <mapgis-ui-iconfont
          v-if="fullScreenAction"
          class="action"
          :type="fullScreen ? 'mapgis-fullscreen-exit' : 'mapgis-fullscreen-ant'"
          @click="onFullScreen"
        />
        <mapgis-ui-iconfont
          v-if="closeAction"
          class="action"
          type="mapgis-close"
          @click="onClose"
        />
      </div>
    </div>
    <div
      v-show="!shrink"
      :class="[
        'beauty-scroll',
        'window-content',
        'window-panel-scroll-height',
        hasPadding ? 'window-padding' : ''
      ]"
      :style="
        currentHeightPixel ? null : { 'max-height': maxHeightPixelContent }
      "
      ref="contentContainer"
    >
      <slot />
      <div
        v-show="canResizable"
        @mousedown="onMousedown(onResizeWindow, onBeforeResizeWindow, $event)"
        style="position: absolute; bottom: 2px; right: 2px; cursor: nw-resize; width: 15px; height: 15px;"
      />
    </div>
  </mapgis-ui-placement>
</template>

<script>
const SPECIAL_CHARS_REGEXP = /([:-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

const camelCase = function(name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

const getStyle =
  Number(document.documentMode) < 9
    ? function(element, styleName) {
        if (!element || !styleName) return null
        styleName = camelCase(styleName)
        if (styleName === 'float') {
          styleName = 'styleFloat'
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100
              } catch (e) {
                return 1.0
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null
          }
        } catch (e) {
          return element.style[styleName]
        }
      }
    : function(element, styleName) {
        if (!element || !styleName) return null
        styleName = camelCase(styleName)
        if (styleName === 'float') {
          styleName = 'cssFloat'
        }
        try {
          const computed = document.defaultView.getComputedStyle(element, '')
          return element.style[styleName] || computed
            ? computed[styleName]
            : null
        } catch (e) {
          return element.style[styleName]
        }
      }

export default {
  name: 'mapgis-ui-window',
  props: {
    // 窗体方位
    // top-left | top-right | bottom-right | bottom-left |
    // top-center | bottom-center | center-right |  center-left | center-center
    anchor: {
      type: String,
      default: 'top-right'
    },
    // 水平偏移
    horizontalOffset: {
      type: Number,
      default: 0
    },
    // 垂直偏移
    verticalOffset: {
      type: Number,
      default: 0
    },
    // 是否展开
    expand: {
      type: Boolean,
      default: false
    },
    dragable: {
      type: Boolean,
      default: true
    },
    // 显示标题
    title: { type: String, default: '' },
    // 显示图标
    icon: { type: String, required: false },
    // 是否显示
    visible: { type: Boolean, default: false },
    // 内容宽度
    width: { type: Number, required: false },
    // 内容高度
    height: { type: Number, required: false },
    // 内容最小宽度
    minWidth: { type: Number, required: false },
    // 内容最大宽度
    maxWidth: { type: Number, required: false },
    // 内容最小高度
    minHeight: { type: Number, required: false },
    // 内容最大高度
    maxHeight: { type: Number, required: false },
    // 相对于主视图顶的距离
    top: { type: Number },
    // 相对于主视图底的距离
    bottom: { type: Number },
    // 是否有收缩动作
    shrinkAction: { type: Boolean, default: true },
    // 是否有全屏动作
    fullScreenAction: { type: Boolean, default: true },
    // 是否有关闭动作
    closeAction: { type: Boolean, default: true },
    // 是否窗口范围内拖动
    dragRange: { type: Boolean, default: true },
    // 是否调整窗口大小
    resizable: { type: Boolean, default: true },
    // 是否全屏
    isFullScreen: { type: Boolean, default: false },
    // 是否有边距
    hasPadding: { type: Boolean, default: true },
    // 层级
    zIndex: { type: Number, default: 1 }
  },
  data() {
    return {
      // 是否收缩面板
      shrink: false,
      // 是否全屏
      fullScreen: this.isFullScreen,
      // 拖拽之后的位置，默认为初始位置
      dragHorizontalOffset: this.horizontalOffset,
      dragVerticalOffset: this.verticalOffset,
      heightPixel: null,
      // 调整大小后的大小，默认为初始大小
      resizeWidth: this.width,
      resizeHeight: this.height,
      relParentEl: null,
      // 拖拽数据
      dragState: {}
    }
  },
  computed: {
    // 同步属性visible
    syncedVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
    // 是否是水平布局
    // 上下悬停
    isHorizontal() {
      return ['top-center', 'bottom-center', 'center-center'].includes(
        this.anchor
      )
    },
    // 是否是垂直布局
    // 左右悬停
    isVertical() {
      return ['center-left', 'center-right', 'center-center'].includes(
        this.anchor
      )
    },
    // 是否允许拖动
    // 全屏以及展开时不允许拖动
    canDragable() {
      return this.dragable && !this.fullScreen && !this.expand
    },
    canResizable() {
      return this.resizable && (this.width || this.height)
    },
    // 当前的水平偏移，主要为了保证全屏的时候在0位置
    currentHorizontalOffset() {
      if (this.canDragable) return this.dragHorizontalOffset

      return 0
    },
    // 当前的垂直偏移，主要为了保证全屏的时候在0位置
    currentVerticalOffset() {
      if (this.canDragable) return this.dragVerticalOffset

      return 0
    },
    // 当前的内容宽度
    // 全屏(fullScreen)|水平展开(expand && isHorizontal)：计算宽度
    // 正常情况：使用传入的宽度
    currentWidthPixel() {
      if (this.fullScreen || (this.expand && this.isHorizontal))
        // 全屏|水平展开：100%
        return '100%'

      if (this.width) {
        return `${this.resizeWidth}px`
      }

      return null
    },
    // 当前的内容高度
    // 全屏(fullScreen)|垂直展开(expand && isVertical)
    // 正常情况：使用传入的高度并加上title的高度
    currentHeightPixel() {
      if (this.shrink) {
        return '36px'
      }

      if (this.fullScreen || (this.expand && this.isVertical)) {
        // 全屏|垂直展开：高度100%
        return '100%'
      }

      // 布局高度加上title高度
      if (this.heightPixel) {
        return `calc(${this.heightPixel} + 36px)`
      }

      return null
    },
    // 最小宽度和最大宽度
    minWidthPixel() {
      return this.minWidth ? `${this.minWidth}px` : '240px'
    },
    maxWidthPixel() {
      return this.maxWidth
        ? `${this.maxWidth}px`
        : `calc(100% - ${this.currentHorizontalOffset}px)`
    },
    // 最小高度和最大高度
    minHeightPixel() {
      return this.minHeight ? `${this.minHeight}px` : '48px'
    },
    maxHeightPixel() {
      return this.maxHeight
        ? `${this.maxHeight}px`
        : `calc(100% - ${this.currentVerticalOffset}px)`
    },
    maxHeightPixelContent() {
      return this.maxHeight
        ? `${this.maxHeight - 36}px`
        : `calc(100% - ${this.currentVerticalOffset + 36}px)`
    },
    style() {
      const styleObj = {}

      if (this.currentWidthPixel) {
        this.$set(styleObj, 'width', this.currentWidthPixel)
      } else {
        this.$set(styleObj, 'minWidth', this.minWidthPixel)
        this.$set(styleObj, 'maxWidth', this.maxWidthPixel)
      }

      if (this.currentHeightPixel) {
        this.$set(styleObj, 'height', this.currentHeightPixel)
      } else {
        this.$set(styleObj, 'minHeight', this.minHeightPixel)
        this.$set(styleObj, 'maxHeight', this.maxHeightPixel)
      }

      return styleObj
    },
    toolbarClass() {
      return {
        actions: true
      }
    }
  },
  watch: {
    horizontalOffset(newVal) {
      this.dragHorizontalOffset = newVal
    },
    verticalOffset(newVal) {
      this.dragVerticalOffset = newVal
    },
    isFullScreen(newVal) {
      this.fullScreen = newVal
    },
    resizeHeight: {
      handler() {
        if (this.resizeHeight) {
          this.heightPixel = `${this.resizeHeight}px`
        }
      }
    }
  },
  created() {
    if (!this.width) {
    }

    if (this.height) {
      this.heightPixel = `${this.height}px`
    } else {
      // 如果height为undefined
      if (
        ['top-left', 'top-right', 'top-center'].includes(this.anchor) &&
        typeof this.bottom != 'undefined'
      ) {
        this.heightPixel = `calc(100% - 36px - ${this.verticalOffset}px - ${this.bottom}px)`
      } else if (
        ['bottom-left', 'bottom-right', 'bottom-center'].includes(
          this.anchor
        ) &&
        typeof this.top != 'undefined'
      ) {
        this.heightPixel = `calc(100% - 36px - ${this.verticalOffset}px - ${this.top}px)`
      }
    }
  },
  methods: {
    /**
     *  获取拖拽元素相对位置参考元素
     */
    getRelativeEl(el) {
      let parent = el.parentNode
      while (
        parent !== document.documentElement &&
        getStyle(parent, 'position') === 'static'
      ) {
        parent = parent.parentNode
      }
      return parent
    },
    onBeforeDrag() {
      this.dragState.windowWidth = this.$refs.windowContainer.$el.clientWidth
      this.dragState.windowHeight = this.$refs.windowContainer.$el.clientHeight
      this.dragState.contentHeight = this.$refs.contentContainer.clientHeight
      this.dragState.headerHeight = this.$refs.headerContainer.clientHeight
    },
    // 拖拽事件
    // 只有在允许拖拽的时候生效
    // 通过此次拖拽的相对位置以及上次的位置计算新的位置
    // 注意xy的加减问题
    onDrag({ delta: { x, y } }) {
      if (this.canDragable) {
        // 基于左右计算x轴偏移量
        let offsetX
        let minOffsetX
        let maxOffsetX

        if (this.anchor.includes('left')) {
          offsetX = this.dragHorizontalOffset + x

          if (this.dragRange) {
            minOffsetX = 0
            maxOffsetX =
              this.relParentEl.clientWidth - this.dragState.windowWidth
          } else {
            minOffsetX = -this.dragState.windowWidth
            maxOffsetX = this.relParentEl.clientWidth
          }
        } else if (this.anchor.includes('right')) {
          offsetX = this.dragHorizontalOffset - x

          if (this.dragRange) {
            minOffsetX = 0
            maxOffsetX =
              this.relParentEl.clientWidth - this.dragState.windowWidth
          } else {
            minOffsetX = -this.dragState.windowWidth
            maxOffsetX = this.relParentEl.clientWidth
          }
        } else if (this.anchor.includes('-center')) {
          offsetX = this.dragHorizontalOffset + x

          if (this.dragRange) {
            minOffsetX =
              -(this.relParentEl.clientWidth - this.dragState.windowWidth) / 2
            maxOffsetX =
              this.relParentEl.clientWidth -
              this.dragState.windowWidth -
              (this.relParentEl.clientWidth - this.dragState.windowWidth) / 2
          } else {
            minOffsetX =
              -this.dragState.windowWidth -
              (this.relParentEl.clientWidth - this.dragState.windowWidth) / 2
            maxOffsetX =
              this.relParentEl.clientWidth -
              (this.relParentEl.clientWidth - this.dragState.windowWidth) / 2
          }
        }

        // 保证在可视范围内
        if (offsetX > maxOffsetX) offsetX = maxOffsetX
        if (offsetX < minOffsetX) offsetX = minOffsetX

        // 基于上下计算y轴偏移量
        let offsetY
        let minOffsetY
        let maxOffsetY
        if (this.anchor.includes('top')) {
          offsetY = this.dragVerticalOffset + y
          if (this.dragRange) {
            minOffsetY = 0
            maxOffsetY =
              this.relParentEl.clientHeight - this.dragState.windowHeight
          } else {
            minOffsetY = 0
            maxOffsetY =
              this.relParentEl.clientHeight - this.dragState.headerHeight
          }
        } else if (this.anchor.includes('bottom')) {
          offsetY = this.dragVerticalOffset - y
          if (this.dragRange) {
            minOffsetY = 0
            maxOffsetY =
              this.relParentEl.clientHeight - this.dragState.windowHeight
          } else {
            minOffsetY = -this.dragState.contentHeight
            maxOffsetY =
              this.relParentEl.clientHeight - this.dragState.windowHeight
          }
        } else if (this.anchor.includes('center-')) {
          offsetY = this.dragVerticalOffset + y
          if (this.dragRange) {
            minOffsetY =
              -(this.relParentEl.clientHeight - this.dragState.windowHeight) / 2
            maxOffsetY =
              this.relParentEl.clientHeight -
              this.dragState.windowHeight -
              (this.relParentEl.clientHeight - this.dragState.windowHeight) / 2
          } else {
            minOffsetY =
              -(this.relParentEl.clientHeight - this.dragState.windowHeight) / 2
            maxOffsetY =
              this.relParentEl.clientHeight -
              this.dragState.headerHeight -
              (this.relParentEl.clientHeight - this.dragState.windowHeight) / 2
          }
        }

        // 保证在可视范围内
        if (offsetY > maxOffsetY) offsetY = maxOffsetY
        if (offsetY < minOffsetY) offsetY = minOffsetY
        this.dragHorizontalOffset = offsetX
        this.dragVerticalOffset = offsetY
      }
    },
    onMousedown(func, beforeFunc, e) {
      // 从DOM树向上查找定位元素，如无，就取documentElement
      this.relParentEl = this.getRelativeEl(this.$el)

      beforeFunc()

      let startX = e.clientX
      let startY = e.clientY

      const move = moveEvent => {
        moveEvent.preventDefault()
        moveEvent.stopPropagation()

        let offsetX = 0
        let offsetY = 0

        offsetX = moveEvent.clientX - startX
        startX += offsetX
        offsetY = moveEvent.clientY - startY
        startY += offsetY

        func({ delta: { x: offsetX, y: offsetY } })
      }

      const up = moveEvent => {
        document.removeEventListener('mousemove', move, true)
        document.removeEventListener('mouseup', up, true)
      }
      document.addEventListener('mousemove', move, true)
      document.addEventListener('mouseup', up, true)
    },
    onBeforeResizeWindow() {},
    // 调整大小（暂时没有考虑dragRange）
    onResizeWindow({ delta: { x, y } }) {
      if (!this.resizable) return

      // 只处理宽度有值的面板
      if (!this.width) return

      let rx = x
      const maxWidth = this.relParentEl.clientWidth

      if (this.resizeWidth + x <= this.width) {
        rx = this.width - this.resizeWidth

        this.resizeWidth = this.width
      }
      // 不能将窗口调整到主视图外面去，否则将调不回来
      else if (this.resizeWidth + x >= maxWidth) {
        rx = maxWidth - this.resizeWidth

        this.resizeWidth = maxWidth
      } else {
        this.resizeWidth += x
      }

      if (this.anchor.includes('right')) {
        this.dragHorizontalOffset -= rx
      }

      // 只处理高度有值的面板
      if (!this.height) {
        this.$emit('resize', { width: this.resizeWidth })
        return
      }

      let ry = y
      const maxHeight =
        this.relParentEl.clientHeight - this.$refs.headerContainer.clientHeight

      if (this.resizeHeight + y <= this.height) {
        ry = this.height - this.resizeHeight

        this.resizeHeight = this.height
      }
      // 不能将窗口调整到主视图下面去，否则将调不回来
      else if (this.resizeHeight + y >= maxHeight) {
        ry = maxHeight - this.resizeHeight

        this.resizeHeight = maxHeight
      } else {
        this.resizeHeight += ry
      }

      if (this.anchor.includes('bottom')) {
        this.dragVerticalOffset -= ry
      }

      this.$emit('resize', {
        width: this.resizeWidth,
        height: this.resizeHeight
      })
    },
    onFullScreen() {
      this.fullScreen = !this.fullScreen
      this.$emit('window-size', this.fullScreen ? 'max' : 'normal')
    },
    // 关闭事件
    onClose() {
      this.syncedVisible = false
    }
  }
}
</script>
