<template>
  <div style="height: 100%">
    <div v-show="!editEntity" :style="{height: height + 'px'}" style="position: relative;width: 100%">
      <div v-if="featureCopy" :style="{height: height - 48 + 'px'}" class="mapgis-ui-feature-edit-panel">
        <!--标题-->
        <mapgis-ui-input-row-left
          title="标题"
          paddingLeft="0"
          paddingRight="0"
          fontSize="14px"
          v-model="featureCopy.title"
        />
        <!--展示框大小-->
        <!--      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">-->
        <!--        <mapgis-ui-size-check-box title="展示框大小"/>-->
        <!--      </mapgis-ui-row>-->
        <!--选择图标-->
        <mapgis-ui-icons-panel-scroll-x v-if="featureCopy.drawType === 'point'" @changeIcon="$_changeIcon"
                                        title="选择图标"/>
        <!--附加地图-->
        <mapgis-ui-map-select :showTitleIcon="false"
                              v-show="!showMoreMap" :showMoreTitle="showMoreTitle" @showMore="$_showMore"
                              :map="featureCopy.map" @addMap="$_addMap" title="附加地图"/>
        <mapgis-ui-map-multi-rows v-show="showMoreMap" :showMoreTitle="showMoreTitle" @showMore="$_showMore"
                                  :map="featureCopy.map" @addMap="$_addMap" title="附加地图"/>
        <!--设置相机视角-->
        <mapgis-ui-set-camera-view-select
          :showTitleIcon="false"
          :cameras="cameras"
          @click="$_getCamera"
          @showDetail="$_showDetail"
          @selectCamera="$_selectCamera"
          v-model="camera"/>
        <mapgis-ui-set-camera-view
          :showTitle="false"
          :showButton="false"
          v-show="showDetail"
          @click="$_getCamera"
          v-model="camera"/>
        <!--动画时间-->
