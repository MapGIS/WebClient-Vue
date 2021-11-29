<template>
  <div class="mapgis-ui-icons-panel-container">
    <div class="mapgis-ui-icons-panel-title">{{ title }}</div>
    <div class="mapgis-ui-icons-panel">
      <img @click="$_click(marker.key)" class="mapgis-feature-icon" v-for="(marker,index) in markers" :key="index"
           :src="marker.value" :title="marker.key" alt=""/>
    </div>
  </div>
</template>

<script>
import Base64IconsKeyValue from "./Base64IconsKeyValue"

export default {
  name: "mapgis-ui-icons-panel",
  data() {
    return {
      markers: Base64IconsKeyValue
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  methods: {
    $_click(marker) {
      this.$emit("changeIcon", marker);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-icons-panel-container {
  width: 100%;
  height: auto;
  position: relative;
}

.mapgis-ui-icons-panel-title {
  position: absolute;
  top: -10px;
  left: 40px;
  z-index: 1;
  padding: 0 10px;
}

.mapgis-ui-icons-panel {
  margin: 30px auto;
  width: 100%;
  height: 210px;
  border-radius: 4px;
  border: 1px solid rgb(95, 99, 104);
  text-align: left;
  padding-top: 10px;
  padding-left: 10px;
  overflow: hidden;
  overflow-y: scroll;
}

.mapgis-feature-icon {
  width: 44px;
  height: 44px;
  margin: 10px 13px;
  cursor: pointer;
}
</style>