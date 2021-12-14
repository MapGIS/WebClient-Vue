<template>
  <div>
    <mapgis-ui-row>
      <mapgis-ui-col span="16">
        {{ title }}
      </mapgis-ui-col>
      <mapgis-ui-col span="8">
        <mapgis-ui-switch checked-children="开" un-checked-children="关" default-checked />
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-switch-row",
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>