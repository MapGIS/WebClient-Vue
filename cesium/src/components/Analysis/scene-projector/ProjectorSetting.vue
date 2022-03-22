<template>
  <div>
    <slot>
      <div class="mapgis-widget-projector">
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
        <mapgis-ui-group-tab title="数据源" :has-top-margin="false" />
        <div class="projector-style">
          <div v-show="showVideoDiv">
            <mapgis-ui-video
              :width="300"
              :height="200"
              :videoUrl="videoSource.videoUrl"
              :protocol="videoSource.protocol"
              @onPlayerReady="_getPlayer"
            ></mapgis-ui-video>
          </div>
          <img v-show="showImgDiv" :src="imgUrl" :width="300" :height="200" />
          <mapgis-ui-empty
            v-show="!showImgDiv && !showVideoDiv"
            :image="emptyImage"
            :image-style="imageStyle"
            class="empty"
          >
            <span slot="description" class="empty-style">
              请在下方设置数据源
            </span>
          </mapgis-ui-empty>
        </div>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item label="数据类型">
            <mapgis-ui-select v-model="projectorType" :options="projectorTypes">
            </mapgis-ui-select>
          </mapgis-ui-form-item>
          <div v-if="projectorType === 'video'">
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
          </div>
          <div v-else-if="projectorType === 'image'">
            <mapgis-ui-form-item label="图片地址">
              <div class="full-width flex">
                <mapgis-ui-textarea v-model="imgUrl" autoSize allowClear>
                </mapgis-ui-textarea>
                <slot name="imgUpload" :click="updateImgUrl"></slot>
              </div>
            </mapgis-ui-form-item>
          </div>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="摄像头参数"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form
          :label-width="50"
          :wrapper-width="224"
          class="mapgis-ui-setting-form"
        >
          <mapgis-ui-form-item>
            <div slot="label" class="form-label">
              <span>位置</span>
              <mapgis-ui-iconfont
                class="iconfont-btn"
                type="mapgis-target-lock"
                @click="_getCameraPosition"
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
            <div slot="label" class="form-label">
              <span>朝向</span>
              <mapgis-ui-iconfont
                class="iconfont-btn"
                type="mapgis-target-lock"
                @click="_getTargetPosition"
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
          <mapgis-ui-button type="primary" @click="_okClick"
            >确定</mapgis-ui-button
          >
          <mapgis-ui-button @click="_cancelClick">取消</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>
<script>
import VueOptions from "../../Base/Vue/VueOptions";
import emptyImage from "../../../assets/image/empty.png";
import projectorMixins from "./mixins/projector-mixins";

