<template>
  <a-form
    :class="[
      'mapgis-ui-setting-form',
      { compact },
      size,
      { 'no-last-margin-bottom': noLastMarginBottom },
      { 'wrapper-align-left': wrapperAlign === 'left' },
      { 'wrapper-align-right': wrapperAlign === 'right' },
      { 'fixed-wrapper': isFiexedWrapper }
    ]"
    :form="form"
    v-bind="formItemLayout"
    :hideRequiredMark="hideRequiredMark"
    :labelAlign="labelAlign"
    :layout="layout"
    :selfUpdate="selfUpdate"
    :colon="colon"
    @submit="$emit('submit', $event)"
  >
    <slot />
  </a-form>
</template>

<script>
import { formProps } from './props'

export default {
  name: 'mapgis-ui-setting-form',
  props: formProps,
  computed: {
    formItemLayout() {
      return this.layout === 'horizontal'
        ? {
            labelCol:
              this.itemLayout === 'grid'
                ? this.labelCol
                : { style: `width:${this.labelWidth}px` },
            wrapperCol:
              this.itemLayout === 'grid'
                ? this.wrapperCol
                : this.wrapperWidth === 'auto'
                ? { style: 'width:auto; flex:1' }
                : {
                    style: `width:${this.wrapperWidth}px; flex:1; display: flex; justify-content: flex-end`
                  }
          }
        : {}
    },
    isFiexedWrapper() {
      return (
        this.layout === 'horizontal' &&
        this.itemLayout !== 'grid' &&
        this.wrapperWidth !== 'auto'
      )
    }
  }
}
</script>
