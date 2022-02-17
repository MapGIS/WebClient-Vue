<template>
  <div class="mapgis-3d-graphic-container" :style="containerStyle">
    <div>
      <mapgis-ui-graphic-icons-panel
        ref="iconsPanel"
        :models="models"
        :containerStyle="iconsPanelStyle"
        :enableOneMap="enableOneMap"
        :enableMapStory="enableMapStory"
        @startDraw="$_startDraw"
        @startDrawModel="$_startDrawModel"
      />
    </div>
    <div>
      <mapgis-ui-graphic-edit-panel
        ref="editPanel"
        :editPanelValues="editPanelValues"
        :editList="editList"
        :dataSourceCopy="dataSourceCopy"
        :currentEditType="currentEditType"
        :graphicGroups="graphicGroups"
        @change="$_changeEditPanelValues"
        @stopDrawing="$_stopDraw"
        @dblclick="$_dbclick"
        @clickTool="$_clickTool"
        @changeAttributes="$_changeAttributes"
        @open="$_open"
        @editTitle="$_editTitle"
      />
    </div>
    <mapgis-3d-popup
      v-if="enablePopup"
      :position='{"longitude":popup.lng,"latitude":popup.lat,"height":popup.alt}'
      :forceRender="true"
    >
      <div>
        <slot name="content" :popup="popup">
          <div v-html="popup.container"></div>
        </slot>
      </div>
    </mapgis-3d-popup>
  </div>
</template>

<script>
import GraphicLayerService from "./GraphicLayerService";
import icons from "../Plotting/base64Source"
import editList from "./editList";
import {polygon} from "@turf/helpers";
import centerOfMass from "@turf/center-of-mass";
import bbox from "@turf/bbox";
import {getPopupHtml} from "../../UI/Popup/popupUtil";
import clonedeep from 'lodash.clonedeep';

