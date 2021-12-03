<template>
  <div :style="{height: height + 'px'}" style="position: relative;width: 100%">
    <div v-if="featureCopy" :style="{height: height - 48 + 'px'}" class="mapgis-ui-feature-edit-panel">
      <!--标题-->
      <mapgis-ui-row style="width: 100%">
        <mapgis-ui-input-border v-model="featureCopy.title" title="标题" placeholder="请输入标题"/>
      </mapgis-ui-row>
      <!--展示框大小-->
      <!--      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">-->
      <!--        <mapgis-ui-size-check-box title="展示框大小"/>-->
      <!--      </mapgis-ui-row>-->
      <!--选择图标-->
      <mapgis-ui-icons-panel-scroll-x v-if="featureCopy.drawType === 'point'" @changeIcon="$_changeIcon" title="选择图标"/>
      <!--附加地图-->
      <mapgis-ui-map-select v-show="!showMoreMap" :showMoreTitle="showMoreTitle" @showMore="$_showMore"
                            :map="featureCopy.map" @addMap="$_addMap" title="附加地图"/>
      <mapgis-ui-map-multi-rows v-show="showMoreMap" :showMoreTitle="showMoreTitle" @showMore="$_showMore"
                                :map="featureCopy.map" title="附加地图"/>
      <!--设置相机视角-->
      <mapgis-ui-set-camera-view-select
          :cameras="cameras"
          @click="$_getCamera"
          @showDetail="$_showDetail"
          v-model="featureCopy.camera"/>
      <mapgis-ui-set-camera-view
          :showTitle="false"
          :showButton="false"
          v-show="showDetail"
          @click="$_getCamera"
          v-model="featureCopy.camera"/>
      <!--图片展示-->
      <mapgis-ui-choose-picture @firstAddPicture="$_firstAddPicture" :enablePreview="false"
                                v-model="featureCopy.images"/>
      <!--填充颜色-->
      <mapgis-ui-row v-if="featureCopy.drawType !== 'point'">
        <mapgis-ui-color-title @changeColor="$_changeFillColor" title="填充颜色"/>
      </mapgis-ui-row>
      <!--透明度-->
      <mapgis-ui-row v-if="featureCopy.drawType !== 'point'">
        <mapgis-ui-slider-title @change="$_changeOpacity" v-model="featureCopy.layerStyle.opacity" title="透明度"/>
      </mapgis-ui-row>
      <!--富文本-->
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">
        <div v-if="editor">
          <editor-menu-bar :editor="editor" v-slot="{ commands }">
            <div>
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
    <mapgis-ui-project-bottom-panel v-if="featureCopy" class="mapgis-ui-feature-edit-bottom" @preview="$_preview"/>
  </div>
</template>

<script>
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
  name: "mapgis-ui-feature-edit",
  model: {
    prop: "feature",
    event: "change"
  },
  components: {
    EditorMenuBar,
    EditorContent,
  },
  data() {
    return {
      featureCopy: undefined,
      inputStyle: {},
      iconStyle: {
        opacity: 1
      },
      editor: undefined,
      editButtonStyle: {
        color: "black",
        width: "24px",
        height: "24px",
      },
      pictureStyle: {
        color: "black",
        width: "18px",
        height: "18px",
        marginBottom: "2px",
      },
      editButtonContainerStyle: {
        textAlign: "center",
        width: "24px",
        height: "30px",
      },
      showMoreMap: false,
      showMoreTitle: "展开高级选项",
      showDetail: false
    }
  },
  props: {
    feature: {
      type: Object,
      default() {
        return {}
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
    cameras: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  watch: {
    feature: {
      handler: function () {
        this.$_init();
        this.$nextTick(function () {
          this.$_addEditor();
        });
      },
      deep: true
    },
    featureCopy: {
      handler: function () {
        this.$emit("change", this.featureCopy);
      },
      deep: true
    },
    "featureCopy.title": {
      handler: function () {
        this.$emit("titleChanged", this.featureCopy);
      },
      deep: true
    }
  },
  created() {
    this.$_init();
  },
  mounted() {
  },
  methods: {
    $_showMore() {
      this.showMoreMap = !this.showMoreMap;
      if (this.showMoreMap) {
        this.showMoreTitle = "收起高级选项";
      } else {
        this.showMoreTitle = "展开高级选项";
      }
    },
    $_init() {
      this.featureCopy = this.feature;
      const {map, layerStyle} = this.featureCopy;
      if (!map) {
        this.featureCopy.map = {};
      }
      if (!layerStyle) {
        this.featureCopy.layerStyle = {
          "show": true,
          "color": "#FF0000",
          "opacity": 1
        };
      }
    },
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({src})
      }
    },
    $_firstAddPicture() {
      this.$emit("firstAddPicture", this.featureCopy);
    },
    $_showDetail(showDetail) {
      this.showDetail = showDetail;
    },
    $_getCamera() {
      this.$emit("getCamera");
    },
    $_addEditor() {
      let vm = this;
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
          content: this.featureCopy.content,
          onUpdate: ({getHTML}) => {
            vm.featureCopy.content = getHTML();
          },
        });
      } else {
        this.editor.setContent(this.featureCopy.content);
      }
    },
    $_addMap(type, map) {
      this.mapType = type;
      if (this.featureCopy.map) {
        const {vueKey, vueIndex} = this.featureCopy.map;
        if (vueKey && vueIndex) {
          map.vueKey = vueKey;
          map.vueIndex = vueIndex;
        }
      }
      this.$emit("addMap", type, map, this.featureCopy.id);
    },
    $_changeFillColor(color) {
      this.$emit("changeColor", color, "fill");
    },
    $_changeOpacity(opacity) {
      this.$emit("changeOpacity", opacity, "fill");
    },
    $_changeIcon(icon) {
      this.$emit("changeIcon", icon);
    },
    $_preview() {
      this.$emit("featurePreview", this.featureCopy);
    },
    $_back() {
      this.$emit("back");
    }
  }
}
</script>

<style>
.mapgis-ui-feature-edit-panel {
  width: 100%;
  height: 836px;
  overflow: hidden;
  overflow-y: scroll;
  padding-left: 4px;
  padding-right: 4px;
  position: relative;
}

.mapgis-ui-feature-edit-panel::-webkit-scrollbar {
  display: none;
}

.mapgis-ui-feature-edit-deitor {
  width: 100%;
}

.mapgis-ui-feature-edit-bottom {
  width: 98%;
  height: auto;
  position: absolute;
  left: 0;
  bottom: 0
}

.mapgis-3d-map-story-edit-container {
  width: 99%;
}
</style>