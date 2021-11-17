<template>
  <div class="mapgis-ui-hover-edit-panel">
    <mapgis-ui-row class="mapgis-ui-hover-edit-panel-title">
      <mapgis-ui-col span="18">
        <h2 class="mapgis-ui-hover-edit-panel-title-value">保存至项目</h2>
      </mapgis-ui-col>
      <mapgis-ui-col span="6">
        <mapgis-ui-svg-icon @click="$_close" style="margin-left: 32px" type="close"/>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-input-outline :inputStyle="inputStyle" @change="$_titleChange" placeholder="请输入标题"/>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-select class="mapgis-ui-hover-edit-panel-select" :default-value="projects[0].title">
        <mapgis-ui-select-option v-for="(project,index) in projects" :key="index" :value="project.title">
          {{ project.title }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-col span="12">
        <mapgis-ui-button class="mapgis-project-hover-go-edit">
          前往编辑
        </mapgis-ui-button>
      </mapgis-ui-col>
      <mapgis-ui-col span="12">
        <mapgis-ui-button @click="$_close" type="primary" class="mapgis-project-hover-save">
          保存
        </mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-hover-edit-panel",
  props: {
    projects: {
      type: Array,
      default() {
        return [{
          title: "测试1",
          url: "",
          type: "normal",
          show: true,
        }, {
          title: "测试2",
          url: "",
          type: "normal",
          show: true,
        }, {
          title: "测试3",
          url: "",
          type: "favourite",
          show: true,
        }]
      }
    }
  },
  data() {
    return {
      inputStyle: {
        width: "320px"
      }
    }
  },
  methods: {
    $_titleChange(value) {
      this.$emit("titleChanged", value);
    },
    $_close() {
      this.$emit("closeHoverPanel");
    }
  }
}
</script>

<style>
.mapgis-ui-hover-edit-panel {
  position: absolute;
  width: 360px;
  height: 255px;
  top: 200px;
  left: 780px;
  background: rgb(32, 33, 36);
  z-index: 1;
  border-radius: 10px;
  -webkit-box-shadow: #666 0 0 10px;
  -moz-box-shadow: #666 0 0 10px;
  box-shadow: #666 0 0 10px;
}

.mapgis-ui-hover-edit-panel-title-value {
  margin-top: 12px;
  padding: 0 12px 0 20px;
  text-align: left;
}

.mapgis-ui-hover-edit-panel-title-value {
  color: white;
  font-weight: bold;
}

.mapgis-ui-hover-edit-panel-select {
  width: 89%;
  margin-top: 14px !important;
}

.mapgis-ui-hover-edit-panel-select > div {
  height: 54px;
}

.mapgis-ui-hover-edit-panel-select > div > div {
  height: 54px;
  line-height: 54px;
  font-size: 18px;
}

.mapgis-project-hover-go-edit {
  color: white !important;
  width: 172px;
  height: 36px !important;
  margin-top: 14px !important;
  margin-left: 19px !important;
}

.mapgis-project-hover-save {
  color: white !important;
  width: 135px;
  height: 36px !important;
  margin-top: 14px !important;
}
</style>