<template>
  <div>
    <div v-show="!editFeature">
      <mapgis-ui-row class="mapgis-project-edit-top-tool">
        <mapgis-ui-col span="18" class="mapgis-project-edit-top-left">
          <div @click="$_back" class="mapgis-project-edit-back-container">
            <svg-icon type="back" :iconStyle="iconStyle" class="mapgis-project-back"/>
          </div>
        </mapgis-ui-col>
        <mapgis-ui-col span="6">
          <svg-icon @click="$_deleteProject" type="delete"/>
          <svg-icon type="more"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="!editTitle" class="mapgis-project-edit-title">
        <mapgis-ui-col span="18">
          <h3 class="mapgis-project-edit-title-value">{{ projectCopy.title }}</h3>
        </mapgis-ui-col>
        <mapgis-ui-col span="6">
          <svg-icon id="mpEdit" @click="$_editTitle" class="mapgis-project-edit-edit-icon" type="edit"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="editTitle">
        <feature-input @change="$_titleChange" title="标题" :inputStyle="inputStyle" id="mpTitle"
                       v-model="projectCopy.title"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="editTitle">
        <feature-textarea @change="$_titleChange" :textareaStyle="textareaStyle" :hasToolBar="false" id="mpDescription"
                          v-model="projectCopy.description" placeholder="描述信息"/>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col span="24" class="mapgis-project-edit-new-feature">
          <mapgis-ui-dropdown>
            <mapgis-ui-menu slot="overlay">
              <mapgis-ui-menu-item key="1" @click="$_addPoint">
                添加点
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item key="2" @click="$_addLine">
                添加线
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item key="3" @click="$_addPolygon">
                添加多边形
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item key="4" @click="$_addRectangle">
                添加矩形
              </mapgis-ui-menu-item>
            </mapgis-ui-menu>
            <mapgis-ui-button type="primary" class="mapgis-project-edit-feature-button"> 新建要素</mapgis-ui-button>
          </mapgis-ui-dropdown>
          <mapgis-ui-button @click="$_projectPreview" class="mapgis-project-edit-feature-preview">
            预览
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-edit-split"></mapgis-ui-row>
      <mapgis-ui-row>
        <feature-row @showFeature="$_showFeature" @deleteFeature="$_deleteFeature" @editFeature="$_editFeature"
                     :features="projectCopy.features"/>
      </mapgis-ui-row>
    </div>
    <div v-show="editFeature">
      <feature-edit @addMap="$_addMap" @changeColor="$_changeColor" @changeIcon="$_changeIcon" @featurePreview="$_featurePreview" @back="$_featureBack" :feature="currentFeature"/>
    </div>
  </div>
</template>

<script>
import svgIcon from "../img/svgIcon"
import featureRow from "../feature/featureRow"
import featureEdit from "../feature/featureEdit"
import featureInput from "../ui/featureInput"
import featureTextarea from "../ui/featureTextarea"

