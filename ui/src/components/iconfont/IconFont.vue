<template>
  <svg
    v-if="iconId"
    :class="{
      'mapgis-iconfont-wrapper': true,
      'mapgis-iconfont-wrapper-disabled': disabled
    }"
    aria-hidden="true"
    @click="click()"
  >
    <use :xlink:href="iconId"></use>
  </svg>
</template>

<script>
import "./iconfont"; // 移动到public的asset目录下
export default {
  name: "mapgis-ui-iconfont",
  props: {
    type: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconId() {
      return this.type ? `#${this.type}` : "";
    }
  },
  methods: {
    click() {
      if (!disabled) {
        this.$emit("click");
      }
    }
  }
};
</script>
<style>
.mapgis-iconfont-wrapper {
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.25em;
  overflow: hidden;
}

.mapgis-iconfont-wrapper-disabled {
  cursor: not-allowed;
}
</style>
