<template>
  <div :id="id" @click="$_clickPanel" class="mapgis-ui-project-edit-panel"
       :style="{height: height + 'px', width: width + 'px'}">
    <mapgis-ui-row class="mapgis-ui-project-edit-back"
      v-if="!enableOneMap"
    >
      <mapgis-ui-svg-icon
        style="position:absolute;left: 5px;top: 0;"
        :iconStyle="{width: '18px'}"
        @click="$_back"
        type="back"/>
      <span @click="$_back">
            返回上一级
      </span>
      <mapgis-ui-svg-icon
        style="position:absolute;right: -16px;top: 0;"
        :iconStyle="{width: '18px'}"
        type="close"
        @click="$_close"
      />
    </mapgis-ui-row>
    <div v-show="!editChapter && !showSetting" :style="{height: height - 38 + 'px'}">
      <div class="mapgis-ui-project-edit-top-bar">
        <mapgis-ui-row class="mapgis-ui-project-edit-top-tool">
          <mapgis-ui-col span="18" class="mapgis-ui-project-edit-top-left">
          </mapgis-ui-col>
          <mapgis-ui-col span="6" class="mapgis-ui-project-edit-top-right">
            <!--            <mapgis-ui-base64-icon style="margin-right: 4px;" width="18px" @click="$_export" type="export"/>-->
<!--            <mapgis-ui-base64-icon width="16px" @click="$_showSetting" type="setting"/>-->
          </mapgis-ui-col>
        </mapgis-ui-row>
        <!--编辑故事标题-->
        <mapgis-ui-row class="mapgis-ui-project-edit-title">
          <mapgis-ui-col span="24" v-if="dataSourceCopy && dataSourceCopy.title">
            <span v-show="!editTitle" class="mapgis-ui-project-edit-title-value">{{ dataSourceCopy.title }}</span>
            <mapgis-ui-svg-icon v-show="!editTitle"
                                id="mpEdit" @click="$_editTitle"
                                :iconStyle="{color: 'white'}"
                                class="mapgis-ui-project-edit-edit-icon mapgis-ui-project-edit-edit-icon-p"
                                type="edit"/>
            <mapgis-ui-input v-show="editTitle"
                             class="mapgis-ui-project-edit-title-edit"
                             @change="$_titleChange" title="标题" id="mpTitle"
                             v-model="dataSourceCopy.title"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </div>
      <!-- 一行章节-->
      <mapgis-ui-row>
        <mapgis-ui-feature-row
          v-if="dataSourceCopy && dataSourceCopy.chapters"
          v-model="dataSourceCopy.chapters"
          :width="width"
          @editChapter="$_editChapter"
          @deleteChapter="$_deleteChapter"
        />
      </mapgis-ui-row>
    </div>
    <!--附加地图-->
    <mapgis-ui-map-multi-rows v-show="showSetting"
                              v-if="dataSourceCopy && dataSourceCopy.map"
                              :showTitleIcon="false"
                              showMoreTitle=""
                              :map="dataSourceCopy.map"
                              @addMap="$_addProjectMap" title="附加地图"/>
    <!--按钮区域-->
    <mapgis-ui-row v-show="!editChapter && !showSetting" class="mapgis-ui-project-edit-new-feature">
      <mapgis-ui-col span="24">
        <mapgis-ui-dropdown>
          <mapgis-ui-menu slot="overlay">
            <mapgis-ui-menu-item @click="$_copyChapter" key="4">
              复制上一章节
            </mapgis-ui-menu-item>
          </mapgis-ui-menu>
          <mapgis-ui-button @click="$_addChapter" class="mapgis-ui-project-edit-feature-button">
            新建章节
          </mapgis-ui-button>
        </mapgis-ui-dropdown>
        <mapgis-ui-button type="primary" @click="$_storyPreview" class="mapgis-ui-project-edit-feature-preview">
          预览
        </mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <!--编辑章节区域-->
    <div v-show="editChapter">
      <feature-edit
        ref="featureEdit"
        @change="$_changeChapter"
        @setCamera="$_setCamera"
        @selectCamera="$_selectCamera"
        @addMap="$_addMap"
        @chapterPreview="$_chapterPreview"
        @animationTimeChanged="$_changeAnimationTime"
        @save="$_save"
        :data-source="currentChapter"
        :cameras="cameras"
        :height="panelHeight"
        :editList="editList"
        :enableOneMap="enableOneMap"
      />
    </div>
  </div>
</template>

<script>
import FeatureEdit from "./FeatureEdit"
import GraphicLayerService from "../Graphic/GraphicLayerService";

