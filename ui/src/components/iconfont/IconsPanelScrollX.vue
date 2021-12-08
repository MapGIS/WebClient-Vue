<template>
  <div>
    <mapgis-ui-row class="mapgis-ui-icons-panel-scroll-x-title" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
      <mapgis-ui-title-icon v-show="showTitleIcon"/>
      <mapgis-ui-col span="24" style="margin-top: 6px;margin-bottom: 10px;">{{ title }}</mapgis-ui-col>
    </mapgis-ui-row>
    <div :style="{height: panelHeight}"
         class="mapgis-ui-icons-panel-scroll-x-container"
         @mouseleave="$_mouseleave"
         @mouseenter="$_mouseenter"
    >
      <img @click="$_click(marker.key)" class="mapgis-feature-icon" v-for="(marker,index) in Base64IconsKeyValue"
           :key="index"
           :src="marker.value" :title="marker.key"/>
    </div>
  </div>
</template>

<script>
import Base64IconsKeyValue from "./Base64IconsKeyValue"

export default {
  name: "mapgis-ui-icons-panel-scroll-x",
  data() {
    return {
      panelHeight: "57px",
      Base64IconsKeyValue: Base64IconsKeyValue
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    showTitleIcon: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    $_mouseenter() {
      this.panelHeight = "168px";
    },
    $_mouseleave() {
      this.panelHeight = "57px";
    },
    $_click(marker) {
      this.$emit("changeIcon", marker);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-icons-panel-scroll-x-container {
  width: 100%;
  position: relative;
  margin-bottom: 10px;
  padding-top: 4px;
  background: #F1F1F1;
  overflow: hidden;
  overflow-y: scroll;
  transition: height 0.5s ease;
}

.mapgis-ui-icons-panel-scroll-x-container::-webkit-scrollbar {
  display: none;
}

.mapgis-ui-icons-panel-scroll-x-title {
  margin-top: 6px;
  margin-bottom: 4px;
  padding-left: 12px;
}

.mapgis-feature-icon {
  width: 37px;
  height: 37px;
  margin: 10px 13px;
  cursor: pointer;
}
</style>