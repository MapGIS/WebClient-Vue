<template>
  <div class="mapgis-ui-graphic-icons-panel" :style="containerStyle">
    <div class="mapgis-ui-graphic-icons-head">
      <mapgis-ui-dropdown>
        <div class="mapgis-ui-graphic-dropdown" @click="e => e.preventDefault()">
          {{ drawType }}
          <mapgis-ui-iconfont type="mapgis-down"/>
        </div>
        <mapgis-ui-menu slot="overlay">
          <mapgis-ui-menu-item @click="$_chooseDrawType('二维几何体')">
            <span>二维几何体</span>
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item @click="$_chooseDrawType('三维几何体')">
            <span>三维几何体</span>
          </mapgis-ui-menu-item>
        </mapgis-ui-menu>
      </mapgis-ui-dropdown>
    </div>
    <div class="mapgis-ui-graphic-icons-container"
         :style="{height: iconsContainerHeight + 'px'}"
         @mouseenter="$_toggleIconsContainer(true)"
         @mouseleave="$_toggleIconsContainer(false)"
    >
      <div class="mapgis-ui-graphic-icon-div"
           :key="index"
           v-for="(icon, index) in iconsInfo"
           :style="{outline: icon.type === currentIconType ? '1px solid #1890FF' : 'none'}"
      >
        <img @click="$_startDraw(icon.type)"
             class="mapgis-ui-graphic-icon"
             :src="icons[icon.type + 'Image']"
             :title="icon.title" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import icons from "./GraphicBase64Icons"
import iconsInfo3D from "./iconsInfo3D";
import iconsInfo2D from "./iconsInfo2D";

export default {
  name: "mapgis-ui-graphic-icons-panel",
  props: {
    containerStyle: {
      type: Object
    }
  },
  data() {
    return {
      //当前绘制模式，分为三维和二维
      drawType: "二维几何体",
      //图标容器高度
      iconsContainerHeight: 62,
      //当前图标类型
      currentIconType: "",
      //图标信息数组
      iconsInfo: iconsInfo2D,
      //图标资源
      icons: icons,
    }
  },
  methods: {
    //确定当前的绘制模式，是三维还是二维
    $_chooseDrawType(type) {
      this.drawType = type;
      if (type === "二维几何体") {
        this.iconsInfo = iconsInfo2D;
      } else {
        this.iconsInfo = iconsInfo3D;
      }
    },
    //展开或收缩图标容器
    $_toggleIconsContainer(flag) {
      let length = Math.ceil(this.iconsInfo.length / 5);
      if (flag) {
        this.iconsContainerHeight = this.iconsContainerHeight * length;
      } else {
        this.iconsContainerHeight = this.iconsContainerHeight / length;
      }
    },
    //开始绘制
    $_startDraw(type) {
      //设置当前绘制图标类型
      this.currentIconType = type;
      this.$emit("startDraw", type);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-graphic-icons-panel {
  width: 300px;
  height: auto;
  background: #FFFFFF;
  border: 1px solid #DCDCDC;
  margin: 16px;
}

.mapgis-ui-graphic-icons-head {
  width: 100%;
  height: 32px;
  border-bottom: 1px solid #DCDCDC;
}

.mapgis-ui-graphic-icons-container {
  width: 100%;
  height: 62px;
  overflow: hidden;
  text-align: left;
  transition: height 0.5s ease;
}

.mapgis-ui-graphic-icon {
  width: 17px;
  height: 17px;
  margin: 12px;
  cursor: pointer;
}

.mapgis-ui-graphic-icon-div {
  display: inline-block;
  width: auto;
  height: auto;
  margin: 10px 9px;
  float: left;
}

.mapgis-ui-graphic-dropdown {
  height: 100%;
  line-height: 32px;
  cursor: pointer;
  text-align: center;
}
</style>