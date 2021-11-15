<template>
  <div>
    <mapgis-ui-row v-if="featureCopy" class="mapgis-project-feature-edit-panel-head">
      <mapgis-ui-col span="17" class="mapgis-project-feature-edit-panel-head-left">
        <svg-icon @click="$_back" :icon-style="iconStyle" type="back"/>
      </mapgis-ui-col>
      <mapgis-ui-col span="7">
        <mapgis-ui-button @click="$_preview" class="mapgis-project-feature-preview">预览</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div v-if="featureCopy" class="mapgis-project-feature-edit-panel">
      <upload-picture v-model="featureCopy.images"/>
      <mapgis-ui-row>
        <feature-input v-model="featureCopy.title" title="标题" placeholder="请输入标题"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-textarea v-model="featureCopy.content"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-select title="展示框大小"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-if="featureCopy.drawType === 'point'">
        <feature-icons title="featureCopy.drawType"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-if="featureCopy.drawType !== 'point'">
        <feature-color @changeColor="$_changeColor" title="填充颜色"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-panel-camera">
        <mapgis-ui-col :span="16">
          <h4 class="mapgis-project-feature-edit-panel-camera-title">设置相机视角</h4>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8">
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row style="padding: 0 10px;" class="mapgis-project-feature-edit-set-camera">
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" v-model="featureCopy.camera.orientation.heading" title="方向角"
                         placeholder="请输入方向角"/>
        </mapgis-ui-col>
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" v-model="featureCopy.camera.orientation.pitch" title="俯仰角" placeholder="请输入俯仰角"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-input v-model="featureCopy.camera.orientation.roll" title="滚动角" placeholder="请输入滚动角"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-input v-model="featureCopy.camera.height" title="相机高度" placeholder="请输入滚动角"/>
      </mapgis-ui-row>
      <mapgis-ui-row style="padding: 0 10px;" class="mapgis-project-feature-edit-set-camera">
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" v-model="featureCopy.camera.longLatPosition[0]" title="经度"
                         placeholder="请输入经度"/>
        </mapgis-ui-col>
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" v-model="featureCopy.camera.longLatPosition[1]" title="纬度"
                         placeholder="请输入纬度"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-input v-model="featureCopy.camera.longLatPosition[2]" title="高度" placeholder="请输入高度"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <mapgis-ui-button type="primary" class="mapgis-project-feature-edit-reset-camera">还原视角</mapgis-ui-button>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
import svgIcon from "../img/svgIcon"
import featureInput from "../ui/featureInput"
import featureTextarea from "../ui/featureTextarea"
import featureSelect from "../ui/featureSelect"
import featureIcons from "../ui/featureIcons"
import featureColor from "../ui/featureColor"
import uploadPicture from "../ui/uploadPicture"

export default {
  name: "featureEdit",
  components: {
    "svg-icon": svgIcon,
    "feature-input": featureInput,
    "feature-textarea": featureTextarea,
    "feature-select": featureSelect,
    "feature-icons": featureIcons,
    "upload-picture": uploadPicture,
    "feature-color": featureColor,
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
      },
      deep: true
    },
  },
  created() {
    this.featureCopy = this.feature;
  },
  methods: {
    $_changeColor(color) {
      this.$emit("changeColor",color);
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
.mapgis-project-feature-edit-panel {
  width: 100%;
  height: 836px;
  overflow: hidden;
  overflow-y: scroll;
}

.mapgis-project-feature-edit-panel-head {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgb(95, 99, 104);
}

.mapgis-project-feature-edit-panel-head-left {
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

.mapgis-project-feature-edit-panel-camera {
  width: 400px;
  height: 40px;
  background: rgb(41, 42, 45);
  border-top: 1px solid rgb(56, 57, 61);
  border-bottom: 1px solid rgb(56, 57, 61);
}

.mapgis-project-feature-edit-panel-camera-title {
  color: white;
  text-align: left;
  padding-left: 28px;
  height: 35px;
  line-height: 40px;
}

.mapgis-project-feature-edit-set-camera {
  margin-top: 30px;
}

.mapgis-project-feature-edit-reset-camera {
  width: 344px;
}
</style>