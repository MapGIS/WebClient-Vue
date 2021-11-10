<template>
  <div>
    <div v-show="!editFeature">
      <mapgis-ui-row class="mapgis-project-edit-top-tool">
        <mapgis-ui-col span="18" class="mapgis-project-edit-top-left">
          <div @click="$_back" class="mapgis-project-edit-back-container">
            <project-icon type="back" :iconStyle="iconStyle" class="mapgis-project-back"/>
          </div>
        </mapgis-ui-col>
        <mapgis-ui-col span="6">
          <project-icon type="delete"/>
          <project-icon type="more"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="!editTitle" class="mapgis-project-edit-title">
        <mapgis-ui-col span="18">
          <h3 class="mapgis-project-edit-title-value">{{ projectCopy.title }}</h3>
        </mapgis-ui-col>
        <mapgis-ui-col span="6">
          <project-icon id="mpEdit" @click="$_editTitle" class="mapgis-project-edit-edit-icon" type="edit"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="editTitle">
        <mapgis-ui-input id="mpTitle" class="mapgis-project-edit-edit-title" v-model="projectCopy.title"/>
      </mapgis-ui-row>
      <mapgis-ui-row v-show="editTitle">
        <mapgis-ui-textarea id="mpDescription" class="mapgis-project-edit-edit-title mapgis-project-edit-edit-description" v-model="projectCopy.description" placeholder="描述信息"/>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col span="24" class="mapgis-project-edit-new-feature">
          <mapgis-ui-dropdown>
            <mapgis-ui-menu slot="overlay">
              <mapgis-ui-menu-item key="1" @click="$_addPoint">
                添加点
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item key="2">
                添加线
              </mapgis-ui-menu-item>
              <mapgis-ui-menu-item key="3">
                添加多边形
              </mapgis-ui-menu-item>
            </mapgis-ui-menu>
            <mapgis-ui-button type="primary" class="mapgis-project-edit-feature-button"> 新建要素</mapgis-ui-button>
          </mapgis-ui-dropdown>
          <mapgis-ui-button class="mapgis-project-edit-feature-preview">
            预览
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-project-edit-split"></mapgis-ui-row>
      <mapgis-ui-row>
        <feature-row @editFeature="$_editFeature" :features="projectCopy.features"/>
      </mapgis-ui-row>
    </div>
    <div v-show="editFeature">
      <feature-edit :feature="currentFeature"/>
    </div>
  </div>
</template>

<script>
import projectIcon from "./projectIcon"
import featureRow from "./featureRow"
import featureEdit from "./featureEdit"

export default {
  name: "projectEdit",
  components: {
    "project-icon": projectIcon,
    "feature-row": featureRow,
    "feature-edit": featureEdit,
  },
  data() {
    return {
      currentFeature: undefined,
      editFeature: false,
      editTitle: false,
      projectCopy: undefined,
      iconStyle: {
        opacity: 1
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
  created(){
    this.projectCopy = this.project;
  },
  methods: {
    $_editFeature(index){
      this.editFeature = true;
      this.currentFeature = this.projectCopy.features[index];
    },
    $_editTitle() {
      this.editTitle = true;
    },
    $_addPoint() {
      this.projectCopy.features.push({
        "title": "无标题",
        "content": "",
        "containerType": "small",
        "images": "",
        "baseUrl": {
          "type":  "point",
          "geometry": {},
          "properties": {}
        },
        "layerStyle": {
          "show": true
        },
        "camera": {
          "type": "cartesian",
          "latitude": 0,
          "longitude": 0,
          "height": 0,
          "heading": 0,
          "pitch": 0,
          "roll": 0
        }
      });
    },
    $_back() {
      this.$emit("backed");
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