export default {
  name: "mapgis-3d-project-edit",
  mixins: [GraphicLayerService],
  components: {
    "feature-edit": FeatureEdit
  },
  data() {
    return {
      //是否初始化
      isInit: false,
      //当前章节
      currentChapter: undefined,
      showSetting: false,
      editChapter: false,
      editTitle: false,
      dataSourceCopy: undefined,
      margin: 26,
      panelHeight: 0
    }
  },
  props: {
    dataSource: {
      type: Object,
      default() {
        return {};
      }
    },
    height: {
      type: Number,
      default: 900
    },
    width: {
      type: Number,
      default: 400
    },
    id: {
      type: String,
      default: "defaultProjectEditId"
    },
    editList: {
      type: Object
    },
    cameras: {
      type: Array,
      default() {
        return [];
      }
    },
    //一张图模式
    enableOneMap: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
      },
      deep: true
    },
    height: {
      handler: function () {
        this.$_setFeatureEditHeight();
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        if (!this.isInit) {
          this.$emit("changeStory", this.dataSourceCopy);
        }
      },
      deep: true
    },
    currentChapter: {
      handler: function () {
      },
      deep: true
    }
  },
  mounted() {
    if (this.width < 310) {
      this.margin = 0;
    }
    //如果是一张图模式，添加返回按钮
    if(this.enableOneMap) {
      let title = document.getElementsByClassName("ant-card-head-title");
      let vm = this;
      for (let i = 0; i < title.length; i++) {
        if (title[i].innerText === "地图故事") {
          title[i].innerHTML = "<img style='width: 12px;margin-bottom: 3px;margin-right: 4px; cursor: pointer;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABMZJREFUeF7tm09oXUUUxs+5DwyCIAiCoiiKogiKoigGzZszLyYq1gZDo9VatbXWYlVSiUiVoFQJatWqtWppbbXapm7sqgvz7sy8hzvBpTtxpTtd6SLE3CMDE0ja9M3k/Zm5NJntnHvv9/3unHPn3XsewiofuMr9wxqA1Cug2WzeNDAw8GsqHUlXQL1ev6VSqRzPsmxdtVr9PQWEZABmZmZuq1QqJxDxBgD4eW5ubmRoaOjP2BCSANBa3wEAJwDgukWGTV9f32h/f//fMSFEB6CUugsRrflrzjSKiKdnZ2fHhoeH/40FISqAPM/7rXlEvKqFwR8AYIyI/osBIRoAY8y9zGzv/BUeYyeJ6LEY5u01ogDQWguX85d5jH1HRJtimY8CQClVczl/qcfYUSJ6Jqb5ngPI83zI5fwlHmOHiGhbbPM9BZDn+QNZltmcv9hj7Asi2pHCfM8AaK0fcjl/kcfYfiJ6MZX5ngBQSq13OX9hK2OI+JEQYldK810HoJR6xC57Zr6glTFmfl9K+Wpq810FkOf5BpfzFY/5KSnl7jKY7xoArbXduNiC13Iw8x4p5aQvLuZ8xxshrfUTAPCtTzQiTgoh9vjiYs93BMAY8yQzf+MTzcy7pZRTvrgU820D0Fo/DQBHAkRPENHegLgkIW0B0FpvBYBDAYrHiWhfQFyykBUDaDQazxVF8WWA4p1E9FlAXNKQFQEwxuxg5gM+xVmWba9Wqwd9cWWYDwagtd4JAJ/6RDPzVinlV764sswHAdBavwwA3lxGxM1CiGNlMReiwwtAKbULET/wnawoisdrtZp3M+Q7T+z5lgCMMRPM/F6AqDcDYkoRQkRvLRZyTgBa69cAoJSbl05IEtESz8sC0Fq/DgBvd3Khsh7rBaCUmkTEJcukrGba0bUGYC0FAmqAXVqruggu5JZSagIRQx6DtmaYdnIy9jFEtESndyNkjBln5g99Qsv4tsen2c57AdggY8xLzPxxwAnfIaI3AuJKExIEwNWEFwBgv085Ik4JIUrz0tOr1xeweF5r/TwAfB5wzLtEZHeSpR/BK2DBiTFmGzOH/NbfS0QTZSewYgDWkFJqCyIe9pmzxVNK+YovLuV8WwBcTXgKAI4GiN9HROMBcUlC2gbgINhmBu8LEET8RAhhX6qUbnQEwD0iNzLz8QBnyb8EL6exYwCuJowh4kkfBEQ8IISwj9PSjK4AcBBGHYSWH0cBIGlDxJnkuwbA1YQRC8H3eRwRDwohtpdhGXQVgKsJ65jZpkPLBgkAOExEz6aG0HUA1lCj0XiwKAoLoWWLDDMfkVJuSQmhJwBcOtwPANMBTVJfE5H90Jpk9AyAdVOv1+/LsmwaEVu2ySHiMSHE5hQEegrAGsrzXFoIAOBrlIzeJWr19RyAe0RWXfPU5Z67PE1EG2OuhCgAXE24x/URXdnKICJ+L4R4NBaEaADcI/Ju1zF+dQuDpwBgw3nXLr9guNls3lkUhe0lvPasXRnij8w8SkT/nJcrYMGUUup21016/SKjP83Pz48MDg7+Fct8tCK4nCGt9a2uJtzIzL8w88O1Wu2PmOaTAnA7xpttOhRFsb5Wq/0W23xyAFbAqv7jZIo7flbhLYOIlBqi7gNSGj3Xtf8H3j6JUDQ6P+IAAAAASUVORK5CYII=' id='MapStoryClose'/>地图故事";
          let MapStoryClose = document.getElementById("MapStoryClose");
          MapStoryClose.onclick = function () {
            if (vm.editChapter) {
              vm.$refs.featureEdit.$_stopDraw();
              vm.$refs.featureEdit.$_hideChapterGraphics();
              vm.editChapter = false;
              window.showPanels.currentPage = "projectEdit";
            } else {
              vm.$emit("back");
            }
          }
        }
      }
    }
    this.$_setFeatureEditHeight();
  },
  methods: {
    //初始化函数
    $_init() {
      this.isInit = true;
      //复制数据源
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
      if (this.currentChapter) {
        let {chapters} = this.dataSourceCopy;
        for (let i = 0; i < chapters.length; i++) {
          if (this.currentChapter.uuid === chapters[i].uuid) {
            this.currentChapter = JSON.parse(JSON.stringify(chapters[i]));
            break;
          }
        }
      }
      this.$nextTick(function () {
        this.isInit = false;
      });
    },
    //修改章节内容
    $_changeChapter(chapter) {
      this.$emit("changeChapter", chapter);
    },
    //显示设置信息
    $_showSetting() {
      this.showSetting = true;
    },
    //点击面板事件
    $_clickPanel(e) {
      if (e.target.id !== "mpTitle" && e.target.id !== "mpDescription" && e.target.id !== "mpEdit") {
        this.editTitle = false;
      }
    },
    //设置相机视角
    $_setCamera(camera) {
      this.$emit("setCamera", this.currentChapter, camera);
    },
    //选择相机视角
    $_selectCamera(camera) {
      this.$emit("selectCamera", camera, this.currentChapter);
    },
    //添加章节底图
    $_addMap(type, map, id) {
      this.$emit("addMap", type, map, id);
    },
    //添加故事
    $_addProjectMap(type, map) {
      this.showSetting = false;
      // this.$emit("addMapToProject", type, map, this.dataSourceCopy);
    },
    //预览故事
    $_storyPreview() {
      this.$emit("storyPreview", this.dataSourceCopy);
    },
    //导出
    $_export() {
      this.$emit("export");
    },
    //删除故事
    $_deleteProject() {
      this.$emit("deleteProject");
      this.$_back();
    },
    //修改标题
    $_titleChange() {
    },
    //修改标题
    $_editTitle() {
      this.editTitle = true;
    },
    //取得空章节数据
    $_getChapter() {
      return {
        "uuid": "Chapter_" + parseInt(String(Math.random() * 100000000)),
        "camera": {
          "uuid": "Chapter_" + parseInt(String(Math.random() * 100000000)),
          "heading": 0,
          "pitch": 0,
          "roll": 0,
          "positionCartographic": {
            "longitude": 0,
            "latitude": 0,
            "height": 0,
          }
        },
        "features": [],
        "title": "无标题",
        "animationTime": "5000"
      };
    },
    //新增章节
    $_addChapter() {
      let chapter = this.$_getChapter();
      chapter.mapStoryUUID = this.dataSourceCopy.uuid;
      this.$emit("addChapter", chapter);
    },
    //复制上一章节
    $_copyChapter() {
      let chapters = JSON.parse(JSON.stringify(this.dataSourceCopy.chapters))
      let chapter = chapters[chapters.length - 1];
      chapter.uuid = "Chapter_" + parseInt(String(Math.random() * 100000000));
      this.$emit("copyChapter", chapter);
    },
    //保存数据
    $_save() {
      this.$emit("save");
    },
    //更新动画时间
    $_changeAnimationTime(feature) {
      this.$emit("animationTimeChanged", feature);
    },
    //预览一个章节
    $_chapterPreview(chapter) {
      this.$emit("chapterPreview", chapter);
    },
    //删除章节
    $_deleteChapter(index) {
      this.$emit("deleteChapter", index, this.dataSourceCopy.uuid);
    },
    //编辑章节
    $_editChapter(index) {
      let chapters = JSON.parse(JSON.stringify(this.dataSourceCopy.chapters))
      this.currentChapter = chapters[index];
      let uuid = this.currentChapter.mapStoryUUID;
      let features = this.currentChapter.features;
      let graphicLayer = this.$_getGraphicLayer(uuid, uuid);
      if (!graphicLayer) {
        this.$refs.featureEdit.$_initGraphicLayer(uuid);
      } else {
        //如果是由预览组件生成的标会图层
        if (graphicLayer.hasOwnProperty("initByPreview") && graphicLayer.initByPreview) {
          graphicLayer.initByPreview = false;
          //先重置getGraphic函数
          this.$refs.featureEdit.$_resetGetGraphic(uuid, uuid);
        }
      }
      //先隐藏其他章节的标绘对象
      for (let i = 0; i < chapters.length; i++) {
        if (i !== index) {
          const {features} = chapters[i];
          if (features) {
            for (let j = 0; j < features.length; j++) {
              let graphic = this.$_getGraphicByID(features[j].id, uuid, uuid);
              if (graphic) {
                graphic.show = false;
              }
            }
          }
        }
      }
      //在显示当前章节的标会对象
      if (features) {
        //通过预览组件生成的数据，没有传入标会组件里面，因此更新标会列表数据
        this.$refs.featureEdit.$_updateGraphicList(JSON.parse(JSON.stringify(features)));
        for (let i = 0; i < features.length; i++) {
          let graphic = this.$_getGraphicByID(features[i].id, uuid, uuid);
          if (graphic) {
            graphic.show = true;
          } else {
            this.$_fromJson({
              features: [features[i]],
              type: "FeatureCollection"
            }, uuid, uuid);
          }
        }
      }
      this.editChapter = true;
    },
    //返回上一级
    $_back() {
      if (this.editChapter) {
        this.editChapter = false;
      }else {
        this.$emit("back");
      }
    },
    //关闭面板
    $_close() {
      this.$emit("close");
    },
    //设置编辑面板高度
    $_setFeatureEditHeight() {
      this.panelHeight = this.height;
      if(this.enableOneMap){
        this.panelHeight += 30;
      }
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-edit-title-edit {
  width: 90%;
}

.mapgis-ui-project-edit-panel {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 400px;
  height: 900px;
  transform-origin: top left;
  overflow: hidden;
  overflow-y: scroll;
}

.mapgis-ui-project-edit-panel::-webkit-scrollbar {
  display: none;
}

.mapgis-ui-project-edit-top-bar {
  background: url("./img/bg.png");
  width: 100%;
  height: 96px;
  position: relative;
}

.mapgis-ui-project-edit-top-tool {
  height: 50px;
  padding-top: 8px;
}

.mapgis-ui-project-edit-top-left {
  text-align: left;
  padding-left: 10px;
}

.mapgis-ui-project-edit-top-right {
  text-align: right;
  padding-right: 14px;
}

.mapgis-ui-project-edit-title {
  width: 100%;
  height: 52px;
  position: absolute;
  top: 35px;
  left: 10px;
}

.mapgis-ui-project-edit-title-value {
  font-weight: bold;
  text-align: left;
  font-size: 20px;
  padding-left: 10px;
}

.mapgis-ui-project-edit-edit-icon {
  margin-left: 10px;
}

.mapgis-ui-project-edit-edit-icon-p {
  position: absolute;
  top: -3px;
}

.mapgis-ui-project-edit-new-feature {
  position: absolute;
  left: 0;
  bottom: 4px;
  text-align: left;
  width: 100%;
  height: 36px;
  padding-left: 8px;
}

.mapgis-ui-project-edit-feature-button {
  width: 47%;
  height: 32px;
  margin-right: 5px;
  background: white;
  color: #0081E2;
  font-size: 14px;
}

.mapgis-ui-project-edit-feature-preview {
  width: 47%;
  height: 32px;
  color: white;
  font-weight: bold;
  border: 1px solid #75BAED;
  background: #0081E2;
}

.mapgis-ui-project-edit-back {
  padding: 8px 8px 8px 28px;
  border-bottom: 1px solid rgb(217, 217, 217);
  cursor: pointer;
}
</style>