<template>
  <div
    :class="{
      'mapgis-ui-toolbar-command-group': true,
      'remove-first-command-left-margin': removeFirstCommandLeftMargin,
      'remove-last-command-right-margin': removeLastCommandRightMargin
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-toolbar-command-group",
  props: {
    /**
     * 是否删除左侧第一个的间距, 默认值 `true`
     */
    removeFirstCommandLeftMargin: {
      type: Boolean,
      default: true
    },
    /**
     * 是否删除右侧最后一个的间距, 默认值 `true`
     */
    removeLastCommandRightMargin: {
      type: Boolean,
      default: true
    }
  }
};
</script>
