<template>
  <div v-if="currentFeature" class="mapgis-story-panel-large" :style="{height: panelHeight + 'px'}">
    <img v-if="showFullImg" class="mapgis-story-panel-large-full-img" :src="currentImg" alt="">
    <svg-icon @click="$_closeFull"  class="mapgis-story-panel-large-full-close" :icon-style="iconStyle" :container-style="containerStyle" type="close"/>
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
    <svg-icon @click="$_close" :icon-style="iconStyle" :container-style="containerStyle" type="close"/>
    <div class="mapgis-story-panel-large-title">
      <h1>{{ currentFeature.title }}</h1>
    </div>
    <div class="mapgis-story-panel-large-content">
      &nbsp;&nbsp;{{ currentFeature.content }}
    </div>
    <div class="mapgis-story-panel-large-bottom">
      <mapgis-ui-iconfont @click="$_prevFeature" style="width: 20px;cursor: pointer" type="mapgis-left-circle"/>
      {{ currentFeatureIndex }} / {{ this.featureCopy.length }}
      <mapgis-ui-iconfont @click="$_nextFeature" style="width: 20px;cursor: pointer" type="mapgis-right-circle"/>
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
      }
    }
  },
  created() {
    this.$_init();
  },
  mounted() {
    this.panelHeight = this.$_getContainerHeight();
  },
  methods: {
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
      const {x, y, z} = this.currentFeature.baseUrl.geometry;
      let entity = this.viewer.entities.add({
        position: new Cesium.Cartesian3(x, y, z),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#000").withAlpha(0),
          outlineWidth: 0
        }
      });
      this.viewer.flyTo(entity, {
        maximumHeight: 30000
      });
      let vm = this;
      setTimeout(function () {
        vm.viewer.entities.remove(entity);
      }, 400);
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
        if (this.currentFeature.images.length === 1) {
          this.showCarousel = false;
        } else {
          this.showCarousel = true;
        }
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
  padding: 0 14px;
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

.mapgis-mapstory-icon-container:hover {
  background: rgb(88, 86, 87) !important;
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

.mapgis-story-panel-large-full-img{
  position: fixed;
  z-index: 10000000;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
}

.mapgis-story-panel-large-full-close{
  position: fixed;
  z-index: 10000001;
  top: 0;
  right: 0;
}
</style>