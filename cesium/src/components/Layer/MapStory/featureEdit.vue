<template>
  <div>
    <mapgis-ui-row v-if="feature" class="mapgis-project-feature-edit-panel-head">
      <mapgis-ui-col span="17" class="mapgis-project-feature-edit-panel-head-left">
        <project-icon :icon-style="iconStyle" type="back"/>
      </mapgis-ui-col>
      <mapgis-ui-col span="7">
        <mapgis-ui-button class="mapgis-project-feature-preview">预览</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div v-if="feature" class="mapgis-project-feature-edit-panel">
      <mapgis-ui-row>
        <div class="mapgis-project-feature-edit-panel-image">
          <project-icon :icon-style="iconStyle" type="image"/>
        </div>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <feature-input :value="feature.title" title="标题" placeholder="请输入标题"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-textarea :value="feature.content"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-select title="展示框大小"/>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <feature-icons title="图标"/>
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
          <feature-input :inputStyle="inputStyle" :value="feature.camera.heading" title="方向角" placeholder="请输入方向角"/>
        </mapgis-ui-col>
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" :value="feature.camera.pitch" title="俯仰角" placeholder="请输入俯仰角"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-input :value="feature.camera.roll" title="滚动角" placeholder="请输入滚动角"/>
      </mapgis-ui-row>
      <mapgis-ui-row style="padding: 0 10px;" class="mapgis-project-feature-edit-set-camera">
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" :value="feature.camera.latitude" title="经度" placeholder="请输入经度"/>
        </mapgis-ui-col>
        <mapgis-ui-col span="12">
          <feature-input :inputStyle="inputStyle" :value="feature.camera.longitude" title="纬度" placeholder="请输入纬度"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <feature-input :value="feature.camera.height" title="高度" placeholder="请输入高度"/>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-feature-edit-set-camera">
        <mapgis-ui-button type="primary" class="mapgis-project-feature-edit-reset-camera">还原视角</mapgis-ui-button>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
import projectIcon from "./projectIcon"
import featureInput from "./featureInput"
import featureTextarea from "./featureTextarea"
import featureSelect from "./featureSelect"
import featureIcons from "./featureIcons"

export default {
  name: "featureEdit",
  components: {
    "project-icon": projectIcon,
    "feature-input": featureInput,
    "feature-textarea": featureTextarea,
    "feature-select": featureSelect,
    "feature-icons": featureIcons,
  },
  data() {
    return {
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
  }
}
</script>

<style>
.mapgis-project-feature-edit-panel {
  width: 100%;
  height: 836px;
  overflow: hidden;
  overflow-y: scroll;
  padding-bottom: 20px;
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

.mapgis-project-feature-edit-panel-image {
  width: 344px;
  height: 160px;
  background: rgb(57, 68, 87);
  border-radius: 4px;
  margin: 30px auto;
  padding-top: 50px;
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