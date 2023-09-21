<template>
  <div>
    <slot>
      <div class="mapgis-widget-projector">
        <mapgis-ui-group-tab title="基本信息"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form
          :layout="layout"
          size="default"
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
        <mapgis-ui-group-tab
          title="数据源"
          :hasTopMargin="false"
          :hasBottomMargin="false"
          :isTitleBold="false"
        />
        <div class="projector-style">
          <div v-show="showVideoDiv">
            <div id="projectorVideoContainer" :width="300" :height="200"></div>
            <!-- <mapgis-ui-video
              v-else
              id="demovideo"
              :width="300"
              :height="200"
              :videoUrl="videoSource.videoUrl"
              :protocol="videoSource.protocol"
              autoplay=""
              crossorigin=""
              loop=""
              @onPlayerReady="_getPlayer"
            ></mapgis-ui-video> -->
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
          :layout="layout"
          size="default"
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
                <mapgis-ui-textarea
                  v-model="imgUrl"
                  autoSize
                  allowClear
                  :disabled="disabledImageUrlInput"
                >
                </mapgis-ui-textarea>
                <slot name="imgUpload" :click="updateImgUrl"></slot>
              </div>
            </mapgis-ui-form-item>
          </div>
        </mapgis-ui-setting-form>
        <mapgis-ui-group-tab title="投放方式选择" />
        <mapgis-ui-radio-group
          v-model="renderType"
          class="padding"
          @change="_changeRenderType"
        >
          <mapgis-ui-radio :value="0" :disabled="isEdit && renderType == 1"
            >输入摄像头参数</mapgis-ui-radio
          >
          <mapgis-ui-radio :value="1" :disabled="isEdit && renderType == 0"
            >绘制投放面</mapgis-ui-radio
          >
        </mapgis-ui-radio-group>

        <!-- 摄像头参数方式 -->
        <div v-if="renderType === 0">
          <mapgis-ui-group-tab>
            <span slot="title">
              摄像头参数
              <mapgis-ui-tooltip slot="handle" placement="top">
                <template slot="title">
                  <span>{{ info }}</span>
                </template>
                <mapgis-ui-iconfont type="mapgis-info"></mapgis-ui-iconfont>
              </mapgis-ui-tooltip>
            </span>
          </mapgis-ui-group-tab>
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
                <mapgis-ui-tooltip slot="handle" title="定位">
                  <mapgis-ui-iconfont
                    class="iconfont-btn"
                    type="mapgis-target-lock"
                    @click="_getCameraPosition"
                  />
                </mapgis-ui-tooltip>
              </mapgis-ui-group-tab>
              <mapgis-ui-row :gutter="8">
                <mapgis-ui-col :span="12">
                  <mapgis-ui-input-number-addon
                    :min="0"
                    :step="0.0001"
                    v-model.number="params.cameraPosition.x"
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
                    v-model.number="params.cameraPosition.y"
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
                    v-model.number="params.cameraPosition.z"
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
                <mapgis-ui-tooltip slot="handle" title="定位">
                  <mapgis-ui-iconfont
                    class="iconfont-btn"
                    type="mapgis-target-lock"
                    @click="_getTargetPosition"
                  />
                </mapgis-ui-tooltip>
              </mapgis-ui-group-tab>
              <mapgis-ui-row :gutter="8">
                <mapgis-ui-col :span="12">
                  <mapgis-ui-input-number-addon
                    :min="0"
                    :max="360"
                    :step="0.1"
                    v-model.number="params.orientation.heading"
                    @change="val => onChangeSetting(val, 'heading')"
                  >
                    <mapgis-ui-tooltip slot="addonBefore" title="方位角">
                      <mapgis-ui-iconfont type="mapgis-fangwei" />
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                  <mapgis-ui-slider
                    v-model="params.orientation.heading"
                    :min="0"
                    :max="360"
                    size="small"
                    :step="0.1"
                    :tooltipVisible="false"
                    @change="val => onChangeSetting(val, 'heading')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="12">
                  <mapgis-ui-input-number-addon
                    :min="-90"
                    :max="90"
                    :step="0.1"
                    v-model.number="params.orientation.pitch"
                    @change="val => onChangeSetting(val, 'pitch')"
                  >
                    <mapgis-ui-tooltip slot="addonBefore" title="俯仰角">
                      <mapgis-ui-iconfont type="mapgis-fushi" />
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                  <mapgis-ui-slider
                    v-model="params.orientation.pitch"
                    :min="-90"
                    :max="90"
                    :step="0.1"
                    size="small"
                    :tooltipVisible="false"
                    @change="val => onChangeSetting(val, 'pitch')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="12" style="paddingTop:8px;">
                  <mapgis-ui-input-number-addon
                    :min="0"
                    :max="360"
                    :step="0.1"
                    v-model.number="params.orientation.roll"
                    @change="val => onChangeSetting(val, 'roll')"
                  >
                    <mapgis-ui-tooltip slot="addonBefore" title="翻滚角">
                      <mapgis-ui-iconfont type="mapgis-Zzhouxuanzhuan" />
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                  <mapgis-ui-slider
                    v-model="params.orientation.roll"
                    :min="0"
                    :max="360"
                    :step="0.1"
                    size="small"
                    :tooltipVisible="false"
                    @change="val => onChangeSetting(val, 'roll')"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="视角">
              <mapgis-ui-row :gutter="8">
                <mapgis-ui-col :span="12">
                  <mapgis-ui-input-number-addon
                    :min="0"
                    :max="180"
                    :step="0.1"
                    v-model.number="params.hFOV"
                    @change="val => onChangeSetting(val, 'horizontAngle')"
                  >
                    <mapgis-ui-tooltip slot="addonBefore" title="水平">
                      <mapgis-ui-iconfont type="mapgis-shuiping" />
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                  <mapgis-ui-slider
                    v-model="params.hFOV"
                    :min="0"
                    :max="180"
                    :step="0.1"
                    :tooltipVisible="false"
                    @change="val => onChangeSetting(val, 'horizontAngle')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="12">
                  <mapgis-ui-input-number-addon
                    :min="0"
                    :max="180"
                    :step="0.1"
                    v-model.number="params.vFOV"
                    @change="val => onChangeSetting(val, 'verticalAngle')"
                  >
                    <mapgis-ui-tooltip slot="addonBefore" title="垂直">
                      <mapgis-ui-iconfont type="mapgis-chuizhi" />
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                  <mapgis-ui-slider
                    v-model="params.vFOV"
                    :min="0"
                    :max="180"
                    :step="0.1"
                    size="small"
                    :tooltipVisible="false"
                    @change="val => onChangeSetting(val, 'verticalAngle')"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
          </mapgis-ui-setting-form>
          <mapgis-ui-group-tab
            title="显示锥体线"
            :isTitleBold="true"
            :hasTopMargin="false"
            :hasBottomMargin="false"
            style="paddingBottom:8px;"
          >
            <mapgis-ui-switch
              slot="handle"
              size="small"
              v-model="params.hintLineVisible"
              @change="val => onChangeSetting(val, 'showLine')"
            />
          </mapgis-ui-group-tab>
        </div>

        <mapgis-3d-draw
          @drawCreate="handleDrawCreate"
          @load="handleDrawLoad"
          :drawStyle="drawStyleCopy"
          :enableControl="enableControl"
        >
          <div v-if="renderType === 1" style="margin-top: 7px;">
            <mapgis-ui-group-tab title="绘制投影区域" style="display:inline" />
            <div class="padding_draw">
              <mapgis-ui-tooltip
                v-for="(item, i) in draws"
                :key="i"
                placement="bottom"
              >
                <template slot="title">
                  <span>{{ item.tip }}</span>
                </template>
                <mapgis-ui-button
                  :ghost="true"
                  type="link"
                  @click="item.click"
                  style="margin: 0 -5px;border:none;"
                >
                  <mapgis-ui-iconfont :type="item.icon" theme="filled" />
                </mapgis-ui-button>
              </mapgis-ui-tooltip>
            </div>

            <mapgis-ui-setting-form
              :layout="layout"
              size="default"
              class="mapgis-ui-setting-form"
            >
              <mapgis-ui-form-item label="高度设置">
                <mapgis-ui-select
                  v-model="heightReference"
                  :options="heightReferenceTypes"
                  @change="_heightReferenceTypesChange"
                >
                </mapgis-ui-select>
              </mapgis-ui-form-item>
              <mapgis-ui-form-item
                label="离地高度"
                v-if="heightReference === 1"
              >
                <mapgis-ui-input-number-addon
                  v-model.number="offsetHeight"
                  addon-after="米"
                  :min="0"
                  :step="0.1"
                  @change="_offsetHeightChange"
                />
              </mapgis-ui-form-item>
            </mapgis-ui-setting-form>
          </div>
        </mapgis-3d-draw>
      </div>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button type="primary" @click="_okClick"
          >确定</mapgis-ui-button
        >
        <mapgis-ui-button @click="_cancelClick">取消</mapgis-ui-button>
      </mapgis-ui-setting-footer>
    </slot>
  </div>
