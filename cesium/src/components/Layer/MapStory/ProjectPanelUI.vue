<template>
  <div>
    <div :style="{height: height + 'px',width: width + 'px'}" @click="$_click"
         class="mapgis-ui-project-panel">
      <div class="mapgis-ui-project-panel-content" v-show="!showStoryEdit" :style="{height: height - 40 + 'px'}">
        <mapgis-ui-project-header @import="$_import"/>
        <mapgis-ui-project-row @editProject="$_editStory"
                               @deleted="$_deleteStory"
                               @export="$_export"
                               @import="$_import"
                               @showProjected="$_showProject"
                               @marked="$_markerStory"
                               @projectPreview="$_storyPreview"
                               :projects="dataSourceCopy"
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
        v-show="showStoryEdit"
        :width="width"
        :height="height"
        @changeChapter="$_changeChapter"
        @addMap="$_addMap"
        @setCamera="$_setCamera"
        @selectCamera="$_selectCamera"
        @toggleChapterFeatures="$_toggleChapterFeatures"
        @storyPreview="$_storyPreview"
        @chapterPreview="$_chapterPreview"
        @addChapter="$_addChapter"
        @copyChapter="$_copyChapter"
        @export="$_export"
        @save="$_save"
        @backed="$_back"
        ref="panelEdit"
        :data-source="currentStory"/>
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
  model: {
    prop: "dataSource",
    event: "change"
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
    editList: {
      type: Object
    }
  },
  data() {
    return {
      optArr: [],
      showEditPanel: false,
      addProject: false,
      currentStory: undefined,
      storys: [],
      currentProjectIndex: undefined,
      storyFeature: [],
      dataSourceCopy: undefined,
      showStoryEdit: false
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
    //导入数据
    $_import() {
      this.$emit("import");
    },
    //删除故事
    $_deleteStory() {
      this.currentStorys.splice(this.currentProjectIndex, 1);
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
      this.currentStory = {
        "title": "无标题",
        "description": "",
        "uuid": "mapStory" + parseInt(String(Math.random() * 100000000)),
        "map": {
          "type": "",
          "baseUrl": "",
          "layer": "",
          "tilingScheme": "",
          "tileMatrixSet": "",
          "format": "",
          "vueKey": "",
          "vueIndex": ""
        },
        "features": [],
        "chapters": []
      };
      this.dataSourceCopy.push(this.currentStory);
      this.showStoryEdit = true;
    },
    //编辑故事
    $_editStory(index) {
      this.currentStory = JSON.parse(JSON.stringify(this.dataSourceCopy[index]));
      this.showStoryEdit = true;
    },
    //回退
    $_back() {
      this.showStoryEdit = false;
      this.$emit("back", this.currentStory);
    },
    //新增章节
    $_addChapter(chapter) {
      this.$emit("addChapter", chapter);
    },
    //复制章节
    $_copyChapter(uuid) {
      this.$emit("copyChapter", uuid);
    },
    //添加章节地图
    $_addMap(type, map, id) {
      this.$emit("addMap", type, map, id);
    },
    //修改章节内容
    $_changeChapter(chapter) {
      this.$emit("changeChapter", chapter);
    },
    //设置视角
    $_setCamera(currentFeature) {
      this.$emit("setCamera", currentFeature);
    },
    //选择视角
    $_selectCamera(camera, currentFeature) {
      this.$emit("selectCamera", camera, currentFeature);
    },
    //显示或隐藏章节要素
    $_toggleChapterFeatures(featureUUID, projectUUID, show) {
      this.$emit("toggleChapterFeatures", featureUUID, projectUUID, show);
    },
    //预览故事
    $_storyPreview(project) {
      if (!project) {
        this.currentStoryFeature = this.currentStory.features;
      }
      project = project || this.currentStory;
      this.$emit("projectPreview", project);
    },
    //预览章节
    $_chapterPreview(feature) {
      this.$emit("featurePreview", feature);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 400px;
  height: 900px;
  transform-origin: top left;
}

.mapgis-ui-project-add-story-row {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
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
</style>