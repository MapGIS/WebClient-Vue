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
      <!--      <mapgis-ui-map-select @addMap="$_addMap" title="附加地图"/>-->
      <!--设置相机视角-->
      <mapgis-ui-set-camera-view @click="$_getCamera" v-model="featureCopy.camera"/>
      <!--图片展示-->
      <mapgis-ui-choose-picture :enablePreview="false" v-model="featureCopy.images"/>
      <!--富文本-->
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">
        <div v-if="editor">
          <editor-menu-bar :editor="editor" v-slot="{ commands }">
            <div>
              <span
                  @click="commands.bold"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle" :iconStyle="editButtonStyle"
                                    type="border"/>
              </span>
              <span
                  @click="showImagePrompt(commands.image)"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle" :iconStyle="editButtonStyle"
                                    type="picture"/>
              </span>
              <span
                  @click="commands.italic"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle" :iconStyle="editButtonStyle"
                                    type="italic"/>
              </span>
              <span
                  @click="commands.strike"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle" type="strike"/>
              </span>
              <span
                  @click="commands.underline"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle" type="underline"/>
              </span>
              <span
                  @click="commands.bullet_list"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle" type="ul"/>
              </span>
              <span
                  @click="commands.ordered_list"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle"
                                    :iconStyle="editButtonStyle" type="ol"/>
              </span>
            </div>
          </editor-menu-bar>
          <editor-content class="mapgis-3d-map-story-edit-container" :editor="editor"/>
        </div>
      </mapgis-ui-row>
      <!--      <mapgis-ui-row v-if="featureCopy.drawType !== 'point'">-->
      <!--        <mapgis-ui-color-outline @changeColor="$_changeColor" title="填充颜色"/>-->
      <!--      </mapgis-ui-row>-->
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
      editButtonContainerStyle: {
        textAlign: "center",
        width: "24px",
        height: "24px",
      }
    }
  },
  props: {
    feature: {
      type: Object
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 900
    },
  },
  watch: {
    feature: {
      handler: function () {
        this.featureCopy = this.feature;
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
    }
  },
  created() {
    this.featureCopy = this.feature;
  },
  mounted() {
  },
  methods: {
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({src})
      }
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
    $_changeColor(color) {
      this.$emit("changeColor", color);
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
  width: 100%;
}
</style>