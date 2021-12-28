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
            @onPlayerReady="_getPlayer"
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
import {
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable,
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../../WebGlobe/util";

export default {
  name: "mapgis-3d-video-setting",
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
    },
    modelUrl: {
      type: String
    },
    modelOffset: {
      type: Object,
      default: () => {
        return { headingOffset: -90, pitchOffset: 0, rollOffset: 0 };
      }
    },
    modelScale: {
      type: Number,
      default: 1
    }
  },
  watch: {
    settings: {
      handler() {
        this.settingsCopy = JSON.parse(JSON.stringify(this.settings));
        this.putVideo(this.settingsCopy);
        this._changeProtocol();
      },
      deep: true,
      immediate: true
    },
    videoSource: {
      handler() {
        this._changeVideo();
      },
      deep: true,
      immediate: true
    },
    orientation: {
      handler() {
        if (this.modelPrimitive) {
          const { Cesium, viewer, scenePro, params, modelOffset } = this;
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
        this.cancelPutVideo(this.settings.id);
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
    _changeVideo() {
      if (!this.scenePro) {
        return;
      }
      this._changeProtocol();
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
    },
    /**
     * 确定按钮事件
     */
    _okClick() {
      // 退出配置前，先恢复投放状态
      if (!this.settings.isProjected) {
        this.cancelPutVideo(this.settings.id);
      }
      this.$emit("update-settings", this.settingsCopy);
    },
    /**
     * 取消按钮事件
     */
    _cancelClick() {
      // 退出配置前，先恢复投放状态
      if (!this.settings.isProjected) {
        this.cancelPutVideo(this.settings.id);
      }
      this.$emit("cancel");
    },
    /**
     * 投放视频
     */
    putVideo(video) {
      this._openSceneSetting();
      this._addCameraMarker(video, this.modelUrl, this.modelOffset);
      let scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
        video.id
      );
      if (scenePro) {
        this.scenePro = scenePro;
        // 视频已经被投放
        return;
      }
      const { viewer, Cesium } = this;
      const { id, params } = video;
      const proType = this._getProType(video.params.videoSource.protocol);
      scenePro = new Cesium.SceneProjector(proType);
      viewer.scene.visualAnalysisManager.add(scenePro, id);
      switch (proType) {
        case Cesium.SceneProjectorType.IMAGE:
        case Cesium.SceneProjectorType.VIDEO:
        case Cesium.SceneProjectorType.HLS:
          scenePro.textureSource = params.videoSource.videoUrl;
          break;
        case Cesium.SceneProjectorType.COLOR:
          scenePro.textureSource = new Cesium.Color(1, 0, 0, 1);
          break;
        default:
          break;
      }
      const {
        cameraPosition,
        orientation,
        hFOV,
        vFOV,
        hintLineVisible
      } = params;
      const viewPosition = Cesium.Cartographic.toCartesian(
        Cesium.Cartographic.fromDegrees(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        )
      );
      scenePro.viewPosition = viewPosition;
      let targetPosition = Cesium.AlgorithmLib.pickFromRay(
        viewer.scene,
        viewPosition,
        { heading: orientation.heading, pitch: orientation.pitch }
      );
      if (!targetPosition) {
        targetPosition = Cesium.AlgorithmLib.pickFromRay(
          viewer.scene,
          viewPosition,
          {
            heading: orientation.heading,
            pitch: orientation.pitch,
            distance: 150
          }
        );
        scenePro.targetPosition = targetPosition;
      } else {
        scenePro.targetPosition = targetPosition;
      }
      scenePro.roll = orientation.roll;
      scenePro.hintLineVisible = hintLineVisible;
      scenePro.horizontAngle = hFOV;
      scenePro.verticalAngle = vFOV;
      this.scenePro = scenePro;
    },
    /**
     * 取消投放
     */
    cancelPutVideo(id) {
      this.viewer.scene.visualAnalysisManager.removeByID(id);
      this._removeCameraMarker();
    },
    /**
     * 获取相机模型矩阵
     */
    _getModelMatrix(cartesian3Position, orientation, modelOffset) {
      const { Cesium, viewer } = this;
      const { headingOffset, pitchOffset, rollOffset } = modelOffset;
      //弧度的航向分量。
      const heading = Cesium.Math.toRadians(
        orientation.heading + headingOffset
      );
      //弧度的螺距分量。
      const pitch = Cesium.Math.toRadians(orientation.pitch + pitchOffset);
      //滚动分量（以弧度为单位）
      const roll = Cesium.Math.toRadians(orientation.roll + rollOffset);
      //HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        cartesian3Position,
        hpr
      );
      return modelMatrix;
    },
    /**
     * 获取相机模型位置，为确保视频投放(不被相机模型遮挡，需将相机模型往观察点和视点反方向移动)
     */
    _getCameraModelPosition(
      targetPosition,
      viewPosition,
      orientation,
      distance
    ) {
      const { Cesium, viewer, modelOffset } = this;
      const { heading, pitch } = orientation;
      // 根据相机的观察点和视点计算两点的方向，
      // 取反，将相机往计算的反方向移动包围球半径的距离，
      // 确保相机模型不在相机的观察点和视点之间，以防遮挡视频投放(防止视频部分投放在相机模型上)
      let direction = new Cesium.Cartesian3();
      let dist = new Cesium.Cartesian3();
      let position = new Cesium.Cartesian3();
      direction = Cesium.Cartesian3.subtract(
        targetPosition,
        viewPosition,
        direction
      );
      direction = Cesium.Cartesian3.normalize(
        direction,
        new Cesium.Cartesian3()
      );
      dist = Cesium.Cartesian3.multiplyByScalar(
        direction,
        -distance,
        new Cesium.Cartesian3()
      );
      position = Cesium.Cartesian3.add(
        viewPosition,
        dist,
        new Cesium.Cartesian3()
      );
      return position;
    },
    /**
     * 添加相机模型
     */
    _addCameraMarker(video, modelUrl, modelOffset) {
      const { primitives } = this.viewer.scene;
      for (let i = 0; i < primitives.length; i++) {
        const p = primitives.get(i);
        if (p.id === video.id) {
          this.modelPrimitive = p;
          break;
        }
      }
      if (!this.modelPrimitive) {
        const { Cesium, viewer } = this;
        const { id, params } = video;
        const { cameraPosition } = params;
        const viewPosition = Cesium.Cartesian3.fromDegrees(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
        let modelMatrix = this._getModelMatrix(
          viewPosition,
          params.orientation,
          modelOffset
        );
        let modelObj = {
          id,
          url: modelUrl,
          modelMatrix: modelMatrix,
          scale: this.modelScale
        };

        let modelPrimitive = viewer.scene.primitives.add(
          Cesium.Model.fromGltf(modelObj)
        );
        modelPrimitive.readyPromise.then(() => {
          console.log(modelPrimitive);
          // 获取模型的包围球
          const { boundingSphere } = modelPrimitive;
          const cameraModelPosition = this._getCameraModelPosition(
            this.scenePro.targetPosition,
            viewPosition,
            params.orientation,
            boundingSphere.radius
          );
          modelMatrix = this._getModelMatrix(
            cameraModelPosition,
            params.orientation,
            modelOffset
          );

          viewer.scene.primitives.remove(modelPrimitive);

          modelObj = {
            id,
            url: modelUrl,
            modelMatrix: modelMatrix,
            scale: this.modelScale
          };

          this.modelPrimitive = viewer.scene.primitives.add(
            Cesium.Model.fromGltf(modelObj)
          );
        });
      }
    },
    /**
     * 移除相机模型
     */
    _removeCameraMarker() {
      if (this.primitive) {
        this.viewer.scene.primitives.remove(this.primitive);
      }
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
    },
    /**
     * 获取投放视频协议
     */
    _getProType(protocol) {
      let proType;
      switch (protocol) {
        case "m3u8":
          proType = this.Cesium.SceneProjectorType.HLS;
          break;
        case "mp4":
          proType = this.Cesium.SceneProjectorType.VIDEO;
          break;
        default:
          break;
      }
      return proType;
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
