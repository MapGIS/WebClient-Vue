<template>
  <div v-if="currentFeature" class="mapgis-ui-story-panel-large"
       :style="{height: height + 'px', width: width + 'px'}">
    <img v-show="showFullImg"
         :style="{width: fullScreenWidth + 'px', height: fullScreenHeight + 'px',left: fullScreenOffsetLeft + 'px', top:fullScreenOffsetTop + 'px'}"
         class="mapgis-ui-story-panel-large-full-img" :src="currentImg" alt="">
    <mapgis-ui-svg-icon v-if="showFullImg" @click="$_closeFull" class="mapgis-ui-story-panel-large-full-close"
                        :icon-style="iconStyle"
                        v-show="enableClose"
                        :container-style="containerStyle" type="close"/>
    <!--轮播图-->
    <mapgis-ui-carousel
        :afterChange="$_afterChange"
        :style="{height: width * 9 / 16 + 'px'}"
        class="mapgis-ui-story-panel-large-carousel"
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
      <div :key="index" v-for="(image,index) in images">
        <img :style="{height: width * 9 / 16 + 'px'}"
             class="mapgis-ui-story-panel-large-carousel-img" :src="image" alt="">
      </div>
    </mapgis-ui-carousel>
    <!--全屏图标-->
    <div v-if="enableFullScreen" @click="$_fullScreen" class="mapgis-ui-story-panel-large-full-screen">
      <mapgis-ui-base64-icon width="24px" height="24px" type="fullScreen"/>
    </div>
    <!--视角定位图标-->
    <div @click="$_flyTo"
         :style="{right: width / 400 * 30 + 'px',paddingTop: width / 400 * 8 + 'px', width: width / 400 * 56 + 'px', height: width / 400 * 56 + 'px', top: width * 9 / 16 - ( width / 400 * 56 ) / 2 + 'px'}"
         class="mapgis-ui-story-panel-large-fly">
      <mapgis-ui-base64-icon style="display: block;margin: auto" :width="width / 400 * 28 + 'px'"
                             :height="width / 400 * 28 + 'px'" type="flyToView"/>
    </div>
    <!--关闭图标-->
    <mapgis-ui-svg-icon v-if="enableFullScreen" @click="$_close" :icon-style="iconStyle"
                        v-show="enableClose && toggleClose"
                        :container-style="containerStyle" type="close"/>
    <div class="mapgis-ui-story-panel-large-close-Anchor" @mouseenter="$_toggleCloseIcon"
         @mouseleave="$_toggleCloseIcon"></div>
    <!--标题-->
    <div class="mapgis-ui-story-panel-large-title">
      {{ currentFeature.title }}
    </div>
    <!--富文本-->
    <!--减去图片高度、标题上边距、标题高度、内容上边距、底部高度-->
    <div :style="{height: height - width * 9 / 16 - 20 -30 - 10 - 64 + 'px', overflowY: showContentScroll}"
         class="mapgis-ui-story-panel-large-content" :id="storyContentId">
    </div>
    <div class="mapgis-ui-story-panel-large-bottom">
      <mapgis-ui-base64-icon v-show="!isPlay && showPlay" @click="$_play" class="mapgis-ui-story-panel-large-play"
                             type="play"/>
      <mapgis-ui-base64-icon v-show="isPlay" @click="$_play" class="mapgis-ui-story-panel-large-play" type="pause"/>
      <mapgis-ui-iconfont v-show="!isPlay && showArrow" @click="$_prevFeature" style="width: 20px;cursor: pointer"
                          type="mapgis-left-circle"/>
      {{ currentFeatureIndex }} / {{ this.dataSourceCopy.length }}
      <mapgis-ui-iconfont v-show="!isPlay && showArrow" @click="$_nextFeature" style="width: 20px;cursor: pointer"
                          type="mapgis-right-circle"/>
    </div>
  </div>
</template>

<script>
import Base64IconsKeyValue from "../iconfont/Base64IconsKeyValue"

