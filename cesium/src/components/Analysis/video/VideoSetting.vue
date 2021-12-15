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
                @click="getCameraPosition"
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
                @click="getTargetPosition"
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
          <mapgis-ui-button @click="cancelClick">取消</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>
<script>
import VueOptions from "../../Base/Vue/VueOptions";
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
          isProjected: false, // 是否开启视频投放
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
        this.settingsCopy = JSON.parse(JSON.stringify(this.settings));
        // 在进入配置界面前，应先投放视频，确保这里能取到值
        this.scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
          this.settingsCopy.id
        );
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
      scenePro: undefined, //投放对象
      isGetCameraPosition: false, //是否获取相机位置
      isGetTargetPosition: false //是否获取视点位置
    };
  },
  mounted() {
    this.mouseEvent();
  },
  methods: {
    /**
     * 修改视频协议
     */
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
    /**
     * 获取播放对象
     */
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
    /**
     * 更改投放设置
     */
    onChangeSetting(val, tag) {
      // console.log(val, tag);
      this.scenePro[tag] = val;
    },
    /**
     * 获取相机位置按钮事件
     */
    getCameraPosition() {
      this.isGetCameraPosition = true;
      this.isGetTargetPosition = false;
    },
    /**
     * 获取朝向按钮事件
     */
    getTargetPosition() {
      this.isGetTargetPosition = true;
      this.isGetCameraPosition = false;
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
        if (!vm.scenePro) {
          return;
        }
        const cartesian = viewer.scene.pickPosition(movement.position);
        if (vm.isGetCameraPosition) {
          if (cartesian !== undefined) {
            // cartesian.z += 0.08;
            cartesian.x -= 10;
            vm.scenePro.viewPosition = cartesian;
            const coord = vm._cartesianToDegrees(cartesian);
            const { params } = vm;
            params.cameraPosition.x = coord.lon;
            params.cameraPosition.y = coord.lat;
            params.cameraPosition.z = coord.height;
          }
          vm.isGetCameraPosition = false;
        } else if (vm.isGetTargetPosition) {
          vm.scenePro.targetPosition = cartesian;
          vm.updateOrientation();
        }
        scene.requestRender();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      //鼠标移动
      handler.setInputAction(function(movement) {
        if (!vm.scenePro) {
          return;
        }
        if (vm.isGetTargetPosition) {
          const cartesian = viewer.scene.pickPosition(movement.endPosition);
          if (cartesian !== undefined) {
            vm.scenePro.targetPosition = cartesian;
            vm.updateOrientation();
          }
        }
        scene.requestRender();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      //鼠标右键结束
      handler.setInputAction(function(movement) {
        if (!vm.scenePro) {
          return;
        }
        if (vm.isGetTargetPosition) {
          const cartesian = viewer.scene.pickPosition(movement.position);
          // console.log(movement.position);
          if (cartesian) {
            vm.scenePro.targetPosition = cartesian;
            vm.updateOrientation();
          }
        }
        vm.isGetTargetPosition = false;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    /**
     * 更新界面投放参数显示
     */
    updateOrientation() {
      const { params } = this;
      params.orientation.heading = this.scenePro.heading;
      params.orientation.pitch = this.scenePro.pitch;
      params.orientation.roll = this.scenePro.roll;
    },
    /**
     * 确定按钮事件
     */
    okClick() {
      this.$emit("update-settings", this.settingsCopy);
    },
    /**
     * 取消按钮事件
     */
    cancelClick() {
      this.$emit("cancel");
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
     * 获取朝向参数
     */
    _getHeadingPitch(viewPosition, targetPosition) {
      // 计算heading初始值
      const viewCartographic = this.Cesium.Cartographic.fromCartesian(
        viewPosition
      );
      const longitude = this.Cesium.CesiumMath.toDegrees(
        viewCartographic.longitude
      );
      const latitude = this.Cesium.CesiumMath.toDegrees(
        viewCartographic.latitude
      );
      const matrix = this.Cesium.AlgorithmLib.getTransform(
        longitude,
        latitude,
        viewCartographic.height
      );
      const inverseMatrix = this.Cesium.Matrix4.inverse(matrix, new Matrix4());
      const viewLocal = this.Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        viewPosition,
        new Cartesian3()
      );
      const targetLocal = this.Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        targetPosition,
        new Cartesian3()
      );
      const r = this.Cesium.Cartesian3.distance(viewLocal, targetLocal);
      const y = Math.sqrt(Math.pow(r, 2) - Math.pow(targetLocal.z, 2));
      const vectorLeft = this.Cesium.Cartesian3.subtract(
        new Cartesian3(0, y, 0),
        viewLocal,
        new Cartesian3()
      );
      const vectorRight = this.Cesium.Cartesian3.subtract(
        targetLocal,
        viewLocal,
        new Cartesian3()
      );
      vectorRight.z = 0;

      const heading = this.Cesium.CesiumMath.toDegrees(
        Cartesian3.angleBetween(vectorLeft, vectorRight)
      );
      if (vectorLeft.x * vectorRight.y - vectorRight.x * vectorLeft.y > 0) {
        heading = -heading + 360;
      }
      vectorLeft = new this.Cesium.Cartesian3(vectorRight.x, vectorRight.y, 0);
      this.Cesium.Cartesian3.normalize(vectorLeft, vectorLeft);
      vectorRight.z = targetLocal.z;

      const pitch = this.Cesium.CesiumMath.toDegrees(
        this.Cesium.Cartesian3.angleBetween(vectorLeft, vectorRight)
      );
      if (targetLocal.z < viewLocal.z) {
        pitch = -pitch;
      }
      const pitchDirection = vectorLeft;
      const result = {
        heading: heading,
        pitch: pitch,
        pitchDirection: pitchDirection
      };
      return result;
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
