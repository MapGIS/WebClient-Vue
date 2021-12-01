<template>
  <div :id="id" @click="$_clickPanel" class="mapgis-ui-project-edit-panel"
       :style="{height: height + 'px', width: width + 'px'}">
    <div v-show="!editFeature" :style="{height: height - 32 + 'px'}">
      <div class="mapgis-ui-project-edit-top-bar">
        <mapgis-ui-row class="mapgis-ui-project-edit-top-tool">
          <mapgis-ui-col span="18" class="mapgis-ui-project-edit-top-left">
          </mapgis-ui-col>
          <mapgis-ui-col span="6" class="mapgis-ui-project-edit-top-right">
            <mapgis-ui-base64-icon width="16px" @click="$_deleteProject" type="setting"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row v-show="!editTitle" class="mapgis-ui-project-edit-title">
          <mapgis-ui-col span="24">
            <span class="mapgis-ui-project-edit-title-value">{{ projectCopy.title }}</span>
            <mapgis-ui-svg-icon id="mpEdit" @click="$_editTitle"
                                class="mapgis-ui-project-edit-edit-icon mapgis-ui-project-edit-edit-icon-p"
                                type="edit"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </div>
      <mapgis-ui-row v-show="editTitle">
        <mapgis-ui-input-outline @change="$_titleChange" title="标题" :inputStyle="inputStyle" id="mpTitle"
                                 v-model="projectCopy.title"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="editTitle">
        <mapgis-ui-textarea-outline @change="$_titleChange" :textareaStyle="textareaStyle" :hasToolBar="false"
                                    id="mpDescription"
                                    v-model="projectCopy.description" placeholder="描述信息"/>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-feature-row
            @showFeature="$_showFeature"
            @deleteFeature="$_deleteFeature"
            @editFeature="$_editFeature"
            :features="projectCopy.features"
            :width="width"
        />
      </mapgis-ui-row>
    </div>
    <mapgis-ui-row v-show="!editFeature">
      <mapgis-ui-col span="24" class="mapgis-ui-project-edit-new-feature">
        <mapgis-ui-dropdown>
          <mapgis-ui-menu slot="overlay">
            <mapgis-ui-menu-item key="1" @click="$_addPoint">
              添加点
            </mapgis-ui-menu-item>
            <mapgis-ui-menu-item key="2" @click="$_addLine">
              添加线
            </mapgis-ui-menu-item>
            <mapgis-ui-menu-item key="3" @click="$_addPolygon">
              添加多边形
            </mapgis-ui-menu-item>
            <mapgis-ui-menu-item key="4" @click="$_addRectangle">
              添加矩形
            </mapgis-ui-menu-item>
          </mapgis-ui-menu>
          <mapgis-ui-button class="mapgis-ui-project-edit-feature-button">新建</mapgis-ui-button>
        </mapgis-ui-dropdown>
        <mapgis-ui-button type="primary" @click="$_projectPreview" class="mapgis-ui-project-edit-feature-preview">
          预览
        </mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div v-show="editFeature">
      <mapgis-ui-feature-edit
          @textChanged="$_textChanged"
          @getCamera="$_getCamera"
          @addMap="$_addMap"
          @changeColor="$_changeColor"
          @changeIcon="$_changeIcon"
          @featurePreview="$_featurePreview"
          @back="$_featureBack"
          @titleChanged="$_featureTitleChanged"
          @firstAddPicture="$_firstAddPicture"
          :feature="currentFeature"
          :cameras="cameras"
          :height="height"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-edit",
  model: {
    prop: "project",
    event: "change"
  },
  data() {
    return {
      panelScale: 1,
      currentFeature: undefined,
      editFeature: false,
      editTitle: false,
      projectCopy: undefined,
      iconStyle: {
        opacity: 1
      },
      textareaStyle: {
        marginBottom: "20px",
        marginLeft: "-14px",
        width: "358px"
      },
      inputStyle: {
        marginBottom: "20px",
        marginLeft: "-14px",
        width: "358px"
      },
      margin: 26,
      cameras: []
    }
  },
  props: {
    project: {
      type: Object,
      default() {
        return {
          "title": "测试1",
          "description": "",
          "features": []
        };
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
    id: {
      type: String,
      default: "defaultProjectEditId"
    }
  },
  watch: {
    project: {
      handler: function () {
        this.projectCopy = this.project;
      },
      deep: true
    },
    height: {
      handler: function () {
        this.panelScale = this.height / 900;
      },
      deep: true
    },
    "project.features": {
      handler: function () {
        this.projectCopy = this.project;
      },
      deep: true
    },
    projectCopy: {
      handler: function () {
        this.$emit("change", this.projectCopy);
      },
      deep: true
    }
  },
  created() {
    this.projectCopy = this.project;
  },
  mounted() {
    if (this.width < 310) {
      this.margin = 0;
    }
    let title = document.getElementsByClassName("ant-card-head-title");
    let vm = this;
    for (let i = 0; i < title.length; i++) {
      if (title[i].innerText === "地图故事") {
        title[i].innerHTML = "<img style='width: 12px;margin-bottom: 3px;margin-right: 4px; cursor: pointer;' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjM4MTEwNzU0MDU2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzMDYiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTk1OS4yOTYgNDU1LjgwOEgyNzYuOTI4bDMyMC42NC0zMTMuMTUyLTc4LjY1Ni03Ny41NjgtNDUyLjkyOCA0NDYuNjU2IDQ1My44MjQgNDQ2Ljk3NiA3Ny4xODQtNzYuODY0TDI3Ny4xMiA1NjQuMDk2aDY4Mi4xNzZWNDU1LjgwOHoiIHAtaWQ9IjIzMDciPjwvcGF0aD48L3N2Zz4=' id='MapStoryClose'/>地图故事";
        let MapStoryClose = document.getElementById("MapStoryClose");
        MapStoryClose.onclick = function () {
          if (vm.editFeature) {
            vm.editFeature = false;
            window.showPanels.currentPage = "projectEdit";
          } else {
            vm.$emit("backed");
          }
        }
      }
    }
  },
  methods: {
    $_clickPanel(e) {
      if (e.target.id !== "mpTitle" && e.target.id !== "mpDescription" && e.target.id !== "mpEdit") {
        this.editTitle = false;
      }
    },
    $_textChanged(text) {
      let features = this.projectCopy.features, index;
      for (let i = 0; i < features.length; i++) {
        if (features[i].id === this.currentFeature.id) {
          index = i;
          break;
        }
      }
      this.$emit("textChanged", text, index);
    },
    $_getCamera() {
      this.$emit("getCamera", this.currentFeature);
    },
    $_addMap(type, map, id) {
      this.$emit("addMap", type, map, id);
    },
    $_addMapToProject(type, map) {
      this.$emit("addMapToProject", type, map, this.projectCopy);
    },
    $_changeColor(color, type) {
      this.$emit("changeColor", color, type, this.currentFeature.id, this.currentFeature.baseUrl.type);
    },
    $_changeIcon(icon) {
      this.$emit("changeIcon", icon, this.currentFeature.id);
    },
    $_showFeature(id, flag, index) {
      this.$emit("showFeature", id, flag, index, this.projectCopy);
    },
    $_projectPreview() {
      this.$emit("projectPreview");
    },
    $_deleteProject() {
      this.$emit("deleteProject", this.projectCopy);
      this.$_back();
    },
    $_titleChange() {
      this.$emit("titleChanged", {
        title: this.projectCopy.title,
        description: this.projectCopy.description,
        uuid: this.projectCopy.uuid,
      });
    },
    $_editFeature(index) {
      this.editFeature = true;
      this.currentFeature = this.projectCopy.features[index];
      let cameras = [];
      for (let i = 0; i < this.projectCopy.features.length; i++) {
        cameras.push(Object.assign({}, this.projectCopy.features[i].camera));
        cameras[i].title = this.projectCopy.features[i].title;
      }
      this.cameras = cameras;
      if (window.showPanels) {
        window.showPanels.currentPage = "featureEdit";
      }
    },
    $_editTitle() {
      this.editTitle = true;
    },
    $_getFeature(type) {
      return {
        "title": "无标题",
        "id": type + parseInt(String(Math.random() * 100000000)),
        "content": "",
        "containerType": "small",
        "images": "",
        "layerStyle": {
          "show": true
        },
        show: true,
        "baseUrl": {
          "type": type,
          "geometry": {},
          "properties": {}
        },
        "camera": {
          "heading": 0,
          "pitch": 0,
          "roll": 0,
          "longLatPosition": [0, 0, 0],
          "positionCartographic": {
            "longitude": 0,
            "latitude": 0,
            "height": 0,
          }
        }
      }
    },
    $_addPoint() {
      let feature = this.$_getFeature("point");
      this.$emit("addFeature", {
        type: "point",
        feature: feature
      });
    },
    $_addLine() {
      let feature = this.$_getFeature("polyline");
      this.$emit("addFeature", {
        type: "polyline",
        feature: feature
      });
    },
    $_addPolygon() {
      let feature = this.$_getFeature("polygon");
      this.$emit("addFeature", {
        type: "polygon",
        feature: feature
      });
    },
    $_addRectangle() {
      let feature = this.$_getFeature("polygon");
      this.$emit("addFeature", {
        type: "rectangle",
        feature: feature
      });
    },
    $_firstAddPicture(feature) {
      this.$emit("firstAddPicture", feature);
    },
    $_featureTitleChanged(feature) {
      this.$emit("featureTitleChanged", feature);
    },
    $_featureBack() {
      this.editFeature = false;
    },
    $_featurePreview(feature) {
      this.$emit("featurePreview", feature);
    },
    $_deleteFeature(index, id) {
      let feature = this.projectCopy.features.splice(index, 1);
      this.$emit("deleteFeature", index, id, this.projectCopy, feature);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-edit-panel {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 400px;
  height: 900px;
  transform-origin: top left;
  overflow: hidden;
  overflow-y: scroll;
}

.mapgis-ui-project-edit-panel::-webkit-scrollbar {
  display: none;
}

.mapgis-ui-project-edit-top-bar {
  background: url("./img/bg.png");
  width: 100%;
  height: 96px;
  position: relative;
}

.mapgis-ui-project-edit-top-tool {
  height: 50px;
  padding-top: 8px;
}

.mapgis-ui-project-edit-top-left {
  text-align: left;
  padding-left: 10px;
}

.mapgis-ui-project-edit-top-right {
  text-align: right;
  padding-right: 14px;
}

.mapgis-ui-project-edit-title {
  width: 100%;
  height: 52px;
  position: absolute;
  top: 35px;
  left: 10px;
}

.mapgis-ui-project-edit-title-value {
  font-weight: bold;
  text-align: left;
  font-size: 20px;
  padding-left: 10px;
}

.mapgis-ui-project-edit-edit-icon {
  margin-left: 10px;
}

.mapgis-ui-project-edit-edit-icon-p {
  position: absolute;
  top: -3px;
}

.mapgis-ui-project-edit-new-feature {
  text-align: left;
  padding-left: 4px;
  height: 36px;
}

.mapgis-ui-project-edit-feature-button {
  width: 47%;
  height: 32px;
  margin-right: 10px;
  background: white;
  color: #0081E2;
  font-size: 14px;
}

.mapgis-ui-project-edit-feature-preview {
  width: 47%;
  height: 32px;
  color: white;
  font-weight: bold;
  border: 1px solid #75BAED;
  background: #0081E2;
}
</style>