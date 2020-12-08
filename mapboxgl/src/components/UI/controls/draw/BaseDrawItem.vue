<template>
  <div style="float:left;">
    <slot />
  </div>
</template>

<style lang="scss"></style>

<script>
export default {
  name: "BaseDrawItem",
  inject: ["mapbox", "map", "drawer"],

  data() {
    return {};
  },

  methods: {}
};
</script>
