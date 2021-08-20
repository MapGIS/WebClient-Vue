<template>
  <div class="mapgis-ui-nav-bar">
    <slot />
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-nav-bar",
  props: {
    collapsed: { type: Boolean, default: false },
    detached: { type: Boolean, default: false },
    position: {
      type: String,
      default: "start" // start end
    }
  },
  mounted() {
    this.$on("change-bar", this.handleValue); // 在mounted生命周期注册事件
  },
  methods: {
    handleValue(value) {
      this.$parent.$emit("change-bar", value);
    }
  }
};
</script>
