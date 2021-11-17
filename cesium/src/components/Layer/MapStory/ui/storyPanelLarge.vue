<template>
  <div v-if="currentFeature" class="mapgis-story-panel-large" :style="{height: panelHeight + 'px'}">
    <img v-if="showFullImg" class="mapgis-story-panel-large-full-img" :src="currentImg" alt="">
    <mapgis-ui-svg-icon v-if="showFullImg" @click="$_closeFull" class="mapgis-story-panel-large-full-close"
              :icon-style="iconStyle"
              :container-style="containerStyle" type="close"/>
    <img class="mapgis-story-panel-large-carousel-img" v-if="!showCarousel" :src="currentFeature.images" alt="">
    <mapgis-ui-carousel :afterChange="$_afterChange" v-if="showCarousel" class="mapgis-story-panel-large-carousel"
                        autoplay arrows>
      <div
          slot="prevArrow"
          class="custom-slick-arrow"
          style="left: 10px;zIndex: 1"
      >
        <mapgis-ui-iconfont type="mapgis-left-circle"/>
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
        <mapgis-ui-iconfont type="mapgis-right-circle"/>
      </div>
      <div :key="index" v-for="(image,index) in currentFeature.images">
        <img class="mapgis-story-panel-large-carousel-img" :src="image" alt="">
      </div>
    </mapgis-ui-carousel>
    <div @click="$_fullScreen" class="mapgis-story-panel-large-full-screen">
      <img :src="icon.fullScreen" alt="">
    </div>
    <div @click="$_flyTo" class="mapgis-story-panel-large-fly">
      <img :src="icon.flyTo" alt="">
    </div>
    <mapgis-ui-svg-icon @click="$_close" :icon-style="iconStyle" :container-style="containerStyle" type="close"/>
    <div class="mapgis-story-panel-large-title">
      <h1>{{ currentFeature.title }}</h1>
    </div>
    <div class="mapgis-story-panel-large-content" :id="storyContentId">
    </div>
    <div class="mapgis-story-panel-large-bottom">
      <mapgis-ui-base64-icon v-show="!isPlay" @click="$_play" class="mapgis-story-panel-large-play" type="play"/>
      <mapgis-ui-base64-icon v-show="isPlay" @click="$_play" class="mapgis-story-panel-large-play" type="pause"/>
      <mapgis-ui-iconfont v-show="!isPlay" @click="$_prevFeature" style="width: 20px;cursor: pointer" type="mapgis-left-circle"/>
      {{ currentFeatureIndex }} / {{ this.featureCopy.length }}
      <mapgis-ui-iconfont v-show="!isPlay" @click="$_nextFeature" style="width: 20px;cursor: pointer" type="mapgis-right-circle"/>
    </div>
  </div>
</template>

<script>
import icon from "../img/base64Icon"
import svgIcon from "../img/svgIcon"
import mapStoryService from "../mapStoryService"

