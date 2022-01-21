<template>
  <div :id="id" @click="$_clickPanel" class="mapgis-ui-project-edit-panel"
       :style="{height: height + 'px', width: width + 'px'}">
    <div v-show="!editFeature && !showSetting" :style="{height: height - 32 + 'px'}">
      <div class="mapgis-ui-project-edit-top-bar">
        <mapgis-ui-row class="mapgis-ui-project-edit-top-tool">
          <mapgis-ui-col span="18" class="mapgis-ui-project-edit-top-left">
          </mapgis-ui-col>
          <mapgis-ui-col span="6" class="mapgis-ui-project-edit-top-right">
            <mapgis-ui-base64-icon style="margin-right: 4px;" width="18px" @click="$_export" type="export"/>
            <mapgis-ui-base64-icon width="16px" @click="$_showSetting" type="setting"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row class="mapgis-ui-project-edit-title">
          <mapgis-ui-col span="24">
            <span v-show="!editTitle" class="mapgis-ui-project-edit-title-value">{{ projectCopy.title }}</span>
            <mapgis-ui-svg-icon v-show="!editTitle"
                                id="mpEdit" @click="$_editTitle"
                                class="mapgis-ui-project-edit-edit-icon mapgis-ui-project-edit-edit-icon-p"
                                type="edit"/>
            <mapgis-ui-input v-show="editTitle"
                             class="mapgis-ui-project-edit-title-edit"
                             @change="$_titleChange" title="标题" id="mpTitle"
                             v-model="projectCopy.title"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </div>
      <mapgis-ui-row>
        <mapgis-ui-feature-row
          @deleteFeature="$_deleteFeature"
          v-model="projectCopy.chapters"
          :width="width"
        />
      </mapgis-ui-row>
    </div>
    <!--附加地图-->
    <mapgis-ui-map-multi-rows v-show="showSetting"
                              :showTitleIcon="false"
                              showMoreTitle=""
                              :map="projectCopy.map"
                              @addMap="$_addProjectMap" title="附加地图"/>
    <!--按钮区域-->
    <mapgis-ui-row v-show="!editFeature && !showSetting">
      <mapgis-ui-col span="24" class="mapgis-ui-project-edit-new-feature">
        <mapgis-ui-dropdown>
          <mapgis-ui-menu slot="overlay">
            <mapgis-ui-menu-item key="4" @click="$_copyChapter">
              复制上一章节
            </mapgis-ui-menu-item>
          </mapgis-ui-menu>
          <mapgis-ui-button @click="$_addChapter" class="mapgis-ui-project-edit-feature-button">
            新建章节
          </mapgis-ui-button>
        </mapgis-ui-dropdown>
        <mapgis-ui-button type="primary" @click="$_projectPreview" class="mapgis-ui-project-edit-feature-preview">
          预览
        </mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <!--编辑章节区域-->
    <div v-show="editFeature" style="height: 100%;">
      <feature-edit
        ref="featureEdit"
        @getCamera="$_setCamera"
        @selectCamera="$_selectCamera"
        @addMap="$_addMap"
        @featurePreview="$_featurePreview"
        @animationTimeChanged="$_changeAnimationTime"
        @save="$_save"
        :data-source="currentChapter"
        :cameras="cameras"
        :height="height"
        :editList="editList"
      />
    </div>
  </div>
</template>

<script>
import FeatureEdit from "./FeatureEdit"
import GraphicLayerService from "../Graphic/GraphicLayerService";

export default {
  name: "mapgis-3d-project-edit",
  mixins: [GraphicLayerService],
  components: {
    "feature-edit": FeatureEdit
  },
  data() {
    return {
      //当前章节
      currentChapter: {},
      showSetting: false,
      editFeature: false,
      editTitle: false,
      dataSourceCopy: undefined,
      margin: 26,
      cameras: []
    }
  },
  props: {
    dataSource: {
      type: Object,
      default() {
        return {};
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
    },
    editList: {
      type: Object
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
      },
      deep: true
    },
    height: {
      handler: function () {
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        this.$emit("change", this.projectCopy);
      },
      deep: true
    },
    currentChapter: {
      handler: function () {
      },
      deep: true
    }
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
            vm.$refs.featureEdit.$_stopDraw();
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
    //初始化函数
    $_init() {
      //复制数据源
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
    },
    //显示设置信息
    $_showSetting() {
      this.showSetting = true;
    },
    //点击面板事件
    $_clickPanel(e) {
      if (e.target.id !== "mpTitle" && e.target.id !== "mpDescription" && e.target.id !== "mpEdit") {
        this.editTitle = false;
      }
    },
    //设置相机视角
    $_setCamera() {
      this.$emit("setCamera", this.currentChapter);
    },
    //选择相机视角
    $_selectCamera(camera) {
      this.$emit("selectCamera", camera, this.currentChapter);
    },
    //添加章节底图
    $_addMap(type, map, id) {
      this.$emit("addMap", type, map, id);
    },
    //添加故事
    $_addProjectMap(type, map) {
      this.showSetting = false;
      this.$emit("addMapToProject", type, map, this.projectCopy);
    },
    //预览故事
    $_projectPreview() {
      this.$emit("projectPreview");
    },
    //导出
    $_export() {
      this.$emit("export", this.projectCopy);
    },
    //删除故事
    $_deleteProject() {
      this.$emit("deleteProject", this.projectCopy);
      this.$_back();
    },
    //修改标题
    $_titleChange() {
      this.$emit("titleChanged", {
        title: this.projectCopy.title,
        description: this.projectCopy.description,
        uuid: this.projectCopy.uuid,
      });
    },
    //修改标题
    $_editTitle() {
      this.editTitle = true;
    },
    //取得空章节数据
    $_getChapter() {
      return {
        "uuid": "Chapter_" + parseInt(String(Math.random() * 100000000)),
        "camera": {
          "uuid": "Chapter_" + parseInt(String(Math.random() * 100000000)),
          "heading": 0,
          "pitch": 0,
          "roll": 0,
          "positionCartographic": {
            "longitude": 0,
            "latitude": 0,
            "height": 0,
          }
        },
        "features": [],
        "title": "无标题",
        "animationTime": "5000"
      };
    },
    //新增章节
    $_addChapter() {
      let chapter = this.$_getChapter();
      chapter.projectUUID = this.projectCopy.uuid;
      this.$emit("addChapter", chapter);
    },
    //保存数据
    $_save() {
      this.$emit("save");
    },
    //更新动画时间
    $_changeAnimationTime(feature) {
      this.$emit("animationTimeChanged", feature);
    },
    //预览一个章节
    $_featurePreview(feature) {
      this.$emit("featurePreview", feature);
    },
  }
}
</script>

<style scoped>
.mapgis-ui-project-edit-title-edit {
  width: 90%;
}

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