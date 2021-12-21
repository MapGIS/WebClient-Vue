<template>
  <div class="mapgis-3d-graphic-container" v-if="dataSourceCopy">
    <div>
      <div class="mapgis-3d-graphic-icons-panel">
        <div class="mapgis-3d-graphic-icons-head">
          <mapgis-ui-dropdown>
            <div class="mapgis-3d-graphic-dropdown" @click="e => e.preventDefault()">
              {{ drawType }}
              <mapgis-ui-iconfont type="mapgis-down"/>
            </div>
            <mapgis-ui-menu slot="overlay">
              <mapgis-ui-menu-item @click="$_chooseDrawType('三维几何体')">
                <span>三维几何体</span>
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item @click="$_chooseDrawType('二维几何体')">
                <span>二维几何体</span>
              </mapgis-ui-menu-item>
            </mapgis-ui-menu>
          </mapgis-ui-dropdown>
        </div>
        <div class="mapgis-3d-graphic-icons-container"
             :style="{height: iconsContainerHeight + 'px'}"
             @mouseenter="$_toggleIconsContainer(true)"
             @mouseleave="$_toggleIconsContainer(false)"
        >
          <img @click="$_startDraw(icon.type)" class="mapgis-3d-graphic-icon" :key="index" v-for="(icon, index) in iconsInfo" :src="imgs[icon.type + 'Image']"
               :title="icon.title" alt="">
        </div>
      </div>
    </div>
    <div>
      <mapgis-ui-card
        style="width:100%"
        :tab-list="tabListNoTitle"
        :active-tab-key="noTitleKey"
        @tabChange="key => onTabChange(key, 'noTitleKey')"
      >
        <div v-if="noTitleKey === 'list'">
          <div @dblclick="$_dbclick" :key="index" v-for="(row, index) in dataSourceCopy">
            <mapgis-ui-icon-row :src="imgs[row.type + 'Image']" :title="row.name"/>
          </div>
        </div>
        <div v-else-if="noTitleKey === 'edit'">
          <div :key="index" v-for="(row, index) in editList[currentEditType]">
            <mapgis-ui-input-row v-if="row.type === 'inputRow'" :title="row.title"/>
          </div>
        </div>
      </mapgis-ui-card>
    </div>
  </div>
</template>

<script>
import GraphicLayerService from "./GraphicLayerService";
import * as imgs from "../Plotting/base64Source"
import iconsInfo3D from "./iconsInfo3D";
import iconsInfo2D from "./iconsInfo2D";

export default {
  name: "mapgis-3d-graphic-layer",
  mixins: [GraphicLayerService],
  model: {
    prop: "dataSource",
    event: "change"
  },
  props: {
    //数据源
    dataSource: {
      type: Array
    }
  },
  data() {
    return {
      //切换面板参数
      tabListNoTitle: [
        {
          key: 'list',
          tab: '标注列表',
        },
        {
          key: 'edit',
          tab: '设置面板',
        }
      ],
      //当前显示面板
      noTitleKey: 'list',
      //设置面板显示参数
      editList: {
        point: [{
          type: "inputRow",
          title: "名称"
        }, {
          type: "inputRow",
          title: "半径"
        }, {
          type: "inputRow",
          title: "填充颜色"
        }, {
          type: "inputRow",
          title: "透明度"
        }, {
          type: "inputRow",
          title: "外边线"
        }, {
          type: "inputRow",
          title: "外边线颜色"
        }, {
          type: "inputRow",
          title: "外边线透明度"
        }]
      },
      //当前编辑的类型
      currentEditType: "point",
      //数据源副本
      dataSourceCopy: undefined,
      //图标资源
      imgs: imgs,
      //图标信息数组
      iconsInfo: iconsInfo2D,
      //图标容器高度
      iconsContainerHeight: 62,
      //当前绘制模式，分为三维和二维
      drawType: "二维几何体"
    };
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        this.$emit("change", this.dataSourceCopy);
      },
      deep: true
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    //开始绘制
    $_startDraw(type) {
      this.noTitleKey = "edit";
      this.$_startDrawing({
        id: "1111111",
        type: "label",
        text: '无标题',
        font: '50px Helvetica',
        pixelSize: 20,
        pixelOffsetScaleByDistance: false,
        horizontalOrigin: Cesium.HorizontalOrigin.right,
        fillColor: '#000',
        isScaleByDistance: true, //是否远近缩放
        getPrimitive: function (e) {
          console.log("------",e)
        }
      });
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
    //确定当前的绘制模式，是三维还是二维
    $_chooseDrawType(type) {
      this.drawType = type;
      if (type === "二维几何体") {
        this.iconsInfo = iconsInfo2D;
      } else {
        this.iconsInfo = iconsInfo3D;
      }
    },
    //双击一条标注列表里的要素，进入到设置面板
    $_dbclick() {
      this.noTitleKey = "edit";
    },
    //初始化组件
    $_init() {
      this.dataSourceCopy = this.dataSource;
      //初始化GraphicLayer对象
      this.$_initGraphicLayer();
    },
    onTabChange(key, type) {
      this[type] = key;
    },
  },
}
</script>

<style scoped>
/*--------------标绘容器--------------*/
.mapgis-3d-graphic-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 332px;
  height: 785px;
  background: white;
}

/*------------图标面板---------------*/
.mapgis-3d-graphic-icons-panel {
  width: 300px;
  height: auto;
  background: #FFFFFF;
  border: 1px solid #DCDCDC;
  margin: 16px;
}

.mapgis-3d-graphic-icons-head {
  width: 100%;
  height: 32px;
  border-bottom: 1px solid #DCDCDC;
}

.mapgis-3d-graphic-icons-container {
  width: 100%;
  height: 62px;
  overflow: hidden;
  text-align: left;
  transition: height 0.5s ease;
}

.mapgis-3d-graphic-icon {
  width: 17px;
  height: 17px;
  margin: 21px;
  cursor: pointer;
}

.mapgis-3d-graphic-dropdown {
  height: 100%;
  line-height: 32px;
  cursor: pointer;
}
</style>