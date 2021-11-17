<template>
  <div @mouseleave="$_playerLeave" @mouseenter="$_playerEnter" @click="$_click" class="mapgis-ui-local-base64-icon-container" :style="{width: width,height: height}">
    <img ref="play"
         :style="{width: width,height: height}" v-if="type === 'play'" title="播放"
         :src="Base64Icons.play"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'pause'" title="暂停"
         :src="Base64Icons.pause"
         alt="">
  </div>
</template>

<script>
import Base64Icons from "./Base64Icons"

export default {
  name: "mapgis-ui-base64-icon",
  props: {
    type: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
  },
  data() {
    return {
      Base64Icons: Base64Icons
    }
  },
  methods: {
    $_click() {
      this.$emit("click");
    },
    $_playerLeave() {
      if(this.Base64Icons.hasOwnProperty(this.type + "Hover")){
        this.$refs[this.type].src = this.Base64Icons[this.type];
      }
      this.$emit("mouseleave");
    },
    $_playerEnter() {
      if(this.Base64Icons.hasOwnProperty(this.type + "Hover")){
        this.$refs[this.type].src = this.Base64Icons[this.type + "Hover"];
      }
      this.$emit("mouseenter");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-local-base64-icon-container {
  width: 24px;
  height: 24px;
  display: inline;
  cursor: pointer;
}
</style>