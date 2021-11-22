<template>
  <div>
    <mapgis-ui-row v-if="featureCopy" class="mapgis-ui-feature-edit-panel-head">
      <mapgis-ui-col span="17" class="mapgis-ui-feature-edit-panel-head-left">
        <mapgis-ui-svg-icon @click="$_back" :icon-style="iconStyle" type="back"/>
      </mapgis-ui-col>
      <mapgis-ui-col span="7">
        <mapgis-ui-button @click="$_preview" class="mapgis-project-feature-preview">预览</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div v-if="featureCopy" class="mapgis-ui-feature-edit-panel">
      <mapgis-ui-choose-picture v-model="featureCopy.images"/>
      <mapgis-ui-row>
        <mapgis-ui-input-outline v-model="featureCopy.title" title="标题" placeholder="请输入标题"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">
        <div class="mapgis-ui-feature-edit-deitor" ref="editor"></div>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">
        <mapgis-ui-select-outline title="展示框大小"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-if="featureCopy.drawType === 'point'">
        <mapgis-ui-icons-panel @changeIcon="$_changeIcon" title="选择图标"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-if="featureCopy.drawType !== 'point'">
        <mapgis-ui-color-outline @changeColor="$_changeColor" title="填充颜色"/>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-map-outline :map="featureCopy.map" @addMap="$_addMap" title="附加地图" placeholder="请输入地图Url"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-ui-feature-edit-panel-camera">
        <mapgis-ui-col :span="16">
          <h4 class="mapgis-ui-feature-edit-panel-camera-title">设置相机视角</h4>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8">
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row style="padding: 0 10px;" class="mapgis-ui-feature-edit-set-camera">
        <mapgis-ui-col span="12">
          <mapgis-ui-input-outline :inputStyle="inputStyle" v-model="featureCopy.camera.heading" title="方向角"
                                   placeholder="请输入方向角"/>
        </mapgis-ui-col>
        <mapgis-ui-col span="12">
          <mapgis-ui-input-outline :inputStyle="inputStyle" v-model="featureCopy.camera.pitch" title="俯仰角"
                                   placeholder="请输入俯仰角"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">
        <mapgis-ui-input-outline v-model="featureCopy.camera.roll" title="滚动角" placeholder="请输入滚动角"/>
      </mapgis-ui-row>
      <mapgis-ui-row style="padding: 0 10px;" class="mapgis-ui-feature-edit-set-camera">
        <mapgis-ui-col span="12">
          <mapgis-ui-input-outline :inputStyle="inputStyle" v-model="featureCopy.camera.positionCartographic.longitude"
                                   title="经度"
                                   placeholder="请输入经度"/>
        </mapgis-ui-col>
        <mapgis-ui-col span="12">
          <mapgis-ui-input-outline :inputStyle="inputStyle" v-model="featureCopy.camera.positionCartographic.latitude"
                                   title="纬度"
                                   placeholder="请输入纬度"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera">
        <mapgis-ui-input-outline v-model="featureCopy.camera.positionCartographic.height" title="高度"
                                 placeholder="请输入高度"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-ui-feature-edit-set-camera" style="text-align: center;">
        <mapgis-ui-button @click="$_getCamera" type="primary" class="mapgis-ui-feature-edit-reset-camera">获取当前视角
        </mapgis-ui-button>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor-antd'

export default {
  name: "mapgis-ui-feature-edit",
  model: {
    prop: "feature",
    event: "change"
  },
  data() {
    return {
      featureCopy: undefined,
      inputStyle: {
        width: "162px",
      },
      iconStyle: {
        opacity: 1
      }
    }
  },
  props: {
    feature: {
      type: Object
    }
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
  methods: {
    $_getCamera() {
      this.$emit("getCamera");
    },
    $_addEditor() {
      let vm = this;
      if (this.$refs.editor) {
        let editor = new E(this.$refs.editor);
        editor.customConfig.onchange = (html) => {
          vm.featureCopy.content = editor.txt.html();
          vm.$emit("textChanged", editor.txt.html())
        };
        editor.customConfig.menus = [
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'foreColor',  // 文字颜色
          'link',  // 插入链接
          'justify',  // 对齐方式s
          'image',  // 插入图片
        ]
        editor.customConfig.uploadImgServer = '你的上传地址';
        editor.customConfig.uploadFileName = 'file';
        editor.customConfig.zIndex = 100;
        editor.customConfig.uploadImgParams = {
          from: 'editor'
        };
        editor.customConfig.linkImgCallback = function (url) {
          vm.featureCopy.content = editor.txt.html();
        }
        editor.create();
        editor.txt.html(this.featureCopy.content);
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
  padding-bottom: 20px;
}

.mapgis-ui-feature-edit-panel-head {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgb(95, 99, 104);
}

.mapgis-ui-feature-edit-panel-head-left {
  text-align: left;
  padding-left: 10px;
}

.mapgis-project-feature-preview {
  color: white !important;
  font-weight: bold;
  width: 105px;
  height: 36px;
  margin-top: 14px;
  margin-right: 14px;
  border-color: rgb(95, 99, 104) !important;
}

.mapgis-project-feature-preview:hover {
  color: black !important;
}

.mapgis-ui-feature-edit-panel-camera {
  width: 400px;
  height: 40px;
  background: rgb(41, 42, 45);
  border-top: 1px solid rgb(56, 57, 61);
  border-bottom: 1px solid rgb(56, 57, 61);
}

.mapgis-ui-feature-edit-panel-camera-title {
  color: white;
  text-align: left;
  padding-left: 28px;
  height: 35px;
  line-height: 40px;
}

.mapgis-ui-feature-edit-set-camera {
  margin-top: 30px;
}

.mapgis-ui-feature-edit-reset-camera {
  width: 344px;
}

.mapgis-ui-feature-edit-deitor {
  width: 340px;
  margin: 0 28px;
}
</style>