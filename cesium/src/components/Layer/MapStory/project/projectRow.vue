<template>
  <div>
    <mapgis-ui-row class="mapgis-mapstory-project-panel-filter">
      <mapgis-ui-col span="18">
        <div @click="$_collapse" class="mapgis-mapstory-project-panel-filter-title">
          {{ title }}
        </div>
      </mapgis-ui-col>
      <mapgis-ui-col span="6" class="mapgis-mapstory-filter">
        <div class="mapgis-mapstory-filter-container">
          <svg class="mapgis-mapstory-filter-icon" viewBox="0 0 24 24"
               preserveAspectRatio="xMidYMid meet"
               focusable="false">
            <g mirror-in-rtl="" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path>
            </g>
          </svg>
        </div>
        <div @click="$_collapse" class="mapgis-mapstory-filter-container">
          <svg :style="{transform: collapse ? 'rotate(270deg)' : 'rotate(90deg)'}"
               class="mapgis-mapstory-filter-icon mapgis-mapstory-transition-filter" viewBox="0 0 24 24"
               preserveAspectRatio="xMidYMid meet"
               focusable="false">
            <g mirror-in-rtl="" width="24" height="24">
              <path d="M16.41 5.41L15 4l-8 8 8 8 1.41-1.41L9.83 12"></path>
            </g>
          </svg>
        </div>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div :style="{height: collapse ? '0' : rowLength * 64 + 'px'}" class="mapgis-mapstory-project-row-container">
      <mapgis-ui-row :key="index" v-for="(project,index) in projects" class="mapgis-mapstory-project-row">
        <div style="width: 400px;height: 64px" v-if="project.type === type" @mouseenter="$_rowEnter(index)"
             @mouseleave="$_rowLeave">
          <mapgis-ui-col span="12">
            <div class="mapgis-mapstory-project-panel-title">{{ project.title }}</div>
          </mapgis-ui-col>
          <mapgis-ui-col span="12" class="mapgis-mapstory-tool-bar">
            <svg-icon @click="$_edit(index)" v-show="showToolIndex === index" type="edit"/>
            <svg-icon @click="$_delete(index)" v-show="showToolIndex === index" type="delete"/>
            <svg-icon @click="$_marker(index, 'normal')" v-show="showToolIndex === index && project.type === 'favourite'" type="marker"/>
            <svg-icon @click="$_marker(index, 'favourite')" v-show="showToolIndex === index && project.type === 'normal'" type="noMarker"/>
            <svg-icon v-show="showToolIndex !== index && project.show" type="eye"/>
            <svg-icon @click="$_showProject(index, true)" v-show="showToolIndex === index && !project.show" type="eye"/>
            <svg-icon @click="$_showProject(index, false)" v-show="showToolIndex === index && project.show" type="noEye"/>
          </mapgis-ui-col>
        </div>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
import svgIcon from "../img/svgIcon"
export default {
  name: "projectRow",
  components: {
    "svg-icon": svgIcon,
  },
  data() {
    return {
      hoverIcon: undefined,
      showToolIndex: undefined,
      collapse: false,
      rowLength: 0
    }
  },
  props: {
    projects: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: "normal"
    },
    title: {
      type: String
    }
  },
  watch: {
    projects: {
      handler: function () {
        this.$_getRowLength();
      },
      deep: true
    }
  },
  mounted() {
    this.$_getRowLength();
  },
  methods: {
    $_getRowLength(){
      const {projects, type} = this;
      this.rowLength = 0;
      for (let i = 0; i < projects.length; i++) {
        if (projects[i].type === type) {
          this.rowLength++;
        }
      }
    },
    $_rowLeave() {
      this.showToolIndex = undefined;
    },
    $_rowEnter(index) {
      this.showToolIndex = index;
    },
    $_marker(index, type) {
      this.$emit("marked", index, type);
    },
    $_showProject(index, flag) {
      this.$emit("showProjected", index, flag);
    },
    $_edit(index) {
      this.$emit("editProject", index);
    },
    $_delete(index) {
      this.$emit("deleted", index);
    },
    $_collapse() {
      this.collapse = !this.collapse;
    }
  }
}
</script>

<style scoped>
.mapgis-mapstory-project-row-container {
  width: 100%;
  transition: height .3s;
  overflow: hidden;
  -moz-transition: height .3s; /* Firefox 4 */
  -webkit-transition: height .3s; /* Safari 和 Chrome */
  -o-transition: height .3s; /* Opera */
}

.mapgis-mapstory-project-row:hover {
  background: rgb(40, 41, 44);
  cursor: pointer;
}

.mapgis-mapstory-tool-bar {
  text-align: right;
  padding-right: 14px;
}

.mapgis-mapstory-project-panel-title {
  color: white;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  text-align: left;
  padding-left: 10px;
}

.mapgis-mapstory-project-panel-filter {
  height: 40px;
  line-height: 40px;
  padding-right: 13px;
  padding-left: 20px;
  text-align: left;
  border: 1px solid rgb(56, 57, 61);
  border-left: none;
  border-right: none;
  cursor: pointer;
  background: rgb(41, 42, 45);
}

.mapgis-mapstory-project-panel-filter-title {
  color: white;
  opacity: 0.7;
}

.mapgis-mapstory-filter {
  text-align: right;
}

.mapgis-mapstory-filter-container {
  display: inline-block;
  margin: 0 4px;
  height: 40px;
  line-height: 50px;
}

.mapgis-mapstory-filter-icon {
  pointer-events: none;
  display: inline-block;
  color: white;
  opacity: 0.5;
  fill: currentColor;
  width: 24px;
  height: 24px;
}

.mapgis-mapstory-transition-filter {
  transform: rotate(270deg);
  transition: transform .3s;
  -moz-transition: transform .3s; /* Firefox 4 */
  -webkit-transition: transform .3s; /* Safari 和 Chrome */
  -o-transition: transform .3s; /* Opera */
}
</style>