<template>
  <div>
    <mapgis-ui-row class="mapgis-ui-icon-row-container">
      <img
           :src="src"
           :title="imgTitle" alt="">
      {{ title }}
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-icon-row",
  props: {
    title: {
      type: String
    },
    //传图的图标url或base64
    src: {
      type: String
    },
    //图片悬停说明
    imgTitle: {
      type: String
    },
  },
}
</script>

<style scoped>
.mapgis-ui-icon-row-container {
  text-align: left;
}
</style>