export default {
  name: "mapgis-3d-graphic-single-layer",
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
    models: {
      type: Object
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: [Number, String],
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    autoFlyToGraphic: {
      type: Boolean,
      default: true
    },
    containerStyle: {
      type: Object
    },
    iconsPanelStyle: {
      type: Object
    },
    //一张图模式
    enableOneMap: {
      type: Boolean,
      default: false
    },
    enableMapStory: {
      type: Boolean,
      default: false
    },
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
      icons: icons,
      //设置面板的显示数据
      editPanelValues: undefined,
      //是否开始编辑
      isEdit: false,
      //是否开始绘制
      isStartDrawing: false,
      //是否在添加数据
      addSource: false,
      //是否会之线模型
      isStartDrawLine: false,
      add: true,
      drawMode: "",
      drawDistance: 0,
      modelUrl: undefined,
      lastGraphicId: undefined,
      lastGraphicColor: undefined,
      groupNum: 0,
      enablePopup: false,
      popup: {},
      graphicGroups: [],
      //视角偏移高度
      destinationHeight: 100,
      //点击标绘对象次数，1次为单击，2次为双击
      clickTime: 0,
      //点击间隔，小于这个数就弹出popup
      clickInterval: 200,
      //弹出popup的定时器
      firstClickFlag: undefined
    };
  },
  watch: {
    dataSource: {
      handler: function () {
        if (!this.isEdit && !this.addSource && !this.editTitle) {
          this.$_init();
        }
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
      },
      deep: true
    },
  },
  mounted() {
  },
  methods: {
    $_resetEditPanel() {
      if (this.$refs.editPanel) {
        this.$refs.editPanel.$_resetEditPanel();
        this.dataSourceCopy = [];
        this.$refs.editPanel.isUpdatePanel = false;
        this.$_clearList();
      }
    },
    $_resetIconsPanel() {
      if (this.$refs.iconsPanel) {
        this.$refs.iconsPanel.$_resetIconsPanel();
      }
    },
    $_setIconMode(type) {
      this.$refs.iconsPanel.currentIconType = type;
    },
    $_clearList() {
      this.drawNum = {
        label: 0,
        box: 0,
        billboard: 0,
        polyline: 0,
        polygon: 0,
        polygonCube: 0,
        point: 0,
        circle: 0,
        cylinder: 0,
        cone: 0,
        polylineVolume: 0,
        corridor: 0,
        wall: 0,
        rectangle: 0,
        ellipsoid: 0,
        model: 0
      }
    },
    /**
     * 显示当前图层的所有标绘对象
     * */
    $_showAllGraphics() {
      let graphics = this.$_getAllGraphic();
      for (let i = 0; i < graphics.length; i++) {
        graphics[i].show = true;
      }
    },
    /**
     * 隐藏当前图层的所有标绘对象
     * */
    $_hideAllGraphics() {
      let graphics = this.$_getAllGraphic();
      for (let i = 0; i < graphics.length; i++) {
        graphics[i].show = false;
      }
    },
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
    $_updateSourceTitleById(id, title) {
      let index;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].id === id) {
          index = i;
          break;
        }
      }
      this.dataSourceCopy[index].title = title;
    },
    $_changeAttributes(attributes, graphicId) {
      if (graphicId) {
        let graphic = this.$_getGraphicByID(graphicId);
        Object.keys(attributes).forEach(function (key) {
          graphic.attributes[key] = attributes[key];
        });
        this.enablePopup = false;
        // this.$nextTick(function () {
        //   this.$_setPopUp(graphic, true);
        // });
      }
    },
    $_editTitle(flag, title, id) {
      if (!flag) {
        let graphic = this.$_getGraphicByID(id);
        graphic.attributes.title = title;
      }
      this.editTitle = flag;
    },
    $_open(name) {
      let graphicLayer = this.$_getGraphicLayer();
      let graphicGroups = graphicLayer.getGraphicByName(name);
      let groups = [];
      for (let i = 0; i < graphicGroups.length; i++) {
        groups.push({
          name: graphicGroups[i].name + "_" + (i + 1),
          attributes: clonedeep(graphicGroups[i].attributes),
          type: graphicGroups[i].type
        });
      }
      this.graphicGroups = groups;
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
          this.$refs.editPanel.isUpdatePanel = false;
          this.addSource = true;
          this.dataSourceCopy.splice(index, 1);
          this.$emit("delete", index);
          this.$nextTick(function () {
            let graphicsLayer = this.$_getGraphicLayer(this.vueIndex, this.vueKey);
            graphicsLayer.removeGraphicByID(row.id);
            this.$refs.editPanel.isUpdatePanel = true;
            this.addSource = false;
          });
          break;
      }
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
        asynchronous
      } = json;

      let {
        text, font, color, fillColor, backgroundColor, outlineWidth, outlineColor, image,
        extrudedHeight, width, height, topRadius, backgroundOpacity, backgroundPadding, bottomRadius,
        pixelSize, radius, materialType, material, cornerType, radiusX, radiusY, radiusZ, url, scale,
        isHermiteSpline, stRotation, offsetHeight
      } = style;

      const {title, __flashStyle} = attributes;
      material = material || {};

      const {speed, duration, gradient, count, direction} = material;

      let editPanelValues = {};

      switch (json.type) {
        case "point":
          editPanelValues.id = id;
          editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.pixelSize = pixelSize;
          editPanelValues.offsetHeight = offsetHeight;
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
          editPanelValues.offsetHeight = position.alt;
          editPanelValues.position = position;
          break;
        case "box":
          editPanelValues.id = id;
          editPanelValues.color = "#FF0000";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.offsetHeight = offsetHeight;
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
          editPanelValues.offsetHeight = offsetHeight;
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
          editPanelValues.isHermiteSpline = isHermiteSpline;
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
          editPanelValues.offsetHeight = offsetHeight;
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
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.materialType = materialType || "Color";
          if (title) {
            editPanelValues.title = title;
          }
          if (__flashStyle) {
            editPanelValues.alphaSpace = __flashStyle.alphaSpace;
            editPanelValues.flashTime = __flashStyle.flashTime;
            editPanelValues.flashAlpha = __flashStyle.flashAlpha;
            editPanelValues.materialType = "flash";
          }
          break;
        case "rectangle":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.materialType = materialType;
          if (title) {
            editPanelValues.title = title;
          }
          if (materialType === "text") {
            const {backgroundColor, text, font, fillColor} = material;
            editPanelValues.rtBackgroundColor = "rgb(" + backgroundColor[0] * 255 + "," + backgroundColor[1] * 255 + "," + backgroundColor[2] * 255 + ")";
            editPanelValues.rtBackgroundOpacity = backgroundColor[3] * 100;
            editPanelValues.rectangleText = text;
            let fonts = font.split(" ");
            editPanelValues.rtFontSize = fonts[0].split("px")[0];
            editPanelValues.rtFontFamily = fonts[1];
            editPanelValues.color = "rgb(" + fillColor[0] * 255 + "," + fillColor[1] * 255 + "," + fillColor[2] * 255 + ")";
            editPanelValues.opacity = fillColor[3] * 100;
          } else {
            editPanelValues.color = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            editPanelValues.opacity = color[3] * 100;
          }
          if (materialType === "Image") {
            const {repeat} = material;
            editPanelValues.image = material.image;
            editPanelValues.stRotation = stRotation;
            editPanelValues.repeatX = repeat.x;
            editPanelValues.repeatY = repeat.y;
          }
          break;
        case "circle":
          if (this.currentEditType === "circle") {
            editPanelValues.id = id;
            editPanelValues.pureColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            editPanelValues.pureOpacity = color[3] * 100;
            editPanelValues.radius = radius;
            editPanelValues.offsetHeight = offsetHeight;
            editPanelValues.speed = speed || 1;
            editPanelValues.duration = duration || 2000;
            editPanelValues.gradient = gradient || 0.5;
            editPanelValues.count = count || 4;
            editPanelValues.materialType = materialType;
            if (materialType === "Color") {
              editPanelValues.materialColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
              editPanelValues.materialOpacity = color[3] * 100;
            } else {
              editPanelValues.materialColor = "rgb(" + material.color.red * 255 + "," + material.color.green * 255 + "," + material.color.blue * 255 + ")";
              editPanelValues.materialOpacity = material.color.alpha * 100;
            }
            if (title) {
              editPanelValues.title = title;
            }
          } else {
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
          editPanelValues.offsetHeight = offsetHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "wall":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.speed = speed || 1;
          editPanelValues.image = material.image || "http://localhost:8080/assets/png/lineClr.png";
          editPanelValues.duration = duration || 2000;
          editPanelValues.direction = direction || 1;
          editPanelValues.materialType = materialType;
          if (materialType === "Color") {
            editPanelValues.materialColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            editPanelValues.materialOpacity = color[3] * 100;
            editPanelValues.linkColor = "rgb(255, 255, 255)";
          } else {
            editPanelValues.linkColor = "rgb(" + material.color.red * 255 + "," + material.color.green * 255 + "," + material.color.blue * 255 + ")";
            editPanelValues.materialOpacity = material.color.alpha * 100;
          }
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
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "cylinder":
          editPanelValues.id = id;
          editPanelValues.color = "rgba(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.topRadius = topRadius;
          editPanelValues.bottomRadius = bottomRadius;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "model":
          editPanelValues.id = id;
          editPanelValues.url = url;
          editPanelValues.scale = scale;
          if (title) {
            editPanelValues.title = title;
          }
          break;
      }

      return editPanelValues;
    },
    $_startDrawModel(type, model, drawMode, drawDistance, modelRadius, scale) {
      //停止上一次的绘制
      let graphicsLayer, DrawTool;
      graphicsLayer = this.$_getGraphicLayer();
      DrawTool = new this.Cesium.DrawTool(this.viewer, graphicsLayer);
      this.$_stopDrawing();
      this.isStartDrawLine = true;
      this.isStartDrawing = true;
      this.drawMode = drawMode;
      this.drawDistance = drawDistance;
      this.modelUrl = model;
      this.currentEditType = type;
      switch (drawMode) {
        case "point":
          if (!this.editPanelValues) {
            //根据当前的绘制类型，获取设置面板显示参数数据
            this.editPanelValues = this.$_getEditPanelValues(this.editList, this.currentEditType);
          }
          this.editPanelValues.url = model;
          this.editPanelValues.scale = scale;
          //更新编辑面板
          this.$refs.editPanel.$_setEditPanelValues(this.editPanelValues);
          //根据面板显示参数数据生成绘制参数
          let drawOptions = this.$_getDrawOptions(this.editPanelValues, this.currentEditType, Cesium);
          this.$_startDrawing({
            type: "model",
            ...drawOptions
          });
          break;
        case "polyline":
          DrawTool.DrawModelsByLine({
            intervalDistance: drawDistance,
            modelRadius: modelRadius,
            style: {
              scale: 1,
              url: model
            }
          });
          break;
        case "polygon":
          let str = model.split("/");
          let name = str[str.length - 1];
          name = name.split(".")[0];
          this.groupNum++;
          let groupName = name + "模型组" + this.groupNum;
          DrawTool.DrawModelsByArea({
            intervalDistance: drawDistance,
            modelRadius: modelRadius,
            style: {
              scale: 1,
              url: model
            },
            name: groupName
          });
          this.dataSourceCopy.push({
            type: "group",
            id: Number((Math.random() * 100000000).toFixed(0)),
            attributes: {
              title: groupName
            }
          });
          break;
      }
    },
    //开始绘制
    $_startDraw(type, chooseMode) {
      //设置当前绘制类型
      if (type !== "mouse") {
        this.currentEditType = type;
      }
      //停止上一次的绘制
      this.$_stopDrawing();
      //如果选择鼠标，开启编辑模式，否则开始绘制
      if (type === "mouse") {
        if (this.noTitleKey !== "edit") {
          this.$_startEdit();
        }
        //结束绘制
        this.isStartDrawing = false;
      } else {
        //根据当前的绘制类型，获取设置面板显示参数数据
        this.editPanelValues = this.$_getEditPanelValues(this.editList, this.currentEditType);
        //更新编辑面板
        this.$refs.editPanel.$_setEditPanelValues(this.editPanelValues);
        //根据面板显示参数数据生成绘制参数
        let drawOptions = this.$_getDrawOptions(this.editPanelValues, this.currentEditType, Cesium);
        //开始绘制
        this.isStartDrawing = true;
        //停止编辑
        this.$_stopEdit();
        //根据编辑面板参数绘制图形
        let drawType = this.currentEditType;
        if (drawType === "cone") {
          drawType = "circle";
        }
        if (drawType === "polygonCube") {
          drawType = "polygon";
        }
        if (drawType === "square") {
          drawType = "box";
        }
        this.drawMode = "point";
        this.$_startDrawing({
          type: drawType,
          ...drawOptions
        });
      }
    },
    $_stopDraw() {
      this.$refs.iconsPanel.currentIconType = "mouse";
      this.$_stopDrawing();
      this.$_startEdit();
    },
    $_stopDrawAll() {
      this.$refs.iconsPanel.currentIconType = "mouse";
      this.$_stopDrawing();
      this.$_stopEdit();
    },
    $_changeEditPanelValues(editPanelValues, isEdit) {
      this.editPanelValues = editPanelValues;
      if (isEdit) {
        //在绘制中，更改参数时先停止绘制，应用参数，在开始绘制
        if (this.isStartDrawing) {
          //停止绘制
          this.$_stopDrawing();
          //根据面板显示参数数据生成绘制参数
          let drawOptions = this.$_getDrawOptions(editPanelValues, this.currentEditType, Cesium);
          //根据编辑面板参数绘制图形
          let drawType = this.currentEditType;
          if (drawType === "cone") {
            drawType = "circle";
          }
          if (drawType === "polygonCube") {
            drawType = "polygon";
          }
          if (drawType === "model") {
            this.$_startDrawModel("model", this.modelUrl, this.drawMode, this.drawDistance, 0, editPanelValues.scale)
          } else {
            const {materialType} = editPanelValues;
            if (materialType === "flash") {
              drawOptions.attributes = {
                "__enableFlash": true,
                "__flashStyle": {
                  flog: true,
                  flashAlpha: editPanelValues.flashAlpha,
                  alphaSpace: editPanelValues.alphaSpace,
                  flashTime: editPanelValues.flashTime
                }
              }
            }
            this.$_startDrawing({
              type: drawType,
              ...drawOptions
            });
          }
        } else {
          if (!editPanelValues) {
            return;
          }
          //结束绘制
          //先存起来title
          let title = editPanelValues.title;
          //更新样式
          let options = this.$_getDrawOptions(editPanelValues, this.currentEditType, Cesium);
          this.$_updateStyleByStyle(editPanelValues.id, options.style);
          //更新title
          this.$refs.editPanel.isUpdatePanel = false;
          this.$_updateSourceTitleById(editPanelValues.id, title);
          let Graphic = this.$_getGraphicByID(editPanelValues.id);
          if (Graphic) {
            Graphic.attributes.title = title;
          }
          this.$nextTick(function () {
            this.$refs.editPanel.isUpdatePanel = true;
          });
        }
      }
    },
    test() {
      let graphicLayer = this.$_getGraphicLayer();
      let SelectTool = new Cesium.SelectTool(graphicLayer);
      SelectTool.selectByRectangle({
        type: 'polygon',
        style: {
          color: Cesium.Color.BLUE.withAlpha(0.2),
          height: 0
        },
        isContinued: false,
        getSelectedGraphic: function (graphics) {
          // console.log("-----------", graphics)
        }
      });
    },
    //双击一条标注列表里的要素，进入到设置面板
    $_dbclick(json) {
      //显示设置面板
      this.noTitleKey = "edit";
      this.$refs.iconsPanel.$_resetIconsPanel();
      //停止绘制
      this.$_stopDrawing();
      this.isStartDrawing = false;
      //开始编辑
      this.$nextTick(function () {
        this.isEdit = true;
        this.$_startEdit();
      });
      this.currentEditType = json.type;
      if (this.currentEditType === "group") {
        let graphicLayer = this.$_getGraphicLayer();
        let group = graphicLayer.getGraphicByName(json.attributes.title);
      }
      if (json.style.hasOwnProperty("isSquare") && json.style.isSquare) {
        this.currentEditType = "square";
      }
      if (this.currentEditType === "circle") {
        if (json.style.hasOwnProperty("extrudedHeight") && json.style.extrudedHeight > 0) {
          this.currentEditType = "cone";
        }
      }
      if (this.currentEditType === "polygon") {
        if (json.style.hasOwnProperty("extrudedHeight") && json.style.extrudedHeight > 0) {
          this.currentEditType = "polygonCube";
        }
      }
      //设置当前绘制图标类型为鼠标选中
      this.currentIconType = "mouse";
      //获取设置面板显示参数
      this.editPanelValues = this.$_getEditPanelValuesFromJSON(json);
      this.editPanelValues.showOutline = false;

      function setColor(Graphic, color) {
        if (Graphic.style.hasOwnProperty("materialType") && Graphic.style.materialType === "Image") {

        } else {
          Graphic.style.color = color;
        }
      }

      if (this.lastGraphicId) {
        let lastGraphic = this.$_getGraphicByID(this.lastGraphicId);
        setColor(lastGraphic, this.lastGraphicColor);
      }
      this.lastGraphicId = json.id;
      let graphic = this.$_getGraphicByID(json.id);
      //定义视角高度
      const {style} = graphic;
      const {offsetHeight, extrudedHeight, radiusX, width, radius} = style;
      //如果有offsetHeight，则加上这个高度
      if (offsetHeight) {
        this.destinationHeight += Number(offsetHeight);
      }
      //如果有extrudedHeight，则加上这个高度
      if (extrudedHeight) {
        this.destinationHeight += Number(extrudedHeight);
      }
      //如果是球体，暂时不考虑椭球，则加上两倍半径
      if (graphic.type === "ellipsoid" && radiusX) {
        this.destinationHeight += Number(radiusX * 2);
      }
      //如果是圆管线，则加上两倍宽度
      if (graphic.type === "polylineVolume" && width) {
        this.destinationHeight += Number(width * 2);
      }
      //如果是圆，则加上两倍半径
      if (graphic.type === "circle" && radius) {
        this.destinationHeight += Number(radius * 2);
      }
      if (graphic.type === "model") {
        this.lastGraphicColor = Cesium.Color.WHITE;
      } else {
        this.lastGraphicColor = graphic.style.color;
      }
      setColor(graphic, Cesium.Color.BLUEVIOLET.withAlpha(0.5));
      let positions = [[]], center, destination, polygonG, position, lla;
      switch (json.type) {
        case "label":
        case "billboard":
        case "point":
          //计算中心点
          position = graphic.positions[0];
          lla = this.$_cartesian3ToLongLat(new Cesium.Cartesian3(position.x, position.y, position.z));
          //生成视角位置
          destination = Cesium.Cartesian3.fromDegrees(lla.lng, lla.lat, this.destinationHeight);
          break;
        case "polygon":
        case "polyline":
        case "polylineVolume":
        case "corridor":
        case "wall":
          for (let i = 0; i < json.positions.length / 3; i++) {
            let lla = this.$_cartesian3ToLongLat(new Cesium.Cartesian3(json.positions[i * 3], json.positions[i * 3 + 1], json.positions[i * 3 + 2]));
            positions[0].push([lla.lng, lla.lat]);
          }
          positions[0].push(positions[0][0]);
          polygonG = polygon(positions);
          center = centerOfMass(polygonG);
          //计算边界框长度
          let boxP = bbox(polygonG);
          let x = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(boxP[0], boxP[1]), Cesium.Cartesian3.fromDegrees(boxP[2], boxP[1]));
          let y = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(boxP[0], boxP[1]), Cesium.Cartesian3.fromDegrees(boxP[0], boxP[3]));
          //加上边界框的最大值
          this.destinationHeight += Number(x > y ? x : y);
          destination = Cesium.Cartesian3.fromDegrees(center.geometry.coordinates[0], center.geometry.coordinates[1], this.destinationHeight);
          break;
        case "rectangle":
        case "box":
          //左下角
          let p1 = new Cesium.Cartesian3(json.positions[0], json.positions[1], json.positions[2]);
          //右上角
          let p2 = new Cesium.Cartesian3(json.positions[3], json.positions[4], json.positions[5]);
          p1 = this.$_cartesian3ToLongLat(p1);
          p2 = this.$_cartesian3ToLongLat(p2);
          positions[0].push([p1.lng, p1.lat]);
          positions[0].push([p2.lng, p1.lat]);
          positions[0].push([p2.lng, p2.lat]);
          positions[0].push([p1.lng, p2.lat]);
          positions[0].push([p1.lng, p1.lat]);
          polygonG = polygon(positions);
          center = centerOfMass(polygonG);
          //计算边界框长度
          let xB = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(p1.lng, p1.lat), Cesium.Cartesian3.fromDegrees(p2.lng, p1.lat));
          let yB = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(p1.lng, p1.lat), Cesium.Cartesian3.fromDegrees(p1.lng, p2.lat));
          //加上边界框长度的最大值
          this.destinationHeight += Number(xB > yB ? xB : yB);
          destination = Cesium.Cartesian3.fromDegrees(center.geometry.coordinates[0], center.geometry.coordinates[1], this.destinationHeight);
          break;
        case "circle":
        case "cylinder":
        case "ellipsoid":
          //计算中心点
          position = graphic.centerPosition;
          lla = this.$_cartesian3ToLongLat(new Cesium.Cartesian3(position.x, position.y, position.z));
          //生成视角位置
          destination = Cesium.Cartesian3.fromDegrees(lla.lng, lla.lat, this.destinationHeight);
          break;
        case "model":
          let Cartesian3 = new Cesium.Cartesian3(json.positions[0], json.positions[1], json.positions[2]);
          center = this.$_cartesian3ToLongLat(Cartesian3);
          destination = Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 100);
          break;
      }
      if (this.autoFlyToGraphic) {
        this.viewer.camera.flyTo({
          duration: 1,
          destination: destination,
          orientation: {
            heading: Cesium.Math.toRadians(-90.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0
          }
        });
      }
    },
    $_getCenter(json) {
      let positions = [[]], center, polygonG, position, lla;
      const {style} = json;
      //extrudedHeight拉伸高度，offsetHeight离地高度，radiusX圆的半径
      const {extrudedHeight, offsetHeight, radiusX} = style;
      switch (json.type) {
        case "polyline":
        case "polygon":
          for (let i = 0; i < json.positions.length; i++) {
            let lla = this.$_cartesian3ToLongLat(json.positions[i]);
            positions[0].push([lla.lng, lla.lat]);
          }
          positions[0].push(positions[0][0]);
          polygonG = polygon(positions);
          center = centerOfMass(polygonG);
          break;
        case "rectangle":
        case "box":
          let p1, p2;
          p1 = json.positions[0];
          p2 = json.positions[1];
          p1 = this.$_cartesian3ToLongLat(p1);
          p2 = this.$_cartesian3ToLongLat(p2);
          positions[0].push([p1.lng, p1.lat]);
          positions[0].push([p2.lng, p1.lat]);
          positions[0].push([p2.lng, p2.lat]);
          positions[0].push([p1.lng, p2.lat]);
          positions[0].push([p1.lng, p1.lat]);
          polygonG = polygon(positions);
          center = centerOfMass(polygonG);
          break;
        case "cylinder":
        case "circle":
        case "ellipsoid":
          //计算中心点
          position = json.centerPosition;
          lla = this.$_cartesian3ToLongLat(new Cesium.Cartesian3(position.x, position.y, position.z));
          center = {
            geometry: {
              coordinates: [lla.lng, lla.lat]
            }
          }
          break;
        case "model":
          let Cartesian3 = new Cesium.Cartesian3(json.positions[0], json.positions[1], json.positions[2]);
          center = this.$_cartesian3ToLongLat(Cartesian3);
          break;
      }
      //加上拉伸高度、离地高度、半径
      center.geometry.coordinates.push((extrudedHeight || 0) + (offsetHeight || 0) + (radiusX * 2 || 0));
      return center;
    },
    $_updateGraphicList(graphics) {
      this.dataSourceCopy = graphics;
    },
    $_resetGetGraphic(vueIndex, vueKey) {
      let graphicLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      this.$_switchGraphicLayer(vueIndex, vueKey);
      graphicLayer._getGraphic = this.$_getGraphic;
    },
    $_getGraphic(e) {
      let vm = this;
      let data = vm.$_getJsonById(e.id);
      let type = data.type;
      if (vm.drawMode === "point") {
        if (!vm.add) {
          return;
        }
        //开始添加数据
        vm.addSource = true;
        if (type === "circle") {
          if (data.style.hasOwnProperty("extrudedHeight") && data.style.extrudedHeight > 0) {
            type = "cone";
          }
        }
        if (type === "polygon") {
          if (data.style.hasOwnProperty("extrudedHeight") && data.style.extrudedHeight > 0) {
            type = "polygonCube";
          }
        }
        const {attributes} = e
        if (attributes.hasOwnProperty("__enableFlash")) {
          let color = e.style.color;
          let flashStyle = e.attributes.__flashStyle;
          color.alpha = flashStyle.flashAlpha;
          let newFlashP2D = vm.$_bezierSpline(e.positions, true);
          let newPolygon = new Cesium.Graphic({
            type: 'polygon',
            positions: newFlashP2D,
            style: {
              color: color
            }
          });
          let graphicLayer = vm.$_getGraphicLayer();
          vm.drawMode = "addFlashGraphic";
          newPolygon.attributes.__flashStyle = e.attributes.__flashStyle;
          newPolygon.attributes.__enableFlash = e.attributes.__enableFlash;
          graphicLayer.addGraphic(newPolygon);
          vm.$_removeGraphicByID(e.id);
        } else {
          e.attributes.title = e.attributes.title || vm.$_getTitle(type);
          data.attributes.title = e.attributes.title;
          vm.dataSourceCopy.push(data);
          if (vm.dataSourceCopy.length === 1) {
            vm.$emit("saveCamera");
          }
          let editPanelValues = vm.$_getEditPanelValuesFromJSON(data);
          vm.$refs.editPanel.$_setEditPanelValues(editPanelValues);
          //数据添加完毕
          vm.$nextTick(function () {
            vm.addSource = false;
          });
          vm.$emit("change", vm.dataSourceCopy);
          vm.$emit("addFeature", vm.$_getJsonById(e.id));
        }
      } else if (vm.drawMode === "addGraphic") {
        vm.drawMode = "point"
      } else if (vm.drawMode === "addFlashGraphic") {
        vm.drawMode = "point"
        let flashStyle = e.attributes.__flashStyle;
        window["flog_" + e.id] = flashStyle.flog;
        window["alpha_" + e.id] = flashStyle.flashAlpha;
        window["alphaEnd_" + e.id] = flashStyle.flashAlpha;
        window["alphaSpace_" + e.id] = flashStyle.alphaSpace;
        window["flashTime_" + e.id] = flashStyle.flashTime;
        window["flashRunningTime_" + e.id] = 0;
        window["interval_" + e.id] = setInterval(function () {
          if (window["flog_" + e.id]) {
            window["alpha_" + e.id] = window["alpha_" + e.id] - window["alphaSpace_" + e.id];
            if (window["alpha_" + e.id] <= 0) {
              window["alpha_" + e.id] = 0;
              window["flog_" + e.id] = false;
            }
          } else {
            window["alpha_" + e.id] = window["alpha_" + e.id] + window["alphaSpace_" + e.id];
            if (window["alpha_" + e.id] >= window["alphaEnd_" + e.id]) {
              window["flog_" + e.id] = true;
            }
          }
          e.style.color.alpha = window["alpha_" + e.id].toFixed(2);
          window["flashRunningTime_" + e.id] += 100;
          if (window["flashRunningTime_" + e.id] > window["flashTime_" + e.id]) {
            clearInterval(window["interval_" + e.id]);
            e.show = false;
            delete window["flog_" + e.id];
            delete window["alpha_" + e.id];
            delete window["alphaEnd_" + e.id];
            delete window["alphaSpace_" + e.id];
            delete window["flashTime_" + e.id];
            delete window["flashRunningTime_" + e.id];
          }
        }, 100);
        e.attributes.title = e.attributes.title || vm.$_getTitle(type);
        data.attributes.title = e.attributes.title;
        vm.dataSourceCopy.push(data);
        if (vm.dataSourceCopy.length === 1) {
          vm.$emit("saveCamera");
        }
        let editPanelValues = vm.$_getEditPanelValuesFromJSON(data);
        vm.$refs.editPanel.$_setEditPanelValues(editPanelValues);
        //数据添加完毕
        vm.$nextTick(function () {
          vm.addSource = false;
        });
        vm.$emit("change", vm.dataSourceCopy);
        vm.$emit("addFeature", vm.$_getJsonById(e.id));
      } else {
        //通过fromJSON方式导入
        let hasData = false;
        for (let i = 0; i < vm.dataSourceCopy.length; i++) {
          if (vm.dataSourceCopy[i].id === data.id) {
            vm.$set(vm.dataSourceCopy, i, data);
            hasData = true;
            break;
          }
        }
        if (!hasData) {
          vm.dataSourceCopy.push(data);
        }
      }
    },
    //初始化组件
    $_init(dataSource, vueIndex, vueKey) {
      //复制数据源
      this.dataSourceCopy = dataSource || JSON.parse(JSON.stringify(this.dataSource));
      if (this.dataSourceCopy.length === 0) {
        this.$nextTick(function () {
          this.$_setIconMode("mouse");
        });
      }
      //初始化GraphicLayer对象
      let vm = this;
      vueIndex = vueIndex || this.vueIndex;
      vueKey = vueKey || this.vueKey;
      let graphicLayer = this.$_getGraphicLayer(vueIndex, vueKey);
      if (!graphicLayer) {
        this.$_newGraphicLayer({
          vueIndex: vueIndex,
          vueKey: vueKey,
          finishEdit: function (e) {
            for (let i = 0; i < vm.dataSourceCopy.length; i++) {
              if (vm.dataSourceCopy[i].id === e.id && e.style.extrudedHeight) {
                vm.dataSourceCopy[i].style.extrudedHeight = e.style.extrudedHeight;
                break;
              }
            }
          },
          getGraphic: this.$_getGraphic,
          revokeModel: function (e) {
            //撤销模型的同时，删除标绘列表
            let index = undefined;
            for (let i = 0; i < vm.dataSourceCopy.length; i++) {
              if (vm.dataSourceCopy[i].id === e.id) {
                index = i;
                break;
              }
            }
            if (index !== undefined) {
              vm.$refs.editPanel.isUpdatePanel = false;
              vm.dataSourceCopy.splice(index, 1);
            }
          }
        });
      }
      if (this.dataSourceCopy.length > 0) {
        let dataArr = [];
        for (let i = 0; i < this.dataSourceCopy.length; i++) {
          let graphic = this.$_getGraphicByID(this.dataSourceCopy[i].id);
          if (!graphic) {
            dataArr.push(this.dataSourceCopy[i]);
          }
        }
        //如果有数据，绘制数据
        this.$_fromJson({
          type: "FeatureCollection",
          features: dataArr
        });
      }
      //获取设置面板显示参数
      if (this.dataSourceCopy.length > 0) {
        this.editPanelValues = this.$_getEditPanelValuesFromJSON(this.dataSourceCopy[0]);
      }
      //设置点击事件
      this.viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        let pickedFeature = vm.viewer.scene.pick(movement.position);
        let worldPosition = vm.viewer.scene.pickPosition(movement.position);
        if (Cesium.defined(pickedFeature) && !vm.isStartDrawing) {
          console.log("new date().getTime()", new Date().getTime())
          vm.clickTime++;
          //如果clickTime等于2，则表明在clickInterval毫秒内，点击了第二次，因此为双击事件，不弹框
          if (vm.clickTime === 2) {
            clearTimeout(vm.firstClickFlag);
            //重置点击次数
            vm.clickTime = 0;
          } else if (vm.clickTime === 1) {
            //单击标绘对象，在clickInterval毫秒后，弹框
            vm.firstClickFlag = setTimeout(function () {
              vm.$_setPopUp(pickedFeature, false, worldPosition);
              //重置点击次数
              vm.clickTime = 0;
            }, vm.clickInterval);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // //设置双击事件
      // this.viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
      //   let pickedFeature = vm.viewer.scene.pick(movement.position);
      //   if (Cesium.defined(pickedFeature) && !vm.isStartDrawing) {
      //     if (pickedFeature.hasOwnProperty("id")) {
      //       let graphic = vm.$_getGraphicByID(pickedFeature.id);
      //       if (graphic) {
      //         vm.$refs.editPanel.$_dbclick(undefined, vm.$_getJsonById(pickedFeature.id));
      //       }
      //     }
      //   }
      // }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    $_setPopUp(graphic, isGraphic, worldPosition) {
      let center;
      let vm = this;
      let attributes;
      if (isGraphic) {
        attributes = graphic.attributes;
      } else {
        attributes = graphic.primitive.attributes;
      }
      //使用点击时的坐标
      if(worldPosition){
        let lla = this.$_cartesian3ToLongLat(worldPosition);
        this.popup = {
          lng: lla.lng,
          lat: lla.lat,
          alt: lla.alt,
          properties: {}
        };
      }else {
        if (isGraphic) {
          center = this.$_getCenter(graphic);
        } else {
          center = this.$_getCenter(graphic.primitive);
        }
        if (!center) {
          return;
        }
        let coordinates = center.geometry.coordinates;
        //使用中心点坐标
        this.popup = {
          lng: coordinates[0],
          lat: coordinates[1],
          alt: coordinates[2],
          properties: {}
        };
      }
      Object.keys(attributes).forEach(function (key) {
        vm.popup.properties[key] = attributes[key];
      })
      let properties = JSON.parse(JSON.stringify(this.popup.properties));
      delete properties.title;
      this.popup.container = getPopupHtml("underline",
        {properties: properties},
        {
          fields: Object.keys(properties),
          title: this.popup.properties.title,
          style: {
            containerStyle: {width: "244px"}
          }
        });
      this.enablePopup = true;
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
  margin-top: -20px;
  width: 332px;
  max-height: 785px;
  padding: 10px 15px;
}

/deep/ .mapgis-ui-select-selection-selected-value {
  text-align: left;
}
</style>