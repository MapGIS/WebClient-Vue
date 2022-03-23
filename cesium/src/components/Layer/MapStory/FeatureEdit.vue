<template>
  <div>
    <div :style="{height: height - 40 + 'px'}" style="position: relative;width: 100%">
      <div v-if="dataSourceCopy" :style="{height: height - 85 + 'px'}" class="mapgis-ui-feature-edit-panel">
        <!--标题-->
        <mapgis-ui-input-row-left
            title="标题"
            paddingLeft="7px"
            paddingRight="6px"
            fontSize="14px"
            v-model="dataSourceCopy.title"
        />
        <!--附加地图-->
        <!--        <mapgis-ui-map-select v-show="!showMoreMap"-->
        <!--                              title="附加地图"-->
        <!--                              :topTitleStyle="topTitleStyle"-->
        <!--                              :showTitleIcon="false"-->
        <!--                              :showMoreTitle="showMoreTitle"-->
        <!--                              :titleStyle="titleStyle"-->
        <!--                              :mainStyle="mainStyle"-->
        <!--                              :map="dataSourceCopy.map"-->
        <!--                              @showMore="$_showAdvance"-->
        <!--                              @addMap="$_addMap"-->
        <!--        />-->
        <mapgis-ui-map-multi-rows v-show="showMoreMap" :showMoreTitle="showMoreTitle" @showMore="$_showAdvance"
                                  :map="dataSourceCopy.map" @addMap="$_addMap" title="附加地图"/>
        <!--设置相机视角-->
        <mapgis-ui-set-camera-view-select
            :showTitleIcon="false"
            :cameras="cameras"
            :titleStyle="cameraTitleStyle"
            :mainStyle="cameraMainStyle"
            @click="$_setCamera"
            @showDetail="$_showCameraDetail"
            @selectCamera="$_selectCamera"/>
        <mapgis-ui-set-camera-view
            :showTitle="false"
            :showButton="false"
            :disableInput="true"
            v-show="showCameraDetail"
            v-model="camera"/>
        <!--漫游时间-->
        <mapgis-ui-input-row-left
            title="漫游时间"
            paddingLeft="7px"
            paddingRight="5px"
            fontSize="14px"
            @change="$_setAnimationTime"
            v-model="dataSourceCopy.animationTime"
        />
        <!--图片展示-->
        <mapgis-ui-choose-picture-right :showTitleIcon="false"
                                        :useInternetImg="true"
                                        :enablePreview="false"
                                        @changeImage="$_changeImage"
                                        v-model="dataSourceCopy.images"/>
        <!--标绘工具-->
        <mapgis-ui-title-row-left
            title="标绘工具"
            paddingLeft="7px"
            paddingRight="0"
            margin="0"
            fontSize="14px"
        />
        <mapgis-3d-graphic-single-layer
            v-if="dataSourceCopy"
            ref="graphicLayer"
            :data-source="graphics"
            :containerStyle="graphicContainerStyle"
            :iconsPanelStyle="iconsPanelStyle"
            :enableOneMap="enableOneMap"
            :enableMapStory="true"
            :models="models"
            :vueIndex="dataSourceCopy.mapStoryUUID"
            :vueKey="dataSourceCopy.mapStoryUUID"
            @addFeature="$_addGraphic"
            @saveCamera="$_setCamera"
            @delete="$_deleteGraphic"
        />
        <!--富文本-->
        <mapgis-ui-title-row-left
            title="富文本编辑"
            paddingLeft="7px"
            paddingRight="0"
            margin="0"
            fontSize="14px"
            width="80px"
        />
        <mapgis-ui-row style="width: 100%;padding-left: 8px;padding-right: 9px;">
          <div v-if="editor" style="border: 1px solid #DCDCDC;">
            <editor-menu-bar :editor="editor" v-slot="{ commands }">
              <div style="border-bottom: 1px solid #DCDCDC;">
              <span
                  @click="commands.bold"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle" :iconStyle="editButtonStyle"
                                    title="粗体"
                                    type="border"/>
              </span>
                <span
                    @click="showImagePrompt(commands.image)"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="pictureStyle"
                                    title="图片"
                                    type="picture"/>
              </span>
                <span
                    @click="commands.italic"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle" :iconStyle="editButtonStyle"
                                    title="斜体"
                                    type="italic"/>
              </span>
                <span
                    @click="commands.strike"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle"
                                    title="删除线"
                                    type="strike"/>
              </span>
                <span
                    @click="commands.underline"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle"
                                    title="下划线"
                                    type="underline"/>
              </span>
                <span
                    @click="commands.bullet_list"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle"
                                    title="无序列表"
                                    type="ul"/>
              </span>
                <span
                    @click="commands.ordered_list"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle"
                                    title="有序列表"
                                    type="ol"/>
              </span>
                <span
                    @click="commands.blockquote"
                >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle"
                                    title="引用"
                                    type="quote"/>
              </span>
                <span
                    @click="commands.code"
                >
               <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                   :iconStyle="editButtonStyle"
                                   title="代码"
                                   type="code"/>
              </span>

              </div>
            </editor-menu-bar>
            <editor-content class="mapgis-3d-map-story-edit-container" :editor="editor"/>
          </div>
        </mapgis-ui-row>
      </div>
      <!--保存与预览-->
      <mapgis-ui-project-bottom-panel v-if="dataSourceCopy"
                                      class="mapgis-ui-feature-edit-bottom"
                                      :enableSave="false"
                                      @save="$_save"
                                      @preview="$_preview"/>
    </div>
  </div>
