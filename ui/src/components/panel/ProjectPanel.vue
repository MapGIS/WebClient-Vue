<template>
  <div>
    <div :style="{height: height}" @click="$_click" class="mapgis-ui-project-panel">
      <div v-show="!addProject">
        <mapgis-ui-row>
          <mapgis-ui-col span="14">
            <div class="mapgis-ui-project-panel-title">工程文件</div>
          </mapgis-ui-col>
          <mapgis-ui-col span="10">
            <mapgis-ui-button @click="$_addProject" type="primary" class="mapgis-ui-project-panel-add">
              新建工程
            </mapgis-ui-button>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-project-row title="我的最爱" @editProject="$_editProject" @deleted="$_deleted"
                               @showProjected="$_showProject"
                               @marked="$_marker"
                               :projects="projects" type="favourite"/>
        <mapgis-ui-project-row title="所有工程" @editProject="$_editProject" @deleted="$_deleted"
                               @showProjected="$_showProject"
                               @marked="$_marker"
                               :projects="projects"/>
      </div>
      <div v-if="addProject">
        <mapgis-ui-project-edit
            @getCamera="$_getCamera"
            @deleteFeature="$_deleteFeature"
            @changeIcon="$_changeIcon"
            @changeColor="$_changeColor"
            @showFeature="$_showFeature"
            @projectPreview="$_projectPreview"
            @featurePreview="$_featurePreview"
            @addFeature="$_addFeature"
            @deleteProject="$_deleteProject"
            @titleChanged="$_titleChanged"
            ref="panelEdit" v-model="project"
            @backed="$_back"/>
      </div>
      <mapgis-ui-hover-edit-panel
          @closeHoverPanel="$_closeHoverPanel"
          @titleChanged="$_titleChange" v-if="showEditPanel"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-panel",
  watch: {
    dataSource: {
      handler: function () {
        this.projects = this.dataSource;
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
      type: String,
      default: "900px"
    }
  },
  data() {
    return {
      optArr: [],
      showLargePanel: false,
      showEditPanel: false,
      addProject: false,
      project: undefined,
      projects: [],
      currentProjectIndex: undefined,
      storyFeature: []
    }
  },
  created() {
    this.projects = this.dataSource;
  },
  methods: {
    $_closePanel() {
      this.showLargePanel = false;
    },
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
      this.projects.splice(index, 1);
    },
    $_marker(index, type) {
      this.$set(this.projects[index], "type", type);
    },
    $_showProject(index, flag) {
      this.$set(this.projects[index], "show", flag);
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
      this.$emit("editProject", index, this.projects[index]);
    },
    $_back() {
      this.addProject = false;
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
    $_getCamera(currentFeature) {
      this.$emit("getCamera", currentFeature);
    },
    $_deleteFeature(index, id) {
      this.$emit("deleteFeature", index, id, this.project);
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
      this.showLargePanel = true;
      this.storyFeature = this.project.features;
    },
    $_featurePreview(feature) {
      this.showLargePanel = true;
      this.storyFeature = [feature];
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
  background: rgb(32, 33, 36);
  padding-bottom: 20px;
}

.mapgis-ui-project-panel-add {
  margin-top: 13px;
  margin-right: -16px;
  width: 126px;
  height: 36px;
}

.mapgis-ui-project-panel-title {
  color: white;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  text-align: left;
  padding-left: 10px;
}
</style>