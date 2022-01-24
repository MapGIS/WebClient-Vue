<template>
  <div :style="{width: containerWidth, height: containerHeight}" class="mapgis-3d-map-story-container">
    <project-panel ref="projectPanel"
                   :data-source="dataSourceCopy"
                   :height="height"
                   :width="width"
                   :enablePreview="enablePreview"
                   :enableClose="enableClose"
                   :enableImport="enableImport"
                   @changeChapter="$_changeChapter"
                   @setCamera="$_setCamera"
                   @save="$_save"
                   @addChapter="$_addChapter"
                   @copyChapter="$_addChapter"
                   @deleteChapter="$_deleteChapter"
                   @addStory="$_addStory"
                   @deleteStory="$_deleteStory"
                   @changeStory="$_changeStory"
                   @storyPreview="$_storyPreview"
                   @chapterPreview="$_chapterPreview"
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
    <mapgis-3d-preview-map-story-layer
      v-if="enablePreview"
      v-show='showPreview'
      :height='height'
      :width='width'
      :dataSource='storyDataSource'
      ref='preview'
    />
  </div>
</template>

<script>
import projectPanel from "./projectPanel"
import mapCollection from "./mapCollection";
import mapStoryService from "./mapStoryService"

window.showPanels = {
  currentPage: "",
  showProjectEdit: false
}
export default {
  name: "mapgis-3d-map-story-layer",
  mixins: [mapStoryService],
  components: {
    "project-panel": projectPanel,
    "map-collection": mapCollection,
  },
  mounted() {
    this.$_init();
    this.$_setContainerStyle();
  },
  methods: {
    //设置容器宽高
    $_setContainerStyle() {
      let cesiumWidget = document.getElementsByClassName("cesium-widget");
      if (cesiumWidget && cesiumWidget.length > 0) {
        this.containerWidth = cesiumWidget[0].offsetWidth + "px";
        this.containerHeight = cesiumWidget[0].offsetHeight + "px";
      }
    },
    //修改章节内容
    $_changeChapter(chapter) {
      this.$_setChapter(chapter);
      this.$_save();
    },
    //保存数据
    $_save() {
      this.$emit("save", JSON.parse(JSON.stringify(this.dataSourceCopy)));
    },
    //新增章节
    $_addChapter(chapter) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === chapter.projectUUID) {
          this.dataSourceCopy[i].chapters.push(chapter);
          break;
        }
      }
    },
    //删除章节
    $_deleteChapter(index, uuid) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === uuid) {
          this.dataSourceCopy[i].chapters.splice(index, 1);
          break;
        }
      }
    },
    //删除故事
    $_deleteStory(index) {
      this.dataSourceCopy.splice(index, 1);
    },
    //修改故事
    $_changeStory(story) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === story.uuid) {
          this.$set(this.dataSourceCopy, i, story);
          break;
        }
      }
    },
    //新增故事
    $_addStory(index) {
      let story = {
        "title": "无标题",
        "description": "",
        "uuid": "mapStory" + parseInt(String(Math.random() * 100000000)),
        "map": {
          "type": "",
          "baseUrl": "",
          "layer": "",
          "tilingScheme": "",
          "tileMatrixSet": "",
          "format": "",
          "vueKey": "",
          "vueIndex": ""
        },
        "features": [],
        "chapters": []
      };
      this.dataSourceCopy.push(story);
    },
    $_storyPreview(story) {
      if (this.enablePreview) {
        this.storyDataSource = story;
        this.showPreview = true;
        this.$refs.preview.projectPreview()
      }
      this.$emit("storyPreview", story);
    },
    $_chapterPreview(chapter) {
      let story = {
        chapters: [chapter]
      };
      if (this.enablePreview) {
        this.storyDataSource = story
        this.showPreview = true
      }
      this.$emit("chapterPreview", story);
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

.mapgis-3d-map-story-container {
  position: absolute;
  top: 0;
  left: 0;
}
</style>