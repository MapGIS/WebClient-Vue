<template>
  <div class="mapgis-feature-icons-container">
    <div class="mapgis-feature-icons-title">{{ title }}</div>
    <div class="mapgis-feature-icons">
      <img class="mapgis-feature-icon" v-for="(marker,index) in markers" :key="index" :src="marker.value" :title="marker.key" alt=""/>
    </div>
  </div>
</template>

<script>
import marker from "../img/base64Image"

export default {
  name: "featureIcons",
  data() {
    return {
      markers: marker
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    }
  }
}
</script>

<style scoped>
.mapgis-feature-icons-container {
  width: auto;
  height: auto;
  position: relative;
}

.mapgis-feature-icons-title {
  position: absolute;
  top: -10px;
  left: 40px;
  z-index: 1;
  padding: 0 10px;
  color: #e8eaed;
  background: rgb(32, 33, 36);
}

.mapgis-feature-icons {
  margin: 30px auto;
  width: 344px;
  height: 210px;
  border-radius: 4px;
  border: 1px solid rgb(95, 99, 104);
  text-align: left;
  padding-top: 10px;
  padding-left: 10px;
}

.mapgis-feature-icon{
  width: 44px;
  height: 44px;
  margin: 10px;
  cursor: pointer;
}
</style>