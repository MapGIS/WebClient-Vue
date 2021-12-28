<template>
  <div class="mapgis-3d-graphic-container" v-if="dataSourceCopy">
    <div>
      <mapgis-ui-graphic-icons-panel
        @startDraw="$_startDraw"
      />
    </div>
    <div>
      <mapgis-ui-graphic-edit-panel
        :editPanelValues="editPanelValues"
        :editList="editList"
        :dataSourceCopy="dataSourceCopy"
        :currentEditType="currentEditType"
        @dbclick="$_dbclick"
      />
    </div>
  </div>
</template>

<script>
import GraphicLayerService from "./GraphicLayerService";
import icons from "../Plotting/base64Source"
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
      icons: icons,
      //设置面板的显示数据
      editPanelValues: undefined,
      //是否开始编辑
      isEdit: false,
      //是否开始绘制
      isStartDrawing: false,
      //是否在添加数据
      addSource: false,
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
          data.title = vm.$_getTitle(data.type, vm.currentEditType);
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

/deep/ .mapgis-ui-select-selection-selected-value {
  text-align: left;
}
</style>