<template>
  <div>
    <slot>
      <div class="mapgis-widget-video">
        <mapgis-ui-group-tab title="基本信息"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item label="名称">
            <mapgis-ui-input
              v-model="settingsCopy.name"
              class="full-width"
              allowClear
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="描述">
            <mapgis-ui-textarea
              v-model="settingsCopy.description"
              class="full-width"
              autoSize
              allowClear
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="视频源" :has-top-margin="false" />
        <div class="video-style">
          <mapgis-ui-video
            v-if="showVideoDiv"
            :width="300"
            :height="200"
            :videoUrl="videoSource.videoUrl"
            :protocol="videoSource.protocol"
            @onPlayerReady="getPlayer"
          ></mapgis-ui-video>
          <mapgis-ui-empty
            v-else
            :image="emptyImage"
            :image-style="imageStyle"
            class="empty"
          >
            <span slot="description" class="empty-style">
              请在下方设置视频源
            </span>
          </mapgis-ui-empty>
        </div>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item label="协议类型">
            <mapgis-ui-select v-model="videoSource.protocol">
              <mapgis-ui-select-option v-for="item in protocols" :key="item">
                {{ item }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="服务地址">
            <mapgis-ui-textarea
              v-model="videoSource.videoUrl"
              class="full-width"
              autoSize
              allowClear
            />
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="摄像头参数"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
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
              :step="0.0001"
              v-model.number="params.cameraPosition.x"
            />
            <mapgis-ui-input
              addon-before="Y"
              type="number"
              :min="0"
              :step="0.0001"
              v-model.number="params.cameraPosition.y"
            />
            <mapgis-ui-input
              addon-before="Z"
              type="number"
              :min="0"
              :step="0.0001"
              v-model.number="params.cameraPosition.z"
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
              :step="0.1"
              v-model.number="params.orientation.heading"
              @change="val => onChangeSetting(val.target.value, 'heading')"
            />
            <mapgis-ui-slider
              v-model="params.orientation.heading"
              :min="0"
              :max="360"
              size="small"
              :step="0.1"
              :tooltipVisible="false"
              @change="val => onChangeSetting(val, 'heading')"
            />
            <mapgis-ui-input
              addon-before="俯仰角"
              type="number"
              :min="-90"
              :max="90"
              :step="0.1"
              v-model.number="params.orientation.pitch"
              @change="val => onChangeSetting(val.target.value, 'pitch')"
            />
            <mapgis-ui-slider
              v-model="params.orientation.pitch"
              :min="-90"
              :max="90"
              :step="0.1"
              size="small"
              :tooltipVisible="false"
              @change="val => onChangeSetting(val, 'pitch')"
            />
            <mapgis-ui-input
              addon-before="翻滚角"
              type="number"
              :min="0"
              :max="360"
              :step="0.1"
              v-model.number="params.orientation.roll"
              @change="val => onChangeSetting(val.target.value, 'roll')"
            />
            <mapgis-ui-slider
              v-model="params.orientation.roll"
              :min="0"
              :max="360"
              :step="0.1"
              size="small"
              :tooltipVisible="false"
              @change="val => onChangeSetting(val, 'roll')"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="视角">
            <div class="item-left">
              <mapgis-ui-input
                addon-before="水平"
                type="number"
                :min="0"
                :max="180"
                :step="0.1"
                v-model.number="params.hFOV"
                @change="
                  val => onChangeSetting(val.target.value, 'horizontAngle')
                "
              />
              <mapgis-ui-slider
                v-model="params.hFOV"
                :min="0"
                :max="180"
                :step="0.1"
                size="small"
                :tooltipVisible="false"
                @change="val => onChangeSetting(val, 'horizontAngle')"
              />
            </div>
            <div class="item-right">
              <mapgis-ui-input
                addon-before="垂直"
                type="number"
                :min="0"
                :max="180"
                :step="0.1"
                v-model.number="params.vFOV"
                @change="
                  val => onChangeSetting(val.target.value, 'verticalAngle')
                "
              />
              <mapgis-ui-slider
                v-model="params.vFOV"
                :min="0"
                :max="180"
                :step="0.1"
                size="small"
                :tooltipVisible="false"
                @change="val => onChangeSetting(val, 'verticalAngle')"
              />
            </div>
          </mapgis-ui-form-item>
        </mapgis-ui-setting-form>
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <p class="switch-label">显示锥体线</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="16">
            <mapgis-ui-switch
              class="switch"
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
import emptyImage from "../../../assets/image/empty.png";

export default {
  name: "mapgis-video-setting",
  inject: ["Cesium", "vueCesium", "viewer"],
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
          },
          preHeading: 0,
          prePitch: 0
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
    },
    videoSource: {
      handler() {
        this.changeVideo();
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    id() {
      return this.settingsCopy.id;
    },
    videoSource() {
      return this.settingsCopy.params.videoSource;
    },
    params: {
      get: function() {
        return this.settingsCopy.params;
      },
      set: function(params) {
        this.settingsCopy.params = params;
      }
    },
    showVideoDiv() {
      return this.videoSource.videoUrl.endsWith(
        `.${this.videoSource.protocol}`
      );
    }
  },
  data() {
    return {
      settingsCopy: {},
      proType: undefined, //投影类型
      protocols: ["m3u8", "mp4"], // video协议集合
      scenePro: undefined, //投放对象
      isGetCameraPosition: false, //是否获取相机位置
      isGetTargetPosition: false, //是否获取视点位置
      emptyImage: emptyImage,
      imageStyle: {
        height: "150px",
        margin: "0 auto"
      }
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
      switch (this.videoSource.protocol) {
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
     * 更改视频源参数
     */
    changeVideo() {
      if (!this.scenePro) {
        return;
      }
      this.changeProtocol();
      // this.scenePro.projectorType = this.proType;
      switch (this.proType) {
        case Cesium.SceneProjectorType.IMAGE:
        case Cesium.SceneProjectorType.VIDEO:
        case Cesium.SceneProjectorType.HLS:
          this.scenePro.textureSource = this.videoSource.videoUrl;
          break;
        case Cesium.SceneProjectorType.COLOR:
          this.scenePro.textureSource = new this.Cesium.Color(1, 0, 0, 1);
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
      this.scenePro[tag] = Number(val);
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
      this.preHeading = this.params.orientation.heading;
      this.prePitch = this.params.orientation.pitch;
    },
    changeCameraPosition() {
      const { Cesium, scenePro } = this;
      const { cameraPosition } = this.params;
      const viewPosition = Cesium.Cartographic.toCartesian(
        Cesium.Cartographic.fromDegrees(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        )
      );
      scenePro.viewPosition = viewPosition;
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
            // cartesian.x -= 10;
            vm.scenePro.viewPosition = cartesian;
            const coord = vm._cartesianToDegrees(cartesian);
            const { params } = vm;
            params.cameraPosition.x = coord.lon;
            params.cameraPosition.y = coord.lat;
            params.cameraPosition.z = coord.height;
            const { heading, pitch } = vm.params.orientation;
            //根据相机视点和heading、pitch获取视点位置
            const targetPosition = Cesium.AlgorithmLib.pickFromRay(
              viewer.scene,
              cartesian,
              { heading: heading, pitch: pitch }
            );
            if (targetPosition) {
              if (!vm.scenePro.textureSource) {
                vm.scenePro.textureSource = vm.videoSource.videoUrl;
              }
              vm.scenePro.targetPosition = targetPosition;
            }
          }
          vm.isGetCameraPosition = false;
        } else if (vm.isGetTargetPosition) {
          // vm.scenePro.targetPosition = cartesian;
          const { viewPosition } = vm.scenePro;
          // 根据相机视点和鼠标位置获取heading和pitch
          const { heading, pitch } = vm._getHeadingPitch(
            viewPosition,
            cartesian
          );
          //根据相机视点和heading、pitch获取视点位置
          const targetPosition = Cesium.AlgorithmLib.pickFromRay(
            viewer.scene,
            viewPosition,
            { heading: heading, pitch: pitch }
          );
          if (targetPosition) {
            if (!vm.scenePro.textureSource) {
              vm.scenePro.textureSource = vm.videoSource.videoUrl;
            }
            vm.scenePro.targetPosition = targetPosition;
          }
          vm.updateOrientation(heading, pitch);
          vm.isGetTargetPosition = false;
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
            // vm.scenePro.targetPosition = cartesian;
            const { viewPosition } = vm.scenePro;
            // 根据相机视点和鼠标位置获取heading和pitch
            const { heading, pitch } = vm._getHeadingPitch(
              viewPosition,
              cartesian
            );
            //根据相机视点和heading、pitch获取视点位置
            const targetPosition = Cesium.AlgorithmLib.pickFromRay(
              viewer.scene,
              viewPosition,
              { heading: heading, pitch: pitch }
            );
            if (targetPosition) {
              if (!vm.scenePro.textureSource) {
                vm.scenePro.textureSource = vm.videoSource.videoUrl;
              }
              vm.scenePro.targetPosition = targetPosition;
            }
            vm.updateOrientation(heading, pitch);
          }
        }
        scene.requestRender();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      //鼠标右键取消，恢复到拾取之前的值
      handler.setInputAction(function(movement) {
        if (!vm.scenePro) {
          return;
        }
        if (vm.isGetTargetPosition) {
          const cartesian = viewer.scene.pickPosition(movement.position);
          // console.log(movement.position);
          if (cartesian) {
            //vm.scenePro.targetPosition = cartesian;
            // 恢复初始值
            const { preHeading, prePitch } = vm;
            const { viewPosition } = vm.scenePro;
            //根据相机视点和heading、pitch获取视点位置
            let targetPosition = Cesium.AlgorithmLib.pickFromRay(
              viewer.scene,
              viewPosition,
              { heading: preHeading, pitch: prePitch }
            );
            if (targetPosition) {
              vm.scenePro.targetPosition = targetPosition;
            } else {
              // 如果没有targetPosition，则通过默认设置的距离和朝向参数确定一个targetPosition
              targetPosition = Cesium.AlgorithmLib.pickFromRay(
                viewer.scene,
                viewPosition,
                { heading: preHeading, pitch: prePitch, distance: 150 }
              );
              vm.scenePro.targetPosition = targetPosition;
            }
            vm.updateOrientation(preHeading, prePitch);
          }
        }
        vm.isGetTargetPosition = false;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    /**
     * 更新界面投放参数显示
     */
    updateOrientation(heading, pitch) {
      this.params.orientation.heading = heading;
      this.params.orientation.pitch = pitch;
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
      const { Cesium } = this;
      // 计算heading初始值
      const viewCartographic = Cesium.Cartographic.fromCartesian(viewPosition);
      const longitude = Cesium.Math.toDegrees(viewCartographic.longitude);
      const latitude = Cesium.Math.toDegrees(viewCartographic.latitude);
      const matrix = Cesium.AlgorithmLib.getTransform(
        longitude,
        latitude,
        viewCartographic.height
      );
      const inverseMatrix = Cesium.Matrix4.inverse(
        matrix,
        new Cesium.Matrix4()
      );
      const viewLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        viewPosition,
        new Cesium.Cartesian3()
      );
      const targetLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        targetPosition,
        new Cesium.Cartesian3()
      );
      const r = Cesium.Cartesian3.distance(viewLocal, targetLocal);
      const y = Math.sqrt(Math.pow(r, 2) - Math.pow(targetLocal.z, 2));
      let vectorLeft = Cesium.Cartesian3.subtract(
        new Cesium.Cartesian3(0, y, 0),
        viewLocal,
        new Cesium.Cartesian3()
      );
      const vectorRight = Cesium.Cartesian3.subtract(
        targetLocal,
        viewLocal,
        new Cesium.Cartesian3()
      );
      vectorRight.z = 0;

      let heading = Cesium.Math.toDegrees(
        Cesium.Cartesian3.angleBetween(vectorLeft, vectorRight)
      );
      if (vectorLeft.x * vectorRight.y - vectorRight.x * vectorLeft.y > 0) {
        heading = -heading + 360;
      }
      vectorLeft = new Cesium.Cartesian3(vectorRight.x, vectorRight.y, 0);
      Cesium.Cartesian3.normalize(vectorLeft, vectorLeft);
      vectorRight.z = targetLocal.z;

      let pitch = Cesium.Math.toDegrees(
        Cesium.Cartesian3.angleBetween(vectorLeft, vectorRight)
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
  margin-bottom: 12px;
}

.full-width {
  width: 100%;
}

.item-left {
  width: 50%;
  padding: 0 2px 0 0;
  float: left;
}

.item-right {
  width: 50%;
  padding: 0 0 0 2px;
  float: right;
}

.switch-label {
  font-size: 12px;
}

.switch {
  float: right;
}

.empty {
  border: 1px dashed var(--button-border-default-color);
  border-radius: 4px;
}

.empty-style {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #999999;
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
