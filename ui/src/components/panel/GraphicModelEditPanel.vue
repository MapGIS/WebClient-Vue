<template>
  <div class="mapgis-ui-graphic-model-edit-panel">
    <mapgis-ui-setting-form
      :layout="layout"
      size="default"
      class="mapgis-ui-setting-form"
    >
      <mapgis-ui-form-item>
        <mapgis-ui-group-tab
          title="位置"
          :isTitleBold="false"
          :hasTopMargin="false"
          :hasBottomMargin="false"
        >
          <mapgis-ui-tooltip slot="handle" title="鼠标点选">
            <mapgis-ui-iconfont
              :class="isPickCoords ? 'iconfont-btn btn-active' : 'iconfont-btn'"
              type="mapgis-map"
              @click="$_pickCoords"
            />
          </mapgis-ui-tooltip>
          <mapgis-ui-tooltip slot="handle" title="编辑">
            <mapgis-ui-iconfont
              :class="
                isEditPositions ? 'iconfont-btn btn-active' : 'iconfont-btn'
              "
              type="mapgis-edit"
              @click="$_editPositions"
            />
          </mapgis-ui-tooltip>
          <mapgis-ui-tooltip slot="handle" title="定位">
            <mapgis-ui-iconfont
              class="iconfont-btn"
              type="mapgis-target-lock"
              @click="$_location"
            />
          </mapgis-ui-tooltip>
        </mapgis-ui-group-tab>
        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-input-number-addon
              :min="0"
              :step="0.0001"
              v-model.number="selfPositions.lng"
            >
              <mapgis-ui-tooltip slot="addonBefore" title="X">
                <mapgis-ui-iconfont type="mapgis-xzhouyidong" />
              </mapgis-ui-tooltip>
            </mapgis-ui-input-number-addon>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input-number-addon
              :min="0"
              :step="0.0001"
              v-model.number="selfPositions.lat"
            >
              <mapgis-ui-tooltip slot="addonBefore" title="Y">
                <mapgis-ui-iconfont type="mapgis-yzhouyidong" />
              </mapgis-ui-tooltip>
            </mapgis-ui-input-number-addon>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12" style="paddingTop:8px;">
            <mapgis-ui-input-number-addon
              :min="0"
              :step="0.0001"
              v-model.number="selfPositions.alt"
            >
              <mapgis-ui-tooltip slot="addonBefore" title="Z">
                <mapgis-ui-iconfont type="mapgis-Zzhouyidong" />
              </mapgis-ui-tooltip>
            </mapgis-ui-input-number-addon>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item>
        <mapgis-ui-group-tab
          title="朝向"
          :isTitleBold="false"
          :hasTopMargin="false"
          :hasBottomMargin="false"
        >
          <mapgis-ui-tooltip slot="handle" title="编辑">
            <mapgis-ui-iconfont
              :class="
                isEditOrientation ? 'iconfont-btn btn-active' : 'iconfont-btn'
              "
              type="mapgis-edit"
              @click="$_editOrientation"
            />
          </mapgis-ui-tooltip>
          <mapgis-ui-tooltip slot="handle" title="重置">
            <mapgis-ui-iconfont
              class="iconfont-btn"
              type="mapgis-redo"
              @click="$_resetOrientation"
            />
          </mapgis-ui-tooltip>
        </mapgis-ui-group-tab>
        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-input-number-addon
              :min="0"
              :max="360"
              :step="0.1"
              v-model.number="selfOrientation.heading"
            >
              <mapgis-ui-tooltip slot="addonBefore" title="方位角">
                <mapgis-ui-iconfont type="mapgis-fangwei" />
              </mapgis-ui-tooltip>
            </mapgis-ui-input-number-addon>
            <mapgis-ui-slider
              v-model="selfOrientation.heading"
              :min="0"
              :max="360"
              size="small"
              :step="0.1"
              :tooltipVisible="false"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-input-number-addon
              :min="-90"
              :max="90"
              :step="0.1"
              v-model.number="selfOrientation.pitch"
            >
              <mapgis-ui-tooltip slot="addonBefore" title="俯仰角">
                <mapgis-ui-iconfont type="mapgis-fushi" />
              </mapgis-ui-tooltip>
            </mapgis-ui-input-number-addon>
            <mapgis-ui-slider
              v-model="selfOrientation.pitch"
              :min="-90"
              :max="90"
              :step="0.1"
              size="small"
              :tooltipVisible="false"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="12" style="paddingTop:8px;">
            <mapgis-ui-input-number-addon
              :min="0"
              :max="360"
              :step="0.1"
              v-model.number="selfOrientation.roll"
            >
              <mapgis-ui-tooltip slot="addonBefore" title="翻滚角">
                <mapgis-ui-iconfont type="mapgis-Zzhouxuanzhuan" />
              </mapgis-ui-tooltip>
            </mapgis-ui-input-number-addon>
            <mapgis-ui-slider
              v-model="selfOrientation.roll"
              :min="0"
              :max="360"
              :step="0.1"
              size="small"
              :tooltipVisible="false"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-graphic-model-edit-panel",
  props: {
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    graphicId: {
      type: String,
      default: null
    },
    positions: {
      type: Object,
      default: () => {
        return {
          lng: 0,
          lat: 0,
          alt: 0
        };
      }
    },
    orientation: {
      type: Object,
      default: () => {
        return {
          heading: 0,
          pitch: 0,
          rolling: 0
        };
      }
    }
  },
  computed: {
    selfPositions: {
      get() {
        return this.positions;
      },
      set() {
        this.$emit("update-positions", this.selfPositions);
      }
    },
    selfOrientation: {
      get() {
        return this.orientation;
      },
      set() {
        this.$emit("update-orientation", this.selfOrientation);
      }
    }
  },
  data() {
    return {
      isPickCoords: false,
      isEditPositions: false,
      isEditOrientation: false
    };
  },
  methods: {
    $_pickCoords() {
      this.isPickCoords = !this.isPickCoords;
      this.isEditPositions = false;
      this.isEditOrientation = false;
      this.$emit("pickCoords", this.isPickCoords);
    },
    $_editPositions() {
      this.isPickCoords = false;
      this.isEditPositions = !this.isEditPositions;
      this.isEditOrientation = false;
      this.$emit("editPositions", this.isEditPositions);
    },
    $_location() {
      this.isPickCoords = false;
      this.isEditPositions = false;
      this.isEditOrientation = false;
      this.$emit("location");
    },
    $_editOrientation() {
      this.isPickCoords = false;
      this.isEditPositions = false;
      this.isEditOrientation = !this.isEditOrientation;
      this.$emit("editOrientation", this.isEditOrientation);
    },
    $_resetOrientation() {
      this.selfOrientation = {
        heading: 0,
        pitch: 0,
        roll: 0
      };
      this.isPickCoords = false;
      this.isEditPositions = false;
      this.isEditOrientation = false;
      this.$emit("resetOrientation");
    }
  }
};
</script>

<style scoped>
.mapgis-ui-graphic-model-edit-panel {
  padding: 0 10px;
}

.iconfont-btn {
  padding: 0 5px;
  font-size: 16px;
  color: var(--text-color);
  background-color: transparent;
  border-color: var(--button-border-default-color);
}

.btn-active {
  color: var(--primary-color);
}
</style>
