<template>
  <mapgis-ui-card class="mapgis-global-socket">
    <slot />
  </mapgis-ui-card>
</template>
<script>
export default {
  name: "mapgis-global-socket",
};
</script>

<style scoped>
.mapgis-global-socket {
  position: absolute;
  z-index: 9000;
  height: 320px;
  width: 240px;
  bottom: 10px;
  right: 10px;
}
</style>