export default {
  name: "projectEdit",
  components: {
    "svg-icon": svgIcon,
    "feature-row": featureRow,
    "feature-edit": featureEdit,
    "feature-input": featureInput,
    "feature-textarea": featureTextarea,
  },
  model: {
    prop: "project",
    event: "change"
  },
  data() {
    return {
      currentFeature: undefined,
      editFeature: false,
      editTitle: false,
      projectCopy: undefined,
      iconStyle: {
        opacity: 1
      },
      textareaStyle: {
        marginBottom: "20px",
        marginLeft: "-14px",
        width: "358px"
      },
      inputStyle: {
        marginBottom: "20px",
        marginLeft: "-14px",
        width: "358px"
      }
    }
  },
  props: {
    project: {
      type: Object,
      default() {
        return {
          "title": "测试1",
          "description": "",
          "features": []
        };
      }
    }
  },
  watch: {
    project: {
      handler: function () {
        this.projectCopy = this.project;
      },
      deep: true
    },
    "project.features": {
      handler: function () {
        this.projectCopy = this.project;
      },
      deep: true
    },
    projectCopy: {
      handler: function () {
        this.$emit("change", this.projectCopy);
      },
      deep: true
    }
  },
  created() {
    this.projectCopy = this.project;
  },
  methods: {
    $_addMap(type, map) {
      this.$emit("addMap", type, map);
    },
    $_changeColor(color) {
      this.$emit("changeColor",color, this.currentFeature.id, this.currentFeature.drawType);
    },
    $_changeIcon(icon) {
      this.$emit("changeIcon", icon, this.currentFeature.id);
    },
    $_showFeature(id, flag) {
      this.$emit("showFeature", id, flag);
    },
    $_projectPreview() {
      this.$emit("projectPreview");
    },
    $_deleteProject() {
      this.$emit("deleteProject");
      this.$_back();
    },
    $_titleChange() {
      this.$emit("titleChanged", {
        title: this.projectCopy.title,
        description: this.projectCopy.description,
      });
    },
    $_editFeature(index) {
      this.editFeature = true;
      this.currentFeature = this.projectCopy.features[index];
    },
    $_editTitle() {
      this.editTitle = true;
    },
    $_getFeature(type) {
      return {
        "title": "无标题",
        "id": type + parseInt(String(Math.random() * 100000000)),
        "content": "",
        "containerType": "small",
        "images": "",
        "layerStyle": {
          "show": true
        },
        "baseUrl": {
          "type": type,
          "geometry": {},
          "properties": {}
        },
        "camera": {
          "type": "cartesian",
          "latitude": 0,
          "longitude": 0,
          "height": 0,
          "heading": 0,
          "pitch": 0,
          "roll": 0,
          "longLatPosition": [0, 0, 0]
        }
      }
    },
    $_addPoint() {
      let feature = this.$_getFeature("point");
      this.$emit("addFeature", {
        type: "point",
        feature: feature
      });
    },
    $_addLine() {
      let feature = this.$_getFeature("polyline");
      this.$emit("addFeature", {
        type: "polyline",
        feature: feature
      });
    },
    $_addPolygon() {
      let feature = this.$_getFeature("polygon");
      this.$emit("addFeature", {
        type: "polygon",
        feature: feature
      });
    },
    $_addRectangle() {
      let feature = this.$_getFeature("polygon");
      this.$emit("addFeature", {
        type: "rectangle",
        feature: feature
      });
    },
    $_back() {
      this.$emit("backed");
    },
    $_featureBack() {
      this.editFeature = false;
    },
    $_featurePreview(feature) {
      this.$emit("featurePreview", feature);
    },
    $_deleteFeature(index) {
      this.projectCopy.features.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.mapgis-project-edit-top-left {
  text-align: left;
  padding-left: 10px;
}

.mapgis-project-edit-back-container {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
  margin-top: 12px;
}

.mapgis-project-back {
  position: absolute;
  top: -13px;
  left: 5px;
}

.mapgis-project-edit-title {
  width: 368px;
  height: 52px;
  margin: 12px 12px 0 20px;
}

.mapgis-project-edit-title-value {
  color: white;
  font-weight: bold;
  text-align: left;
  font-size: 20px;
}

.mapgis-project-edit-edit-icon {
  margin-top: -12px;
  margin-left: 51px;
}

.mapgis-project-edit-new-feature {
  text-align: left;
  padding-left: 14px;
  height: 36px;
}

.mapgis-project-edit-feature-button {
  width: 141px;
  height: 36px;
  margin-right: 10px;
}

.mapgis-project-edit-feature-preview {
  width: 100px;
  height: 36px;
  color: rgb(102, 102, 102);
  font-weight: bold;
  border: 1px solid rgb(102, 102, 102);
}

.mapgis-project-edit-split {
  margin-top: 20px;
  border-bottom: 1px solid #5f6368;
}

.mapgis-project-edit-edit-title {
  font-size: 18px;
  height: 58px;
  width: 352px;
  margin-left: -20px;
  margin-bottom: 20px;
}

.mapgis-project-edit-edit-description {
  height: 152px;
}
</style>