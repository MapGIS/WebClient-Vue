<template>
  <mapgis-ui-row>
    <div v-if="enablePreview" @click="$_clickLarge" class="mapgis-ui-choose-picture-image">
      <mapgis-ui-svg-icon style="margin-top: 50px" v-show="!currentImgUrl" :icon-style="iconStyle" type="image"/>
      <mapgis-ui-svg-icon @click="$_reload" style="right: 36px;" class="mapgis-ui-choose-picture-icon-container"
                          v-show="currentImgUrl"
                          :icon-style="iconStyle" type="edit"/>
      <mapgis-ui-svg-icon @click="$_delete" class="mapgis-ui-choose-picture-icon-container" v-show="currentImgUrl"
                          :icon-style="iconStyle"
                          type="delete"/>
      <img class="mapgis-ui-choose-picture-current-img" :src="currentImgUrl" alt="">
    </div>
    <input style="display: none" type="file" :id="inputId"
           accept="image/png, image/jpeg, image/gif, image/jpg, image/svg">
    <div class="mapgis-ui-choose-picture-img-title" v-show="!enablePreview" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
      <mapgis-ui-title-icon v-show="showTitleIcon"/>
      {{ title }}
    </div>
    <!--图片高度、图片下边距、区域内边距-->
    <div :style="{height: parseInt(String(Math.ceil(( imgUrls.length + 1 ) / 3))) * (58 + 10 + 8) + 'px'}"
         v-show="currentImgUrl || !enablePreview" class="mapgis-ui-choose-picture-carousel">
      <div :key="index"
           class="mapgis-ui-choose-picture-img-container"
           v-for="(imgUrl,index) in imgUrls"
           @mouseenter="$_mouseenter(index)"
           @mouseleave="$_mouseleave()"
           :style="{marginLeft: index % 3 === 0 ? '0' : '1%',marginRight: index % 3 === 2 ? '0' : '1%'}"
      >
        <!--遮罩-->
        <div v-show="shapeIndex === index" class="mapgis-ui-choose-picture-img-shape">
          <mapgis-ui-svg-icon @click="$_reload(index)"
                              style="width: 36px;text-align: center;margin-top: 10px;padding-left: 10px"
                              :iconStyle="shapeIcon" type="edit"/>
          <mapgis-ui-svg-icon @click="$_delete(index)"
                              style="width: 36px;text-align: center;margin-top: 10px;padding-right: 10px"
                              :iconStyle="shapeIcon" type="delete"/>
        </div>
        <img :class="{imgActive: currenImgIndex === index}" @click="$_activeImg(index)"
             class="mapgis-ui-choose-picture-img" :src="imgUrl" alt="">
      </div>
      <mapgis-ui-base64-icon
          title="添加图片"
          :iconStyle="addIconStyle"
          :titleStyle="titleStyle"
          @click="$_clickSmall"
          :style="{marginLeft: imgUrls.length % 3 === 2 ? 0 : '1%'}"
          class="mapgis-ui-choose-picture-upload mapgis-ui-choose-picture-img-container"
          type="addPicture"/>
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-choose-picture",
  model: {
    prop: "images",
    event: "change"
  },
  props: {
    showTitleIcon: {
      type: Boolean,
      default: true
    },
    images: {
      type: [Array, String]
    },
    enablePreview: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "图片展示"
    }
  },
  data() {
    return {
      imagesCopyCopy: undefined,
      loadImg: true,
      currenImgIndex: 0,
      currentImgUrl: undefined,
      imgUrls: [],
      iconStyle: {
        opacity: 1
      },
      inputId: "mapgisImgInput" + parseInt(String(Math.random() * 10000)),
      shapeIndex: undefined,
      shapeIcon: {
        width: "18px",
      },
      addIconStyle: {
        width: "20px",
        marginTop: "calc(25% - 10px)",
        marginLeft: "calc((100% - 20px)/2)",
      },
      titleStyle: {
        color: "#747070",
        top: "34px",
        left: "11px",
        fontWeight: "border"
      }
    }
  },
  watch: {
    images: {
      handler: function () {
        this.getImagesCopy();
      },
      deep: true
    },
    imgUrls: {
      handler: function () {
        this.$emit("change", this.imgUrls);
      },
      deep: true
    }
  },
  created() {
    this.getImagesCopy();
  },
  methods: {
    $_mouseenter(index) {
      this.shapeIndex = index;
    },
    $_mouseleave() {
      this.shapeIndex = undefined;
    },
    getImagesCopy() {
      this.imagesCopy = this.images;
      if (this.imagesCopy) {
        if (typeof this.imagesCopy === "string") {
          this.currentImgUrl = this.imagesCopy;
          this.imgUrls.push(this.currentImgUrl);
        } else if (this.imagesCopy instanceof Array) {
          if (this.imagesCopy.length > 0) {
            this.currentImgUrl = this.imagesCopy[this.currenImgIndex];
            this.imgUrls = this.imagesCopy;
          }
        }
      } else {
        this.imagesCopy = [];
        this.imgUrls = this.imagesCopy;
      }
    },
    $_delete(index) {
      this.loadImg = false;
      if (typeof index === "number") {
        this.currenImgIndex = index;
      }
      this.imgUrls.splice(this.currenImgIndex, 1);
      if (this.imgUrls.length > 0) {
        if (this.currenImgIndex === 0) {
          this.currentImgUrl = this.imgUrls[this.currenImgIndex];
        } else if (this.imgUrls.length >= this.currenImgIndex) {
          this.currentImgUrl = this.imgUrls[this.currenImgIndex - 1];
          this.currenImgIndex = this.currenImgIndex - 1;
        }
      } else {
        this.currenImgIndex = undefined;
        this.currentImgUrl = undefined;
      }
      let vm = this;
      setTimeout(function () {
        vm.loadImg = true;
      }, 200);
    },
    $_reload(index) {
      let vm = this;
      if (typeof index === "number") {
        this.currenImgIndex = index;
      }
      this.$_chooseImg(function (url) {
        vm.currentImgUrl = url;
        vm.$set(vm.imgUrls, vm.currenImgIndex, url);
      });
    },
    $_activeImg(index) {
      this.currenImgIndex = index;
      this.currentImgUrl = this.imgUrls[index];
    },
    $_clickLarge() {
      if (!this.currentImgUrl) {
        this.$_chooseImg();
      }
    },
    $_clickSmall() {
      if (this.currentImgUrl || !this.enablePreview) {
        this.$_chooseImg();
      }
    },
    $_chooseImg(callBack) {
      if (!this.loadImg) {
        return;
      }
      let inputFile = document.getElementById(this.inputId), vm = this;
      inputFile.click();
      inputFile.onchange = function () {
        let File = inputFile.files[0];
        let url = window.URL.createObjectURL(File);
        inputFile.value = '';
        if (callBack) {
          callBack(url);
        } else {
          vm.imgUrls.push(url);
          vm.currentImgUrl = url;
          vm.currenImgIndex = vm.imgUrls.length - 1;
          if (vm.imgUrls.length === 1) {
            vm.$emit("firstAddPicture");
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.mapgis-ui-choose-picture-img-title {
  font-weight: bolder;
  position: relative;
  margin-top: 6px;
  margin-bottom: 4px;
  padding-left: 12px;
}

.mapgis-ui-choose-picture-image {
  position: relative;
  width: 100%;
  height: 160px;
  background: rgb(57, 68, 87);
  border-radius: 4px;
  margin: 20px auto;
  overflow: hidden;
  text-align: center;
}

.mapgis-ui-choose-picture-carousel {
  width: 99%;
  padding: 8px;
  height: auto;
  text-align: left;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 3px;
}

.mapgis-ui-choose-picture-img-container {
  position: relative;
  display: inline-block;
  float: left;
  width: 32%;
  height: 58px;
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 10px;
  cursor: pointer;
}

.mapgis-ui-choose-picture-img {
  height: 100%;
  width: 100%;
}

.mapgis-ui-choose-picture-img-shape {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #001326;
  opacity: 0.3;
}

.imgActive {
  border: 2px solid rgb(138, 180, 248);
}

.mapgis-ui-choose-picture-upload {
  background: #DCDCDC;
  border: 1px dashed #CCCCCC;
}

.mapgis-ui-choose-picture-icon-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  line-height: 50px;
}

.mapgis-ui-choose-picture-icon-container:hover {
  background: rgb(43, 43, 45);
}

.mapgis-ui-choose-picture-current-img {
  height: 100%;
  width: 90%;
}
</style>