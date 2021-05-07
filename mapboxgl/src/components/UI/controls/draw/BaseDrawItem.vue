<template>
  <div style="float:left;">
    <slot />
  </div>
</template>

<style></style>

<script>
export default {
  name: "mapgis-basedraw-item",
  inject: ["mapbox", "map", "drawer"],

  data() {
    return {};
  },

  methods: {}
};
</script>