<!--        <mapgis-ui-row style="width: 100%;margin-top: 6px;">-->
<!--          <mapgis-ui-input-border :showTitleIcon="false"-->
<!--                                  ref="animationTime" @change="$_changeTime" v-model="featureCopy.animationTime"-->
<!--                                  title="动画时间" placeholder="请输入动画时间"/>-->
<!--        </mapgis-ui-row>-->
        <mapgis-ui-input-row-left
          title="动画时间"
          paddingLeft="0"
          paddingRight="0"
          fontSize="14px"
          @change="$_changeTime"
          v-model="featureCopy.animationTime"
        />
        <!--图片展示-->
        <mapgis-ui-choose-picture-right :showTitleIcon="false"
                                        @firstAddPicture="$_firstAddPicture" :enablePreview="false"
                                        v-model="featureCopy.images"/>
        <mapgis-ui-title-row-left
          title="标绘工具"
          paddingLeft="0"
          paddingRight="0"
          margin="0"
          fontSize="14px"
        />
        <mapgis-ui-graphic-icons-panel
          :containerStyle="containerStyle"
          @startDraw="$_addFeature"
        />
        <mapgis-ui-graphic-edit-panel
          style="margin-top: 10px"
          @change="$_changeEntity"
          :editList="editList"
          :currentEditType="currentEditType"
          :dataSourceCopy="featureCopy.features"
        />
        <!--富文本-->
        <mapgis-ui-title-row-left
          title="富文本编辑"
          paddingLeft="0"
          paddingRight="0"
          margin="0"
          fontSize="14px"
        />
        <mapgis-ui-row>
          <div v-if="editor" style="border: 2px solid black;">
            <editor-menu-bar :editor="editor" v-slot="{ commands }">
              <div style="border-bottom: 2px solid black;">
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
      <mapgis-ui-project-bottom-panel v-if="featureCopy" class="mapgis-ui-feature-edit-bottom"
                                      @save="$_saveEntity"
                                      @preview="$_preview"/>
    </div>
    <div v-if="editEntity" style="padding-left: 4px;height: 100%;position: relative;">
      <!--标题-->
      <mapgis-ui-row style="width: 100%">
        <mapgis-ui-input-border @change="$_changeEntityTitle"
                                :showTitleIcon="false"
                                title="标题"
                                v-model="currentEntity.title"
                                placeholder="请输入标题"/>
      </mapgis-ui-row>
      <!--填充颜色-->
      <mapgis-ui-row v-if="currentEntity.drawType !== 'text' && currentEntity.drawType !== 'point'">
        <mapgis-ui-color-title
          :color="currentEntity.layerStyle.color"
          :showTitleIcon="false"
          title="填充颜色"
          @changeColor="$_changeEntityColor"
        />
      </mapgis-ui-row>
      <!--字体颜色-->
      <mapgis-ui-row v-if="currentEntity.drawType === 'text'">
        <mapgis-ui-color-title :color="currentEntity.layerStyle.color"
                               @changeColor="$_changeTextColor" :showTitleIcon="false" title="字体颜色"/>
      </mapgis-ui-row>
      <!--透明度-->
      <mapgis-ui-row>
        <mapgis-ui-slider-title @change="$_changeEntityOpacity"
                                :showTitleIcon="false"
                                :enableWatchValue="false"
                                v-model="currentEntity.layerStyle.opacity"
                                title="透明度"/>
      </mapgis-ui-row>
      <!--经度-->
      <mapgis-ui-row style="width: 100%;margin-top: 6px;">
        <mapgis-ui-input-border @change="$_changeEntityLng"
                                type="number"
                                :showTitleIcon="false" title="经度"
                                v-model="currentEntity.center[0]"
                                placeholder="请输入经度"/>
      </mapgis-ui-row>
      <!--纬度-->
      <mapgis-ui-row style="width: 100%;margin-top: 6px;">
        <mapgis-ui-input-border @change="$_changeEntityLat"
                                type="number"
                                :showTitleIcon="false" title="纬度"
                                v-model="currentEntity.center[1]"
                                placeholder="请输入纬度"/>
      </mapgis-ui-row>
      <!--高度-->
      <mapgis-ui-row style="width: 100%;margin-top: 6px;">
        <mapgis-ui-input-border @change="$_changeEntityHeight"
                                type="number"
                                :showTitleIcon="false" title="高度"
                                v-model="currentEntity.center[2]"
                                placeholder="请输入高度"/>
      </mapgis-ui-row>
      <!--线宽-->
      <mapgis-ui-row style="width: 100%" v-if="currentEntity.drawType === 'polyline'">
        <mapgis-ui-input-border :enableWatchValue="false"
                                :showTitleIcon="false"
                                @change="$_changeLineWidth"
                                v-model="currentEntity.layerStyle.width"
                                title="线宽"
                                placeholder="请输入线宽"/>
      </mapgis-ui-row>
      <!--选择图标-->
      <mapgis-ui-icons-panel-scroll-x v-if="currentEntity.drawType === 'point'"
                                      style="margin-bottom: 4px"
                                      :showTitleIcon="false"
                                      @changeIcon="$_changeEntityIcon"
                                      title="选择图标"/>
      <mapgis-ui-row>
        <span>
          是否填充文字
        </span>
        <mapgis-ui-switch style="float: right;margin-right: 2px"
                          @click="$_toggleFillText"
                          checked-children="是" un-checked-children="否"
                          v-model="currentEntity.enableFillText"
        />
      </mapgis-ui-row>
      <mapgis-ui-row v-show="currentEntity.enableFillText">
        <mapgis-ui-input/>
      </mapgis-ui-row>
      <!--是否启用popup-->
      <mapgis-ui-switch-panel @changeChecked="$_enablePopup" label="是否启用Popup" layout="horizontal">
        <!--popup标题-->
        <mapgis-ui-row style="width: 100%;margin-top: 6px;">
          <mapgis-ui-input-border :showTitleIcon="false" v-model="currentEntity.popupOptions.title" title="popup标题"
                                  placeholder="请输入popup标题"/>
        </mapgis-ui-row>
        <mapgis-ui-select-row style="margin-top: 15px"
                              @change="$_changePopupOptionType" :defaultValue="defaultPopupOptionType"
                              :dataSource="popupOptionTypes" title="点击类型"/>
        <!--图片展示-->
        <mapgis-ui-choose-picture-right
          :showTitleIcon="false"
          title="图片"
          v-model="currentEntity.popupOptions.images"
          @firstAddPicture="$_firstAddPicture" :enablePreview="false"
        />
        <!--富文本-->
        <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera" style="margin-top: 28px">
          <div v-if="popupEditor" style="border: 2px solid black;width: 97%;">
            <editor-menu-bar :editor="editor" v-slot="{ commands }">
              <div style="border-bottom: 2px solid black;">
              <span
                @click="commands.bold"
              >
                <mapgis-ui-svg-icon :containerStyle="editButtonContainerStyle" :iconStyle="editButtonStyle"
                                    title="粗体"
                                    type="border"/>
              </span>
                <span v-if="currentEntity.popupOptions.type === 'text'"
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
            <editor-content class="mapgis-3d-map-story-edit-container" :editor="popupEditor"/>
          </div>
        </mapgis-ui-row>
      </mapgis-ui-switch-panel>
      <mapgis-ui-button class="mapgis-3d-map-story-edit-save-entity"
                        @click="$_saveEntity"
                        type="primary"
      >
        保存
      </mapgis-ui-button>
      <mapgis-ui-button class="mapgis-3d-map-story-edit-save-entity"
                        @click="$_deleteEntity"
                        style="left: 51%"
      >
        删除
      </mapgis-ui-button>
    </div>
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
      featureCopy: {
        "uuid": "",
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
        "features": [],
        "title": ""
      },
      inputStyle: {},
      iconStyle: {
        opacity: 1
      },
      editor: undefined,
      popupEditor: undefined,
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
      showDetail: false,
      camera: {},
      deleteIconStyle: {
        color: "#000"
      },
      isPreviewFeature: false,
      editEntity: false,
      currentEntity: undefined,
      defaultPopupType: "text",
      popupTypes: [{
        key: "card",
        value: "图片"
      }, {
        key: "text",
        value: "文字"
      }],
      defaultPopupOptionType: "click",
      popupOptionTypes: [{
        key: "click",
        value: "点击时显示Popup"
      }, {
        key: "hover",
        value: "鼠标悬停时显示Popup"
      }, {
        key: "force",
        value: "始终显示Popup"
      }],
      currentEditType: undefined,
      containerStyle: {
        margin: 0,
        width: "100%"
      }
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
    editList: {
      type: Object
    }
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
    $_toggleFillText() {
      this.$emit("changeEntity", "enableFillText", this.currentEntity);
    },
    $_changePopupOptionType(e) {
      this.currentEntity.popupOptions.optionType = e;
      if (e === "force") {
        this.$emit("changeEntity", "forcePopup", this.currentEntity);
      }
    },
    $_changePopupType(e) {
      this.currentEntity.popupOptions.type = e;
    },
    $_enablePopup(e) {
      this.$emit("changeEntity", "enablePopup", {
        projectUUID: this.featureCopy.projectUUID,
        featureUUID: this.featureCopy.uuid,
        uuid: this.currentEntity.uuid
      }, e);
    },
    $_changeEntityIcon(e) {
      this.$emit("changeEntity", "changeEntityIcon", this.currentEntity.uuid, e);
    },
    $_changeLineWidth(e) {
      this.$emit("changeEntity", "polylineWidth", this.currentEntity.uuid, Number(e));
    },
    $_changeEntityColor(e) {
      this.currentEntity.layerStyle.color = e.hex;
      switch (this.currentEntity.drawType) {
        case "polyline":
          this.$emit("changeEntity", "polylineColor", this.currentEntity.uuid, {
            opacity: this.currentEntity.layerStyle.opacity,
            color: e.hex
          });
          break;
        case "polygon":
          this.$emit("changeEntity", "polygonColor", this.currentEntity.uuid, {
            opacity: this.currentEntity.layerStyle.opacity,
            color: e.hex
          });
          break;
        case "rectangle":
          this.$emit("changeEntity", "rectangleColor", this.currentEntity.uuid, {
            opacity: this.currentEntity.layerStyle.opacity,
            color: e.hex
          });
          break;
      }
    },
    $_changeEntityLng(e) {
      this.$emit("changeEntity", "changeEntityLng", this.currentEntity.uuid, Number(e));
    },
    $_changeEntityLat(e) {
      this.$emit("changeEntity", "changeEntityLat", this.currentEntity.uuid, Number(e));
    },
    $_changeEntityHeight(e) {
      this.$emit("changeEntity", "changeEntityHeight", this.currentEntity.uuid, Number(e));
    },
    $_changeEntityOpacity(e) {
      this.currentEntity.layerStyle.opacity = e;
      switch (this.currentEntity.drawType) {
        case "text":
          this.$emit("changeEntity", "fontOpacity", this.currentEntity.uuid, {
            opacity: e,
            color: this.currentEntity.layerStyle.color
          });
          break;
        case "polyline":
          this.$emit("changeEntity", "polylineOpacity", this.currentEntity.uuid, {
            opacity: e,
            color: this.currentEntity.layerStyle.color
          });
          break;
        case "polygon":
          this.$emit("changeEntity", "polygonOpacity", this.currentEntity.uuid, {
            opacity: e,
            color: this.currentEntity.layerStyle.color
          });
          break;
        case "rectangle":
          this.$emit("changeEntity", "rectangleOpacity", this.currentEntity.uuid, {
            opacity: e,
            color: this.currentEntity.layerStyle.color
          });
          break;
      }
    },
    $_changeTextColor(e) {
      this.currentEntity.layerStyle.color = e.hex;
      this.$emit("changeEntity", "fontColor", this.currentEntity.uuid, e.hex);
    },
    $_changeEntityTitle() {
      if (this.currentEntity.drawType === "text") {
        this.$emit("changeEntity", "changeEntityTitle", this.currentEntity.uuid, this.currentEntity.title);
      }
    },
    $_changeEntity(editPanelValues) {
      this.$emit("changeEntity", "changeEntity", this.currentEditType, editPanelValues);
    },
    $_saveEntity() {
      this.editEntity = false;
      this.$emit("closeFeatureEdit");
    },
    $_deleteEntity() {
      this.editEntity = false;
      this.$emit("changeEntity", "deleteEntity", this.currentEntity.uuid, {
        projectUUID: this.featureCopy.projectUUID,
        featureUUID: this.featureCopy.uuid,
      });
    },
    $_editEntity(currentEntity) {
      this.editEntity = true;
      this.currentEntity = currentEntity;
      if (this.currentEntity.popupOptions.type === "text") {
        this.$_addPopupEditor();
      }
    },
    $_changeTime(e) {
      this.featureCopy.animationTime = e;
      this.$emit("change", this.featureCopy);
    },
    $_toggleFeature() {
      this.$emit("toggleFeature");
    },
    $_deleteFeature(feature) {
      this.$emit("deleteFeature", feature);
    },
    $_addFeature(type) {
      //设置当前绘制类型
      if (type !== "mouse") {
        this.currentEditType = type;
      }
      if (type === "label") {
        type = "text";
      }
      this.$emit("addFeature", type);
    },
    $_showMore() {
      this.showMoreMap = !this.showMoreMap;
      if (this.showMoreMap) {
        this.showMoreTitle = "收起高级选项";
      } else {
        this.showMoreTitle = "展开高级选项";
      }
    },
    $_init() {
      this.featureCopy = Object.assign(this.featureCopy, this.feature);
      if (this.$refs.animationTime) {
        this.$refs.animationTime.setValue(this.featureCopy.animationTime);
      }
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
    $_selectCamera(camera) {
      this.$emit("selectCamera", camera);
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
            let contentStr = getHTML();
            contentStr = contentStr.replace("<img", "<img style='width:100%'");
            vm.featureCopy.content = contentStr;
            vm.$emit("changeContent", vm.featureCopy);
            if (vm.isPreviewFeature) {
              vm.$emit("featurePreview", vm.featureCopy);
            }
          },
        });
      } else {
        this.editor.setContent(this.featureCopy.content);
      }
    },
    $_addPopupEditor() {
      let vm = this;
      if (!this.popupEditor) {
        this.popupEditor = new Editor({
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
          content: this.currentEntity.popupOptions.content,
          onUpdate: ({getHTML}) => {
            let content = getHTML();
            content = content.slice(0, 2) + " style='margin-bottom: 0;'" + content.slice(2);
            vm.currentEntity.popupOptions.content = content;
          },
        });
      } else {
        this.popupEditor.setContent(this.currentEntity.popupOptions.content);
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
      this.isPreviewFeature = true;
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