export default {
  name: "mapgis-3d-projector-setting",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [projectorMixins],
  props: {
    ...VueOptions,
    settings: {
      type: Object,
      default: () => {
        return {
          id: "543-123-987-765", // 视频id
          name: "layer2Projector2", // 视频名称
          description: "", //描述
          isProjected: false, // 是否开启视频投放
          params: {
            projectorType: "video", //投放类型[video,image]
            imgUrl: "", // 图片地址
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
        this.scenePro = this.putProjector(this.settingsCopy);
        this._changeProjectorType();
      },
      deep: true,
      immediate: true
    },
    videoSource: {
      handler() {
        this._changeProjector();
      },
      deep: true,
      immediate: true
    },
    imgUrl: {
      handler() {
        this._changeProjector();
      },
      deep: true,
      immediate: true
    },
    projectorType: {
      handler() {
        this._changeProjector();
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
    projectorType: {
      get: function() {
        return this.settingsCopy.params.projectorType;
      },
      set: function(params) {
        this.settingsCopy.params.projectorType = params;
      }
    },
    imgUrl: {
      get: function() {
        return this.settingsCopy.params.imgUrl;
      },
      set: function(params) {
        this.settingsCopy.params.imgUrl = params;
      }
    },
    orientation() {
      return this.settingsCopy.params.orientation;
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
      return !!(
        this.projectorType === "video" &&
        this.videoSource &&
        this.videoSource.videoUrl &&
        this.videoSource.videoUrl.endsWith(`.${this.videoSource.protocol}`)
      );
    },
    showImgDiv() {
      return !!(
        this.projectorType === "image" &&
        this.imgUrl &&
        this.imgUrl !== ""
      );
    }
  },
  data() {
    return {
      settingsCopy: {},
      proType: undefined, //投影类型
      protocols: ["m3u8", "mp4"], // video协议集合
      projectorTypes: [
        { value: "video", label: "视频" },
        { value: "image", label: "图片" }
      ],
      scenePro: undefined, //投放对象
      isGetCameraPosition: false, //是否获取相机位置
      isGetTargetPosition: false, //是否获取视点位置
      emptyImage: emptyImage,
      imageStyle: {
        height: "150px",
        margin: "0 auto"
      },
      modelPrimitive: undefined
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
      });
      this._mouseEvent();
    },
    unmount() {
      this.$emit("unload", this);
      if (!this.settings.isProjected) {
        this.cancelPutProjector(this.settings.id);
      }
    },
    updateImgUrl(url) {
      this.imgUrl = url;
    },
    /**
     * 修改投影类型
     */
    _changeProjectorType() {
      const { projectorType } = this;
      if (projectorType === "image") {
        this.proType = this.Cesium.SceneProjectorType.IMAGE;
      } else if (projectorType === "video") {
        this._changeProtocol();
      }
    },
    /**
     * 修改视频协议
     */
    _changeProtocol() {
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
    _changeProjector() {
      if (!this.scenePro) {
        return;
      }
      this._changeProjectorType();
      switch (this.proType) {
        case Cesium.SceneProjectorType.IMAGE:
          this.scenePro.textureSource = this.imgUrl;
          break;
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
    _getPlayer(val) {
      console.log(val);
      const player = val;
      player.on("loadstart", () => {
        //开始加载
        console.log("loadstart");
      });
      player.on("waiting", () => {
        console.log("waiting");
      });
      player.on("pause", () => {
        console.log("pause");
        if (this.scenePro) {
          this.scenePro.isPaused = true;
        }
      });
      player.on("play", () => {
        console.log("play");
        if (this.scenePro) {
          this.scenePro.isPaused = false;
        }
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
    _getCameraPosition() {
      this.isGetCameraPosition = true;
      this.isGetTargetPosition = false;
    },
    /**
     * 获取朝向按钮事件
     */
    _getTargetPosition() {
      this.isGetTargetPosition = true;
      this.isGetCameraPosition = false;
      this.preHeading = this.params.orientation.heading;
      this.prePitch = this.params.orientation.pitch;
    },
    /**
     * 鼠标事件
     */
    _mouseEvent() {
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
          vm._updateOrientation(heading, pitch);
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
            vm._updateOrientation(heading, pitch);
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
          if (cartesian) {
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
            vm._updateOrientation(preHeading, prePitch);
          }
        }
        vm.isGetTargetPosition = false;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    /**
     * 更新界面投放参数显示
     */
    _updateOrientation(heading, pitch) {
      this.params.orientation.heading = heading;
      this.params.orientation.pitch = pitch;
      this._updateCameraModel();
    },

    _updateCameraModel() {
      if (this.modelPrimitive) {
        const { Cesium, viewer, scenePro, params, modelOffset } = this;
        if (!this.modelPrimitive._boundingSphere) {
          // 说明模型还未加载完
          return;
        }
        const { boundingSphere } = this.modelPrimitive;
        const { heading, pitch } = params.orientation;
        const targetPosition = Cesium.AlgorithmLib.pickFromRay(
          viewer.scene,
          scenePro.viewPosition,
          { heading, pitch, distance: 150 }
        );
        const cameraModelPosition = this._getCameraModelPosition(
          targetPosition,
          scenePro.viewPosition,
          params.orientation,
          boundingSphere.radius
        );
        const modelMatrix = this._getModelMatrix(
          cameraModelPosition,
          params.orientation,
          modelOffset
        );
        this.modelPrimitive.modelMatrix = modelMatrix;
      }
    },
    /**
     * 确定按钮事件
     */
    _okClick() {
      // 退出配置前，先恢复投放状态
      if (!this.settings.isProjected) {
        this.cancelPutProjector(this.settings.id);
      }
      this.$emit("update-settings", this.settingsCopy);
    },
    /**
     * 取消按钮事件
     */
    _cancelClick() {
      // 退出配置前，先恢复投放状态,先取消，再恢复投放状态，以确保投放参数是配置之前的参数
      this.cancelPutProjector(this.settings.id);
      if (this.settings.isProjected) {
        this.putProjector(this.settings);
      }
      this.$emit("cancel");
    }
  }
};
</script>
<style scoped>
.projector-style {
  text-align: center;
  margin-bottom: 12px;
}

.full-width {
  width: 100%;
}

.flex {
  display: flex;
}

.item-left {
  width: 50%;
  padding: 0 2px 0 0;
  float: left;
}

.form-label {
  display: inherit;
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
