<template>
  <mapgis-ui-row>
    <div @click="$_clickLarge" class="mapgis-ui-choose-picture-image">
      <mapgis-ui-svg-icon style="margin-top: 50px" v-show="!currentImgUrl" :icon-style="iconStyle" type="image"/>
      <mapgis-ui-svg-icon @click="$_reload" style="right: 36px;" class="mapgis-ui-choose-picture-icon-container"
                v-show="currentImgUrl"
                :icon-style="iconStyle" type="edit"/>
      <mapgis-ui-svg-icon @click="$_delete" class="mapgis-ui-choose-picture-icon-container" v-show="currentImgUrl"
                :icon-style="iconStyle"
                type="delete"/>
      <input style="display: none" type="file" :id="inputId"
             accept="image/png, image/jpeg, image/gif, image/jpg, image/svg">
      <img style="height: 100%" :src="currentImgUrl" alt="">
    </div>
    <div v-show="currentImgUrl" class="mapgis-ui-choose-picture-carousel">
      <img :class="{imgActive: currenImgIndex === index}" @click="$_activeImg(index)"
           :style="{marginRight: index && index % 3 === 0 ? 0 : '13px'}" :key="index" v-for="(imgUrl,index) in imgUrls"
           class="mapgis-ui-choose-picture-img" :src="imgUrl" alt="">
      <mapgis-ui-svg-icon @click="$_clickSmall" class="mapgis-ui-choose-picture-upload" :icon-style="iconStyle" type="image"/>
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
    images: {
      type: [Array, String]
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
    $_delete() {
      this.loadImg = false;
      this.imgUrls.splice(this.currenImgIndex, 1);
      if (this.imgUrls.length > 0) {
        if(this.currenImgIndex === 0){
          this.currentImgUrl = this.imgUrls[this.currenImgIndex];
        }else if (this.imgUrls.length >= this.currenImgIndex) {
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
    $_reload() {
      let vm = this;
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
      if (this.currentImgUrl) {
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
        if (callBack) {
          callBack(url);
        } else {
          vm.imgUrls.push(url);
          vm.currentImgUrl = url;
          vm.currenImgIndex = vm.imgUrls.length - 1;
        }
      }
    }
  }
}
</script>

<style scoped>
.mapgis-ui-choose-picture-image {
  position: relative;
  width: 344px;
  height: 160px;
  background: rgb(57, 68, 87);
  border-radius: 4px;
  margin: 20px auto;
  overflow: hidden;
  text-align: center;
}

.mapgis-ui-choose-picture-carousel {
  width: 344px;
  height: auto;
  overflow: hidden;
  text-align: left;
  margin: 10px auto;
  margin-top: 0;
}

.mapgis-ui-choose-picture-img {
  width: 76px;
  height: 58px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 13px;
  margin-bottom: 10px;
  display: inline-block;
  float: left;
}

.imgActive {
  border: 2px solid rgb(138, 180, 248);
}

.mapgis-ui-choose-picture-upload {
  width: 76px;
  height: 58px;
  background: rgb(47, 68, 87);
  border-radius: 4px;
  padding-left: 26px;
  margin-bottom: 10px;
  float: left;
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
</style>