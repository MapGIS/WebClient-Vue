<template>
  <div>
    <slot>
      <div class="mapgis-widget-video">
        <mapgis-ui-group-tab title="视频预览" :has-top-margin="false" />
        <div class="video-style">
          <mapgis-video
            :width="300"
            :height="200"
            :videoUrl="paramsCopy.videoSource.videoUrl"
            :protocol="paramsCopy.videoSource.protocol"
            @onPlayerReady="getPlayer"
          ></mapgis-video>
        </div>
        <mapgis-ui-group-tab title="视频源设置"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form>
          <mapgis-ui-form-item label="协议类型">
            <mapgis-ui-select v-model="paramsCopy.videoSource.protocol">
              <mapgis-ui-select-option v-for="item in protocols" :key="item">
                {{ item }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="服务地址">
            <mapgis-ui-textarea
              v-model="paramsCopy.videoSource.videoUrl"
              style="width: 100%"
              autoSize
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
                v-model="paramsCopy.cameraPosition.x"
                style="width: 100%"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="Y坐标">
              <mapgis-ui-input-number
                :min="0"
                v-model="paramsCopy.cameraPosition.y"
                style="width: 100%"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="Z坐标">
              <mapgis-ui-input-number
                :min="0"
                v-model="paramsCopy.cameraPosition.z"
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
          v-model="paramsCopy.orientation.heading"
          @change="val => onChangeSetting(val, 'heading')"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="俯仰角"
          :range="[-180, 180]"
          v-model="paramsCopy.orientation.pitch"
          @change="val => onChangeSetting(val, 'pitch')"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="翻滚角"
          :range="[-180, 180]"
          v-model="paramsCopy.orientation.roll"
          @change="val => onChangeSetting(val, 'roll')"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="水平视角"
          :range="[-180, 180]"
          v-model="paramsCopy.hFOV"
          @change="val => onChangeSetting(val, 'horizontAngle')"
        />
        <mapgis-ui-input-number-panel
          size="small"
          class="mapgis-ui-number-style"
          label="垂直视角"
          :range="[-180, 180]"
          v-model="paramsCopy.vFOV"
          @change="val => onChangeSetting(val, 'verticalAngle')"
        />
        <mapgis-ui-setting-form class="form">
          <mapgis-ui-form-item label="显示锥体线">
            <mapgis-ui-switch
              size="small"
              v-model="paramsCopy.hintLineVisible"
              @change="val => onChangeSetting(val, 'showLine')"
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="addVideo"
            >投放</mapgis-ui-button
          >
          <mapgis-ui-button @click="remove">取消</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>
<script>
import VueOptions from "../../Base/Vue/VueOptions";
import {
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable,
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../../WebGlobe/util";
import MapgisVideo from "./components/Video.vue";

export default {
  name: "mapgis-video-setting",
  inject: ["Cesium", "vueCesium", "viewer"],
  components: { MapgisVideo },
  props: {
    ...VueOptions,
    id: {
      type: String,
      default: ""
    },
    isPubliced: {
      Type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {
        return {
          videoSource: {
            protocol: "mp4", // 视频传输协议
            videoUrl: "http://localhost:8895/video/DJI_0008.mp4" // 视频服务地址
          },
          cameraPosition: { x: 0, y: 0, Z: 0 }, // 相机位置
          orientation: {
            heading: 0, // 方向角
            pitch: 0, // 俯仰角
            roll: 0 // 滚动角
          },
          hFOV: 0, // 水平视场角
          vFOV: 0, // 垂直视场角
          hintLineVisible: true // 是否显示投放区域线
        };
      }
    }
  },
  watch: {
    isPubliced: {
      handler() {
        this.isPublicedCopy = this.isPubliced;
      },
      immediate: true
    },
    params: {
      handler() {
        this.paramsCopy = this.params;
        this.changeProtocol();
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      isPublicedCopy: false,
      paramsCopy: {
        videoSource: {
          protocol: "mp4", // 视频传输协议
          videoUrl: "http://localhost:8895/video/DJI_0008.mp4" // 视频服务地址
        },
        cameraPosition: { x: 0, y: 0, Z: 0 }, // 相机位置
        orientation: {
          heading: 0, // 方向角
          pitch: 0, // 俯仰角
          roll: 0 // 滚动角
        },
        hFOV: 0, // 水平视场角
        vFOV: 0, // 垂直视场角
        hintLineVisible: true // 是否显示投放区域线
      },
      proType: undefined, //投影类型
      protocols: ["m3u8", "mp4"], // video协议集合
      sceneProAction: false, //是否进入鼠标事件函数
      sceneProing: false, //鼠标移动时投放图像是否移动
      scenePro: undefined, //投放对象
      manager: undefined, //视频投放管理对象
      isDepthTestAgainstTerrainEnable: undefined, // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
      //是否开启缓存区
      isLogarithmicDepthBufferEnable: undefined
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
      this.mouseEvent();
      // this.videoEvent();
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.SlopeAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      this.$emit("unload", this);
    },
    changeProtocol() {
      switch (this.paramsCopy.videoSource.protocol) {
        case "m3u8":
          this.proType = this.Cesium.SceneProjectorType.HLS;
          break;
        case "mp4":
          this.proType = this.Cesium.SceneProjectorType.VIDEO;
          break;
        default:
          break;
      }
    },
    getPlayer(val) {
      console.log(val);
      const player = val;
      player.on("loadstart", function() {
        //开始加载
        console.log("loadstart");
      });
      player.on("waiting", function() {
        console.log("waiting");
      });
      player.on("pause", function() {
        console.log("pause");
      });
      player.on("play", function() {
        console.log("play");
      });
    },
    addVideo() {
      this.remove();
      this._openSceneSetting();
      this.manager = this.viewer.scene.visualAnalysisManager;
      this.scenePro = new this.Cesium.SceneProjector(this.proType);
      this.scenePro.id = this.id;
      this.manager.add(this.scenePro);
      this.isPublicedCopy = true;
      this.sceneProAction = true;
    },
    onChangeSetting(val, tag) {
      console.log(val, tag);
      this.scenePro[tag] = val;
    },
    remove() {
      const scenePro = this.viewer.scene.visualAnalysisManager._visualAnalysisList.find(
        item => item.id === this.id
      );
      if (scenePro) {
        this.viewer.scene.visualAnalysisManager.remove(scenePro);
      }

      this._restoreSceneSetting();
    },
    /**
     * video各事件
     */
    videoEvent() {
      const video = document.getElementById("video-preview");
      const vm = this;
      video.addEventListener("play", function() {
        if (vm.scenePro) {
          vm.scenePro.isPaused = false;
          vm.scenePro.videoCurrentTime = video.currentTime;
        }
      });
      video.addEventListener("playing", function() {});
      video.addEventListener("waiting", function() {});
      video.addEventListener("pause", function() {
        if (vm.scenePro) {
          vm.scenePro.isPaused = true;
        }
      });
      video.addEventListener("ended", function() {});
    },
    /**
     * 鼠标事件
     */
    mouseEvent() {
      const { Cesium, viewer } = this;
      const { scene } = viewer;
      const vm = this;
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      //鼠标左击
      handler.setInputAction(function(movement) {
        if (vm.sceneProAction) {
          const cartesian = viewer.scene.pickPosition(movement.position);
          if (cartesian !== undefined && !vm.sceneProing) {
            // cartesian.z += 0.08;
            cartesian.x -= 10;
            vm.scenePro.viewPosition = cartesian;
            switch (vm.proType) {
              case Cesium.SceneProjectorType.IMAGE:
              case Cesium.SceneProjectorType.VIDEO:
              case Cesium.SceneProjectorType.HLS:
                //仅支持 m3u8形式的链接, 因为需要逐帧将图片渲染到canvas上去
                vm.scenePro.textureSource = vm.paramsCopy.videoSource.videoUrl;
                break;
              case Cesium.SceneProjectorType.COLOR:
                vm.scenePro.textureSource = new Cesium.Color(1, 0, 0, 1);
                break;
              default:
                break;
            }
          } else {
            vm.scenePro.targetPosition = cartesian;
            vm.sceneProAction = false;
          }
          vm.sceneProing = true;
        }
        scene.requestRender();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      //鼠标移动
      handler.setInputAction(function(movement) {
        if (vm.sceneProing) {
          const cartesian = viewer.scene.pickPosition(movement.endPosition);
          if (cartesian !== undefined) {
            vm.scenePro.targetPosition = cartesian;
          }
        }
        scene.requestRender();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      //鼠标右键结束
      handler.setInputAction(function(movement) {
        if (vm.sceneProing) {
          const cartesian = viewer.scene.pickPosition(movement.position);
          // console.log(movement.position);
          if (cartesian) {
            vm.scenePro.targetPosition = cartesian;
          }
        }
        vm.sceneProAction = false;
        vm.sceneProing = false;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    /**
     * 设置depthTestAgainstTerrain和logarithmicDepthBuffer
     */
    _openSceneSetting() {
      const { viewer } = this;
      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
        viewer
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, viewer);
      }
      //缓存区设置
      this.isLogarithmicDepthBufferEnable = isLogarithmicDepthBufferEnable(
        viewer
      );
      if (
        navigator.userAgent.indexOf("Linux") > 0 &&
        navigator.userAgent.indexOf("Firefox") > 0
      ) {
        setLogarithmicDepthBufferEnable(false, viewer);
      } else {
        // 其他浏览器还是设置为true，不然会导致分析结果不正确
        setLogarithmicDepthBufferEnable(true, viewer);
      }
    },
    /**
     * 恢复depthTestAgainstTerrain和logarithmicDepthBuffer设置
     */
    _restoreSceneSetting() {
      const { viewer } = this;
      if (
        this.isDepthTestAgainstTerrainEnable !== undefined &&
        this.isDepthTestAgainstTerrainEnable !==
          isDepthTestAgainstTerrainEnable(viewer)
      ) {
        setDepthTestAgainstTerrainEnable(
          this.isDepthTestAgainstTerrainEnable,
          viewer
        );
      }
      if (
        this.isLogarithmicDepthBufferEnable !== undefined &&
        this.isLogarithmicDepthBufferEnable !==
          isLogarithmicDepthBufferEnable(viewer)
      ) {
        setLogarithmicDepthBufferEnable(
          this.isLogarithmicDepthBufferEnable,
          viewer
        );
      }
    }
  }
};
</script>
<style scoped>
.mapgis-widget-video {
  max-height: calc(50vh);
  overflow-y: auto;
}
.roaming-action {
  width: calc(50% - 4px);
}
.video-style {
  text-align: center;
}
.form {
  padding: 10px;
}
</style>
