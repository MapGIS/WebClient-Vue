<template>
  <div>
    <project-panel ref="projectPanel"
                   @deleteFeature="$_deleteFeature"
                   @deleteProject="$_deleteProject"
                   @getCamera="$_getCamera"
                   @selectCamera="$_selectCamera"
                   @changeColor="$_changeColor"
                   @changeOpacity="$_changeOpacity"
                   @changeIcon="$_changeIcon"
                   @showFeature="$_showFeature"
                   @showProject="$_showProject"
                   @addMapToProject="$_addMapToProject"
                   @addFeature="$_addFeature"
                   @addChapter="$_addChapter"
                   @toggleChapterFeatures="$_toggleChapterFeatures"
                   @copyChapter="$_copyChapter"
                   @changeEntityTitle="$_changeEntityTitle"
                   @changeEntity="$_changeEntity"
                   @titleChanged="$_titleChanged"
                   @featureTitleChanged="$_featureTitleChanged"
                   @closeHoverPanel="$_closeHoverPanel"
                   @editProject="$_editProject"
                   @projectPreview="$_projectPreview"
                   @featurePreview="$_featurePreview"
                   @firstAddPicture="$_firstAddPicture"
                   @export="$_export"
                   @import="$_import"
                   @save="$_save"
                   v-model="dataSourceCopy"
                   :upProjectSet="projectSet"
                   :height="height"
                   :width="width"
                   :enablePreview="enablePreview"
                   :enableClose="enableClose"
    />
    <input style="display: none" type="file" :id="inputId"
           accept=".json">
    <map-collection :key="index" v-for="(opt,index) in optArr" :options="opt"/>
    <map-collection :key="opt.vueIndex" v-for="(opt) in projectMaps" :options="opt"/>
    <template v-for="(popup) in popups">
      <mapgis-3d-popup
          :key="popup.vueIndex"
          :position='{"longitude":popup.lng,"latitude":popup.lat,"height":popup.alt}'
          :forceRender="true"
          v-model="popup.show"
          :vueIndex="popup.vueIndex"
      >
        <div>
          <div class="mapgis-3d-map-story-small-popup-container">
            <div v-if="popup.title" class="mapgis-3d-map-story-small-popup-title">
              {{ popup.title }}
<!--              <mapgis-ui-base64-icon @click="$_toLarge(popup.feature)" class="mapgis-3d-map-story-small-popup-tolarge"-->
<!--                                     width="20px" type="toLarge"/>-->
            </div>
            <mapgis-ui-carousel class="mapgis-3d-map-story-small-popup-carousel" autoplay>
              <div class="mapgis-3d-map-story-small-popup-img-div" :key="index + 10000"
                   v-for="(image, index) in popup.images">
                <img class="mapgis-3d-map-story-small-popup-img" :src="image" alt="">
              </div>
            </mapgis-ui-carousel>
            <div v-html="popup.content" class="mapgis-3d-map-story-small-popup"></div>
          </div>
        </div>
      </mapgis-3d-popup>
    </template>
  </div>
</template>

<script>
import projectPanel from "./projectPanel"
import mapCollection from "./mapCollection";
import mapStoryService from "./mapStoryService"
import GraphicLayerService from "../Graphic/GraphicLayerService";

window.showPanels = {
  currentPage: "",
  showProjectEdit: false
}
export default {
  name: "mapgis-3d-map-story-layer",
  mixins: [mapStoryService, GraphicLayerService],
  components: {
    "project-panel": projectPanel,
    "map-collection": mapCollection,
  },
  data() {
    return {
      drawer: undefined,
      currentPoints: undefined,
      interval: undefined,
      //导入文件按钮id
      inputId: "mapgisMapStoryImport" + parseInt(String(Math.random() * 10000)),
    }
  },
  props: {
    dataSource: {
      type: Array
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    enablePreview: {
      type: Boolean,
      default: true
    },
    enableClose: {
      type: Boolean,
      default: true
    }
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
      },
      deep: true
    }
  },
  created() {
    this.dataSourceCopy = this.dataSource;
  },
  mounted() {
    this.$_initManager();
  },
  methods: {
    $_toLarge(feature) {
      this.$emit("projectPreview", [feature], false);
    },
    $_drawerLoaded(drawer) {
      this.drawer = drawer;
    },
    $_featurePreview(feature) {
      this.$emit("featurePreview", [feature]);
    },
    $_projectPreview(project) {
      // this.$_play(chapters);
      let newP;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === project.uuid) {
          newP = this.dataSourceCopy[i];
          break;
        }
      }
      this.$emit("projectPreview", newP, false);
    },
    $_deleteProject() {
      this.popups = [];
    }
  }
}
</script>

<style scoped>
.mapgis-3d-map-story-small-popup-title {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 40px;
  font-size: 14px;
  position: relative;
}

.mapgis-3d-map-story-small-popup-tolarge {
  position: absolute !important;
  top: 9px;
  right: 28px;
}

.mapgis-3d-map-story-small-popup-container {
  width: 260px;
  height: auto;
}

.mapgis-3d-map-story-small-popup {
  padding: 5px 10px;
  font-size: 14px;
}

.mapgis-3d-map-story-small-popup-carousel {
  width: 240px;
  height: 144px;
  margin: 10px 10px 0;
}

.mapgis-3d-map-story-small-popup-img-div {
  width: 240px;
  height: 144px;
}

.mapgis-3d-map-story-small-popup-img {
  width: 240px;
  height: 144px;
}

.cesium-popup .cesium-popup-content-wrapper {
  overflow: hidden;
}
</style>