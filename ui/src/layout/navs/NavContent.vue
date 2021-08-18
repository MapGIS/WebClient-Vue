<template>
  <div
    :class="{
      'mapgis-ui-nav-content': true,
      'mapgis-ui-nav-content-start': position == 'start',
      'mapgis-ui-nav-content-end': position == 'end'
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-nav-content",
  model: {
    prop: "activeKey",
    event: "change.activeKey"
  },
  props: {
    activeKey: {
      type: String,
      default: undefined
    },
    position: { type: String, default: "start" }
  }
};
</script>
