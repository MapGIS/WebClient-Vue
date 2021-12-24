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
              <mapgis-ui-menu-item @click="$_chooseDrawType('二维几何体')">
                <span>二维几何体</span>
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item @click="$_chooseDrawType('三维几何体')">
                <span>三维几何体</span>
              </mapgis-ui-menu-item>
            </mapgis-ui-menu>
          </mapgis-ui-dropdown>
        </div>
        <div class="mapgis-3d-graphic-icons-container"
             :style="{height: iconsContainerHeight + 'px'}"
             @mouseenter="$_toggleIconsContainer(true)"
             @mouseleave="$_toggleIconsContainer(false)"
        >
          <div class="mapgis-3d-graphic-icon-div"
               :key="index"
               v-for="(icon, index) in iconsInfo"
               :style="{outline: icon.type === currentIconType ? '1px solid #1890FF' : 'none'}"
          >
            <img @click="$_startDraw(icon.type)"
                 class="mapgis-3d-graphic-icon"
                 :src="imgs[icon.type + 'Image']"
                 :title="icon.title" alt="">
          </div>
        </div>
      </div>
    </div>
    <div>
      <mapgis-ui-card
        style="width:100%;"
        :tab-list="tabListNoTitle"
        :active-tab-key="noTitleKey"
        :bodyStyle="cardBodyStyle"
        @tabChange="key => onTabChange(key, 'noTitleKey')"
      >
        <!--标注列表-->
        <div v-if="noTitleKey === 'list'">
          <div @dblclick="$_dbclick(row)" :key="index" v-for="(row, index) in dataSourceCopy">
            <mapgis-ui-icon-row @clickTool="$_clickTool($event, row)" :iconStyle="iconStyle" :mainStyle="rowStyle"
                                :src="imgs[row.type + 'Image']" :title="row.title"/>
          </div>
        </div>
        <!--设置面板-->
        <div v-else-if="noTitleKey === 'edit'">
          <div v-if="editPanelValues" style="margin-bottom: 12px;">
            <mapgis-ui-row class="mapgis-3d-graphic-type">
              <span>
                类型 :
              </span>
              <span style="margin-left: 30px">
                {{ $_formatType(currentEditType) }}
              </span>
            </mapgis-ui-row>
            <div :key="index" v-for="(row, index) in editList[currentEditType]">
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInput'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInput"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="['outlineWidth','backgroundPadding','speed','duration','gradient','count'].indexOf(row.key) < 0"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="row.key === 'outlineWidth' && editPanelValues.showOutline"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="row.key === 'backgroundPadding' && editPanelValues.showBackground"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="row.key === 'speed' && editPanelValues.materialType === 'RadarMaterial'"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="row.key === 'duration' && editPanelValues.materialType === 'CircleWaveMaterial'"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="row.key === 'gradient' && editPanelValues.materialType === 'CircleWaveMaterial'"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiInputNumber'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="mainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiInputNumber"
                v-show="row.key === 'count' && editPanelValues.materialType === 'CircleWaveMaterial'"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiSlider'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="sliderMainStyle"
                :extraStyle="sliderInputStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiSlider"
                v-show="row.key !== 'outlineOpacity' && row.key !== 'backgroundOpacity'"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiSlider'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="sliderMainStyle"
                :extraStyle="sliderInputStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiSlider"
                v-show="row.key === 'outlineOpacity' && editPanelValues.showOutline"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiSlider'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="sliderMainStyle"
                :extraStyle="sliderInputStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiSlider"
                v-show="row.key === 'backgroundOpacity' && editPanelValues.showBackground"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiSlider'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="sliderMainStyle"
                :extraStyle="sliderInputStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiSlider"
                v-show="row.key === 'pureOpacity' && (editPanelValues.materialType === 'RadarMaterial' || editPanelValues.materialType === 'CircleWaveMaterial')"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiSelect'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="selectMainStyle"
                :dataSource="row.dataSource"
                v-model="editPanelValues[row.key]"
                type="MapgisUiSelect"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiColorPicker'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="colorMainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiColorPicker"
                v-show="['outlineColor','backgroundColor','materialColor','pureColor'].indexOf(row.key) < 0"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiColorPicker'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="colorMainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiColorPicker"
                v-show="row.key === 'outlineColor' && editPanelValues.showOutline"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiColorPicker'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="colorMainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiColorPicker"
                v-show="row.key === 'backgroundColor' && editPanelValues.showBackground"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiColorPicker'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="colorMainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiColorPicker"
                v-show="row.key === 'materialColor' && (editPanelValues.materialType === 'RadarMaterial' || editPanelValues.materialType === 'CircleWaveMaterial')"
              />
              <mapgis-ui-mix-row
                v-if="row.type === 'MapgisUiColorPicker'"
                :title="row.title"
                :titleStyle="titleStyle"
                :mainStyle="colorMainStyle"
                v-model="editPanelValues[row.key]"
                type="MapgisUiColorPicker"
                v-show="row.key === 'pureColor' && editPanelValues.materialType === 'Color'"
              />
              <mapgis-ui-choose-picture-right
                v-if="row.type === 'MapgisUiPicture'"
                :showTitleIcon="false"
                :title="row.title"
                :carouselStyle="carouselStyle"
                :titleStyle="pTitleStyle"
                v-model="editPanelValues[row.key]"
                :enablePreview="false"
              />
              <mapgis-ui-row class="mapgis-3d-graphic-switch"
                             v-if="row.type === 'MapgisUiShowOutline'">
                <span class="mapgis-3d-graphic-switch-title">
                  {{ row.title }} :
                </span>
                <mapgis-ui-switch class="mapgis-3d-graphic-switch-button"
                                  @change="$_showOutLine" checked-children="是" un-checked-children="否"
                                  v-model="row.value"/>
              </mapgis-ui-row>
              <mapgis-ui-row class="mapgis-3d-graphic-switch"
                             v-if="row.type === 'MapgisUiShowBackground'">
                <span class="mapgis-3d-graphic-switch-title">
                  {{ row.title }} :
                </span>
                <mapgis-ui-switch class="mapgis-3d-graphic-switch-button"
                                  @change="$_showBackground" checked-children="是" un-checked-children="否"
                                  v-model="row.value"/>
              </mapgis-ui-row>
            </div>
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
import editList from "./editList";

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
      type: Array,
      default() {
        return []
      }
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
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
      editList: editList,
      //当前编辑的类型
      currentEditType: "",
      //当前图标类型
      currentIconType: "",
      //数据源副本
      dataSourceCopy: undefined,
      //图标资源
      imgs: imgs,
      //图标信息数组
      iconsInfo: iconsInfo2D,
      //图标容器高度
      iconsContainerHeight: 62,
      //当前绘制模式，分为三维和二维
      drawType: "二维几何体",
      //设置面板的显示数据
      editPanelValues: undefined,
      //名称输入框样式
      mainStyle: {
        width: "220px"
      },
      //名称输入框的标题样式
      titleStyle: {
        marginLeft: "24px"
      },
      //颜色选择器主体样式
      colorMainStyle: {
        width: "220px",
        marginLeft: "13px"
      },
      //滑动组件主体样式
      sliderMainStyle: {
        width: "106px",
        marginLeft: "-13px"
      },
      //下拉框组件主体样式
      selectMainStyle: {
        width: "220px",
        marginLeft: "-28px"
      },
      //滑动组件右边输入框样式
      sliderInputStyle: {
        marginLeft: "-64px"
      },
      //标注列表一行的样式
      rowStyle: {
        height: "40px",
        lineHeight: "40px",
        paddingLeft: "20px"
      },
      //标注列表一行中的图标样式
      iconStyle: {
        marginTop: "-4px"
      },
      //tab框的body样式
      cardBodyStyle: {
        padding: "0"
      },
      //是否开始编辑
      isEdit: false,
      //是否开始绘制
      isStartDrawing: false,
      //是否在添加数据
      addSource: false,
      //本地图片样式
      carouselStyle: {
        paddingRight: "11px"
      },
      //本地图片样式
      pTitleStyle: {
        fontWeight: "normal"
      },
      //绘制的数量
      drawNum: {
        label: 0,
        box: 0,
        billboard: 0,
        polyline: 0,
        polygon: 0,
        point: 0,
        circle: 0,
        cylinder: 0,
        cone: 0,
        polylineVolume: 0,
        corridor: 0,
        wall: 0,
        rectangle: 0,
        ellipsoid: 0,
      }
    };
  },
  watch: {
    dataSource: {
      handler: function () {
        if (!this.isEdit && !this.addSource) {
          this.$_init();
        }
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        // this.$emit("change", this.dataSourceCopy);
      },
      deep: true
    },
    editPanelValues: {
      handler: function () {
        if (this.isEdit) {
          //在绘制中，更改参数时先停止绘制，应用参数，在开始绘制
          if (this.isStartDrawing) {
            //停止绘制
            this.$_stopDrawing();
            //根据面板显示参数数据生成绘制参数
            let drawOptions = this.$_getDrawOptions(this.editPanelValues, this.currentEditType, Cesium);
            //根据编辑面板参数绘制图形
            let drawType = this.currentEditType;
            if (drawType === "cone") {
              drawType = "circle";
            }
            if (drawType === "polygonCube") {
              drawType = "polygon";
            }
            this.$_startDrawing({
              type: drawType,
              ...drawOptions
            });
          } else {
            //结束绘制
            //先存起来title
            let title = this.editPanelValues.title;
            //更新样式
            let options = this.$_getDrawOptions(this.editPanelValues, this.currentEditType, Cesium);
            this.$_updateStyleByStyle(this.editPanelValues.id, options.style);
            if (options.hasOwnProperty("position")) {
              let graphicsLayer = this.$_getGraphicLayer();
              let primitive = graphicsLayer.getGraphicByID(this.editPanelValues.id);
              primitive.primitive.position = Cesium.Cartesian3.fromDegrees(options.position.lng, options.position.lat, this.editPanelValues.height);
            }
            //更新数据
            let dataSource = this.$_getJsonById(this.editPanelValues.id);
            dataSource.title = title;
            this.$_updateSourceById(this.editPanelValues.id, dataSource);
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    $_showBackground(e) {
      this.editPanelValues.showBackground = e;
      this.$_update();
    },
    $_showOutLine(e) {
      this.editPanelValues.showOutline = e;
      // this.$_update();
    },
    $_update() {
      //先存起来title
      let title = this.editPanelValues.title;
      //更新样式
      let options = this.$_getDrawOptions(this.editPanelValues, this.currentEditType, Cesium);
      this.$_updateStyleByStyle(this.editPanelValues.id, options.style);
      if (options.hasOwnProperty("position")) {
        let graphicsLayer = this.$_getGraphicLayer();
        let primitive = graphicsLayer.getGraphicByID(this.editPanelValues.id);
        primitive.primitive.position = Cesium.Cartesian3.fromDegrees(options.position.lng, options.position.lat, this.editPanelValues.height);
      }
      //更新数据
      let dataSource = this.$_getJsonById(this.editPanelValues.id);
      dataSource.title = title;
      this.$_updateSourceById(this.editPanelValues.id, dataSource);
    },
    $_updateSourceById(id, data) {
      let index;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].id === id) {
          index = i;
          break;
        }
      }
      this.$set(this.dataSourceCopy, index, data);
    },
    /**
     * 更多工具里面的按钮的点击事件
     * @param type String 点击事件类型
     * @param row Object 一个要素数据
     * */
    $_clickTool(type, row) {
      switch (type) {
        case "edit":
          this.$_dbclick(row);
          break;
        case "delete":
          let index;
          for (let i = 0; i < this.dataSourceCopy.length; i++) {
            if (this.dataSourceCopy[i].id === row.id) {
              index = i;
              break;
            }
          }
          this.dataSourceCopy.splice(index, 1);
          let graphicsLayer = this.$_getGraphicLayer(this.vueIndex, this.vueKey);
          graphicsLayer.removeGraphicByID(row.id);
          break;
      }
    },
    /**
     * 根据当前的绘制类型，获取设置面板显示参数数据
     * @param editList Array 设置面板
     * @param currentEditType String 类型
     * @return editPanelValues Object 设置面板里面要显示的数值
     * */
    $_getEditPanelValues(editList, currentEditType) {
      let editInfo = this.editList[this.currentEditType];
      let editPanelValues = {};
      for (let i = 0; i < editInfo.length; i++) {
        editPanelValues[editInfo[i].key] = editInfo[i].value;
      }
      return editPanelValues;
    },
    /**
     * 从一个绘制要素的JSON对象中取得设置面板显示参数
     * @param json Object 一个绘制要素的JSON对象
     * @return editPanelValues Object 设置面板里面要显示的数值
     * */
    $_getEditPanelValuesFromJSON(json) {
      if (!json || !(json instanceof Object) || JSON.stringify(json) === "{}") {
        console.warn("json对象不能为空！");
        return;
      }
      if (!json.hasOwnProperty("type") || !json.hasOwnProperty("id")) {
        console.warn("type或者id不存在！");
        return;
      }
      const {
        id,
        positions,
        style,
        editPointStyle,
        attributes,
        name,
        show,
        editing,
        allowPicking,
        modelMatrix,
        asynchronous,
        title
      } = json;

      const {
        text, font, color, fillColor, backgroundColor, outlineWidth, outlineColor, image,
        extrudedHeight, width, height, topRadius, backgroundOpacity, backgroundPadding, bottomRadius,
        pixelSize, radius, materialType, material, cornerType, radiusX, radiusY, radiusZ
      } = style;

      let editPanelValues = {};

      switch (json.type) {
        case "point":
          editPanelValues.id = id;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.pixelSize = pixelSize;
          editPanelValues.height = height;
          editPanelValues.outlineWidth = outlineWidth;
          editPanelValues.outlineOpacity = outlineColor[3] * 100;
          editPanelValues.outlineColor = "rgb(" + outlineColor[0] * 255 + "," + outlineColor[1] * 255 + "," + outlineColor[2] * 255 + ")";
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "label":
          editPanelValues.id = id;
          editPanelValues.text = text;
          editPanelValues.title = title;
          editPanelValues.name = name;
          let fonts;
          if (typeof font === "number") {
            fonts = [font, "sans-serif"];
          } else if (font.indexOf(" ") > -1) {
            fonts = font.split(" ");
          } else {
            fonts = [font, "sans-serif"];
          }
          editPanelValues.fontSize = fonts[0];
          editPanelValues.fontFamily = fonts[1];
          editPanelValues.fontColor = "rgb(" + fillColor[0] * 255 + "," + fillColor[1] * 255 + "," + fillColor[2] * 255 + ")";
          editPanelValues.opacity = fillColor[3] * 100;
          editPanelValues.backgroundColor = "rgb(" + backgroundColor[0] * 255 + "," + backgroundColor[1] * 255 + "," + backgroundColor[2] * 255 + ")";
          editPanelValues.backgroundOpacity = backgroundColor[3] * 100;
          editPanelValues.backgroundPadding = backgroundPadding.x;
          editPanelValues.outlineWidth = outlineWidth;
          editPanelValues.outlineColor = "rgb(" + outlineColor[0] * 255 + "," + outlineColor[1] * 255 + "," + outlineColor[2] * 255 + ")";
          editPanelValues.outlineOpacity = outlineColor[3] * 100;
          let position = this.$_cartesian3ToLongLat({
            x: positions[0],
            y: positions[1],
            z: positions[2]
          });
          editPanelValues.height = position.alt;
          editPanelValues.position = position;
          break;
        case "box":
          editPanelValues.id = id;
          editPanelValues.color = "#FF0000";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.height = height;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "billboard":
          editPanelValues.id = id;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.image = image;
          editPanelValues.width = width;
          editPanelValues.height = height;
          editPanelValues.outlineWidth = outlineWidth;
          editPanelValues.outlineOpacity = outlineColor[3] * 100;
          editPanelValues.outlineColor = "rgb(" + outlineColor[0] * 255 + "," + outlineColor[1] * 255 + "," + outlineColor[2] * 255 + ")";
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "polyline":
          editPanelValues.id = id;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.width = width;
          editPanelValues.materialType = materialType;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "polylineVolume":
          editPanelValues.id = id;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.width = width;
          editPanelValues.cornerType = cornerType;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "polygon":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.height = height;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "rectangle":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.height = height;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "circle":
          if (this.currentEditType === "circle") {
            editPanelValues.id = id;
            editPanelValues.pureColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            editPanelValues.pureOpacity = color[3] * 100;
            editPanelValues.radius = radius;
            editPanelValues.height = height;
            editPanelValues.materialColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            editPanelValues.materialOpacity = color[3] * 100;
            if (title) {
              editPanelValues.title = title;
            }
          }else {
            editPanelValues.id = id;
            editPanelValues.title = title;
            editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            editPanelValues.opacity = color[3] * 100;
            editPanelValues.radius = radius;
            editPanelValues.extrudedHeight = extrudedHeight;
            if (title) {
              editPanelValues.title = title;
            }
          }
          break;
        case "ellipsoid":
          editPanelValues.id = id;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.radiusX = radiusX;
          editPanelValues.radiusY = radiusY;
          editPanelValues.radiusZ = radiusZ;
          editPanelValues.height = height;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "wall":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.color = "rgba(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.height = height;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "corridor":
          editPanelValues.id = id;
          editPanelValues.color = "rgba(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.width = width;
          editPanelValues.cornerType = cornerType;
          editPanelValues.height = height;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "cylinder":
          editPanelValues.id = id;
          editPanelValues.color = "rgba(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.width = width;
          editPanelValues.topRadius = topRadius;
          editPanelValues.bottomRadius = bottomRadius;
          editPanelValues.height = height;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
      }

      return editPanelValues;
    },
    /**
     * 据面板显示参数数据生成绘制参数
     * @param editPanelValues Object 设置面板显示参数数据
     * @param currentEditType String 当前绘制类型
     * @param Cesium Object Cesium对象
     * @return drawOptions Object 绘制参数
     * */
    $_getDrawOptions(editPanelValues, currentEditType, Cesium) {
      let drawOptions = {};
      switch (currentEditType) {
        case "point":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            arcType: Cesium.ArcType.GEODESIC,
            pixelSize: editPanelValues.pixelSize,
            height: editPanelValues.height,
            outlineWidth: editPanelValues.outlineWidth || 0,
            outlineColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.outlineColor || "#000000"), editPanelValues.outlineOpacity / 100),
          };
          break;
        case "label":
          let font;
          if (typeof editPanelValues.fontSize === "number") {
            font = editPanelValues.fontSize + "px " + editPanelValues.fontFamily;
          } else if (editPanelValues.fontSize.indexOf("px") > -1) {
            font = editPanelValues.fontSize + " " + editPanelValues.fontFamily;
          } else {
            font = editPanelValues.fontSize + "px " + editPanelValues.fontFamily;
          }
          drawOptions.style = {
            text: editPanelValues.text || "",
            font: font,
            style: 2,
            fillColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.fontColor || "#000000"), editPanelValues.opacity / 100),
            outlineWidth: editPanelValues.outlineWidth || 0,
            outlineColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.outlineColor || "#000000"), editPanelValues.outlineOpacity / 100),
            showBackground: editPanelValues.showBackground,
            backgroundColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.backgroundColor || "#000000"), editPanelValues.backgroundOpacity / 100),
            backgroundPadding: new Cesium.Cartesian2(editPanelValues.backgroundPadding, editPanelValues.backgroundPadding)
          };
          if (editPanelValues.hasOwnProperty("position")) {
            drawOptions.position = editPanelValues.position;
          }
          break;
        case "box":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            arcType: Cesium.ArcType.GEODESIC,
            extrudedHeight: editPanelValues.extrudedHeight,
            height: editPanelValues.height,
          };
          break;
        case "billboard":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            image: editPanelValues.image,
            width: editPanelValues.width,
            height: editPanelValues.height,
            outlineColor: Cesium.Color.RED,
            outlineWidth:10,
          };
          break;
        case "polyline":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            width: editPanelValues.width,
            materialType: editPanelValues.materialType,
          };
          break;
        case "polygonCube":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            extrudedHeight: editPanelValues.extrudedHeight,
            height: editPanelValues.height,
            isPlanePolygon: true
          };
          break;
        case "polygon":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            extrudedHeight: editPanelValues.extrudedHeight,
            height: editPanelValues.height,
            isPlanePolygon: false
          };
          break;
        case "rectangle":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            height: editPanelValues.height,
          };
          break;
        case "circle":
          drawOptions.style = {
            // color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.pureColor), editPanelValues.pureOpacity / 100),
            radius: Number(editPanelValues.radius),
            height: editPanelValues.height,
            materialType: editPanelValues.materialType,
            material: {
              color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.materialColor), editPanelValues.materialOpacity / 100),
              speed: 1
            }
          };
          if (editPanelValues.materialType === "color") {
            // delete drawOptions.style.color;
          }
          break;
        case "ellipsoid":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            height: editPanelValues.height,
            radiusX: editPanelValues.radiusX,
            radiusY: editPanelValues.radiusY,
            radiusZ: editPanelValues.radiusZ,
          };
          break;
        case "cone":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            radius: Number(editPanelValues.radius),
            extrudedHeight: editPanelValues.extrudedHeight,
          };
          break;
        case "wall":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            extrudedHeight: editPanelValues.extrudedHeight,
            height: editPanelValues.height,
          };
          break;
        case "polylineVolume":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            width: editPanelValues.width,
            cornerType: editPanelValues.cornerType,
          };
          break;
        case "corridor":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            width: editPanelValues.width,
            cornerType: editPanelValues.cornerType,
            height: editPanelValues.height,
            extrudedHeight: editPanelValues.extrudedHeight,
          };
          break;
        case "cylinder":
          drawOptions.style = {
            color: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(editPanelValues.color), editPanelValues.opacity / 100),
            topRadius: editPanelValues.topRadius,
            bottomRadius: editPanelValues.bottomRadius,
            height: editPanelValues.height,
            extrudedHeight: editPanelValues.extrudedHeight,
          };
          break;
      }
      return drawOptions;
    },
    //开始绘制
    $_startDraw(type) {
      //设置当前绘制类型
      if (type !== "mouse") {
        this.currentEditType = type;
      }
      //取得图层对象
      let graphicsLayer = this.$_getGraphicLayer(this.vueIndex, this.vueKey);
      //停止上一次的绘制
      graphicsLayer.stopDrawing();
      //设置当前绘制图标类型
      this.currentIconType = type;
      //如果选择鼠标，开启编辑模式，否则开始绘制
      if (type === "mouse") {
        if (this.noTitleKey !== "edit") {
          graphicsLayer.startEdit();
        }
        //结束绘制
        this.isStartDrawing = false;
      } else {
        //根据当前的绘制类型，获取设置面板显示参数数据
        this.editPanelValues = this.$_getEditPanelValues(this.editList, this.currentEditType);
        //根据面板显示参数数据生成绘制参数
        let drawOptions = this.$_getDrawOptions(this.editPanelValues, this.currentEditType, Cesium);
        //开始绘制
        this.isStartDrawing = true;
        //停止编辑
        this.$_startEdit();
        //根据编辑面板参数绘制图形
        let drawType = this.currentEditType;
        if (drawType === "cone") {
          drawType = "circle";
        }
        if (drawType === "polygonCube") {
          drawType = "polygon";
        }
        this.$_startDrawing({
          type: drawType,
          ...drawOptions
        });
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
    $_dbclick(json) {
      //显示设置面板
      this.noTitleKey = "edit";
      //停止绘制
      this.$_stopDrawing();
      this.isStartDrawing = false;
      //开始编辑
      this.$nextTick(function () {
        this.isEdit = true;
        this.$_startEdit();
      });
      //设置当前绘制图标类型为鼠标选中
      this.currentIconType = "mouse";
      //获取设置面板显示参数
      this.editPanelValues = this.$_getEditPanelValuesFromJSON(json);
      this.editPanelValues.showOutline = false;
    },
    //根据类型获取标题
    $_getTitle(type) {
      let title;
      switch (type) {
        case "label":
          title = "文本";
          break;
        case "box":
          title = "盒子";
          break;
        case "billboard":
          title = "广告牌";
          break;
        case "polyline":
          title = "线";
          break;
        case "rectangle":
          title = "矩形";
          break;
        case "polygon":
          if (this.currentEditType === "polygonCube") {
            title = "立体多边形";
          } else {
            title = "多边形";
          }
          break;
        case "point":
          title = "点";
          break;
        case "circle":
          if (this.currentEditType === "circle") {
            title = "圆";
          } else {
            title = "圆柱";
          }
          break;
        case "ellipsoid":
          title = "球体";
          break;
        case "cylinder":
          title = "圆锥";
          break;
        case "polylineVolume":
          title = "圆管线";
          break;
        case "corridor":
          title = "方管线";
          break;
        case "wall":
          title = "墙";
          break;
      }
      this.drawNum[type] += 1;
      return title + "_" + this.drawNum[type];
    },
    //初始化组件
    $_init() {
      //复制数据源
      this.dataSourceCopy = this.dataSource;
      //初始化GraphicLayer对象
      let vm = this;
      this.$_newGraphicLayer({
        vueIndex: this.vueIndex,
        getGraphic: function (e) {
          //开始添加数据
          vm.addSource = true;
          let data = vm.$_getJsonById(e.id)
          data.title = vm.$_getTitle(data.type);
          vm.dataSourceCopy.push(data);
          vm.editPanelValues = vm.$_getEditPanelValuesFromJSON(data);
          //数据添加完毕
          vm.$nextTick(function () {
            vm.addSource = false;
          });
        }
      });
      //获取设置面板显示参数
      if (this.dataSourceCopy.length > 0) {
        this.editPanelValues = this.$_getEditPanelValuesFromJSON(this.dataSourceCopy[0]);
      }
    },
    onTabChange(key, type) {
      this[type] = key;
      //进制编辑
      if (this.noTitleKey === "list") {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
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
  margin: 12px;
  cursor: pointer;
}

.mapgis-3d-graphic-icon-div {
  display: inline-block;
  width: auto;
  height: auto;
  margin: 10px 9px;
  float: left;
}

.mapgis-3d-graphic-dropdown {
  height: 100%;
  line-height: 32px;
  cursor: pointer;
  text-align: center;
}

.mapgis-3d-graphic-type {
  text-align: left;
  padding-left: 24px;
  padding-top: 12px;
}

.mapgis-3d-graphic-switch {
  margin: 6px 0;
}

.mapgis-3d-graphic-switch-title {
  float: left;
  margin-left: 24px;
}

.mapgis-3d-graphic-switch-button {
  float: right;
  margin-right: 14px;
}

/deep/ .mapgis-ui-select-selection-selected-value {
  text-align: left;
}
</style>