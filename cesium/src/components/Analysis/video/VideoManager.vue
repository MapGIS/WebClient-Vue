<template>
  <div>
    <slot>
      <div class="mapgis-widget-video-manager">
        <!-- 视频列表页面 -->
        <div style="width:100%;padding:12px">
          <video-layer-select
            :selectOptions="videoOverlayLayerListCopy"
            @selectedLayer="changeLayer"
            @change-layer-name="changeLayerName"
            @add-layer="addLayer"
            @delete-layer="deleteLayer"
          />
        </div>
        <mapgis-ui-tabs
          :animated="false"
          :tabBarStyle="tabBarStyle"
          :active-key="activeKey"
          @change="tabChange"
          size="small"
        >
          <mapgis-ui-tab-pane
            key="1"
            tab="投放列表"
            style="position: relative"
            class="control-content"
          >
            <mapgis-ui-list
              :key="`list-${currentVideoOverlayLayer.id}`"
              item-layout="horizontal"
              size="small"
              :data-source="videoList"
              :pagination="pagination"
              class="mapgis-list"
              :split="false"
              style="max-height: 310px;;overflow-y: auto;width:100%"
            >
              <mapgis-ui-empty
                :image="emptyImage"
                :image-style="imageStyle"
                v-if="videoList.length === 0"
              >
                <span slot="description" class="empty-style">
                  请新建投放
                </span>
              </mapgis-ui-empty>
              <mapgis-ui-list-item
                style="padding: 4px 8px; cursor: pointer; display: inline-flex;width: 100%;align-items: center;"
                :class="{ 'list-active': activeIndex === index }"
                :key="item.id"
                slot="renderItem"
                slot-scope="item, index"
                @click="clickListItem(item, index)"
              >
                <mapgis-ui-toolbar-command
                  :class="item.isProjected ? 'camera-active' : 'camera'"
                  icon="mapgis-shexiangji"
                  title="投放"
                  @click="onPutVideo(item)"
                ></mapgis-ui-toolbar-command>
                <operations-item
                  style="width:100%"
                  :key="item.id"
                  :text="item.name"
                  :operations="['setting', 'delete', 'locate']"
                  :showOperations="activeIndex === index"
                  @setting="onGotoSetting(item, index)"
                  @delete="onDeleteVideo(item.id)"
                  @locate="onLocate(item)"
                ></operations-item>
                <mapgis-ui-checkbox
                  style="float:right"
                  v-show="isBatch"
                  :checked="selectedIds.includes(item.id)"
                  @change="changeItemChecked(item.id, $event)"
                >
                </mapgis-ui-checkbox>
              </mapgis-ui-list-item>
            </mapgis-ui-list>
            <div style="bottom: 0;position: absolute;width: 100%;">
              <mapgis-ui-pagination
                v-show="!isBatch"
                hideOnSinglePage
                style="padding:6px 0;width:100%;display: flex;justify-content: flex-end;"
                @change="pagination.onChange"
                :pageSize="pagination.pageSize"
                :total="videoList.length"
                :size="pagination.size"
              ></mapgis-ui-pagination>
              <!-- 批量操作 -->
              <div
                style="display: flex;align-items: center;justify-content: flex-end;padding-top:6px;width:100%;border-top: 1px solid var(--border-color-split);"
              >
                <div v-show="isBatch" style="width:100%">
                  <mapgis-ui-button
                    @click="cancelPutVideos"
                    class="control-button"
                    >取消投放</mapgis-ui-button
                  >
                  <mapgis-ui-button @click="putVideos" class="control-button"
                    >投放视频</mapgis-ui-button
                  >
                  <mapgis-ui-button @click="deleteVideos" class="control-button"
                    >删除</mapgis-ui-button
                  >
                </div>
                <div v-show="!isBatch" style="width:100%">
                  <mapgis-ui-button
                    @click="newVideo"
                    type="primary"
                    style="width:100%"
                  >
                    新建投放视频
                  </mapgis-ui-button>
                </div>
              </div>
            </div>
          </mapgis-ui-tab-pane>
          <mapgis-ui-tab-pane
            key="2"
            tab="设置面板"
            class="control-content"
            id="parameter-formList"
          >
            <video-setting
              v-if="
                currentEditVideo && Object.keys(currentEditVideo).length > 0
              "
              :settings="currentEditVideo"
              @update-settings="updateSettings"
              @cancel="cancelSetting"
            ></video-setting>
          </mapgis-ui-tab-pane>
          <mapgis-ui-checkbox
            v-show="activeKey === '1'"
            slot="tabBarExtraContent"
            @change="changeBatch"
          >
            批量操作
          </mapgis-ui-checkbox>
        </mapgis-ui-tabs>
      </div>
    </slot>
  </div>
