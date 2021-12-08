<template>
  <div>
    <div :style="{height: height + 'px',width: width + 'px'}" @click="$_click"
         class="mapgis-ui-project-panel">
      <div class="mapgis-ui-project-panel-content" v-show="!addProject" :style="{height: height - 40 + 'px'}">
        <mapgis-ui-project-header/>
        <mapgis-ui-project-row @editProject="$_editProject" @deleted="$_deleted"
                               @showProjected="$_showProject"
                               @marked="$_marker"
                               :projects="dataSourceCopy"
                               :width="width"
        />
      </div>
      <mapgis-ui-row class="mapgis-ui-project-add-story-row">
        <mapgis-ui-col span="24">
          <mapgis-ui-button @click="$_addProject" type="primary" class="mapgis-ui-project-add-story">
            新建故事
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-project-edit
          v-show="showProjectEdit"
          :width="width"
          :height="height"
          @addMap="$_addMap"
          @getCamera="$_getCamera"
          @selectCamera="$_selectCamera"
          @deleteFeature="$_deleteFeature"
          @toggleChapterFeatures="$_toggleChapterFeatures"
          @changeIcon="$_changeIcon"
          @changeColor="$_changeColor"
          @showFeature="$_showFeature"
          @projectPreview="$_projectPreview"
          @featurePreview="$_featurePreview"
          @addFeature="$_addFeature"
          @addChapter="$_addChapter"
          @copyChapter="$_copyChapter"
          @deleteProject="$_deleteProject"
          @titleChanged="$_titleChanged"
          ref="panelEdit"
          v-model="project"
          @backed="$_back"/>
      <mapgis-ui-hover-edit-panel
          @closeHoverPanel="$_closeHoverPanel"
          @titleChanged="$_titleChange" v-if="showEditPanel"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-panel",
  model: {
    prop: "dataSource",
    event: "change"
  },
  watch: {
    dataSource: {
      handler: function () {
        this.dataSourceCopy = this.dataSource;
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        this.$emit("change", this.dataSourceCopy)
      },
      deep: true
    },
    height: {
      handler: function () {
        this.panelScale = this.height / 900;
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
    }
  },
  data() {
    return {
      panelScale: 1,
      optArr: [],
      showEditPanel: false,
      addProject: false,
      project: undefined,
      projects: [],
      currentProjectIndex: undefined,
      storyFeature: [],
      dataSourceCopy: undefined,
      showProjectEdit: false
    }
  },
  created() {
    this.dataSourceCopy = this.dataSource;
  },
  methods: {
    $_deleteProject() {
      this.projects.splice(this.currentProjectIndex, 1);
    },
    $_titleChanged(titleObj) {
      if (this.currentProjectIndex !== undefined) {
        this.$set(this.projects[this.currentProjectIndex], "title", titleObj.title);
        this.$set(this.projects[this.currentProjectIndex], "description", titleObj.description);
      }
    },
    $_click(e) {
      if (this.$refs.panelEdit && e.target.id !== "mpTitle" && e.target.id !== "mpDescription" && e.target.id !== "mpEdit") {
        if (this.$refs.panelEdit.editTitle) {
          this.$refs.panelEdit.editTitle = false;
        }
      }
    },
    $_deleted(index) {
      this.$emit("deleteProject", this.projects[index]);
    },
    $_marker(index, type) {
      this.$set(this.projects[index], "type", type);
    },
    $_showProject(index, flag) {
      this.$set(this.projects[index], "show", flag);
      this.$emit("showProject", this.projects[index]);
    },
    $_addProject() {
      this.project = {
        title: "无标题",
        description: "",
        features: []
      };
      this.projects.push({
        title: "无标题",
        description: "",
        url: "",
        type: "normal",
        show: true,
      });
      this.addProject = true;
    },
    $_editProject(index) {
      this.project = this.dataSourceCopy[index];
      this.showProjectEdit = true;
      // this.$emit("editProject", index, this.projects[index]);
    },
    $_back() {
      this.addProject = false;
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
      this.showEditPanel = false;
      this.$emit("closeHoverPanel");
    },
    $_addMap(type, map, id) {
      this.$emit("addMap", type, map, id);
    },
    $_getCamera(currentFeature) {
      this.$emit("getCamera", currentFeature);
    },
    $_selectCamera(camera, currentFeature) {
      this.$emit("selectCamera", camera, currentFeature);
    },
    $_toggleChapterFeatures(featureUUID, projectUUID, show) {
      this.$emit("toggleChapterFeatures", featureUUID, projectUUID, show);
    },
    $_deleteFeature(feature) {
      this.$emit("deleteFeature", feature);
    },
    $_changeIcon(icon, id) {
      this.$emit("changeIcon", icon, id);
    },
    $_changeColor(color, id, type) {
      this.$emit("changeColor", color, id, type);
    },
    $_showFeature(id, flag) {
      this.$emit("showFeature", id, flag);
    },
    $_projectPreview() {
      this.storyFeature = this.project.features;
      this.$emit("projectPreview", this.project);
    },
    $_featurePreview(feature) {
      this.$emit("featurePreview", feature);
    },
    $_addFeatureSet(feature) {
      this.project.features.push(feature);
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