</template>

<script>
import GraphicLayerService from "../Graphic/GraphicLayerService";
import {Editor, EditorContent, EditorMenuBar} from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  Image,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Search,
} from 'tiptap-extensions'

export default {
  name: "mapgis-3d-feature-edit",
  mixins: [GraphicLayerService],
  components: {
    EditorMenuBar,
    EditorContent,
  },
  data() {
    return {
      //是否初始化
      isInit: false,
      //数据源副本
      dataSourceCopy: undefined,
      //图标样式
      iconStyle: {
        opacity: 1
      },
      //富文本编辑器对象
      editor: undefined,
      //富文本编辑器按钮样式
      editButtonStyle: {
        width: "24px",
        height: "24px",
      },
      //图片选择样式
      pictureStyle: {
        width: "18px",
        height: "18px",
        marginBottom: "2px",
      },
      //富文本编辑器按钮样式
      editButtonContainerStyle: {
        textAlign: "center",
        width: "24px",
        height: "30px",
        marginLeft: "1.5px",
      },
      //附加地图样式
      topTitleStyle: {
        paddingLeft: "7px",
        paddingRight: "10px"
      },
      titleStyle: {
        fontSize: "14px",
        top: "4px",
        paddingLeft: "7px"
      },
      mainStyle: {
        paddingRight: "7px",
      },
      cameraTitleStyle: {
        paddingLeft: "7px",
        paddingRight: "10px"
      },
      cameraMainStyle: {
        paddingLeft: "7px",
        paddingRight: "10px"
      },
      showMoreMap: false,
      showMoreTitle: "展开高级选项",
      showCameraDetail: false,
      camera: {},
      deleteIconStyle: {
        color: "#000"
      },
      isPreviewFeature: false,
      containerStyle: {
        margin: 0,
        width: "100%"
      },
      //标绘对象集合
      graphics: [],
      graphicContainerStyle: {
        width: "100%",
        padding: "8px"
      },
      iconsPanelStyle: {
        width: "100%",
        margin: 0,
        marginBottom: "10px",
        marginTop: "10px"
      },
    }
  },
  props: {
    //数据源
    dataSource: {
      type: Object,
      default() {
        return {
          //id标识
          "uuid": "",
          //每一章节对应的视角，参考cesium的相机视角
          "camera": {
            "heading": 0,
            "pitch": 0,
            "roll": 0,
            "positionCartographic": {
              "height": 0,
              "latitude": 0,
              "longitude": 0
            }
          },
          //每一章节包含的要素
          "features": [],
          //章节标题
          "title": ""
        }
      }
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 900
    },
    models: {
      type: Object
    },
    cameras: {
      type: Array,
      default() {
        return [];
      }
    },
    editList: {
      type: Object
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
        //更新数据
        this.$_init();
        //更新富文本编辑
        this.$nextTick(function () {
          this.$_initEditor();
        });
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        if (!this.isInit) {
          this.$emit("change", this.dataSourceCopy);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    //更新轮播图
    $_changeImage(images) {
      this.dataSourceCopy.images = images;
    },
    //更新漫游时间
    $_setAnimationTime(e) {
      this.dataSourceCopy.animationTime = e / 1;
    },
    //展开高级选项
    $_showAdvance() {
      this.showMoreMap = !this.showMoreMap;
      if (this.showMoreMap) {
        this.showMoreTitle = "收起高级选项";
      } else {
        this.showMoreTitle = "展开高级选项";
      }
    },
    //删除标绘对象
    $_deleteGraphic(index) {
      this.dataSourceCopy.features.splice(index, 1);
    },
    //初始化函数
    $_init() {
      this.isInit = true;
      //复制数据源
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
      this.camera = this.dataSourceCopy.camera;
      this.$nextTick(function () {
        this.isInit = false;
      });
    },
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({src})
      }
    },
    //显示相机视角详细参数
    $_showCameraDetail(showCameraDetail) {
      this.showCameraDetail = showCameraDetail;
    },
    //设置相机视角
    $_setCamera() {
      this.$emit("setCamera");
    },
    //选择相机视角
    $_selectCamera(camera) {
      camera.title = this.dataSourceCopy.title;
      camera.uuid = this.dataSourceCopy.uuid;
      this.camera = camera;
      this.$emit("setCamera", camera);
    },
    //初始化富文本编辑
    $_initEditor() {
      let vm = this;
      //如果不存在则新建
      if (!this.editor) {
        this.editor = new Editor({
          extensions: [
            new Blockquote(),
            new BulletList(),
            new CodeBlock(),
            new HardBreak(),
            new Image(),
            new Heading({levels: [1, 2, 3]}),
            new HorizontalRule(),
            new ListItem(),
            new OrderedList(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Code(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Search({
              disableRegex: false
            }),
          ],
          content: this.dataSourceCopy.content,
          onUpdate: ({getHTML}) => {
            let contentStr = getHTML();
            contentStr = contentStr.replace("<img", "<img style='width:100%'");
            vm.dataSourceCopy.content = contentStr;
            vm.$emit("change", vm.dataSourceCopy);
          },
        });
      } else {
        //否则更新
        if(this.dataSourceCopy.content){
          this.editor.setContent(this.dataSourceCopy.content);
        }
      }
    },
    //添加底图
    $_addMap(type, map) {
      this.mapType = type;
      if (this.dataSourceCopy.map) {
        const {vueKey, vueIndex} = this.dataSourceCopy.map;
        if (vueKey && vueIndex) {
          map.vueKey = vueKey;
          map.vueIndex = vueIndex;
        }
      }
      this.$emit("addMap", type, map, this.dataSourceCopy.id);
    },
    //预览
    $_preview() {
      this.isPreviewFeature = true;
      this.$emit("chapterPreview", this.dataSourceCopy);
    },
    //添加Graphic
    $_addGraphic(e) {
      if (this.dataSourceCopy.features.length === 0) {
        this.$set(this.dataSourceCopy.features, this.dataSourceCopy.features.length, e);
        this.$emit("change", this.dataSourceCopy);
      } else {
        this.$set(this.dataSourceCopy.features, this.dataSourceCopy.features.length, e);
      }
    },
    //保存数据
    $_save() {
      this.$emit("save");
    },
    //初始化标绘图层
    $_initGraphicLayer(uuid) {
      this.$refs.graphicLayer.$_init(undefined, uuid, uuid);
    },
    //更新标会列表数据
    $_updateGraphicList(graphics) {
      this.$refs.graphicLayer.$_updateGraphicList(graphics);
    },
    //重置getGraphic函数
    $_resetGetGraphic(vueIndex, vueKey) {
      this.$refs.graphicLayer.$_resetGetGraphic(vueIndex, vueKey);
    },
    //停止绘制
    $_stopDraw() {
      this.$refs.graphicLayer.$_stopDraw();
    },
    //隐藏当前章节的标绘内容
    $_hideChapterGraphics() {
      let uuid = this.dataSourceCopy.mapStoryUUID;
      let graphics = this.dataSourceCopy.features;
      for (let i = 0; i < graphics.length; i++) {
        let graphic = this.$_getGraphicByID(graphics[i].id, uuid, uuid);
        if (graphic) {
          graphic.show = false;
        }
      }
    }
  }
}
</script>

<style>
.mapgis-ui-feature-edit-panel {
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding-left: 4px;
  padding-right: 4px;
  position: relative;
  padding-bottom: 7px;
}

.mapgis-ui-feature-edit-panel::-webkit-scrollbar {
  display: none;
}

.mapgis-ui-feature-edit-deitor {
  width: 100%;
}

.mapgis-ui-feature-edit-bottom {
  width: 100%;
  height: auto;
  position: absolute;
  left: 0;
  bottom: 0
}

.mapgis-3d-map-story-edit-container {
  width: 99%;
  padding: 10px;
}

.ProseMirror-focused {
  border: none;
  border-style: none;
}

.ProseMirror:focus-visible {
  outline: none;
}

div:focus-visible {
  outline: none;
}

.ProseMirror > p > img {
  width: 100%;
}

.mapgis-3d-map-story-edit-save-entity {
  width: 48%;
  position: absolute !important;
  bottom: 0;
}

.mapgis-ui-switch-panel-header {
  padding-left: 0 !important;
}

.mapgis-ui-switch-panel-label {
  font-weight: bolder;
}

.mapgis-ui-feature-edit-set-camera {
  margin-top: 10px;
}
</style>