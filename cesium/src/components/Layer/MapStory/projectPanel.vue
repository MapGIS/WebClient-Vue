<template>
  <div>
    <project-panel-ui
        ref="projectP"
        @addMap="$_addChapterMap"
        @deleteProject="$_deleteStory"
        @editProject="$_editStory"
        @toggleChapterFeatures="$_toggleChapterFeatures"
        @addChapter="$_addChapter"
        @copyChapter="$_copyChapter"
        @storyPreview="$_storyPreview"
        @getCamera="$_getCamera"
        @selectCamera="$_selectCamera"
        @showProject="$_showStory"
        @chapterPreview="$_chapterPreview"
        @back="$_back"
        @export="$_export"
        @import="$_import"
        @save="$_save"
        :height="panelHeight"
        :width="width"
        :editList="editList"
        data-source="dataSourceCopy"
        v-show="showProjectPanel"
    />
    <map-collection :key="index" v-for="(opt,index) in optArr" :options="opt"/>
    <story-panel-large-ui
        v-show="showLargePanel"
        @closePanel="$_closePanel"
        @flyTo="$_flyTo"
        :showPlay="showPlay"
        :showArrow="showArrow"
        :dataSource="storyFeature"
        :height="panelHeight"
        :enableFullScreen="enableFullScreen"
    />
    `
  </div>
</template>

<script>
import mapCollection from "./mapCollection";
import mapStoryService from "./mapStoryService";
import editList from "../Graphic/editList";
import ProjectPanelUI from "./ProjectPanelUI";
import StoryPanelLargeUI from "./StoryPanelLargeUI";

window.showProjectEdit = false;
export default {
  name: "projectPanel",
  mixins: [mapStoryService],
  components: {
    "map-collection": mapCollection,
    "project-panel-ui": ProjectPanelUI,
    "story-panel-large-ui": StoryPanelLargeUI,
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
    }
  },
  data() {
    return {
      optArr: [],
      projects: [],
      panelHeight: undefined,
      showLargePanel: false,
      storyFeature: [],
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
      }
    },
    dataSourceCopy: {
      handler: function () {
      },
      deep: true
    },
  },
  mounted() {
    this.$_init();
  },
  methods: {
    //初始化函数
    $_init() {
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
      if (this.height) {
        this.panelHeight = this.height;
      } else {
        this.panelHeight = this.$_getContainerHeight();
      }
    },
    //保存
    $_save() {
      this.$emit("save");
    },
    //导入
    $_import() {
      this.$emit("import");
    },
    //导出
    $_export(project) {
      this.$emit("export", project);
    },
    //回退
    $_back(project) {
      let features = project.features;
      for (let i = 0; i < features.length; i++) {
        let entity = this.viewer.entities.getById(features[i].uuid);
        if (entity) {
          entity.show = false;
        }
      }
    },
    //预览章节
    $_chapterPreview(feature) {
      if (this.enablePreview) {
        this.storyFeature = [feature];
        this.showPlay = false;
        this.showArrow = false;
        this.showLargePanel = true;
        this.enableFullScreen = false;
      } else {
        this.$emit("featurePreview", feature);
      }
    },
    //预览地图故事
    $_storyPreview(chapters) {
      if (this.enablePreview) {
        this.storyFeature = this.currentProject.features;
        this.showPlay = true;
        this.showArrow = true;
        this.showLargePanel = true;
      } else {
        this.$emit("projectPreview", chapters);
      }
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
    //保存章节
    $_copyChapter(uuid) {
      this.$emit("copyChapter", uuid);
    },
    //取得视角
    $_getCamera(currentFeature) {
      this.$emit("getCamera", currentFeature);
    },
    //选择视角
    $_selectCamera(camera, currentFeature) {
      this.$emit("selectCamera", camera, currentFeature);
    },
    //删除故事
    $_deleteStory(project) {
      this.$emit("deleteProject");
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === project.uuid) {
          this.dataSourceCopy.splice(i, 1);
        }
      }
      if (!project.features) {
        if (this.upProjectSet.hasOwnProperty(project.uuid)) {
          project = this.upProjectSet[project.uuid];
        } else {
          return;
        }
      }
      for (let i = 0; i < project.features.length; i++) {
        this.viewer.entities.removeById(project.features[i].id);
        const {map} = project.features[i];
        if (map) {
          let layer;
          const {vueKey, vueIndex, type} = map;
          if (vueKey && vueIndex && type) {
            switch (type) {
              case "WMTS":
                layer = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex).source;
                break;
              case "WMS":
                layer = window.vueCesium.OGCWMSManager.findSource(vueKey, vueIndex).source;
                break;
              case "TILE":
                layer = window.vueCesium.IgsTilecLayerManager.findSource(vueKey, vueIndex).source;
                break;
              case "DYNAMIC":
                layer = window.vueCesium.IgsserverManager.findSource(vueKey, vueIndex).source;
                break;
              case "DOC":
                layer = window.vueCesium.IgsDocLayerManager.findSource(vueKey, vueIndex).source;
                break;
            }
            this.viewer.imageryLayers.remove(layer);
          }
        }
      }
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
    $_toggleChapterFeatures(featureUUID, projectUUID, show) {
      this.$emit("toggleChapterFeatures", featureUUID, projectUUID, show);
    },
    //显示故事
    $_showStory(project) {
      this.$emit("showProject", project);
    }
  }
}
</script>

<style scoped>
.mapgis-mapstory-project-panel-edit {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 400px;
  height: 900px;
  background: rgb(32, 33, 36);
  padding-bottom: 20px;
}
</style>