export default {
  name: "mapgis-ui-story-panel-large",
  props: {
    //数据源
    dataSource: {
      type: Array,
      default() {
        return [
          {
            images: [],//图片数组
            title: "",//标题
            content: ""//内容
          }
        ];
      }
    },
    height: {
      type: Number,
      default: 900
    },
    width: {
      type: Number,
      default: 400
    },
    showPlay: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    enableFullScreen: {
      type: Boolean,
      default: true
    },
    enableClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      panelScale: 1,
      interval: undefined,
      isPlay: false,
      storyContentId: "storyContentId" + parseInt(String(Math.random() * 1000000000)),
      showFullImg: false,
      currentFeature: undefined,
      currentFeatureIndex: 1,
      currentImgIndex: 0,
      currentImg: 0,
      dataSourceCopy: [],
      icon: Base64IconsKeyValue,
      containerStyle: {
        position: "absolute",
        top: "14px",
        right: "14px",
        width: "40px",
        height: "40px",
        lineHeight: "54px",
        borderRadius: "100%",
        background: "rgba(111,108,107,0.3)",
        textAlign: "center"
      },
      iconStyle: {
        opacity: 1
      },
      showContentScroll: false,
      images: [],
      toggleClose: false,
      fullScreenWidth: 1080,
      fullScreenHeight: 1920,
      fullScreenOffsetLeft: 0,
      fullScreenOffsetTop: 0,
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
        this.$nextTick(function () {
          this.$_setContent();
        });
      },
      deep: true
    },
    height: {
      handler: function () {
        this.panelScale = this.height / 900;
      }
    }
  },
  created() {
    this.$_init();
  },
  mounted() {
    this.$_setContent();
  },
  methods: {
    $_toggleCloseIcon() {
      this.toggleClose = !this.toggleClose;
    },
    $_play() {
      this.$emit("play");
    },
    $_setContent() {
      let content = document.getElementById(this.storyContentId);
      if (content) {
        let contentStr = this.currentFeature.content ? this.currentFeature.content : "无内容";
        content.innerHTML = "<div id='" + this.storyContentId + "Div'>" + contentStr + "</div>";
        this.$nextTick(function () {
          let contentDiv = document.getElementById(this.storyContentId + "Div");
          if (contentDiv.clientHeight > (this.height - this.width * 9 / 16 - 20 - 30 - 10 - 64)) {
            this.showContentScroll = true;
          } else {
            this.showContentScroll = false;
          }
        });
      }
    },
    $_closeFull() {
      this.showFullImg = false;
    },
    $_afterChange(current) {
      this.currentImgIndex = current;
    },
    $_fullScreen() {
      let cesiumCanvas = document.getElementsByClassName("cesium-map-wrapper");
      this.fullScreenWidth = cesiumCanvas[0].offsetWidth;
      this.fullScreenHeight = cesiumCanvas[0].offsetHeight;
      this.fullScreenOffsetLeft = cesiumCanvas[0].offsetLeft;
      this.fullScreenOffsetTop = cesiumCanvas[0].offsetTop;
      this.currentImg = this.currentFeature.images[this.currentImgIndex];
      this.showFullImg = true;
    },
    $_flyTo() {
      this.$emit("flyTo", this.currentFeature.camera, this.currentFeature.animationTime);
    },
    $_resetFeature() {
      this.currentFeatureIndex = 1;
      this.currentFeature = this.dataSourceCopy[this.currentFeatureIndex - 1];
      this.$_init();
      this.$_setContent();
    },
    $_prevFeature() {
      if (this.currentFeatureIndex > 1) {
        this.currentFeatureIndex--;
        this.currentFeature = this.dataSourceCopy[this.currentFeatureIndex - 1];
        this.$_init();
        this.$_flyTo();
        this.$_setContent();
      }
    },
    $_nextFeature() {
      if (this.currentFeatureIndex < this.dataSourceCopy.length) {
        this.currentFeatureIndex++;
        this.currentFeature = this.dataSourceCopy[this.currentFeatureIndex - 1];
        this.$_init();
        this.$_flyTo();
        this.$_setContent();
      }
    },
    $_close() {
      this.$emit("closePanel");
    },
    $_init() {
      this.dataSourceCopy = this.dataSource;
      if (this.dataSourceCopy.length > 0) {
        this.currentFeature = this.dataSourceCopy[this.currentFeatureIndex - 1];
      }
      if (!this.currentFeature) {
        return;
      }
      if (typeof this.currentFeature.images === "string") {
        this.images = [this.currentFeature.images];
      }
      if (this.currentFeature.images instanceof Array) {
        this.images = [];
        for (let i = 0; i < this.currentFeature.images.length; i++) {
          this.$set(this.images, i, this.currentFeature.images[i]);
        }
      }
    }
  }
}
</script>

<style scoped>
.mapgis-ui-story-panel-large {
  position: absolute;
  z-index: 2;
  right: 10px;
  top: 10px;
  margin-right: 3px;
  width: 435px;
  height: 900px;
  transform-origin: top right;
}

.mapgis-ui-story-panel-large-carousel {
  width: 100%;
  height: 278px;
}

.mapgis-ui-story-panel-large-carousel-img {
  width: 100%;
  height: 278px;
}

.mapgis-ui-story-panel-large-title {
  width: 100%;
  margin-top: 20px;
  padding-left: 15px;
  text-align: left;
  font-size: 20px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
}

.mapgis-ui-story-panel-large-content {
  width: 100%;
  word-break: break-word;
  white-space: normal;
  text-align: left;
  font-size: 16px;
  margin-top: 10px;
  height: calc(100% - 64px - 62px - 278px);
  overflow: hidden;
  padding: 0 15px;
}

.mapgis-ui-story-panel-large-full-screen {
  position: absolute;
  top: 120px;
  left: 10px;
  width: 42px;
  height: 42px;
  border-radius: 100%;
  padding: 8px;
  cursor: pointer;
}

.mapgis-ui-story-panel-large-full-screen:hover {
  background: rgb(202, 195, 193);
}

.mapgis-ui-story-panel-large-fly {
  position: absolute;
  width: 56px;
  height: 56px;
  background: rgb(41, 121, 255);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 100%;
  transition: transform 0.5s;
  -moz-transition: transform 0.5s; /* Firefox 4 */
  -webkit-transition: transform 0.5s; /* Safari and Chrome */
  -o-transition: transform 0.5s; /* Opera */
}

.mapgis-ui-story-panel-large-fly:hover {
  transform: scale(1.15);
  -webkit-box-shadow: #7e9cf5 0 0 10px;
  -moz-box-shadow: #7e9cf5 0 0 10px;
  box-shadow: #7e9cf5 0 0 10px;
  cursor: pointer;
}

.mapgis-ui-story-panel-large-fly > img {
  width: 28px;
  height: 28px;
}

.mapgis-ui-story-panel-large-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  text-align: right;
  padding-right: 20px;
}

.mapgis-ui-story-panel-large-full-img {
  position: fixed;
  z-index: 10000000;
}

.mapgis-ui-story-panel-large-full-close {
  position: fixed;
  z-index: 10000001;
  top: 0;
  right: 0;
}

.mapgis-ui-story-panel-large-play {
  float: left;
  margin-top: -2px;
  margin-left: 12px;
}

.mapgis-ui-story-panel-large-close-Anchor {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
