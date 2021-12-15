<template>
  <div>
    <mapgis-ui-row>
      <mapgis-ui-col span="8" class="mapgis-ui-input-row-title">
        {{ title }}
      </mapgis-ui-col>
      <mapgis-ui-col span="16">
        <mapgis-ui-input/>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-input-row",
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style scoped>
.mapgis-ui-input-row-title {
  color: black;
}
</style>