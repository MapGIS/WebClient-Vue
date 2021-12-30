<template>
  <div>
    <mapgis-ui-project-panel
        ref="projectP"
        @addMap="$_addMap"
        @deleteProject="$_deleteProject"
        @editProject="$_editProject"
        @addFeature="$_addFeature"
        @deleteFeature="$_deleteFeature"
        @toggleChapterFeatures="$_toggleChapterFeatures"
        @addChapter="$_addChapter"
        @copyChapter="$_copyChapter"
        @projectPreview="$_projectPreview"
        @closeHoverPanel="$_closeHoverPanel"
        @getCamera="$_getCamera"
        @changeEntityTitle="$_changeEntityTitle"
        @changeEntity="$_changeEntity"
        @selectCamera="$_selectCamera"
        @changeIcon="$_changeIcon"
        @showFeature="$_showFeature"
        @showProject="$_showProject"
        @featurePreview="$_featurePreview"
        @back="$_back"
        @export="$_export"
        :height="panelHeight"
        :width="width"
        :editList="editList"
        v-model="dataSourceCopy"
        v-show="showProjectPanel"
    />
    <map-collection :key="index" v-for="(opt,index) in optArr" :options="opt"/>
    <mapgis-ui-story-panel-large
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

window.showProjectEdit = false;
export default {
  name: "projectPanel",
  mixins: [mapStoryService],
  components: {
    "map-collection": mapCollection,
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
        this.dataSourceCopy = this.dataSource;
      }
    },
    dataSourceCopy: {
      handler: function () {
        this.$emit("change", this.dataSourceCopy);
      }
    },
  },
  created() {
    this.dataSourceCopy = this.dataSource;
  },
  mounted() {
    this.projects = this.dataSource;
    if (this.height) {
      this.panelHeight = this.height;
    } else {
      this.panelHeight = this.$_getContainerHeight();
    }
  },
  methods: {
    $_export(project) {
      this.$emit("export", project);
    },
    $_back(project) {
      let features = project.features;
      for (let i = 0; i < features.length; i++) {
        let entity = this.viewer.entities.getById(features[i].uuid);
        if (entity) {
          entity.show = false;
        }
      }
    },
    $_textChanged(text) {
      this.$set(this.storyFeature[0], "content", text);
    },
    $_featurePreview(feature) {
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
    $_projectPreview(chapters) {
      if (this.enablePreview) {
        this.storyFeature = this.currentProject.features;
        this.showPlay = true;
        this.showArrow = true;
        this.showLargePanel = true;
      } else {
        this.$emit("projectPreview", chapters);
      }
    },
    $_closeEdit() {
      if (!this.enableClose && window.showPanels.currentPage === "projectEdit") {
        this.showPanels.showProjectEdit = false;
      }
      this.showProjectPanel = true;
    },
    $_closePanel() {
      this.showLargePanel = false;
    },
    $_editProject(index) {
      this.$emit("editProject", index);
    },
    $_addChapter(chapter) {
      this.$emit("addChapter", chapter);
    },
    $_copyChapter(uuid) {
      this.$emit("copyChapter", uuid);
    },
    $_addFeature(feature) {
      this.$emit("addFeature", feature);
    },
    $_titleChange(value) {
      this.$emit("titleChanged", value);
    },
    $_closeHoverPanel() {
      this.$emit("closeHoverPanel");
    },
    $_changeEntityTitle(currentEntity) {
      this.$emit("changeEntityTitle", currentEntity);
    },
    $_changeEntity(type, uuid, value) {
      this.$emit("changeEntity", type, uuid, value);
    },
    $_getCamera(currentFeature) {
      this.$emit("getCamera", currentFeature);
    },
    $_selectCamera(camera, currentFeature) {
      this.$emit("selectCamera", camera, currentFeature);
    },
    $_deleteProject(project) {
      this.$emit("deleteProject");
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].uuid === project.uuid) {
          this.projects.splice(i, 1);
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
    $_addMapToProject(type, map, project) {
      this.$emit("addMapToProject", type, map, project);
    },
    $_addMap(type, map, id) {
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
    $_toggleChapterFeatures(featureUUID, projectUUID, show) {
      this.$emit("toggleChapterFeatures", featureUUID, projectUUID, show);
    },
    $_deleteFeature(index, projectUUID) {
      this.$emit("deleteFeature", index, projectUUID);
    },
    $_changeIcon(icon, id) {
      this.$emit("changeIcon", icon, id);
    },
    $_changeColor(color, type, id, geometryType) {
      this.$emit("changeColor", color, type, id, geometryType);
    },
    $_changeOpacity(opacity, color, id, geometryType) {
      this.$emit("changeOpacity", opacity, color, id, geometryType);
    },
    $_showFeature(id, flag, index, project) {
      this.$emit("showFeature", id, flag, index, project);
    },
    $_showProject(project) {
      this.$emit("showProject", project);
    },
    $_firstAddPicture(feature) {
      this.$emit("firstAddPicture", feature);
    },
    $_featureTitleChanged(feature) {
      this.$emit("featureTitleChanged", feature);
    },
    $_animationTimeChanged(feature) {
      this.$emit("animationTimeChanged", feature);
    },
    $_titleChanged(title) {
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].uuid === title.uuid) {
          this.projects[i].title = title.title;
          this.projects[i].description = title.description;
          break;
        }
      }
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