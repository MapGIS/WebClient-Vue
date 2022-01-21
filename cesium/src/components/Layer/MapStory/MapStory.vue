<template>
  <div>
    <project-panel ref="projectPanel"
                   :data-source="dataSourceCopy"
                   :height="height"
                   :width="width"
                   :enablePreview="enablePreview"
                   :enableClose="enableClose"
                   @changeChapter="$_changeChapter"
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
  mounted() {
    this.$_init();
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