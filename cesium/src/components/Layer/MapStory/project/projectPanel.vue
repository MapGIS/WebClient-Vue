<template>
  <div>
    <div :style="{height: panelHeight + 'px'}" @click="$_click" class="mapgis-mapstory-project-panel">
      <div v-show="!addProject">
        <mapgis-ui-row>
          <mapgis-ui-col span="14">
            <div class="mapgis-mapstory-project-panel-title">工程文件</div>
          </mapgis-ui-col>
          <mapgis-ui-col span="10">
            <mapgis-ui-button @click="$_addProject" type="primary" class="mapgis-mapstory-project-panel-add">
              新建工程
            </mapgis-ui-button>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <project-row title="我的最爱" @editProject="$_editProject" @deleted="$_deleted" @showProjected="$_showProject"
                     @marked="$_marker"
                     :projects="projects" type="favourite"/>
        <project-row title="所有工程" @editProject="$_editProject" @deleted="$_deleted" @showProjected="$_showProject"
                     @marked="$_marker"
                     :projects="projects"/>
      </div>
      <div v-if="addProject">
        <project-edit
            @changeIcon="$_changeIcon"
            @changeColor="$_changeColor"
            @showFeature="$_showFeature"
            @projectPreview="$_projectPreview"
            @featurePreview="$_featurePreview"
            @addFeature="$_addFeature" @deleteProject="$_deleteProject" @titleChanged="$_titleChanged"
            ref="panelEdit" v-model="project"
            @backed="$_back"/>
      </div>
      <hover-edit-panel
          @closeHoverPanel="$_closeHoverPanel"
          @titleChanged="$_titleChange" v-if="showEditPanel"/>
    </div>
    <story-panel-large v-show="showLargePanel" @closePanel="$_closePanel" :feature="storyFeature"/>
  </div>
</template>

<script>
import projectRow from "./projectRow";
import projectEdit from "./projectEdit";
import hoverEditPanel from "../ui/hoverEditPanel";
import storyPanelLarge from "../ui/storyPanelLarge";
import mapStoryService from "../mapStoryService";
import {MRFS} from "@mapgis/webclient-es6-service"
import base64Image from "../img/base64Image";

export default {
  name: "projectPanel",
  mixins: [mapStoryService],
  components: {
    "project-row": projectRow,
    "project-edit": projectEdit,
    "hover-edit-panel": hoverEditPanel,
    "story-panel-large": storyPanelLarge,
  },
  inject: ["Cesium", "viewer"],
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
    }
  },
  data() {
    return {
      panelHeight: 900,
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
  mounted() {
    this.panelHeight = this.$_getContainerHeight();
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
      let vm = this;
      if (this.projects[index].url) {
        this.currentProjectIndex = index;
        MRFS.FeatureService.get(this.projects[index].url, function (result) {
          if (typeof result === "string") {
            result = JSON.parse(result);
            const {features} = result;
            if (features && features instanceof Array) {
              for (let i = 0; i < features.length; i++) {
                const {geometry} = features[i].baseUrl;
                const {x, y, z} = geometry;
                if (x && y && z) {
                  let img = document.createElement("img");
                  let imgUrl = features[i].layerStyle.billboard.image;
                  if (typeof imgUrl === 'number') {
                    imgUrl = base64Image[imgUrl].value;
                  }
                  img.src = imgUrl;
                  img.onload = function () {
                    vm.viewer.entities.add({
                      id: features[i].id,
                      position: new Cesium.Cartesian3(x, y, z),
                      billboard: {
                        image: img
                      }
                    });
                  }
                }
              }
            }
          }
          vm.project = result;
          vm.addProject = true;
        }, function (error) {
          console.error(error);
        });
      }
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
.mapgis-mapstory-project-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 400px;
  height: 900px;
  background: rgb(32, 33, 36);
  padding-bottom: 20px;
}

.mapgis-mapstory-project-panel-add {
  margin-top: 13px;
  margin-right: -16px;
  width: 126px;
  height: 36px;
}

.mapgis-mapstory-project-panel-title {
  color: white;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  text-align: left;
  padding-left: 10px;
}

.mapgis-project-edit-top-tool {
  width: 400px;
  height: 64px;
}
</style>