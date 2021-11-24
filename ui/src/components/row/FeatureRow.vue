<template>
  <div>
    <mapgis-ui-row :class="{mapgisMapStoryFeatureActive: index === activeToolIndex}"
                   :key="index"
                   v-for="(feature,index) in featuresCopy" class="mapgis-ui-feature-row">
      <div @click="$_clickRow(index)" class="mapgis-mapstory-feature-container" @mouseenter="$_rowEnter(index)"
           @mouseleave="$_rowLeave">
        <mapgis-ui-col span="18">
          <div :title="feature.title" class="mapgis-mapstory-feature-panel-title">
            <mapgis-ui-svg-icon class="mapgis-mapstory-feature-panel-title-icon" :containerStyle="containerStyle"
                          :iconStyle="iconStylePoint" :type="feature.baseUrl.type"/>
            <p class="mapgis-mapstory-feature-panel-title-value">{{ feature.title }}</p>
          </div>
        </mapgis-ui-col>
        <mapgis-ui-col span="6" class="mapgis-mapstory-tool-bar">
          <mapgis-ui-svg-icon @click="$_editFeature(index)" :containerStyle="containerStyle" :iconStyle="iconStyle"
                        v-show="showToolIndex === index"
                        type="edit"/>
          <mapgis-ui-svg-icon @click="$_delete(index)" :containerStyle="containerStyle" :iconStyle="iconStyle"
                        v-show="showToolIndex === index"
                        type="delete"/>
          <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle"
                        v-show="showToolIndex !== index && feature.layerStyle.show" type="eye"/>
          <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle" @click="$_showFeature(index, true)"
                        v-show="showToolIndex === index && !feature.layerStyle.show"
                        type="eye"/>
          <mapgis-ui-svg-icon :containerStyle="containerStyle" :iconStyle="iconStyle"
                        @click="$_showFeature(index, false)"
                        v-show="showToolIndex === index && feature.layerStyle.show"
                        type="noEye"/>
        </mapgis-ui-col>
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
        marginTop: "8px"
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
        lineHeight: "36px"
      },
    }
  },
  props: {
    features: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  watch: {
    features: {
      handler: function () {
        this.featuresCopy = this.features;
      },
      deep: true
    }
  },
  created() {
    this.featuresCopy = this.features;
  },
  methods: {
    $_editFeature(index) {
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
      const {id} = this.featuresCopy[index];
      this.$emit("deleteFeature", index, id);
    }
  }
}
</script>

<style scoped>
.mapgisMapStoryFeatureActive {
  background: rgb(57, 68, 87) !important;
}

.mapgis-ui-feature-row {
  margin-top: 10px;
}

.mapgis-ui-feature-row:hover {
  background: rgb(40, 41, 44);
  cursor: pointer;
}

.mapgis-mapstory-tool-bar {
  text-align: right;
  padding-right: 14px;
}

.mapgis-mapstory-feature-container {
  width: 400px;
  height: 36px;
}

.mapgis-mapstory-feature-panel-title {
  position: relative;
  color: white;
  height: 36px;
  width: 100%;
  overflow: hidden;
  line-height: 36px;
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
}

.mapgis-mapstory-feature-panel-title-icon {
  position: absolute;
  left: 20px;
  top: 6px;
}

.mapgis-mapstory-feature-panel-title-value {
  position: absolute;
  left: 50px;
}
</style>