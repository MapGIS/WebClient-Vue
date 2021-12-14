<template>
  <div>
    <slot>
      <div class="mapgis-widget-video">
        <mapgis-ui-group-tab title="基本信息"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          style="padding: 0 10px"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item label="名称">
            <mapgis-ui-input
              v-model="settingsCopy.name"
              style="width: 100%"
              allowClear
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="描述">
            <mapgis-ui-textarea
              v-model="settingsCopy.description"
              style="width: 100%"
              autoSize
              allowClear
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="视频源" :has-top-margin="false" />
        <div class="video-style" style="margin-bottom:12px">
          <mapgis-video
            :width="300"
            :height="200"
            :videoUrl="params.videoSource.videoUrl"
            :protocol="params.videoSource.protocol"
            @onPlayerReady="getPlayer"
          ></mapgis-video>
        </div>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          style="padding: 0 10px"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item label="协议类型">
            <mapgis-ui-select v-model="params.videoSource.protocol">
              <mapgis-ui-select-option v-for="item in protocols" :key="item">
                {{ item }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="服务地址">
            <mapgis-ui-textarea
              v-model="params.videoSource.videoUrl"
              style="width: 100%"
              autoSize
              allowClear
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="摄像头参数"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          style="padding: 0 10px"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item>
            <div slot="label">
              <span>位置</span>
              <mapgis-ui-iconfont
                class="iconfont-btn"
                type="mapgis-target-lock"
                @click="addVideo"
              ></mapgis-ui-iconfont>
            </div>
            <mapgis-ui-input
              addon-before="X"
              type="number"
              :min="0"
              v-model="params.cameraPosition.x"
            />
            <mapgis-ui-input
              addon-before="Y"
              type="number"
              :min="0"
              v-model="params.cameraPosition.y"
            />
            <mapgis-ui-input
              addon-before="Z"
              type="number"
              :min="0"
              v-model="params.cameraPosition.z"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item>
            <div slot="label">
              <span>朝向</span>
              <mapgis-ui-iconfont
                class="iconfont-btn"
                type="mapgis-target-lock"
                @click="addVideo"
              ></mapgis-ui-iconfont>
            </div>
            <mapgis-ui-input
              addon-before="方位角"
              type="number"
              :min="0"
              :max="360"
              v-model="params.orientation.heading"
              @change="val => onChangeSetting(val, 'heading')"
            />
            <mapgis-ui-slider
              v-model="params.orientation.heading"
              :min="0"
              :max="360"
              size="small"
              :tooltipVisible="false"
              @change="val => onChangeSetting(val, 'heading')"
            />
            <mapgis-ui-input
              addon-before="俯仰角"
              type="number"
              :min="-90"
              :max="90"
              v-model="params.orientation.pitch"
              @change="val => onChangeSetting(val, 'pitch')"
            />
            <mapgis-ui-slider
              v-model="params.orientation.pitch"
              :min="-90"
              :max="90"
              size="small"
              :tooltipVisible="false"
              @change="val => onChangeSetting(val, 'pitch')"
            />
            <mapgis-ui-input
              addon-before="翻滚角"
              type="number"
              :min="0"
              :max="360"
              v-model="params.orientation.roll"
              @change="val => onChangeSetting(val, 'roll')"
            />
            <mapgis-ui-slider
              v-model="params.orientation.roll"
              :min="0"
              :max="360"
              size="small"
              :tooltipVisible="false"
              @change="val => onChangeSetting(val, 'roll')"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="视角">
            <div :style="{ width: '50%', padding: '0 2px 0 0', float: 'left' }">
              <mapgis-ui-input
                addon-before="水平"
                type="number"
                :min="0"
                :max="180"
                v-model="params.hFOV"
                @change="val => onChangeSetting(val, 'horizontAngle')"
              />
              <mapgis-ui-slider
                v-model="params.hFOV"
                :min="0"
                :max="180"
                size="small"
                :tooltipVisible="false"
                @change="val => onChangeSetting(val, 'horizontAngle')"
              />
            </div>
            <div
              :style="{ width: '50%', padding: '0 0 0 2px', float: 'right' }"
            >
              <mapgis-ui-input
                addon-before="垂直"
                type="number"
                :min="0"
                :max="180"
                v-model="params.vFOV"
                @change="val => onChangeSetting(val, 'verticalAngle')"
              />
              <mapgis-ui-slider
                v-model="params.vFOV"
                :min="0"
                :max="180"
                size="small"
                :tooltipVisible="false"
                @change="val => onChangeSetting(val, 'verticalAngle')"
              />
            </div>
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-row style="padding:0 10px">
          <mapgis-ui-col :span="8">
            <p style="font-size:12px">显示锥体线</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-switch
              style="float:right"
              size="small"
              v-model="params.hintLineVisible"
              @change="val => onChangeSetting(val, 'showLine')"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="okClick"
            >确定</mapgis-ui-button
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
    settings: {
      type: Object,
      default: () => {
        return {
          id: "543-123-987-765", // 视频id
          name: "layer2Video2", // 视频名称
          description: "", //描述
          isPut: false, // 是否开启视频投放
          params: {
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
            hFOV: 15, // 水平视场角
            vFOV: 15, // 垂直视场角
            hintLineVisible: true // 是否显示投放区域线
          }
        };
      }
    }
  },
  watch: {
    settings: {
      handler() {
        this.settingsCopy = this.settings;
        this.changeProtocol();
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    id() {
      return this.settingsCopy.id;
    },
    params: {
      get: function() {
        return this.settingsCopy.params;
      },
      set: function(params) {
        this.settingsCopy.params = params;
      }
    }
  },
  data() {
    return {
      settingsCopy: {},
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
      switch (this.params.videoSource.protocol) {
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
      this.sceneProAction = true;
    },
    onChangeSetting(val, tag) {
      console.log(val, tag);
      this.scenePro[tag] = val;
    },
    remove() {
      this.viewer.scene.visualAnalysisManager.removeByID(this.id);
      this._restoreSceneSetting();
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
                vm.scenePro.textureSource = vm.params.videoSource.videoUrl;
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
          const coord = vm._cartesianToDegrees(cartesian);
          const { params } = vm;
          params.cameraPosition.x = coord.lon;
          params.cameraPosition.y = coord.lat;
          params.cameraPosition.z = coord.height;
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
            const coord = vm._cartesianToDegrees(cartesian);
            const { params } = vm;
            params.orientation.heading = vm.scenePro.heading;
            params.orientation.pitch = vm.scenePro.pitch;
            params.orientation.roll = vm.scenePro.roll;
            params.vFOV = vm.scenePro.verticalAngle;
            params.hFOV = vm.scenePro.horizontAngle;
          }
        }
        vm.sceneProAction = false;
        vm.sceneProing = false;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    okClick() {
      this.$emit("update-settings", this.settingsCopy);
    },
    /**
     * @description 世界坐标转经纬度坐标
     * @param cartesian - {Object} 世界坐标
     * @return {Object} 经纬度坐标
     */
    _cartesianToDegrees(cartesian) {
      const { ellipsoid } = this.viewer.scene.globe;
      // 将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      // 将弧度转为度的十进制度表示
      const longitude = this.Cesium.Math.toDegrees(cartographic.longitude); // 转换后的经度
      const latitude = this.Cesium.Math.toDegrees(cartographic.latitude); // 转换后的纬度
      const coor = {
        lon: longitude,
        lat: latitude,
        height: cartographic.height
      };
      return coor;
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
.video-style {
  text-align: center;
}

.iconfont-btn {
  border-radius: 4px;
  margin-top: 3px;
  padding: 3px;
  border: 1px solid var(--primary-5);
  color: var(--text-color);
  background-color: transparent;
  border-color: var(--button-border-default-color);
}

.iconfont-btn:hover,
.iconfont-btn:focus {
  color: var(--primary-5);
  background-color: var(--background);
  border-color: var(--primary-5);
}

::v-deep .mapgis-ui-input {
  padding: 4px 2px;
}
</style>
