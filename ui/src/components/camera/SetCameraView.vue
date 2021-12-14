<template>
  <div>
    <mapgis-ui-row v-if="showTitle" class="mapgis-ui-set-camera-panel-camera">
      <mapgis-ui-col :span="24">
        <h4 class="mapgis-ui-set-camera-panel-camera-title">
          <mapgis-ui-title-icon/>
          设置相机视角
        </h4>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="showButton" class="mapgis-ui-set-camera-set-camera" style="text-align: center;">
      <mapgis-ui-button @click="$_click" type="primary" class="mapgis-ui-set-camera-reset-camera-get">
        获取当前视角
      </mapgis-ui-button>
    </mapgis-ui-row>
    <div class="mapgis-ui-set-camera-set-camera-content">
      <mapgis-ui-mix-row
          title="方向角"
          type="MapgisUiInput"
          v-model="cameraCopy.heading"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          title="俯仰角"
          type="MapgisUiInput"
          v-model="cameraCopy.pitch"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          title="滚动角"
          type="MapgisUiInput"
          v-model="cameraCopy.roll"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          title="经度"
          type="MapgisUiInput"
          v-model="cameraCopy.positionCartographic.longitude"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          title="纬度"
          type="MapgisUiInput"
          v-model="cameraCopy.positionCartographic.latitude"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          title="高度"
          type="MapgisUiInput"
          v-model="cameraCopy.positionCartographic.height"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-set-camera-view",
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
      formStyle: {
        marginBottom: "-4px",
      },
      mainStyle: {
        height: "32px",
        width: "178px",
      },
      titleStyle: {
        paddingLeft: "12px"
      }
    }
  },
  props: {
    camera: {
      type: Object
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    },
    enableModel: {
      type: Boolean,
      default: true
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
    cameraCopy: {
      handler: function () {
        if (this.enableModel) {
          this.$emit("change", this.cameraCopy);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.cameraCopy = Object.assign(this.cameraCopy, this.camera);
  },
  methods: {
    $_click() {
      this.$emit("click");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-set-camera-set-camera {
  width: 99%;
}

.mapgis-ui-set-camera-panel-camera {
  margin-top: 6px;
}

.mapgis-ui-set-camera-panel-camera-title {
  margin-bottom: 4px;
  padding-left: 12px;
}

.mapgis-ui-set-camera-set-camera-content {
  width: 100%;
  height: 262px;
  border-radius: 3px;
  padding-top: 1px;
}

.mapgis-ui-set-camera-reset-camera-get {
  width: 100%;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #0081E2;
  border-radius: 3px;
  font-size: 14px;
  color: #0081E2;
  margin-bottom: 10px;
}
</style>