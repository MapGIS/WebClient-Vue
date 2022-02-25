<template>
  <div class="mapgis-ui-select-outline-container">
    <div class="mapgis-ui-select-outline-title">{{ title }}</div>
    <mapgis-ui-select class="mapgis-ui-select-outline" default-value="小">
      <mapgis-ui-select-option class="mapgis-ui-select-outline-option" value="小">
        小
      </mapgis-ui-select-option>
      <mapgis-ui-select-option class="mapgis-ui-select-outline-option" value="大">
        大
      </mapgis-ui-select-option>
    </mapgis-ui-select>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-select-outline",
  props: {
    title: {
      type: String,
      default: "title"
    }
  }
}
</script>

<style>
.mapgis-ui-select-outline-container {
  width: 100%;
  height: auto;
  position: relative;
  text-align: center;
}

.mapgis-ui-select-outline-title {
  position: absolute;
  top: -10px;
  left: 40px;
  z-index: 1;
  padding: 0 10px;
}

.mapgis-ui-select-outline {
  width: 100%;
}

.mapgis-ui-select-outline > div {
  border: 1px solid rgb(95, 99, 104);
  height: 54px;
  padding-top: 12px;
  padding-left: 4px;
  font-size: 18px;
}

.mapgis-ui-select-outline-option {
  font-size: 18px !important;
  height: 44px;
  padding-top: 10px !important;
  padding-left: 14px !important;
}

.mapgis-ui-select-outline-option:hover {
  color: black !important;
}
</style>