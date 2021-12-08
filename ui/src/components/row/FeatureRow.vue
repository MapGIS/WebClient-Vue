<template>
  <div>
    <mapgis-ui-row :class="{mapgisMapStoryFeatureActive: index === activeToolIndex}"
                   :key="index"
                   v-for="(feature,index) in featuresCopy" class="mapgis-ui-feature-row">
      <div @dblclick="$_editFeature(index)"
           @click="$_clickRow(index)" :style="{width: width + 'px'}" class="mapgis-mapstory-feature-container"
           @mouseenter="$_rowEnter(index)"
           @mouseleave="$_rowLeave">
        <div v-show="showMoreTool === index"
             class="mapgis-mapstory-more-tool"
             @mouseleave="$_hideMoreTool"
        >
          <div @click="$_editFeature(index)" class="mapgis-mapstory-more-tool-row">
            <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="edit"/>
            <span>修改</span>
          </div>
          <div class="mapgis-mapstory-more-tool-row">
            <mapgis-ui-base64-icon style="left: 9px;top: 10px;" width="19px" class="mapgis-mapstory-more-tool-row-icon"
                                   type="top"/>
            <span>置顶</span>
          </div>
          <div @click="$_delete(index)" class="mapgis-mapstory-more-tool-row">
            <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="delete"/>
            <span>删除</span>
          </div>
        </div>
        <mapgis-ui-col span="20">
          <div :title="feature.title" class="mapgis-mapstory-feature-panel-title">
            <mapgis-ui-svg-icon v-if="feature.baseUrl" class="mapgis-mapstory-feature-panel-title-icon" :containerStyle="containerStyle"
                                :iconStyle="iconStylePoint" :type="feature.baseUrl.type"/>
            <div class="mapgis-mapstory-feature-panel-title-value">{{ feature.title }}</div>
          </div>
        </mapgis-ui-col>
        <mapgis-ui-col span="4" class="mapgis-mapstory-tool-bar">
          <!--          <mapgis-ui-svg-icon @click="$_editFeature(index)" :containerStyle="containerStyle" :iconStyle="iconStyle"-->
          <!--                        v-show="showToolIndex === index"-->
          <!--                        type="edit"/>-->
          <!--          <mapgis-ui-svg-icon @click="$_delete(index)" :containerStyle="containerStyle" :iconStyle="iconStyle"-->
          <!--                        v-show="showToolIndex === index"-->
          <!--                        type="delete"/>-->
          <!--          <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle"-->
          <!--                        v-show="showToolIndex !== index && feature.layerStyle.show" type="eye"/>-->
<!--          <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle"-->
<!--                              @click="$_showFeature(index, true)"-->
<!--                              v-show="showToolIndex === index && !feature.layerStyle.show"-->
<!--                              type="eye"/>-->
<!--          <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle"-->
<!--                              @click="$_showFeature(index, false)"-->
<!--                              v-show="showToolIndex === index && feature.layerStyle.show"-->
<!--                              type="noEye"/>-->
          <mapgis-ui-base64-icon @click="$_showMoreTool(index)" class="mapgis-mapstory-tool-bar-more" height="20px"
                                 type="more"/>
        </mapgis-ui-col>
        <!--        <div v-show="showMoreTool" class="mapgis-mapstory-more-tool">-->
        <!--          <div @click="$_edit(index)" class="mapgis-mapstory-more-tool-row">-->
        <!--            <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="edit"/>-->
        <!--            <span>修改</span>-->
        <!--          </div>-->
        <!--          <div class="mapgis-mapstory-more-tool-row">-->
        <!--            <mapgis-ui-base64-icon style="left: 9px;top: 10px;" width="19px" class="mapgis-mapstory-more-tool-row-icon" type="top"/>-->
        <!--            <span>置顶</span>-->
        <!--          </div>-->
        <!--          <div class="mapgis-mapstory-more-tool-row">-->
        <!--            <mapgis-ui-svg-icon class="mapgis-mapstory-more-tool-row-icon" :iconStyle="editStyle" type="delete"/>-->
        <!--            <span>删除</span>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-feature-row",
  data() {
    return {
      featuresCopy: [],
      activeToolIndex: undefined,
      hoverIcon: undefined,
      showToolIndex: undefined,
      iconStyle: {
        width: "20px",
        height: "20px",
        marginTop: "8px",
        color: "#7A8DA0"
      },
      iconStylePoint: {
        width: "24px",
        height: "24px",
        color: "rgb(138, 180, 248)",
        opacity: 1
      },
      containerStyle: {
        width: "26px",
        height: "36px",
        lineHeight: "36px",
        marginRight: "14px"
      },
      showMoreTool: undefined,
      editStyle: {
        color: "#7A8DA0",
        width: "20px",
        height: "20px"
      }
    }
  },
  model: {
    prop: "features",
    event: "change"
  },
  props: {
    features: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: Number,
      default: 400
    },
  },
  watch: {
    features: {
      handler: function () {
        this.featuresCopy = this.features;
      },
      deep: true
    },
    featuresCopy: {
      handler: function () {
        this.$emit("change", this.featuresCopy);
      },
      deep: true
    }
  },
  created() {
    this.featuresCopy = this.features;
  },
  methods: {
    $_hideMoreTool() {
      this.showMoreTool = undefined;
    },
    $_showMoreTool(index) {
      if (this.showMoreTool === index) {
        this.showMoreTool = undefined;
      } else {
        this.showMoreTool = index;
      }
    },
    $_editFeature(index) {
      this.showMoreTool = undefined;
      this.$emit("editFeature", index);
    },
    $_clickRow(index) {
      this.activeToolIndex = index;
    },
    $_rowLeave() {
      this.showToolIndex = undefined;
    },
    $_rowEnter(index) {
      this.showToolIndex = index;
    },
    $_showFeature(index, flag) {
      this.$set(this.featuresCopy[index].layerStyle, "show", flag);
      this.$emit("showFeature", this.featuresCopy[index].id, flag, index);
    },
    $_delete(index) {
      this.showMoreTool = undefined;
      const {id} = this.featuresCopy[index];
      this.$emit("deleteFeature", index, id);
    }
  }
}
</script>

<style scoped>
.mapgisMapStoryFeatureActive {
  background: #E7F4FF !important;
}

.mapgis-ui-feature-row {
  margin-top: 10px;
}

.mapgis-ui-feature-row:hover {
  background: rgb(230, 247, 255);
  cursor: pointer;
}

.mapgis-mapstory-tool-bar {
  text-align: right;
  padding-right: 14px;
}

.mapgis-mapstory-feature-container {
  width: 100%;
  height: 36px;
  position: relative;
}

.mapgis-mapstory-feature-panel-title {
  position: relative;
  height: 36px;
  width: 100%;
  overflow: hidden;
  line-height: 36px;
  font-size: 14px;
  text-align: left;
  margin-left: -12px;
}

.mapgis-mapstory-feature-panel-title-icon {
  position: absolute;
  left: 20px;
  top: 6px;
}

.mapgis-mapstory-feature-panel-title-value {
  position: absolute;
  left: 50px;
  width: 82%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.mapgis-mapstory-tool-bar-more {
  position: absolute;
  top: 5px;
  right: 0;
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

.mapgis-mapstory-more-tool-row-icon {
  position: absolute;
  top: 0;
  left: 10px;
}
</style>