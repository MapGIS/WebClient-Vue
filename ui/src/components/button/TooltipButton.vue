<template>
  <mapgis-ui-tooltip
    :title="label"
    :overlay-style="{ zIndex }"
    placement="right"
  >
    <div class="mapgis-ui-tooltip-button" @click="onClick">
      <mapgis-ui-icon :icon="icon" />
    </div>
  </mapgis-ui-tooltip>
</template>

<script>
export default {
  name: "mapgis-ui-tooltip-button",
  props: {
    /**
     * tooltip显示文字
     */
    label: {
      type: String
    },
    /**
     * icon名称
     */
    icon: {
      type: [String, Object]
    },
    /**
     * z-index压盖顺序
     */
    zIndex: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>