</template>

<script>
import emptyImage from '../../../assets/image/empty.png';
import { newGuid } from "../../Utils/util";
import VueOptions from "./components/OperationsItem.vue";
import {
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable,
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../../WebGlobe/util";
import OperationsItem from "./components/OperationsItem.vue";
import VideoSetting from "./VideoSetting.vue";
import VideoLayerSelect from "./components/VideoLayerSelect.vue";
import videoOverlayLayerList from "./videosData.js";
export default {
  name: "mapgis-3d-video-manager",
  inject: ["Cesium", "vueCesium", "viewer"],
  components: { OperationsItem, VideoSetting, VideoLayerSelect },
  props: {
    ...VueOptions,
    videoOverlayLayerList: {
      type: Array,
      default: () => videoOverlayLayerList()
    },
    protocol: {
      type: String,
      default: "mp4"
    },
    videoUrl: {
      type: String,
      default: "http://localhost:8895/video/DJI_0008.mp4"
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
    hFOV: {
      type: Number,
      default: 0
    },
    vFOV: {
      type: Number,
      default: 0
    },
    cameraPosition: {
      type: Object,
      default: () => {
        return { x: 0, y: 0, Z: 0 };
      }
    },
    hintLineVisible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    videoList: {
      get: function() {
        return this.currentVideoOverlayLayer.videoList;
      },
      set: function(videoList) {
        this.currentVideoOverlayLayer.videoList = videoList;
      }
    },
    listPagination() {
      return this.isBatch ? false : this.pagination;
    }
  },
  watch: {
    videoOverlayLayerList: {
      handler() {
        this.videoOverlayLayerListCopy = this.videoOverlayLayerList;
        if (this.videoOverlayLayerListCopy.length > 0) {
          // 默认取第一个
          this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy[0];
          this.currentVideoOverlayLayerId = this.currentVideoOverlayLayer.id;
          this.layerSelectOptions = [];
          for (let i = 0; i < this.videoOverlayLayerList.length; i++) {
            const { id, name } = this.videoOverlayLayerList[i];
            this.layerSelectOptions.push({ id, name });
          }
        }
      },
      deep: true,
      immediate: true
    },
    videoList: {
      handler() {
        this.pagination.total = this.videoList.length;
        this.reflush = !this.reflush;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      reflush: true,
      videoOverlayLayerListCopy: [], //图层数组
      layerSelectOptions: [], //图层选中框信息
      currentVideoOverlayLayerId: undefined, //当前选中图层的id
      currentVideoOverlayLayer: {}, //当前选中图层
      currentEditVideo: null, //当前编辑video对象
      tabBarStyle: {
        margin: "0",
        textAlign: "center",
        borderBottom: "1px solid #F0F0F0"
      },
      emptyImage: emptyImage,
      imageStyle: {
        height: "150px",
        margin: "0 auto"
      },
      activeKey: "1",
      activeIndex: undefined,
      isBatch: false, //是否批量操作
      selectedIds: [], //选中video的id集合
      pagination: {
        onChange: page => {
          console.log(page);
          this.pagination.current = page;
        },
        current: 1,
        size: "small",
        pageSize: 3
      },
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
    },
    unmount() {
      this.$emit("unload", this);
    },
    /**
     * 修改图层名
     */
    changeLayerName({ id, dataIndex, value }) {
      const videoOverlayLayerList = [...this.videoOverlayLayerListCopy];
      const target = videoOverlayLayerList.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.videoOverlayLayerListCopy = videoOverlayLayerList;
      }
    },
    /**
     * 添加图层
     */
    addLayer(newLayer) {
      this.videoOverlayLayerListCopy.push(newLayer);
    },
    /**
     * 删除图层
     */
    deleteLayer(id) {
      const videoOverlayLayerList = [...this.videoOverlayLayerListCopy];
      this.videoOverlayLayerListCopy = videoOverlayLayerList.filter(
        item => item.id !== id
      );
    },
    /**
     * 更改图层名
     */
    changeLayer(val) {
      this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy.find(
        item => item.name === val
      );
    },
    /**
     * 更改tab标签
     */
    tabChange(e) {
      this.activeKey = e;
      if (e === "2") {
      }
    },
    /**
     * 是否批量操作
     */
    changeBatch({ target }) {
      this.isBatch = target.checked;
    },
    /**
     * 列表中checbox事件
     */
    changeItemChecked(id, event) {
      const checked = event.target.checked;
      if (checked) {
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id);
        }
      } else {
        if (this.selectedIds.includes(id)) {
          const index = this.selectedIds.indexOf(id);
          if (index > -1) {
            this.selectedIds.splice(index, 1);
          }
        }
      }
    },
    /**
     * 点击列表项
     */
    clickListItem(item, index) {
      let vm = this;
      this.activeIndex = index;
      this.currentEditVideo = item;
    },
    /**
     * 新建video
     */
    newVideo() {
      const guid = newGuid();
      const newVideo = {
        id: guid, // 视频id
        name: "newVideo", // 视频名称
        description: "", //描述
        isProjected: false, // 是否开启视频投放
        params: {
          videoSource: {
            protocol: "mp4", // 视频传输协议
            videoUrl: "" // 视频服务地址
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
      this.putVideo(newVideo);
      this.currentEditVideo = newVideo;
      this.activeKey = "2";
    },
    /**
     * 批量删除
     */
    deleteVideos() {
      const videoList = [...this.videoList];
      const { selectedIds } = this;
      this.videoList = videoList.filter(item => !selectedIds.includes(item.id));
      // 取消被删除video的投放
      for (let i = 0; i < selectedIds.length; i++) {
        this.viewer.scene.visualAnalysisManager.removeByID(selectedIds[i]);
      }
      this.selectedIds = [];
    },
    /**
     * 批量投放
     */
    putVideos() {
      const { selectedIds } = this;
      for (let i = 0; i < selectedIds.length; i++) {
        const video = this.videoList.find(item => item.id === selectedIds[i]);
        this.putVideo(video);
      }
      const videoList = [...this.videoList];
      videoList.map(item => {
        if (selectedIds.indexOf(item.id) > -1) {
          item.isProjected = true;
          return item;
        }
      });
      this.videoList = videoList;
    },
    /**
     * 批量取消投放
     */
    cancelPutVideos() {
      const { selectedIds } = this;
      for (let i = 0; i < selectedIds.length; i++) {
        this.viewer.scene.visualAnalysisManager.removeByID(selectedIds[i]);
      }
      const videoList = [...this.videoList];
      videoList.map(item => {
        if (selectedIds.indexOf(item.id) > -1) {
          item.isProjected = false;
          return item;
        }
      });
      this.videoList = videoList;
    },
    /**
     * 跳转到video配置界面
     */
    onGotoSetting(video, index) {
      this.activeIndex = index;
      this.activeKey = "2";
      // 设置前先投放
      this.putVideo(video);
      this.currentEditVideo = video;
    },
    /**
     * 更新video参数
     */
    updateSettings(settings) {
      // 先恢复投放状态
      if (!this.currentEditVideo.isProjected) {
        this.viewer.scene.visualAnalysisManager.removeByID(
          this.currentEditVideo.id
        );
      }
      let target = this.videoList.find(item => item.id === settings.id);
      if (target) {
        const videoList = [...this.videoList];
        // 编辑
        this.videoList = videoList.map(item => {
          if (item.id === settings.id) {
            return settings;
          }
          return item;
        });
      } else {
        // 新建
        this.videoList.push(settings);
      }
      this.currentEditVideo = settings;
      this.activeKey = "1";
    },
    /**
     * 取消设置
     */
    cancelSetting() {
      //恢复投放状态
      if (!this.currentEditVideo.isProjected) {
        this.viewer.scene.visualAnalysisManager.removeByID(
          this.currentEditVideo.id
        );
      }
      this.activeKey = "1";
    },
    /**
     * 删除video
     */
    onDeleteVideo(id) {
      const videoList = [...this.videoList];
      this.videoList = videoList.filter(item => item.id !== id);
      this.viewer.scene.visualAnalysisManager.removeByID(id);
    },
    /**
     * 获取投放视频协议
     */
    getProType(protocol) {
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
     * 投放视频
     */
    putVideo(video) {
      this._openSceneSetting();
      let scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
        video.id
      );
      if (scenePro) {
        // 视频已经被投放
        return;
      }
      const { viewer, Cesium } = this;
      const { id, params } = video;
      const proType = this.getProType(video.params.videoSource.protocol);
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
      let cartesian = Cesium.Cartographic.toCartesian(
        Cesium.Cartographic.fromDegrees(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        )
      );
      cartesian.x -= 10;
      scenePro.viewPosition = cartesian;
      scenePro.heading = orientation.heading;
      scenePro.pitch = orientation.pitch;
      scenePro.roll = orientation.roll;
      scenePro.hintLineVisible = hintLineVisible;
      scenePro.horizontAngle = hFOV;
      scenePro.verticalAngle = vFOV;
    },
    /**
     * 单个投放/取消投放
     */
    onPutVideo(video) {
      let isProjected = false;
      let scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
        video.id
      );
      if (scenePro) {
        // 视频已经被投放，则取消投放
        this.viewer.scene.visualAnalysisManager.removeByID(video.id);
        isProjected = false;
      } else {
        // 未投放，则投放
        this.putVideo(video);
        isProjected = true;
      }
      const videoList = [...this.videoList];
      const target = videoList.find(item => item.id === video.id);
      if (target) {
        target.isProjected = isProjected;
        this.videoList = videoList;
      }
    },
    /**
     * 定位到摄像机位置
     */
    onLocate(item) {
      const { cameraPosition } = item.params;
      const { Cesium, viewer } = this;
      const destination = Cesium.Cartesian3.fromDegrees(
        cameraPosition.x,
        cameraPosition.y,
        viewer.camera.positionCartographic.height
      );
      viewer.camera.flyTo({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(0), // 0 // 绕垂直于地心的轴旋转 ,相当于头部左右转
          pitch: Cesium.Math.toRadians(-90), // -90  //绕经度线旋转， 相当于头部上下
          roll: Cesium.Math.toRadians(0) // 0         //绕纬度线旋转 ，面对的一面瞬时针转
        }
      });
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

<style lang="scss" scoped>
.mapgis-widget-video-manager {
  .control-content {
    max-height: 394px;
    /*overflow: hidden;*/
    overflow-y: auto;
    padding-top: 10px;
    height: 394px;
  }

  .list-active {
    background: #e0f0ff;
    .operations-row-action {
      display: block;
    }
  }
}

.camera {
  color: var(--text-color);
}

.camera-active {
  color: var(--primary-color);
}

.empty-style {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #999999;
}

.control-button {
  width: calc(33% - 2.5px);
}

.mapgis-ui-empty {
  margin: 50px;
}
::v-deep .mapgis-ui-tabs-nav .mapgis-ui-tabs-tab {
  margin: 0;
}

::v-deep .mapgis-ui-tabs-nav-scroll {
  display: flex;
  justify-content: flex-start;
}

::v-deep .mapgis-ui-list-pagination {
  margin-top: 12px;
  display: none;
}
</style>
