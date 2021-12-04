<template>
  <div>
    <div class="mapgis-ui-size-check-box-title">
      <mapgis-ui-title-icon/>
      {{ title }}
    </div>
    <div class="mapgis-ui-size-check-box-container">
      <mapgis-ui-checkbox class="mapgis-ui-size-check-box">
        小
      </mapgis-ui-checkbox>
      <mapgis-ui-checkbox class="mapgis-ui-size-check-box" style="left: 90px">
        大
      </mapgis-ui-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-size-check-box",
  props: {
    title: {
      type: String,
      default: "title"
    }
  }
}
</script>

<style>
.mapgis-ui-size-check-box-container {
  width: 100%;
  height: auto;
  position: relative;
  text-align: center;
}

.mapgis-ui-size-check-box-title {
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;
  padding-left: 12px;
}

.mapgis-ui-size-check-box-container {
  width: 100%;
  height: 52px;
  background: #F1F1F1;
  border-radius: 3px;
}

.mapgis-ui-size-check-box {
  position: absolute;
  left: 11px;
  top: 15px
}
</style>