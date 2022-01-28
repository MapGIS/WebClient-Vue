<template>
  <div>
    <project-panel-ui
        ref="projectP"
        @addMap="$_addChapterMap"
        @addStory="$_addStory"
        @deleteStory="$_deleteStory"
        @editProject="$_editStory"
        @toggleChapterFeatures="$_toggleChapterFeatures"
        @addChapter="$_addChapter"
        @copyChapter="$_copyChapter"
        @deleteChapter="$_deleteChapter"
        @changeChapter="$_changeChapter"
        @changeStory="$_changeStory"
        @storyPreview="$_storyPreview"
        @setCamera="$_setCamera"
        @selectCamera="$_selectCamera"
        @showProject="$_showStory"
        @chapterPreview="$_chapterPreview"
        @export="$_export"
        @import="$_import"
        @save="$_save"
        @close="$_close"
        :height="height"
        :width="width"
        :data-source="dataSourceCopy"
        :enableImport="enableImport"
        :enableOneMap="enableOneMap"
        v-show="showProjectPanel"
    />
  </div>
</template>

<script>
import editList from "../Graphic/editList";
import ProjectPanelUI from "./ProjectPanelUI";

window.showProjectEdit = false;
export default {
  name: "projectPanel",
  components: {
    "project-panel-ui": ProjectPanelUI,
  },
  inject: ["Cesium", "viewer"],
  model: {
    prop: "dataSource",
    event: "change"
  },
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    enableClose: {
      type: Boolean,
      default: true
    },
    upProjectSet: {
      type: Object,
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
      projects: [],
      panelHeight: undefined,
      showLargePanel: false,
      //当前的工程
      currentProject: {},
      showProjectPanel: true,
      showPlay: true,
      showArrow: true,
      enableFullScreen: true,
      showPanels: window.showPanels,
      dataSourceCopy: undefined,
      editList: editList
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
      },
      deep: true
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    //初始化函数
    $_init() {
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
    },
    //修改章节内容
    $_changeChapter(chapter) {
      this.$emit("changeChapter", chapter);
    },
    //修改故事内容
    $_changeStory(story) {
      this.$emit("changeStory", story);
    },
    //保存
    $_save() {
      this.$emit("save");
    },
    //关闭面板
    $_close() {
      this.$emit("close");
    },
    //导入
    $_import() {
      this.$emit("import");
    },
    //导出
    $_export(project) {
      this.$emit("export", project);
    },
    //预览章节
    $_chapterPreview(chapter) {
      this.$emit("chapterPreview", chapter);
    },
    //预览地图故事
    $_storyPreview(story) {
      this.$emit("storyPreview", story);
    },
    //关闭右侧轮播面板
    $_closePanel() {
      this.showLargePanel = false;
    },
    //编辑故事
    $_editStory(index) {
      this.$emit("editProject", index);
    },
    //新增章节
    $_addChapter(chapter) {
      this.$emit("addChapter", chapter);
    },
    //复制上一章节
    $_copyChapter(chapter) {
      this.$emit("copyChapter", chapter);
    },
    //删除章节
    $_deleteChapter(index, uuid) {
      this.$emit("deleteChapter", index, uuid);
    },
    //取得视角
    $_setCamera(currentChapter, camera) {
      this.$emit("setCamera", currentChapter, camera);
    },
    //选择视角
    $_selectCamera(camera, currentFeature) {
      this.$emit("selectCamera", camera, currentFeature);
    },
    //新增故事
    $_addStory() {
      this.$emit("addStory");
    },
    //删除故事
    $_deleteStory(index) {
      this.$emit("deleteStory", index);
    },
    //天机故事底图
    $_addStoryMap(type, map, project) {
      this.$emit("addMapToProject", type, map, project);
    },
    //添加章节地图
    $_addChapterMap(type, map, id) {
      let addMap = true, index;
      for (let i = 0; i < this.optArr.length; i++) {
        if (this.optArr[i].id === id) {
          addMap = false;
          index = i;
          break;
        }
      }
      if (addMap) {
        this.optArr.push(map);
      } else {
        this.$set(this.optArr, index, map);
      }
    },
    //是否显示章节要素
    $_toggleChapterFeatures(featureUUID, mapStoryUUID, show) {
      this.$emit("toggleChapterFeatures", featureUUID, mapStoryUUID, show);
    },
    //显示故事
    $_showStory(project) {
      this.$emit("showProject", project);
    }
  }
}
</script>

<style scoped>
</style>