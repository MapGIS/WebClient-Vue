<template>
  <div :class="{ 'mapgis-ui-toolbar-title': true, 'has-padding': hasPadding }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-toolbar-title",
  props: {
    /**
     * 是否激活内距padding， 默认`true`
     */
    hasPadding: {
      type: Boolean,
      default: true
    }
  }
};
</script>
