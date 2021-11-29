<template>
  <div>
    <mapgis-ui-row v-if="title" class="mapgis-mapstory-project-panel-filter">
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
    <div class="mapgis-ui-project-row-container">
      <mapgis-ui-row :key="index" v-for="(project,index) in projects" class="mapgis-ui-project-row">
        <div v-if="project.type === type"
             @mouseenter="$_rowEnter(index)"
             @mouseleave="$_rowLeave">
          <div v-show="showMoreTool === index" class="mapgis-mapstory-more-tool">
            <div @click="$_edit(index)" class="mapgis-mapstory-more-tool-row">
              <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="edit"/>
              <span>修改</span>
            </div>
            <div class="mapgis-mapstory-more-tool-row">
              <mapgis-ui-base64-icon style="left: 9px;top: 10px;" width="19px" class="mapgis-mapstory-more-tool-row-icon" type="top"/>
              <span>置顶</span>
            </div>
            <div class="mapgis-mapstory-more-tool-row">
              <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="delete"/>
              <span>删除</span>
            </div>
          </div>
          <mapgis-ui-col span="12">
            <div class="mapgis-mapstory-project-panel-title">
              <mapgis-ui-base64-icon width="20px" height="20px" class="mapgis-mapstory-project-panel-play" type="play"/>
              {{ project.title }}
            </div>
          </mapgis-ui-col>
          <mapgis-ui-col span="12" class="mapgis-mapstory-tool-bar">
<!--            <mapgis-ui-svg-icon @click="$_edit(index)" v-show="showToolIndex === index" type="edit"/>-->
<!--            <mapgis-ui-svg-icon @click="$_delete(index)" v-show="showToolIndex === index" type="delete"/>-->
<!--            <mapgis-ui-svg-icon @click="$_marker(index, 'normal')" v-show="showToolIndex === index && project.type === 'favourite'" type="marker"/>-->
<!--            <mapgis-ui-svg-icon @click="$_marker(index, 'favourite')" v-show="showToolIndex === index && project.type === 'normal'" type="noMarker"/>-->
            <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle" width="16px" height="16px" @click="$_showProject(index, false)" v-show="(showToolIndex === index && project.show) || project.show" type="eye"/>
            <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle" width="16px" height="16px" @click="$_showProject(index, true)" v-show="(showToolIndex === index && !project.show) || !project.show" type="noEye"/>
            <mapgis-ui-base64-icon class="mapgis-mapstory-tool-bar-more" width="22px" @click="$_showMoreTool(index)" type="more"/>
          </mapgis-ui-col>
        </div>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-row",
  data() {
    return {
      hoverIcon: undefined,
      showToolIndex: undefined,
      collapse: false,
      rowLength: 0,
      showMoreTool: undefined,
      iconStyle: {
        color: "#7A8DA0",
        opacity: 1
      },
      containerStyle: {
        width: "28px",
        marginRight: "20px",
        paddingTop: "3px"
      },
      editStyle: {
        color: "#7A8DA0",
        width: "20px",
        height: "20px"
      }
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
    },
    width: {
      type: Number,
      default: 400
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
    $_getRowLength() {
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
    $_showMoreTool(index) {
      if(this.showMoreTool === index) {
        this.showMoreTool = undefined;
      }else {
        this.showMoreTool = index;
      }
    },
    $_showProject(index, flag) {
      this.projects[index].show = flag;
      this.showToolIndex = index;
      this.$emit("showProjected", index, flag);
    },
    $_edit(index) {
      this.showMoreTool = undefined;
      this.$emit("editProject", index);
    },
    $_delete(index) {
      this.showMoreTool = undefined;
      this.$emit("deleted", index);
    },
    $_collapse() {
      this.showMoreTool = undefined;
      this.collapse = !this.collapse;
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-row-container {
  width: 100%;
  transition: height .3s;
  overflow: visible;
  -moz-transition: height .3s; /* Firefox 4 */
  -webkit-transition: height .3s; /* Safari 和 Chrome */
  -o-transition: height .3s; /* Opera */
}

.mapgis-ui-project-row:hover {
  background: rgb(230, 247, 255);
  cursor: pointer;
  position: relative;
}

.mapgis-mapstory-tool-bar {
  position: relative;
  text-align: right;
  height: 40px;
}

.mapgis-mapstory-tool-bar-more {
  position: absolute;
  top: 8px;
  right: -1px;
}

.mapgis-mapstory-more-tool {
  position: absolute;
  top: 40px;
  right: 7px;
  z-index: 100000;
  width: 88px;
  height: 120px;
  background: white;
  border-radius: 3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
}

.mapgis-mapstory-more-tool-row {
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding-left: 40px;
  position: relative;
  padding-top: 10px;
}

.mapgis-mapstory-more-tool-row:hover {
  color: #0081E2;
  background: #E7F4FF;
}

.mapgis-mapstory-project-panel-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: left;
  padding-left: 41px;
  position: relative;
}

.mapgis-mapstory-project-panel-filter {
  height: 40px;
  width: 254px;
  line-height: 40px;
  padding-right: 13px;
  padding-left: 10px;
  text-align: left;
  cursor: pointer;
}

.mapgis-mapstory-project-panel-filter:hover {
  background-color: #E7F4FF;
}

.mapgis-mapstory-project-panel-filter-title {
  height: 40px;
  font-size: 14px;
}

.mapgis-mapstory-filter {
  text-align: right;
}

.mapgis-mapstory-filter-container {
  display: inline-block;
  width: 14px;
  height: 14px;
}

.mapgis-mapstory-filter-icon {
  pointer-events: none;
  display: inline-block;
  opacity: 0.5;
  fill: currentColor;
  width: 14px;
  height: 14px;
}

.mapgis-mapstory-transition-filter {
  transform: rotate(270deg);
  transition: transform .3s;
  -moz-transition: transform .3s; /* Firefox 4 */
  -webkit-transition: transform .3s; /* Safari 和 Chrome */
  -o-transition: transform .3s; /* Opera */
}

.mapgis-mapstory-project-panel-play{
  position: absolute;
  top: -2px;
  left: 11px;
}

.mapgis-mapstory-more-tool-row-icon {
  position: absolute;
  top: 0;
  left: 10px;
}
</style>