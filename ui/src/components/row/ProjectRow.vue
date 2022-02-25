<template>
  <div>
    <div class="mapgis-ui-project-row-container">
      <mapgis-ui-row :key="index" v-for="(project,index) in projectsCopy" class="mapgis-ui-project-row">
        <div @mouseenter="$_rowEnter(index)"
             @mouseleave="$_rowLeave"
             @dblclick="$_edit(index)"
             v-show="hideArr.indexOf(index) < 0"
        >
          <div v-show="showMoreTool === index"
               class="mapgis-mapstory-more-tool"
               @mouseleave="$_hideMoreTool"
          >
            <div @click="$_edit(index)" class="mapgis-mapstory-more-tool-row">
              <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="edit"/>
              <span>修改</span>
            </div>
            <!--            <div class="mapgis-mapstory-more-tool-row">-->
            <!--              <mapgis-ui-base64-icon style="left: 9px;top: 10px;" width="19px"-->
            <!--                                     class="mapgis-mapstory-more-tool-row-icon" type="top"/>-->
            <!--              <span>置顶</span>-->
            <!--            </div>-->
            <div @click="$_delete(index)" class="mapgis-mapstory-more-tool-row">
              <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="delete"/>
              <span>删除</span>
            </div>
          </div>
          <mapgis-ui-col span="20">
            <div class="mapgis-mapstory-project-panel-title">
              <mapgis-ui-base64-icon @click="$_projectPreview(project)" width="20px" height="20px"
                                     class="mapgis-mapstory-project-panel-play" type="play"/>
              {{ project.title }}
            </div>
          </mapgis-ui-col>
          <mapgis-ui-col span="4" class="mapgis-mapstory-tool-bar">
            <mapgis-ui-base64-icon class="mapgis-mapstory-tool-bar-more" width="22px" @click="$_showMoreTool(index)"
                                   type="more"/>
          </mapgis-ui-col>
        </div>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-row",
  model: {
    prop: "projects",
    event: "change"
  },
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
      },
      projectsCopy: undefined
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
    },
    hideArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    projects: {
      handler: function () {
        this.projectsCopy = this.projects;
      },
      deep: true
    },
    projectsCopy: {
      handler: function () {
        this.projectsCopy = this.projects;
        this.$emit("change", this.projectsCopy);
      },
      deep: true
    }
  },
  mounted() {
    this.projectsCopy = this.projects;
  },
  methods: {
    $_projectPreview(project) {
      this.$emit("projectPreview", project);
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
      if (this.showMoreTool === index) {
        this.showMoreTool = undefined;
      } else {
        this.showMoreTool = index;
      }
    },
    $_showProject(index, flag) {
      this.projects[index].show = flag;
      this.showToolIndex = index;
      this.$emit("showProjected", index, flag);
    },
    $_hideMoreTool() {
      this.showMoreTool = undefined;
    },
    $_edit(index) {
      this.showMoreTool = undefined;
      this.$emit("editProject", index);
    },
    $_export(index) {
      this.showMoreTool = undefined;
      this.$emit("export", index);
    },
    $_import() {
      this.$emit("import");
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
  height: 80px;
  border-radius: 3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
}

.mapgis-mapstory-more-tool-row {
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding-left: 40px;
  position: relative;
  padding-top: 10px;
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

.mapgis-mapstory-project-panel-play {
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