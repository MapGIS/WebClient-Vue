<template>
  <mapgis-ui-row class="mapgis-ui-title-row-left" :style="{margin: margin}">
    <div class="mapgis-ui-title-row-left-title"
         :style="{paddingLeft: paddingLeft, fontSize: fontSize}"
    >
      {{ title }}
    </div>
    <div class="mapgis-ui-title-row-left-value"
         :style="{paddingRight: paddingRight}"
    >
      {{ value }}
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-title-row-left",
  props: {
    title: {
      type: String
    },
    value: {
      type: String
    },
    fontSize: {
      type: String,
      default: "12px"
    },
    paddingLeft: {
      type: String,
      default: "10px"
    },
    paddingRight: {
      type: String,
      default: "10px"
    },
    margin: {
      type: String,
      default: "10px 0"
    },
  }
}
</script>

<style scoped>
.mapgis-ui-title-row-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
}

.mapgis-ui-title-row-left-title, .mapgis-ui-title-row-left-value {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-title-row-left-title {
  width: 70px;
  text-align: left;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bolder;
}

.mapgis-ui-title-row-left-value {
  padding-right: 10px;
  font-size: 12px;
  width: calc(100% - 70px);
}
</style>