export default {
  name: "storyPanelLarge",
  components: {
    "svg-icon": svgIcon,
  },
  mixins: [mapStoryService],
  props: {
    feature: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      interval: undefined,
      isPlay: false,
      storyContentId: "storyContentId" + parseInt(String(Math.random() * 1000000000)),
      showFullImg: false,
      panelHeight: 900,
      showCarousel: false,
      currentFeature: undefined,
      currentFeatureIndex: 1,
      currentImgIndex: 0,
      currentImg: 0,
      featureCopy: [],
      icon: icon,
      containerStyle: {
        position: "absolute",
        top: "14px",
        right: "14px",
        width: "40px",
        height: "40px",
        lineHeight: "51px",
        borderRadius: "100%",
        background: "rgb(111,108,107)"
      },
      iconStyle: {
        opacity: 1
      }
    }
  },
  watch: {
    feature: {
      handler: function () {
        this.$_init();
        this.$nextTick(function () {
          this.$_setContent();
        });
      }
    }
  },
  created() {
    this.$_init();
  },
  mounted() {
    this.panelHeight = this.$_getContainerHeight();
    this.$_setContent();
  },
  methods: {
    $_play() {
      if (!this.isPlay) {
        let vm = this;
        this.isPlay = true;
        vm.currentFeatureIndex = 1;
        vm.currentFeature = vm.featureCopy[vm.currentFeatureIndex - 1];
        vm.$_init();
        vm.$_flyTo();
        this.interval = setInterval(function () {
          if (vm.currentFeatureIndex < vm.featureCopy.length) {
            vm.currentFeatureIndex++;
            vm.currentFeature = vm.featureCopy[vm.currentFeatureIndex - 1];
            vm.$_init();
            vm.$_flyTo();
          } else {
            clearInterval(this.interval);
          }
        }, 5000);
      } else {
        this.isPlay = false;
        clearInterval(this.interval);
      }
    },
    $_setContent() {
      let content = document.getElementById(this.storyContentId);
      if (content) {
        content.innerHTML = this.currentFeature.content;
      }
    },
    $_closeFull() {
      this.showFullImg = false;
    },
    $_afterChange(current) {
      this.currentImgIndex = current;
    },
    $_fullScreen() {
      this.currentImg = this.currentFeature.images[this.currentImgIndex];
      this.showFullImg = true;
    },
    $_flyTo() {
      const {positionCartographic, heading, pitch, roll} = this.currentFeature.camera;
      const {longitude, latitude, height} = positionCartographic;
      this.viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromRadians(longitude, latitude, height),
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll
        }
      });
    },
    $_prevFeature() {
      if (this.currentFeatureIndex > 1) {
        this.currentFeatureIndex--;
        this.currentFeature = this.featureCopy[this.currentFeatureIndex - 1];
        this.$_init();
        this.$_flyTo();
      }
    },
    $_nextFeature() {
      if (this.currentFeatureIndex < this.featureCopy.length) {
        this.currentFeatureIndex++;
        this.currentFeature = this.featureCopy[this.currentFeatureIndex - 1];
        this.$_init();
        this.$_flyTo();
      }
    },
    $_close() {
      this.$emit("closePanel");
    },
    $_init() {
      this.featureCopy = this.feature;
      if (this.featureCopy.length > 0) {
        this.currentFeature = this.featureCopy[this.currentFeatureIndex - 1];
      }
      if (!this.currentFeature) {
        return;
      }
      if (typeof this.currentFeature.images === "string") {
        this.showCarousel = false;
      }
      if (this.currentFeature.images instanceof Array) {
        this.showCarousel = this.currentFeature.images.length !== 1;
      }
    }
  }
}
</script>

<style scoped>
.mapgis-story-panel-large {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  width: 435px;
  height: 900px;
  background: white;
}

.mapgis-story-panel-large-carousel {
  width: 100%;
  height: 278px;
}

.mapgis-story-panel-large-carousel-img {
  width: 100%;
  height: 278px;
}

.mapgis-story-panel-large-title {
  text-align: left;
  padding: 10px 14px;
}

.mapgis-story-panel-large-title > h1 {
  margin-bottom: 0;
}

.mapgis-story-panel-large-content {
  width: 100%;
  word-break: break-word;
  text-align: left;
  font-size: 16px;
  color: rgba(0, 0, 0, .7);
  padding: 0 14px 10px;
  height: calc(100% - 64px - 62px - 278px);
  overflow: hidden;
  overflow-y: scroll;
}

.mapgis-story-panel-large-content > img {
  margin: 10px 0;
}

.mapgis-story-panel-large-full-screen {
  position: absolute;
  top: 228px;
  left: 10px;
  width: 42px;
  height: 42px;
  border-radius: 100%;
  padding: 8px;
}

.mapgis-story-panel-large-full-screen:hover {
  background: rgb(202, 195, 193);
}

.mapgis-story-panel-large-full-screen > img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.mapgis-story-panel-large-fly {
  position: absolute;
  top: 248px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background: rgb(41, 121, 255);
  padding-top: 14px;
  transition: transform 0.5s;
  -moz-transition: transform 0.5s; /* Firefox 4 */
  -webkit-transition: transform 0.5s; /* Safari and Chrome */
  -o-transition: transform 0.5s; /* Opera */
}

.mapgis-story-panel-large-fly:hover {
  transform: scale(1.15);
  -webkit-box-shadow: #666 0 0 10px;
  -moz-box-shadow: #666 0 0 10px;
  box-shadow: #666 0 0 10px;
  cursor: pointer;
}

.mapgis-story-panel-large-fly > img {
  width: 28px;
  height: 28px;
}

.mapgis-story-panel-large-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 64px;
  line-height: 64px;
  border-top: 1px solid rgb(217, 217, 217);
  font-size: 18px;
  text-align: right;
  padding-right: 20px;
}

.mapgis-story-panel-large-full-img {
  position: fixed;
  z-index: 10000000;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
}

.mapgis-story-panel-large-full-close {
  position: fixed;
  z-index: 10000001;
  top: 0;
  right: 0;
}

.mapgis-story-panel-large-play {
  float: left;
  margin-top: 20px;
  margin-left: 12px;
}
</style>