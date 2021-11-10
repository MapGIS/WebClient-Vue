<template>
  <div class="mapgis-feature-select-container">
    <div class="mapgis-feature-select-title">{{ title }}</div>
    <mapgis-ui-select class="mapgis-feature-select" default-value="小">
      <mapgis-ui-select-option class="mapgis-feature-select-option" value="小">
        小
      </mapgis-ui-select-option>
      <mapgis-ui-select-option class="mapgis-feature-select-option" value="大">
        大
      </mapgis-ui-select-option>
    </mapgis-ui-select>
  </div>
</template>

<script>
export default {
  name: "featureSelect",
  props: {
    title: {
      type: String,
      default: "title"
    }
  }
}
</script>

<style>
.mapgis-feature-select-container {
  width: auto;
  height: auto;
  position: relative;
}

.mapgis-feature-select-title {
  position: absolute;
  top: -10px;
  left: 40px;
  z-index: 1;
  padding: 0 10px;
  color: #e8eaed;
  background: rgb(32, 33, 36);
}

.mapgis-feature-select {
  width: 342px;
}

.mapgis-feature-select > div {
  background: rgb(32, 33, 36);
  border: 1px solid rgb(95, 99, 104);
  height: 54px;
  padding-top: 12px;
  padding-left: 4px;
  color: #e8eaed;
  font-size: 18px;
}

.mapgis-feature-select .mapgis-ui-select-arrow svg {
  color: #e8eaed;
}

.mapgis-feature-select-option, .mapgis-ui-select-dropdown-menu {
  background: rgb(48, 50, 53);
}

.mapgis-feature-select-option {
  color: #e8eaed !important;
  font-size: 18px !important;
  height: 44px;
  padding-top: 10px !important;
  padding-left: 14px !important;
}

.mapgis-feature-select-option:hover {
  color: black !important;
}
</style>