<template>
  <div @mouseleave="$_playerLeave" @mouseenter="$_playerEnter" @click="$_click"
       class="mapgis-ui-local-base64-icon-container" :style="{width: width,height: height}">
    <img ref="play"
         :style="{width: width,height: height}" v-if="type === 'play'" title="播放"
         :src="Base64Icons.play"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'pause'" title="暂停"
         :src="Base64Icons.pause"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'fullScreen'" title="全屏"
         :src="Base64Icons.fullScreen"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'flyTo'" title="飞到"
         :src="Base64Icons.flyTo"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'more'" title="更多"
         :src="Base64Icons.more"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'top'" title="置顶"
         :src="Base64Icons.top"
         alt="">
    <img :style="{width: width,height: height}" v-if="type === 'setting'" title="setting"
         src="./img/setting.svg"
         alt="">
    <img :style="[{width: width,height: height},iconStyle]" v-if="type === 'addPicture'" title="addPicture"
         src="./img/addPicture.svg"
         alt="">
    <img :style="[{width: width,height: height},iconStyle]" v-if="type === 'flyToView'" title="flyToView"
         src="./img/flyToView.svg"
         alt="">
    <img :style="[{width: width,height: height},iconStyle]" v-if="type === 'toLarge'" title="toLarge"
         src="./img/toLarge.svg"
         alt="">
    <img :style="[{width: width,height: height},iconStyle]" v-if="type === 'export'" title="export"
         src="./img/export.svg"
         alt="">
    <span v-if="title" :style="titleStyle" class="mapgis-ui-local-base64-icon-title">{{title}}</span>
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
    iconStyle: {
      type: Object
    },
    title: {
      type: String
    },
    titleStyle: {
      type: Object
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
      if (this.Base64Icons.hasOwnProperty(this.type + "Hover")) {
        this.$refs[this.type].src = this.Base64Icons[this.type];
      }
      this.$emit("mouseleave");
    },
    $_playerEnter() {
      if (this.Base64Icons.hasOwnProperty(this.type + "Hover")) {
        this.$refs[this.type].src = this.Base64Icons[this.type + "Hover"];
      }
      this.$emit("mouseenter");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-local-base64-icon-container {
  position: relative;
  width: 24px;
  height: 24px;
  display: inline;
  cursor: pointer;
}

.mapgis-ui-local-base64-icon-title{
  position: absolute;
  top: 0;
  left: 0;
}
</style>