</template>
<script>
import VueOptions from "../../Base/Vue/VueOptions";
import { emptyImage } from "../../UI/Base64Image/base64Image";
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
            hintLineVisible: true, // 是否显示投放区域线
            areaCoords: [], // 绘制投放区域方式下存储绘制点位坐标
            renderType: 0,
            heightReference: 2, //是否贴场景选择
            offsetHeight: 5
          },
          preHeading: 0,
          prePitch: 0
        };
      }
    },
    disabledImageUrlInput: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    currentProjectorOverlayLayerId: {
      type: String,
      default: ""
    },
    // 是否是编辑状态进入面板
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    settings: {
      handler() {
        this.settingsCopy = JSON.parse(JSON.stringify(this.settings));
        this.scenePro = this.putProjector(this.settingsCopy);
        this.renderType = this.settingsCopy.params.renderType || 0;
        this.heightReference =
          this.settingsCopy.params.heightReference != undefined
            ? this.settingsCopy.params.heightReference
            : 2;
        this.offsetHeight = this.settingsCopy.params.offsetHeight || 5;
        this._changeProjectorType();
      },
      // deep: true,
      immediate: true
    },
    videoSource: {
      handler() {
        this._changeProjector();
      },
      deep: true,
      immediate: false
    },
    imgUrl: {
      handler() {
        this._changeProjector();
      },
      deep: true,
      immediate: false
    },
    projectorType: {
      handler() {
        this.cancelPutProjector(this.settingsCopy);
        this.scenePro = undefined;
        this._changeProjector();
      },
      deep: true,
      immediate: false
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
    },
    heightReference: {
      get: function() {
        return this.settingsCopy.params.heightReference;
      },
      set: function(params) {
        this.settingsCopy.params.heightReference = params;
      }
    },
    offsetHeight: {
      get: function() {
        return this.settingsCopy.params.offsetHeight;
      },
      set: function(params) {
        this.settingsCopy.params.offsetHeight = params;
      }
    }
  },
  data() {
    return {
      info: "如需投放到地形上,请开启深度检测",
      settingsCopy: {},
      proType: undefined, //投影类型
      protocols: ["m3u8", "mp4"], // video协议集合
      projectorTypes: [
        { value: "video", label: "视频" },
        { value: "image", label: "图片" }
      ],
      // scenePro: undefined, //投放对象
      isGetCameraPosition: false, //是否获取相机位置
      isGetTargetPosition: false, //是否获取视点位置
      emptyImage: undefined,
      imageStyle: {
        height: "150px",
        margin: "0 auto"
      },
      // modelPrimitive: undefined,

      enableControl: false,
      // 绘制矩形颜色
      drawStyleCopy: {
        color: "#FF8C00",
        opacity: 0.6
      },
      draws: [
        {
          icon: "mapgis-huizhijuxing",
          tip: "绘制矩形",
          click: this.drawRectangle
        },
        {
          icon: "mapgis-draw-polygon",
          tip: "绘制多边形",
          click: this.drawPolygon
        }
      ],
      // 离地高度设置
      heightReferenceTypes: [
        { value: 0, label: "使用边界点的高度,仅在绘制区域选择为多边形时生效" },
        {
          value: 1,
          label: "忽略边界点的高度,使用指定的高度"
        },
        { value: 2, label: "贴场景" }
      ],
      // graphic: undefined,
      renderType: 0
      // heightReference: 2,
      // offsetHeight: 5
    };
  },
  mounted() {
    this.mount();
    this.emptyImage = emptyImage();
    this.videoDom = null;
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
        this.cancelPutProjector(this.settings);
        this.scenePro = undefined;
      }
      if (this.drawer) {
        //绘制组件
        this.drawer.unmount();
      }
    },
    _hasGraphic() {
      return (
        !!window.graphicsLayer &&
        !!window.graphicsLayer.getGraphicByID(this.settingsCopy.id + "graphic")
      );
    },
    _getVideoDom() {
      let tempVideoDom;
      if (window.projectorVideoDomMap && window.projectorVideoDomMap[this.id]) {
        const { videoDom, hlsPlayer } = window.projectorVideoDomMap[this.id];
        tempVideoDom = videoDom;
      } else {
        const { protocol, videoUrl } = this.videoSource;
        if (!videoUrl) {
          return null;
        }
        // 创建video元素
        tempVideoDom = this.createVideoElement(protocol, videoUrl, this.id);
      }
      this.videoDom = tempVideoDom;

      this.$nextTick(function() {
        const projectorVideoContainer = document.getElementById(
          "projectorVideoContainer"
        );
        projectorVideoContainer.innerHTML = "";
        tempVideoDom.width = 300;
        tempVideoDom.height = 200;
        tempVideoDom.controls = true;
        projectorVideoContainer.appendChild(tempVideoDom);
      });
    },
    updateImgUrl(url) {
      this.imgUrl = url;
    },
    _changeRenderType(e) {
      this.params.renderType = e.target.value;
      if (e.target.value == 0) {
        this.removeGraphic();
      }
    },
    _heightReferenceTypesChange(e) {
      this.params.heightReference = e;
      // 在绘制完后可以更改贴地模式，编辑状态也可以更改贴地模式
      if (this._hasGraphic()) {
        let graphic = window.graphicsLayer.getGraphicByID(
          this.settingsCopy.id + "graphic"
        );
        switch (e) {
          case 0:
            graphic.style.perPositionHeight = true;
            graphic.style.classificationType = undefined;
            break;
          case 1:
            graphic.style.perPositionHeight = false;
            graphic.style.classificationType = undefined;
            graphic.style.offsetHeight = this.offsetHeight;
            break;
          case 2:
            graphic.style.classificationType = Cesium.ClassificationType.BOTH;
            break;
        }
      }
    },
    _offsetHeightChange(e) {
      this.params.offsetHeight = e;
      if (this._hasGraphic()) {
        let graphic = window.graphicsLayer.getGraphicByID(
          this.settingsCopy.id + "graphic"
        );
        graphic.style.offsetHeight = e;
      }
    },
    _changeDrawProjectorType() {
      if (this._hasGraphic()) {
        let element;
        if (this.projectorType === "image") {
          element = this.imgUrl;
        } else if (this.projectorType === "video") {
          element = this.videoDom;
        }
        const graphic = window.graphicsLayer.getGraphicByID(
          this.settingsCopy.id + "graphic"
        );
        graphic.style.material = Cesium.Material.fromType(
          Cesium.Material.ImageType,
          {
            image: element,
            repeat: new Cesium.Cartesian2(1.0, 1.0)
          }
        );
      }
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
        this._getVideoDom();
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
      this._changeProjectorType();
      // cesium内核目前修改projectorType和projectionSource(除设置undefined会生效)，不生效，只能重新投放
      switch (this.proType) {
        case Cesium.SceneProjectorType.IMAGE:
          if (!this.imgUrl || this.imgUrl.length == 0) {
            // this.scenePro.projectionSource = undefined;
            this.cancelPutProjector(this.settingsCopy);
            this.scenePro = undefined;
          } else {
            if (this.renderType == 1 && this._hasGraphic()) {
              this._changeDrawProjectorType();
            } else {
              if (!this.scenePro) {
                this.scenePro = this.putProjector(this.settingsCopy);
              } else {
                this.scenePro.projectionSource = this.imgUrl;
              }
            }
          }
          break;
        case Cesium.SceneProjectorType.VIDEO:
        case Cesium.SceneProjectorType.HLS:
          const { videoUrl } = this.videoSource;
          if (!videoUrl || videoUrl.length == 0) {
            // this.scenePro.projectionSource = undefined;
            this.cancelPutProjector(this.settingsCopy);
            this.scenePro = undefined;
          } else {
            if (this.renderType == 1 && this._hasGraphic()) {
              // let videoElement = document.getElementById("demovideo_html5_api");
              this._changeDrawProjectorType();
            } else {
              if (!this.scenePro) {
                this.scenePro = this.putProjector(this.settingsCopy);
              } else {
                const { protocol, videoUrl } = this.videoSource;
                const element = this.createVideoElement(
                  protocol,
                  videoUrl,
                  this.id
                );
                this.scenePro.projectionSource = videoUrl;
              }
            }
          }
          break;
        case Cesium.SceneProjectorType.COLOR:
          if (!this.scenePro) {
            this.scenePro = this.putProjector(this.settingsCopy);
          }
          this.scenePro.projectionSource = new this.Cesium.Color(1, 0, 0, 1);
          break;
        default:
          break;
      }
    },
    /**
     * 获取播放对象
     */
    _getPlayer(val) {
      // console.log(val);
      const player = val;
      player.on("loadstart", () => {
        //开始加载
        // console.log("loadstart");
      });
      player.on("waiting", () => {
        // console.log("waiting");
      });
      player.on("pause", () => {
        // console.log("pause");
        if (this.scenePro) {
          this.scenePro.isPaused = true;
        }
      });
      player.on("play", () => {
        // console.log("play");
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
              if (!vm.scenePro.projectionSource) {
                const { protocol, videoUrl } = vm.videoSource;
                const element = vm.createVideoElement(
                  protocol,
                  videoUrl,
                  vm.id
                );
                vm.scenePro.projectionSource = videoUrl;
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
            if (!vm.scenePro.projectionSource) {
              const { protocol, videoUrl } = vm.videoSource;
              const element = vm.createVideoElement(protocol, videoUrl, vm.id);
              vm.scenePro.projectionSource = videoUrl;
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
              if (!vm.scenePro.projectionSource) {
                const { protocol, videoUrl } = vm.videoSource;
                const element = vm.createVideoElement(
                  protocol,
                  videoUrl,
                  vm.id
                );
                vm.scenePro.projectionSource = videoUrl;
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
        } else if (vm.renderType == 1) {
          //绘制模式下监听右键点击获取多边形高度
          const cartesian = viewer.scene.pickPosition(movement.position);
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          vm.graphicHeight = cartographic.height;
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

    //使用3d-draw组建的时候创建的drawer实例，3d-draw组件加载时绑定
    handleDrawLoad(drawer) {
      this.drawer = drawer;
    },
    // 绘制矩形投影面
    drawRectangle() {
      this.removeGraphic();
      if (this.videoSource.videoUrl || this.imgUrl) {
        // 调用draw组件中，绘制矩形
        this.drawer && this.drawer.enableDrawRectangle();
      } else {
        this.$message.error("请先添加数据源");
      }
    },
    // 绘制多边形投影面
    drawPolygon() {
      this.removeGraphic();
      if (this.videoSource.videoUrl || this.imgUrl) {
        this.drawer && this.drawer.enableDrawPolygon();
      } else {
        this.$message.error("请先添加数据源");
      }
    },

    // draw组件的回调函数
    handleDrawCreate(cartesian3, param2) {
      // 绘制矩形只需要两个点
      const { Cesium, viewer } = this;
      const vm = this;
      // 获取坐标系
      const ellipsoid = viewer.scene.globe.ellipsoid;

      // const videoElement = document.getElementById("demovideo_html5_api");

      // 矩形
      if (param2.length === 2) {
        // 获取矩形的位置坐标
        // let lnglatArr = vm.getRectDegrees(param2[0], param2[1]);
        // 这里需要将笛卡尔坐标转换为经纬度坐标
        let lnglatArr1 = vm.cartesian3ToLngLat(cartesian3[0]);
        let lnglatArr2 = vm.cartesian3ToLngLat(cartesian3[1]);
        vm.params.areaCoords = [lnglatArr1, lnglatArr2];
        let type = "rectangle";
        vm.params.areaType = type;
        let position = cartesian3;
        vm.graphic = vm.createGraphic(type, position, this.settingsCopy);
        window.graphicsLayer.addGraphic(vm.graphic);
      } else {
        // 多边形
        // let degreeArr = vm.getPolygonDegrees(param2);
        // vm.params.areaCoords = param2;
        const areaCoords = [];
        let type = "polygon";
        vm.params.areaType = type;
        let position = [];
        for (let i = 0; i < param2.length; i++) {
          param2[i][2] = vm.graphicHeight;
          areaCoords.push(param2[i]);
          position.push(
            Cesium.Cartesian3.fromDegrees(
              param2[i][0],
              param2[i][1],
              param2[i][2],
              ellipsoid
            )
          );
        }
        vm.params.areaCoords = areaCoords;
        // 投影
        vm.graphic = vm.createGraphic(type, position, this.settingsCopy);
        window.graphicsLayer.addGraphic(vm.graphic);
      }
      this.drawer.removeEntities();
      if (window.drawElement) {
        window.drawElement.stopDrawing();
      }
    },
    // 移除绘制
    removeDraw() {
      const { Cesium, viewer } = this;
      //   this.lnglat = undefined;
      this.drawer && this.drawer.removeEntities();
      //清空drawElement
      if (window.drawElement) {
        window.drawElement.stopDrawing();
      }
      // 清除graphic实例
      this.removeGraphic();
    },
    removeGraphic() {
      if (this._hasGraphic()) {
        window.graphicsLayer.removeGraphicByID(
          this.settingsCopy.id + "graphic"
        );
      }
    },
    // 取消时恢复原来的graphic
    _restoreGraphic() {
      const { params } = this.settings;

      let graphic = window.graphicsLayer.getGraphicByID(
        this.settingsCopy.id + "graphic"
      );
      // let element;
      // if (params.projectorType == "image") {
      //   element = params.imgUrl;
      // } else {
      // element = document.getElementById("demovideo_html5_api");
      // }

      let element;
      if (params.projectorType === "image") {
        element = params.imgUrl;
      } else if (params.projectorType === "video") {
        element = this.videoDom;
      }

      graphic.style.material = Cesium.Material.fromType(
        Cesium.Material.ImageType,
        {
          image: element,
          repeat: new Cesium.Cartesian2(1.0, 1.0)
        }
      );
      graphic.style.perPositionHeight = params.heightReference === 0;
      graphic.style.offsetHeight = params.offsetHeight;
      graphic.style.classificationType =
        params.heightReference === 2
          ? Cesium.ClassificationType.BOTH
          : undefined;
    },
    /**
     * 确定按钮事件
     */
    _okClick() {
      // 退出配置前，先恢复投放状态
      if (!this.settings.isProjected) {
        this.cancelPutProjector(this.settingsCopy);
        this.scenePro = undefined;
      }
      this.$emit("update-settings", this.settingsCopy);
    },
    /**
     * 取消按钮事件
     */
    _cancelClick() {
      // 退出配置前，先恢复投放状态,先取消，再恢复投放状态，以确保投放参数是配置之前的参数
      this.cancelPutProjector(this.settingsCopy);
      this.scenePro = undefined;
      if (this.settings.isProjected) {
        this.putProjector(this.settings);
      }
      // 设置面板恢复之前的参数
      // this.settingsCopy = JSON.parse(JSON.stringify(this.settings));
      // 取消时清除绘制的投影面，并让绘制矩形按钮恢复原始状态
      this.removeDraw();
      this.$emit("cancel");
    }
  }
};
</script>
<style scoped>
.mapgis-widget-projector {
  max-height: calc(100% - 55px);
  overflow-y: auto;
  overflow-x: hidden;
}
.projector-style {
  text-align: center;
  margin-bottom: 8px;
}

.full-width {
  width: 100%;
}
/* 
 */
.padding {
  /* padding: 10px 6px; */
  line-height: 32px;
  padding-bottom: 5px;
  margin-top: 5px;
}
.padding_draw {
  display: inline;
  margin: 0 10px;
}
.padding_cla {
  /* padding: 10px 6px; */
  line-height: 32px;
  padding-bottom: 5px;
  margin-top: 5px;
}

.flex {
  display: flex;
  align-items: center;
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
  /* font-size: 12px; */
}

.switch {
  float: right;
}

.empty {
  margin: 0;
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
  /* border-radius: 4px; */
  /* margin-top: 3px; */
  /* padding: 3px; */
  /* border: 1px solid var(--primary-5); */
  font-size: 16px;
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
  /* padding: 4px 2px; */
}
</style>
