<template>
  <div>
    <div class="mapgis-3d-graphic-layers-select-container"
         v-show="!showSetting"
    >
      <mapgis-ui-select class="mapgis-3d-graphic-layers-select" @change="$_selectLayer" :value="currenSelectLayer">
        <mapgis-ui-select-option :key="index" v-for="(layer, index) in layerSelect" :value="layer.key">
          {{ layer.value }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
      <input style="display: none" type="file" :id="inputId"
             accept=".json">
      <mapgis-ui-button type="primary" class="mapgis-3d-graphic-layers-export" @click="$_export">导出</mapgis-ui-button>
      <mapgis-ui-button class="mapgis-3d-graphic-layers-import" @click="$_import">导入</mapgis-ui-button>
      <mapgis-ui-more-tool-button @click="$_clickTool" :dataSource="moreTools"
                                  class="mapgis-ui-graphic-layers-more-tool"/>
    </div>
    <mapgis-ui-input-row-left
      style="margin: 0"
      v-show="showEditTitle"
      title="修改标题"
      :enableButton=true
      paddingLeft="16px"
      @finish="$_finishEditTitle"
      v-model="currenSelectLayer"
    />
    <mapgis-3d-graphic-single-layer
      v-show="!showSetting"
      :vueIndex="vueIndex"
      :models="models"
      :autoFlyToGraphic="autoFlyToGraphic"
      ref="graphicLayer"
      v-model="currentLayer"
      @saveCamera="$_saveCamera"
    />
    <div
      v-show="showSetting"
    >
      <mapgis-ui-row>
        <mapgis-ui-svg-icon @click="$_back" class="mapgis-ui-graphic-layers-setting-back" :iconStyle="editStyle"
                            type="back"/>
        <span style="margin-left: 33px">配置参数</span>
      </mapgis-ui-row>
      <mapgis-ui-switch-row-left
        title="进入图层后自动跳转视角"
        v-model="autoFlyTo"
      />
      <mapgis-ui-switch-row-left
        title="选择标绘对象后自动跳转视角"
        v-model="autoFlyToGraphic"
      />
    </div>
  </div>
</template>

<script>
import {saveAs} from "file-saver";
import {getCamera} from "../../Utils/util";
import clonedeep from 'lodash.clonedeep';

export default {
  name: "mapgis-3d-graphic-layer",
  inject: ["Cesium", "viewer"],
  props: {
    dataSource: {
      type: Array,
      default() {
        return []
      }
    },
    models: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init(this.currenSelectIndex);
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        // this.$emit("change", this.dataSourceCopy);
      },
      deep: true
    }
  },
  data() {
    return {
      //graphicLayer图层列表
      layerSelect: [],
      //当前下拉框中选中的图层
      currenSelectLayer: undefined,
      //当前选中的图层的index
      currenSelectIndex: 0,
      //当前选中的图层
      currentLayer: undefined,
      //数据源备份
      dataSourceCopy: [],
      //导入文件按钮id
      inputId: "mapgisPlottingImport" + parseInt(String(Math.random() * 10000)),
      moreTools: [{
        event: "add",
        icon: "edit",
        title: "新增图层"
      }, {
        event: "editTitle",
        icon: "editTitle",
        title: "编辑标题"
      }, {
        event: "saveCamera",
        icon: "camera2",
        title: "保存视角"
      }, {
        event: "flyTo",
        icon: "flyToView",
        title: "视角跳转"
      }, {
        event: "delete",
        icon: "delete",
        title: "删除图层"
      }, {
        event: "setting",
        icon: "setting",
        title: "配置参数"
      }],
      vueIndex: undefined,
      showEditTitle: false,
      //是否显示配置信息
      showSetting: false,
      autoFlyTo: true,
      autoFlyToGraphic: true,
      editStyle: {
        color: "#7A8DA0",
        width: "20px",
        height: "20px"
      }
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    $_saveCamera() {
      if (this.currenSelectLayer) {
        this.dataSourceCopy[this.currenSelectIndex - 1].camera = getCamera(viewer);
      }
    },
    $_finishEditTitle() {
      this.showEditTitle = false;
      this.dataSourceCopy[this.currenSelectIndex - 1].name = this.currenSelectLayer;
    },
    $_clickTool(e) {
      switch (e) {
        //新增标绘图层
        case "add":
          //新建空图层数据
          let data = {
            "name": "图层_" + (this.dataSourceCopy.length + 1),
            "uuid": parseInt(String(Math.random() * 10000000)),
            "autoFlyTo": true,
            "autoFlyToGraphic": true,
            "dataSource": {
              "type": "FeatureCollection",
              "features": []
            }
          };
          this.currenSelectIndex++;
          this.dataSourceCopy.push(data);
          //如果上一个图层有数据，则隐藏
          if (this.currentLayer.length > 0) {
            this.$refs.graphicLayer.$_hideAllGraphics();
          }
          //清空图层数据
          this.currentLayer = [];
          this.currenSelectLayer = data.name;
          //创建一个新的标绘图层
          this.vueIndex = data.uuid;
          this.$nextTick(function () {
            this.$refs.graphicLayer.drawMode = "";
            this.$refs.graphicLayer.noTitleKey = "list";
            this.$refs.graphicLayer.currentEditType = "mouse";
            this.$refs.graphicLayer.currentIconType = "mouse";
            this.$refs.graphicLayer.$_resetEditPanel();
            this.$refs.graphicLayer.$_resetIconsPanel();
            this.$refs.graphicLayer.$_stopEdit();
            this.$refs.graphicLayer.$_stopDrawing();
            this.$refs.graphicLayer.isStartDrawing = false;
            this.$refs.graphicLayer.$_clearList();
            this.$refs.graphicLayer.$_init([]);
            this.$refs.graphicLayer.$_switchGraphicLayer(this.vueIndex);
          });
          break;
        case "delete":
          this.dataSourceCopy.splice(this.currenSelectIndex, 1);
          if (this.dataSourceCopy.length === 0) {
            this.currenSelectLayer = "无数据";
            this.currentLayer = [];
          }
          break;
        case "editTitle":
          this.showEditTitle = true;
          break;
        case "saveCamera":
          if (this.currenSelectLayer) {
            this.dataSourceCopy[this.currenSelectIndex - 1].camera = getCamera(viewer);
          }
          break;
        case "flyTo":
          if (this.currenSelectLayer) {
            let layer = this.dataSourceCopy[this.currenSelectIndex - 1];
            const {camera} = layer;
            if (camera) {
              const {positionCartographic, heading, pitch, roll} = camera;
              const {longitude, latitude, height} = positionCartographic
              this.viewer.camera.flyTo({
                duration: 1,
                destination: new Cesium.Cartesian3.fromRadians(
                  longitude,
                  latitude,
                  height
                ),
                orientation: {
                  heading: heading,
                  pitch: pitch,
                  roll: roll
                }
              });
            }
          }
          break;
        case "setting":
          this.showSetting = !this.showSetting;
          break;
      }
    },
    $_back() {
      this.showSetting = !this.showSetting;
    },
    $_import() {
      let inputFile = document.getElementById(this.inputId), vm = this;
      inputFile.click();
      inputFile.onchange = function () {
        let File = inputFile.files[0];
        // 使用 FileReader 来读取文件
        let reader = new FileReader();
        // 读取纯文本文件,且编码格式为 utf-8
        reader.readAsText(File, 'UTF-8');
        // 读取文件
        reader.onload = function (e) {
          let fileContent = e.target.result;
          vm.$_updateData(JSON.parse(fileContent));
          inputFile.value = '';
        }
      }
    },
    $_export() {
      let json = this.dataSourceCopy[this.currenSelectIndex - 1];
      this.$refs.graphicLayer.$_stopEdit();
      let dataSource = this.$refs.graphicLayer.$_toJSON();
      let exportJSON = {
        name: json.name,
        uuid: json.uuid,
        autoFlyTo: this.autoFlyTo,
        autoFlyToGraphic: this.autoFlyToGraphic,
        camera: clonedeep(json.camera),
        dataSource: dataSource
      }
      const blob = new Blob([JSON.stringify(exportJSON)], {
        type: "application/json;charset=utf-8",
      });
      let title = json.name || "无标题";
      saveAs(blob, title + ".json");
    },
    //更新数据
    $_updateData(data) {
      this.currenSelectLayer = data.name;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        //uuid相同，更新数据
        if (this.dataSourceCopy[i].uuid === data.uuid) {
          this.$refs.graphicLayer.$_updateStyleByLayer(data);
          this.dataSourceCopy[i].dataSource = data.dataSource.features;
          this.currentLayer = data.dataSource.features;
          this.autoFlyTo = data.autoFlyTo;
          this.autoFlyToGraphic = data.autoFlyToGraphic;
          break;
        } else {
          //uuid不相同，新增数据
          let {dataSource} = data;
          this.$refs.graphicLayer.$_fromJson(dataSource);
          this.dataSourceCopy.push(data);
          this.currenSelectIndex++;
          this.currentLayer = data.dataSource.features;
          this.autoFlyTo = data.autoFlyTo;
          this.autoFlyToGraphic = data.autoFlyToGraphic;
          this.vueIndex = Number(data.uuid);
          this.$nextTick(function () {
            this.$refs.graphicLayer.drawMode = "";
            this.$refs.graphicLayer.noTitleKey = "list";
            this.$refs.graphicLayer.currentEditType = "mouse";
            this.$refs.graphicLayer.currentIconType = "mouse";
            this.$refs.graphicLayer.$_resetEditPanel();
            this.$refs.graphicLayer.$_resetIconsPanel();
            this.$refs.graphicLayer.$_stopEdit();
            this.$refs.graphicLayer.$_stopDrawing();
            this.$refs.graphicLayer.currentEditType = "mouse";
            this.$refs.graphicLayer.isStartDrawing = false;
            this.$refs.graphicLayer.$_clearList();
            this.$refs.graphicLayer.$_init();
            this.$refs.graphicLayer.$_switchGraphicLayer(this.vueIndex);
            this.$refs.graphicLayer.$_fromJson(data.dataSource);
          });
          break;
        }
      }
      if (this.dataSourceCopy.length === 0) {
        this.dataSourceCopy.push(data);
        this.vueIndex = Number(data.uuid);
        this.autoFlyTo = data.autoFlyTo;
        this.autoFlyToGraphic = data.autoFlyToGraphic;
        this.$nextTick(function () {
          this.$refs.graphicLayer.drawMode = "";
          this.$refs.graphicLayer.noTitleKey = "list";
          this.$refs.graphicLayer.currentEditType = "mouse";
          this.$refs.graphicLayer.currentIconType = "mouse";
          this.$refs.graphicLayer.$_resetEditPanel();
          this.$refs.graphicLayer.$_resetIconsPanel();
          this.$refs.graphicLayer.$_stopEdit();
          this.$refs.graphicLayer.$_stopDrawing();
          this.$refs.graphicLayer.currentEditType = "mouse";
          this.$refs.graphicLayer.isStartDrawing = false;
          this.$refs.graphicLayer.$_clearList();
          this.$refs.graphicLayer.$_init();
          this.$refs.graphicLayer.$_switchGraphicLayer(this.vueIndex);
          this.$refs.graphicLayer.$_fromJson(data.dataSource);
        });
        this.currenSelectIndex++;
      }
      if (this.autoFlyTo && data.hasOwnProperty("camera")) {
        const {heading, pitch, roll, positionCartographic} = data.camera;
        const {longitude, latitude, height} = positionCartographic;
        this.viewer.camera.flyTo({
          duration: 2,
          destination: Cesium.Cartesian3.fromRadians(longitude, latitude, height),
          orientation: {
            heading: heading,
            pitch: pitch,
            roll: roll
          }
        });
      }
    },
    //选择图层
    $_selectLayer(e) {
      //设置当前选中的图层
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === e) {
          this.currentLayer = this.dataSourceCopy[i].dataSource.features;
          this.autoFlyTo = this.dataSourceCopy[i].autoFlyTo;
          this.autoFlyToGraphic = this.dataSourceCopy[i].autoFlyToGraphic;
          this.currenSelectLayer = this.dataSourceCopy[i].name;
          this.$refs.graphicLayer.$_hideAllGraphics();
          this.vueIndex = Number(this.dataSourceCopy[i].uuid);
          this.currenSelectIndex = i + 1;
          this.$nextTick(function () {
            this.$refs.graphicLayer.drawMode = "";
            this.$refs.graphicLayer.noTitleKey = "list";
            this.$refs.graphicLayer.currentEditType = "mouse";
            this.$refs.graphicLayer.currentIconType = "mouse";
            this.$refs.graphicLayer.$_resetEditPanel();
            this.$refs.graphicLayer.$_resetIconsPanel();
            this.$refs.graphicLayer.$_stopEdit();
            this.$refs.graphicLayer.$_stopDrawing();
            this.$refs.graphicLayer.$_switchGraphicLayer(this.vueIndex);
            this.$refs.graphicLayer.$_showAllGraphics();
          });
          const {camera} = this.dataSourceCopy[i];
          if (this.autoFlyTo && camera) {
            const {heading, pitch, roll, positionCartographic} = camera;
            const {longitude, latitude, height} = positionCartographic;
            this.viewer.camera.flyTo({
              duration: 2,
              destination: Cesium.Cartesian3.fromRadians(longitude, latitude, height),
              orientation: {
                heading: heading,
                pitch: pitch,
                roll: roll
              }
            });
          }
          break;
        }
      }
    },
    //设置下拉框
    $_layerSelect() {
      this.layerSelect = [];
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        this.layerSelect.push({
          key: this.dataSourceCopy[i].uuid,
          value: this.dataSourceCopy[i].name
        });
      }
    },
    //初始化数据
    $_init(layerIndex) {
      layerIndex = layerIndex || 0;
      //复制数据源
      this.dataSourceCopy = this.dataSource;
      //设置当前图层
      if (this.dataSourceCopy.length > 0) {
        this.currentLayer = this.dataSourceCopy[layerIndex - 1].dataSource.features;
        //初始化graphicLayer图层列表
        this.$_layerSelect(layerIndex);
      } else {
        this.currentLayer = [];
      }
    }
  }
}
</script>

<style scoped>
.mapgis-3d-graphic-layers-select-container {
  width: 332px;
  height: 48px;
  padding: 7px 15px;
}

.mapgis-3d-graphic-layers-select {
  width: 160px;
  float: left;
}

.mapgis-3d-graphic-layers-export {
  float: right;
}

.mapgis-3d-graphic-layers-import {
  float: right;
  margin-right: 6px;
}

.mapgis-ui-graphic-layers-more-tool {
  position: absolute !important;
  right: 9px;
  top: 22px;
}

.mapgis-ui-input-row-left-input {
  width: calc(100% - 148px);
}

.mapgis-ui-graphic-layers-setting-back {
  position: absolute;
  top: -11px;
  left: 6px;
}
</style>