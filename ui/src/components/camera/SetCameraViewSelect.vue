<template>
  <div>
    <mapgis-ui-row class="mapgis-ui-set-camera-panel-select">
      <mapgis-ui-col :span="24">
        <h4 class="mapgis-ui-set-camera-panel-select-title" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
          <mapgis-ui-title-icon v-show="showTitleIcon"/>
          <span style="width: 90px;margin-right: 4px">设置相机视角</span>
          <span @click="$_showDetail" class="mapgis-ui-set-camera-panel-select-show-more">
            {{ showDetailTitle }}
          </span>
        </h4>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div class="mapgis-ui-set-camera-set-content">
      <mapgis-ui-select v-model="currentSelect" class="mapgis-ui-set-camera-set-select" @change="$_selectChange">
        <mapgis-ui-select-option :key="index" v-for="(select,index) in selectData" :value="select.key">
          {{ select.value }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
      <mapgis-ui-svg-icon @click="$_click"
                          class="mapgis-ui-set-camera-set-select-icon"
                          :iconStyle="iconStyle"
                          :containerStyle="containerStyle"
                          title="获取视角"
                          type="camera"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-set-camera-view-select",
  data() {
    return {
      cameraCopy: {
        heading: 0,
        pitch: 0,
        roll: 0,
        positionCartographic: {
          longitude: 0,
          latitude: 0,
          height: 0,
        }
      },
      selectData: [{
        key: "当前视角",
        value: "当前视角"
      }],
      currentSelect: "当前视角",
      iconStyle: {
        width: "20px",
        height: "20px",
        marginBottom: "6px"
      },
      containerStyle: {
        border: "1px solid #1890FF",
        textAlign: "center",
        width: "32px",
        height: "32px",
      },
      camerasCopy: [],
      showDetail: false,
      showDetailTitle: "显示详细视角信息",
    }
  },
  props: {
    showTitleIcon: {
      type: Boolean,
      default: true
    },
    camera: {
      type: Object
    },
    cameras: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  model: {
    prop: "camera",
    event: "change"
  },
  watch: {
    camera: {
      handler: function () {
        this.cameraCopy = Object.assign(this.cameraCopy, this.camera);
      },
      deep: true
    },
    cameras: {
      handler: function () {
        this.$_setCameras();
      },
      deep: true
    },
    cameraCopy: {
      handler: function () {
        this.currentSelect = this.cameraCopy.uuid;
        this.$emit("change", this.cameraCopy);
      },
      deep: true
    }
  },
  mounted() {
    this.cameraCopy = Object.assign(this.cameraCopy, this.camera);
    this.$_setCameras();
  },
  methods: {
    setValue(value) {
      this.currentSelect = value;
    },
    $_selectChange(e) {
      let newCamera = {};
      for (let i = 0; i < this.camerasCopy.length; i++) {
        if (this.camerasCopy[i].uuid === e) {
          newCamera.heading = this.camerasCopy[i].heading || 0;
          newCamera.pitch = this.camerasCopy[i].pitch || 0;
          newCamera.roll = this.camerasCopy[i].roll || 0;
          newCamera.uuid = this.camerasCopy[i].uuid;
          if(!this.camerasCopy[i].positionCartographic){
            newCamera.positionCartographic = {
              height: 0,
              latitude: 0,
              longitude: 0
            };
          }else {
            newCamera.positionCartographic = {
              height: this.camerasCopy[i].positionCartographic.height,
              latitude: this.camerasCopy[i].positionCartographic.latitude,
              longitude: this.camerasCopy[i].positionCartographic.longitude
            };
          }
          break;
        }
      }
      this.$emit("selectCamera", this.cameraCopy);
    },
    $_showDetail() {
      this.showDetail = !this.showDetail;
      if (this.showDetail) {
        this.showDetailTitle = "隐藏详细视角信息";
      } else {
        this.showDetailTitle = "显示详细视角信息";
      }
      this.$emit("showDetail", this.showDetail);
    },
    $_setCameras() {
      this.camerasCopy = this.cameras;
      this.selectData = [{
        key: "当前视角",
        value: "当前视角"
      }];
      for (let i = 0; i < this.camerasCopy.length; i++) {
        let title = this.camerasCopy[i].title;
        let uuid = this.camerasCopy[i].uuid;
        this.selectData.push({
          key: uuid,
          value: title
        })
      }
    },
    $_click() {
      this.currentSelect = "当前视角";
      this.$emit("click");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-set-camera-panel-select {
  margin-top: 6px;
}

.mapgis-ui-set-camera-panel-select-title {
  font-weight: bolder;
  margin-top: 3px;
  margin-bottom: 0;
  padding-left: 12px;
}

.mapgis-ui-set-camera-set-content {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 3px;
  text-align: left;
}

.mapgis-ui-set-camera-set-select-icon {
  position: absolute;
  top: 6px;
  right: 2px;
}

.mapgis-ui-set-camera-panel-select-show-more {
  float: right;
  cursor: pointer;
  color: #0081E2;
  width: calc(100% - 90px);
  text-align: right;
}

.mapgis-ui-set-camera-set-select {
  width: calc(100% - 42px);
  margin-left: 0;
  margin-right: 6px;
  margin-top: 6px;
}
</style>