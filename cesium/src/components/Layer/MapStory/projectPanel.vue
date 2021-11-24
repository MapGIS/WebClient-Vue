<template>
  <div>
    <mapgis-ui-project-panel
        ref="projectP"
        @addMap="$_addMap"
        @deleteProject="$_deleteProject"
        @editProject="$_editProject"
        @addFeature="$_addFeature"
        @closeHoverPanel="$_closeHoverPanel"
        @getCamera="$_getCamera"
        @deleteFeature="$_deleteFeature"
        @changeIcon="$_changeIcon"
        @showFeature="$_showFeature"
        @showProject="$_showProject"
        @featurePreview="$_featurePreview"
        :height="panelHeight"
        :dataSource="dataSource"
        v-show="showProjectPanel"
    />
    <map-collection :key="index" v-for="(opt,index) in optArr" :options="opt"/>
    <mapgis-ui-story-panel-large
        v-show="showLargePanel"
        @closePanel="$_closePanel"
        @flyTo="$_flyTo"
        :showPlay="showPlay"
        :showArrow="showArrow"
        :feature="storyFeature"
        :height="panelHeight"
    />
    <mapgis-ui-project-edit
        @addMapToProject="$_addMapToProject"
        @addMap="$_addMap"
        @getCamera="$_getCamera"
        @deleteProject="$_deleteProject"
        @addFeature="$_addFeature"
        @deleteFeature="$_deleteFeature"
        @changeIcon="$_changeIcon"
        @textChanged="$_textChanged"
        @featurePreview="$_featurePreview"
        @projectPreview="$_projectPreview"
        @backed="$_closeEdit"
        @showFeature="$_showFeature"
        @titleChanged="$_titleChanged"
        v-show="!showProjectPanel"
        v-model="currentProject"
        :height="panelHeight"
    />
  </div>
</template>

<script>
import mapCollection from "./mapCollection";
import mapStoryService from "./mapStoryService";
import {MRFS} from "@mapgis/webclient-es6-service"
import Base64IconsKeyValue from "../../../../../ui/src/components/iconfont/Base64IconsKeyValue"

export default {
  name: "projectPanel",
  mixins: [mapStoryService],
  components: {
    "map-collection": mapCollection,
  },
  inject: ["Cesium", "viewer"],
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
      projectSet: {}
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.projects = this.dataSource;
      }
    }
  },
  mounted() {
    this.projects = this.dataSource;
    this.panelHeight = this.$_getContainerHeight();
  },
  methods: {
    $_textChanged(text) {
      this.$set(this.storyFeature[0], "content", text);
    },
    $_featurePreview(feature) {
      this.storyFeature = [feature];
      this.showPlay = false;
      this.showArrow = false;
      this.showLargePanel = true;
    },
    $_projectPreview() {
      this.storyFeature = this.currentProject.features;
      this.showPlay = true;
      this.showArrow = true;
      this.showLargePanel = true;
    },
    $_closeEdit() {
      this.showProjectPanel = true;
    },
    $_closePanel() {
      this.showLargePanel = false;
    },
    $_editProject(index) {
      this.$emit("editProject", index);
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
    $_getCamera(currentFeature) {
      this.$emit("getCamera", currentFeature);
    },
    $_deleteProject(project) {
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].uuid === project.uuid) {
          this.projects.splice(i, 1);
        }
      }
      if (!project.features) {
        if (this.projectSet.hasOwnProperty(project.uuid)) {
          project = this.projectSet[project.uuid];
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
      window.map = map;
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
    $_deleteFeature(index, id, project) {
      this.$emit("deleteFeature", index, id, project);
    },
    $_changeIcon(icon, id) {
      this.$emit("changeIcon", icon, id);
    },
    $_changeColor(color, id, type) {
      this.$emit("changeColor", color, id, type);
    },
    $_showFeature(id, flag, index, project) {
      this.$emit("showFeature", id, flag, index, project);
    },
    $_showProject(project) {
      this.$emit("showProject", project);
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