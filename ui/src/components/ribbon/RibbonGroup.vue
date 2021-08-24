<template>
  <div class="mapgis-ui-ribbon-group">
    <div class="mapgis-ui-ribbon-group-tools">
      <slot />
    </div>
    <div class="mapgis-ui-ribbon-group-label">{{ title }}</div>
  </div>
</template>

<script>
import RibbonOption from "./RibbonOptions";
export default {
  name: "mapgis-ui-ribbon-group",
  props: {
    ...RibbonOption
  },
  created() {},
  methods: {}
};
</script>
