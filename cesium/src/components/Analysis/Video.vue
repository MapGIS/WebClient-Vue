<template>
  <div>
    <slot>
      <div class="mapgis-widget-video">
        <mapgis-ui-group-tab title="视频预览" :has-top-margin="false">
        </mapgis-ui-group-tab>
        <div>
          <video
            :src="urlCopy"
            alt="预览"
            id="video"
            width="300"
            height="200"
          ></video>
        </div>
        <mapgis-ui-group-tab title="视频源设置"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form>
          <mapgis-ui-form-item label="协议类型">
            <mapgis-ui-row>
              <mapgis-ui-col :span="24">
                <mapgis-ui-select v-model="protocol">
                  <mapgis-ui-select-option
                    v-for="item in protocols"
                    :key="item"
                  >
                    {{ item }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="服务地址">
            <mapgis-ui-textarea
              v-model="urlCopy"
              style="width: 100%"
              autosize
              allowClear
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="投放参数设置"></mapgis-ui-group-tab>
        <mapgis-ui-switch-panel
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 16 }"
          layout="horizontal"
          label="摄像头位置"
          :height="'140px'"
        >
          <mapgis-ui-setting-form>
            <mapgis-ui-form-item label="X坐标">
              <mapgis-ui-input-number
                :min="0"
                v-model="positionCopy.x"
                style="width: 100%"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="Y坐标">
              <mapgis-ui-input-number
                :min="0"
                v-model="positionCopy.y"
                style="width: 100%"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="Z坐标">
              <mapgis-ui-input-number
                :min="0"
                v-model="positionCopy.z"
                style="width: 100%"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-setting-form>
        </mapgis-ui-switch-panel>
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="方位角"
          :range="[-180, 180]"
          v-model="headingCopy"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="俯仰角"
          :range="[-180, 180]"
          v-model="pitchCopy"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="翻滚角"
          :range="[-180, 180]"
          v-model="rollCopy"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="水平视角"
          :range="[-180, 180]"
          v-model="horizontalCopy"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="垂直视角"
          :range="[-180, 180]"
          v-model="verticalCopy"
        />
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-video",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    // 模型集合
    protocol: {
      type: String,
      default: "m3u8"
    },
    url: {
      type: String,
      default: ""
    },
    heading: {
      type: Number,
      default: 90
    },
    pitch: {
      type: Number,
      default: 0
    },
    roll: {
      type: Number,
      default: 0
    },
    horizontal: {
      type: Number,
      default: 0
    },
    vertical: {
      type: Number,
      default: 0
    },
    position: {
      type: Object,
      default: () => {
        return { x: 0, y: 0, Z: 0 };
      }
    }
  },
  watch: {
    protocol: {
      handler() {
        this.protocolCopy = this.protocol;
      },
      immediate: true
    },
    url: {
      handler() {
        this.urlCopy = this.url;
      },
      immediate: true
    },
    heading: {
      handler() {
        this.headingCopy = this.heading;
      },
      immediate: true
    },
    pitch: {
      handler() {
        this.pitchCopy = this.pitch;
      },
      immediate: true
    },
    roll: {
      handler() {
        this.rollCopy = this.roll;
      },
      immediate: true
    },
    horizontal: {
      handler() {
        this.horizontalCopy = this.horizontal;
      },
      immediate: true
    },
    vertical: {
      handler() {
        this.verticalCopy = this.vertical;
      },
      immediate: true
    },
    position: {
      handler() {
        this.positionCopy = this.position;
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      protocolCopy: "m3u8",
      urlCopy: "",
      headingCopy: 90,
      pitchCopy: 0,
      rollCopy: 0,
      horizontalCopy: 0,
      verticalCopy: 0,
      positionCopy: { x: 0, y: 0, Z: 0 },
      protocols: ["m3u8", "mp4"]
    };
  },

  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
      });
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.SlopeAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }

      this.$emit("unload", this);
    },
    remove() {}
  }
};
</script>
