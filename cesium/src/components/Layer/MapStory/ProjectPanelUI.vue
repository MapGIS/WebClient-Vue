<template>
  <div>
    <div :style="{height: height + 'px',width: width + 'px'}" @click="$_click"
         class="mapgis-ui-project-panel">
      <div class="mapgis-ui-project-panel-content" v-show="!showStoryEdit" :style="{height: height + 'px'}">
        <mapgis-ui-row class="mapgis-ui-project-panel-back"
          v-if="!enableOneMap"
        >
          <span>
            地图故事
          </span>
          <mapgis-ui-svg-icon
            style="position:absolute;right: -16px;top: 0;"
            :iconStyle="{width: '18px'}"
            @click="$_close"
            type="close"/>
        </mapgis-ui-row>
        <mapgis-ui-project-header
          @import="$_import"
          @search="$_search"
          :enableImport="enableImport"/>
        <mapgis-ui-project-row @editProject="$_editStory"
                               @deleted="$_deleteStory"
                               @export="$_export"
                               @import="$_import"
                               @showProjected="$_showProject"
                               @marked="$_markerStory"
                               @storyPreview="$_storyPreview"
                               :projects="dataSourceCopy"
                               :hideArr="hideArr"
                               :width="width"
        />
      </div>
      <mapgis-ui-row class="mapgis-ui-project-add-story-row">
        <mapgis-ui-col span="24">
          <mapgis-ui-button @click="$_addStory" type="primary" class="mapgis-ui-project-add-story">
            新建故事
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <project-edit
        ref="panelEdit"
        v-show="showStoryEdit"
        @changeChapter="$_changeChapter"
        @changeStory="$_changeStory"
        @addMap="$_addMap"
        @setCamera="$_setCamera"
        @selectCamera="$_selectCamera"
        @toggleChapterFeatures="$_toggleChapterFeatures"
        @storyPreview="$_storyPreview"
        @chapterPreview="$_chapterPreview"
        @addChapter="$_addChapter"
        @deleteChapter="$_deleteChapter"
        @copyChapter="$_copyChapter"
        @export="$_export"
        @save="$_save"
        @back="$_back"
        @close="$_close"
        :data-source="currentStory"
        :width="width"
        :height="height"
        :models="models"
        :cameras="cameras"
        :enableOneMap="enableOneMap"
      />
    </div>
  </div>
</template>

<script>
import ProjectEdit from "./ProjectEdit"

export default {
  name: "mapgis-3d-project-panel-ui",
  components: {
    "project-edit": ProjectEdit
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
    }
  },
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
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
    models: {
      type: Object
    },
    editList: {
      type: Object
    },
    enableImport: {
      type: Boolean,
      default: false
    },
    //一张图模式
    enableOneMap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      optArr: [],
      showEditPanel: false,
      addProject: false,
      currentStory: undefined,
      currentProjectIndex: undefined,
      storyFeature: [],
      dataSourceCopy: undefined,
      showStoryEdit: false,
      hideArr: [],
      cameras: [],
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    //初始化函数
    $_init() {
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
      //如果currentStory存在，则更新
      if (this.currentStory) {
        for (let i = 0; i < this.dataSourceCopy.length; i++) {
          if (this.dataSourceCopy[i].uuid === this.currentStory.uuid) {
            this.currentStory = JSON.parse(JSON.stringify(this.dataSourceCopy[i]));
            //取得相机视角数组
            let chapters = JSON.parse(JSON.stringify(this.currentStory.chapters))
            let cameras = [];
            for (let i = 0; i < chapters.length; i++) {
              cameras.push(chapters[i].camera);
            }
            this.cameras = cameras
          }
        }
      }
    },
    //保存数据
    $_save() {
      this.$emit("save");
    },
    //导出数据
    $_export(project) {
      if (typeof project === "number") {
        project = this.dataSourceCopy[project];
      }
      this.$emit("export", project);
    },
    //搜索
    $_search(e) {
      let hideArr = [];
      //不想触发数据更新，因此隐藏不包含搜索内容的数据
      if (e.target.value) {
        for (let i = 0; i < this.dataSourceCopy.length; i++) {
          if (this.dataSourceCopy[i].title.indexOf(e) < 0) {
            hideArr.push(i);
          }
        }
      }
      this.hideArr = hideArr;
    },
    //导入数据
    $_import() {
      this.$emit("import");
    },
    //删除故事
    $_deleteStory(index) {
      this.$emit("deleteStory", index);
    },
    //保存标题
    $_click(e) {
      if (this.$refs.panelEdit && e.target.id !== "mpTitle" && e.target.id !== "mpDescription" && e.target.id !== "mpEdit") {
        if (this.$refs.panelEdit.editTitle) {
          this.$refs.panelEdit.editTitle = false;
        }
      }
    },
    //指定故事
    $_markerStory(index, type) {
      this.$set(this.currentStorys[index], "type", type);
    },
    //显示故事
    $_showProject(index, flag) {
      this.$emit("showProject", this.currentStorys[index]);
    },
    //添加故事
    $_addStory() {
      this.$emit("addStory");
    },
    //编辑故事
    $_editStory(index) {
      this.currentStory = JSON.parse(JSON.stringify(this.dataSourceCopy[index]));
      this.showStoryEdit = true;
    },
    //返回上一级
    $_back() {
      this.showStoryEdit = false;
    },
    //关闭面板
    $_close() {
      this.$emit("close");
    },
    //新增章节
    $_addChapter(chapter) {
      this.$emit("addChapter", chapter);
    },
    //复制章节
    $_copyChapter(chapter) {
      this.$emit("copyChapter", chapter);
    },
    //删除章节
    $_deleteChapter(index, uuid) {
      this.$emit("deleteChapter", index, uuid);
    },
    //添加章节地图
    $_addMap(type, map, id) {
      this.$emit("addMap", type, map, id);
    },
    //修改章节内容
    $_changeChapter(chapter) {
      this.$emit("changeChapter", chapter);
    },
    //修改故事内容
    $_changeStory(story) {
      this.$emit("changeStory", story);
    },
    //设置视角
    $_setCamera(currentChapter, camera) {
      this.$emit("setCamera", currentChapter, camera);
    },
    //选择视角
    $_selectCamera(camera, currentFeature) {
      this.$emit("selectCamera", camera, currentFeature);
    },
    //显示或隐藏章节要素
    $_toggleChapterFeatures(featureUUID, mapStoryUUID, show) {
      this.$emit("toggleChapterFeatures", featureUUID, mapStoryUUID, show);
    },
    //预览故事
    $_storyPreview(story) {
      this.$emit("storyPreview", story);
    },
    //预览章节
    $_chapterPreview(chapter) {
      this.$emit("chapterPreview", chapter);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  width: 400px;
  height: 900px;
  transform-origin: top left;
  /*div点击穿透*/
  pointer-events: auto;
}

.mapgis-ui-project-add-story-row {
  position: absolute;
  left: 8px;
  bottom: 8px;
  width: calc(100% - 16px);
}

.mapgis-ui-project-add-story {
  width: 100%;
  height: 40px;
  background: #1890FF;
}

.mapgis-ui-project-panel-content {
  overflow: hidden;
  overflow-y: scroll;
}

.mapgis-ui-project-panel-content::-webkit-scrollbar {
  display: none;
}

.mapgis-ui-project-panel-back {
  padding: 8px;
  border-bottom: 1px solid rgb(217, 217, 217);
}
</style>