<template>
  <div>
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
    <div class="mapgis-ui-graphic-icons-panel"
         :style="containerStyle"
         v-show="currentIconType === 'model'"
    >
      <div class="mapgis-ui-graphic-icons-head">
        <mapgis-ui-dropdown>
          <div class="mapgis-ui-graphic-dropdown" @click="e => e.preventDefault()">
            {{ $_getType(currentModelType) }}
            <mapgis-ui-iconfont type="mapgis-down"/>
          </div>
          <mapgis-ui-menu slot="overlay">
            <mapgis-ui-menu-item
              v-for="(model, index) in modelTypes"
              :key="index"
              @click="$_chooseModelType(model)">
              <span>{{ $_getType(model) }}</span>
            </mapgis-ui-menu-item>
          </mapgis-ui-menu>
        </mapgis-ui-dropdown>
      </div>
      <div class="mapgis-ui-graphic-icons-container"
           :style="{height: modelIconsContainerHeight + 'px'}"
           @mouseenter="$_toggleModelIconsContainer(true)"
           @mouseleave="$_toggleModelIconsContainer(false)"
      >
        <div class="mapgis-ui-graphic-icon-div"
             :key="index"
             v-for="(model, index) in models[currentModelType]"
        >
          <img @click="$_startDrawModel(model.model)"
               class="mapgis-ui-graphic-icons-model"
               :src="model.img" alt="">
        </div>
      </div>
    </div>
    <mapgis-ui-select-row-left
      v-show="currentIconType === 'model'"
      title="绘制模式"
      :dataSource="drawModes"
      v-model="drawMode"
    />
    <mapgis-ui-input-row-left
      v-show="currentIconType === 'model'"
      title="模型间隔"
      type="Number"
      v-model="drawDistance"
    />
    <mapgis-ui-input-row-left
      v-show="currentIconType === 'model'"
      title="模型大小"
      type="Number"
      v-model="modelRadius"
    />
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
    },
    models: {
      type: Object
    }
  },
  data() {
    return {
      //当前绘制模式，分为三维和二维
      drawType: "二维几何体",
      //图标容器高度
      iconsContainerHeight: 62,
      //模型图标容器高度
      modelIconsContainerHeight: 62,
      //当前图标类型
      currentIconType: "",
      //图标信息数组
      iconsInfo: iconsInfo2D,
      //图标资源
      icons: icons,
      //模型类别
      modelTypes: [],
      //当前的模型类别
      currentModelType: "",
      //绘制模式，点、线、多边形等
      drawMode: "point",
      //绘制间隔（距离）
      drawDistance: 500,
      modelRadius: 1000,
      chooseMode: "point",
      drawModes: [
        {
          key: "point",
          value: "点"
        },
        {
          key: "polyline",
          value: "线"
        },
        {
          key: "polygon",
          value: "多边形"
        }
      ]
    }
  },
  mounted() {
    let vm = this;
    Object.keys(this.models).forEach(function (key) {
      vm.modelTypes.push(key);
    });
    if (this.modelTypes.length > 0) {
      this.currentModelType = vm.modelTypes[0];
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
    //展开或收缩模型图标容器
    $_toggleModelIconsContainer(flag) {
      let length = Math.ceil(this.iconsInfo.length / 5);
      if (flag) {
        this.modelIconsContainerHeight = this.modelIconsContainerHeight * length;
      } else {
        this.modelIconsContainerHeight = this.modelIconsContainerHeight / length;
      }
    },
    //开始绘制
    $_startDraw(type) {
      //设置当前绘制图标类型
      this.currentIconType = type;
      if (type !== "model") {
        this.$emit("startDraw", type);
      }
    },
    //开始绘制
    $_startDrawModel(model) {
      this.$emit("startDrawModel", "model", model, this.drawMode, this.drawDistance, this.modelRadius);
    },
    $_chooseModelType(type) {
      this.currentModelType = type;
    },
    $_getType(type) {
      let title;
      switch (type) {
        case "tree":
          title = "树木";
          break;
        case "traffic":
          title = "交通工具";
          break;
        case "ground":
          title = "地面";
          break;
        case "fence":
          title = "护栏";
          break;
        case "entertainment":
          title = "游乐设施";
          break;
        case "lamp":
          title = "灯";
          break;
      }
      return title;
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

.mapgis-ui-graphic-icons-model {
  width: 41px;
  height: 41px;
  cursor: pointer;
}
</style>