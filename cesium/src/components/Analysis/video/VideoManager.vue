<template>
  <div>
    <slot>
      <div class="mapgis-widget-video-manager">
        <!-- 视频列表页面 -->
        <div class="video-layer-select-div">
          <video-layer-select
            :selectOptions="videoOverlayLayerListCopy"
            :defaultValue="layerSelectDefaultValue"
            @selectedLayer="_changeLayer"
            @change-layer-name="_changeLayerName"
            @add-layer="_addLayer"
            @delete-layer="_deleteLayer"
          />
        </div>
        <mapgis-ui-tabs
          :animated="false"
          :tabBarStyle="tabBarStyle"
          :active-key="activeKey"
          @change="_tabChange"
          size="small"
        >
          <mapgis-ui-tab-pane
            key="1"
            tab="投放列表"
            class="control-content list-pane"
          >
            <mapgis-ui-list
              v-if="currentVideoOverlayLayer"
              :key="`list-${currentVideoOverlayLayer.id}`"
              item-layout="horizontal"
              size="small"
              :data-source="videoList"
              :pagination="pagination"
              class="mapgis-list video-list"
              :split="false"
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
                class="list-item"
                :class="{ 'list-active': activeIndex === index }"
                :key="item.id"
                slot="renderItem"
                slot-scope="item, index"
                @click="_clickListItem(item, index)"
              >
                <mapgis-ui-toolbar-command
                  :class="item.isProjected ? 'camera-active' : 'camera'"
                  icon="mapgis-shexiangji"
                  title="投放"
                  @click="_onPutVideo(item)"
                ></mapgis-ui-toolbar-command>
                <operations-item
                  class="full-width"
                  :key="item.id"
                  :text="item.name"
                  :operations="['setting', 'delete', 'locate']"
                  :showOperations="activeIndex === index"
                  @setting="_onGotoSetting(item, index)"
                  @delete="_onDeleteVideo(item.id)"
                  @locate="_onLocate(item)"
                ></operations-item>
                <mapgis-ui-checkbox
                  class="item-checkbox"
                  v-show="isBatch"
                  :checked="selectedIds.includes(item.id)"
                  @change="_changeItemChecked(item.id, $event)"
                >
                </mapgis-ui-checkbox>
              </mapgis-ui-list-item>
            </mapgis-ui-list>
            <div class="pagination-div">
              <mapgis-ui-pagination
                v-show="!isBatch"
                hideOnSinglePage
                class="pagination"
                @change="pagination.onChange"
                :pageSize="pagination.pageSize"
                :total="videoList.length"
                :size="pagination.size"
                :show-total="total => `共${total}条数据`"
              ></mapgis-ui-pagination>
              <!-- 批量操作 -->
              <div class="buttons">
                <div v-show="isBatch" class="full-width">
                  <mapgis-ui-button
                    @click="_cancelPutVideos"
                    class="control-button"
                    >取消投放</mapgis-ui-button
                  >
                  <mapgis-ui-button @click="_putVideos" class="control-button"
                    >投放视频</mapgis-ui-button
                  >
                  <mapgis-ui-button
                    @click="_deleteVideos"
                    class="control-button"
                    >删除</mapgis-ui-button
                  >
                </div>
                <div v-show="!isBatch" class="full-width">
                  <mapgis-ui-button
                    @click="_newVideo"
                    type="primary"
                    class="full-width"
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
            <mapgis-3d-video-setting
              v-if="
                currentEditVideo && Object.keys(currentEditVideo).length > 0
              "
              :settings="currentEditVideo"
              :modelUrl="modelUrl"
              :modelOffset="modelOffset"
              @update-settings="_updateSettings"
              @cancel="_cancelSetting"
            ></mapgis-3d-video-setting>
          </mapgis-ui-tab-pane>
          <mapgis-ui-checkbox
            v-show="activeKey === '1'"
            slot="tabBarExtraContent"
            @change="_changeBatch"
          >
            批量操作
          </mapgis-ui-checkbox>
        </mapgis-ui-tabs>
      </div>
    </slot>
  </div>
</template>

<script>
import emptyImage from "../../../assets/image/empty.png";
import { newGuid } from "../../Utils/util";
import VueOptions from "./components/OperationsItem.vue";
import OperationsItem from "./components/OperationsItem.vue";
import VideoLayerSelect from "./components/VideoLayerSelect.vue";
import videoMixins from "./mixins/video-mixins";
export default {
  name: "mapgis-3d-video-manager",
  inject: ["Cesium", "vueCesium", "viewer"],
  components: { OperationsItem, VideoLayerSelect },
  mixins: [videoMixins],
  props: {
    ...VueOptions,
    videoOverlayLayerList: {
      type: Array,
      default: () => []
    },
    currentLayerId: {
      type: String,
      default: ""
    },
    currentVideoId: {
      type: String,
      default: ""
    },
    maxProjected: {
      type: Number,
      default: 10
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
        return this.currentVideoOverlayLayer
          ? this.currentVideoOverlayLayer.videoList
          : [];
      },
      set: function(videoList) {
        this.currentVideoOverlayLayer.videoList = videoList;
        const videoOverlayLayerList = [...this.videoOverlayLayerListCopy];
        videoOverlayLayerList.map(item => {
          if (item.id === this.currentVideoOverlayLayer.id) {
            item.videoList = [...this.currentVideoOverlayLayer.videoList];
            return item;
          }
        });
        this.videoOverlayLayerListCopy = videoOverlayLayerList;
        this.$emit(
          "update-videoOverlayLayerList",
          this.videoOverlayLayerListCopy
        );
      }
    },
    listPagination() {
      return this.isBatch ? false : this.pagination;
    },
    layerSelectDefaultValue() {
      return this.currentVideoOverlayLayer &&
        Object.keys(this.currentVideoOverlayLayer).length > 0
        ? this.currentVideoOverlayLayer.name
        : "";
    }
  },
  watch: {
    videoOverlayLayerList: {
      handler() {
        this.videoOverlayLayerListCopy = JSON.parse(
          JSON.stringify(this.videoOverlayLayerList)
        );
        if (this.videoOverlayLayerListCopy.length > 0) {
          // 默认取第一个
          // this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy[0];
          this.layerSelectOptions = [];
          for (let i = 0; i < this.videoOverlayLayerListCopy.length; i++) {
            const { id, name } = this.videoOverlayLayerListCopy[i];
            this.layerSelectOptions.push({ id, name });
          }
          if (this.currentLayerId) {
            this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy.find(
              item => item.id === this.currentLayerId
            );
            this._initPutVideos();
          }
        }
      },
      deep: true,
      immediate: true
    },
    videoList: {
      handler() {
        this.pagination.total = this.videoList ? this.videoList.length : 0;
        this.reflush = !this.reflush;
      },
      deep: true,
      immediate: true
    },
    currentLayerId: {
      handler() {
        this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy.find(
          item => item.id === this.currentLayerId
        );
        this._initPutVideos();
      },
      immediate: true
    },
    currentVideoId: {
      handler() {
        this.currentEditVideo = this.videoList.find(
          item => item.id === this.currentVideoId
        );
        if (this.currentEditVideo) {
          const { x, y, z } = this.currentEditVideo.params.cameraPosition;
          if (x === 0 && y === 0 && z === 0) {
            this.activeKey = "2";
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      reflush: true,
      videoOverlayLayerListCopy: [], //图层数组
      layerSelectOptions: [], //图层选中框信息
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
        pageSize: 20
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
    _initPutVideos() {
      this.viewer.scene.visualAnalysisManager.removeAll();
      for (let i = 0; i < this.videoList.length; i++) {
        const video = this.videoList[i];
        if (video.isProjected) {
          this.putVideo(video);
        } else {
          this.cancelPutVideo(video.id);
        }
      }
    },
    /**
     * 修改图层名
     */
    _changeLayerName({ id, dataIndex, value }) {
      const videoOverlayLayerList = [...this.videoOverlayLayerListCopy];
      let target = videoOverlayLayerList.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.videoOverlayLayerListCopy = videoOverlayLayerList;
        this.$emit(
          "update-videoOverlayLayerList",
          this.videoOverlayLayerListCopy
        );
      }
    },
    /**
     * 添加图层
     */
    _addLayer(newLayer) {
      this.videoOverlayLayerListCopy.push(newLayer);
      this.$emit(
        "update-videoOverlayLayerList",
        this.videoOverlayLayerListCopy
      );
    },
    /**
     * 删除图层
     */
    _deleteLayer(id) {
      const videoOverlayLayerList = [...this.videoOverlayLayerListCopy];
      this.videoOverlayLayerListCopy = videoOverlayLayerList.filter(
        item => item.id !== id
      );
      if (
        this.currentVideoOverlayLayer &&
        this.currentVideoOverlayLayer.id === id
      ) {
        // currentEditVideo一定在currentVideoOverlayLayer里
        this.currentVideoOverlayLayer = {};
        this.currentEditVideo = null;
      }
      this.$emit(
        "update-videoOverlayLayerList",
        this.videoOverlayLayerListCopy
      );
    },
    /**
     * 更改图层名
     */
    _changeLayer(val) {
      this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy.find(
        item => item.name === val
      );
      this.viewer.scene.visualAnalysisManager.removeAll();
      for (let i = 0; i < this.videoList.length; i++) {
        const video = this.videoList[i];
        if (video.isProjected) {
          this.putVideo(video);
        } else {
          this.cancelPutVideo(video.id);
        }
      }
    },
    /**
     * 更改tab标签
     */
    _tabChange(e) {
      this.activeKey = e;
      if (
        this.currentEditVideo &&
        Object.keys(this.currentEditVideo).length > 0
      ) {
        if (e === "2") {
          // 切换到配置界面，直接投放已选中的视频
          this.putVideo(this.currentEditVideo);
        } else if (e === "1") {
          // 切换到列表界面，恢复投放状态，先取消投放
          // 如果在进入配置界面之前已投放，则重新投放（以确保投放参数与之前投放的参数保持一致）
          this.cancelPutVideo(this.currentEditVideo.id);
          if (this.currentEditVideo.isProjected) {
            this.putVideo(this.currentEditVideo);
          }
        }
      }
    },
    /**
     * 是否批量操作
     */
    _changeBatch({ target }) {
      this.isBatch = target.checked;
    },
    /**
     * 列表中checbox事件
     */
    _changeItemChecked(id, event) {
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
    _clickListItem(item, index) {
      this.activeIndex = index;
      this.currentEditVideo = item;
    },
    /**
     * 新建video
     */
    _newVideo() {
      const guid = newGuid();
      const newVideo = {
        id: guid, // 视频id
        name: "newVideo", // 视频名称
        description: "", //描述
        isProjected: false, // 是否开启视频投放
        params: {
          videoSource: {
            protocol: "m3u8", // 视频传输协议
            videoUrl: undefined // 视频服务地址
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
    _deleteVideos() {
      const videoList = [...this.videoList];
      const { selectedIds } = this;
      this.videoList = videoList.filter(item => !selectedIds.includes(item.id));
      // 取消被删除video的投放
      for (let i = 0; i < selectedIds.length; i++) {
        this.cancelPutVideo(selectedIds[i]);
        if (
          this.currentEditVideo &&
          this.currentEditVideo.id === selectedIds[i]
        ) {
          this.currentEditVideo = null;
        }
      }
      this.selectedIds = [];
    },
    _isProjectedList() {
      const videoList = [...this.videoList];
      const list = videoList.filter(item => item.isProjected);
      return list || [];
    },
    /**
     * 批量投放
     */
    _putVideos() {
      const length = this._isProjectedList().length;
      const num =
        this.maxProjected - length > 0 ? this.maxProjected - length : 0;
      if (this.selectedIds.length >= num) {
        const vm = this;
        this.$warning({
          content: `最大投放数为${this.maxProjected}，已投放${length},还可投放${num},所选数目已超出可投放数,是否继续?`,
          okText: "确认",
          cancelText: "取消",
          onOk() {
            vm._continuePutVideos();
          }
        });
      } else {
        this._continuePutVideos();
      }
    },
    _continuePutVideos() {
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
    _cancelPutVideos() {
      const { selectedIds } = this;
      for (let i = 0; i < selectedIds.length; i++) {
        this.cancelPutVideo(selectedIds[i]);
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
    _onGotoSetting(video, index) {
      this.activeIndex = index;
      this.activeKey = "2";
      this.currentEditVideo = video;
    },
    /**
     * 更新video参数
     */
    _updateSettings(settings) {
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
        this.$emit(
          "update-videoOverlayLayerList",
          this.videoOverlayLayerListCopy
        );
      }
      this.currentEditVideo = settings;
      this.activeKey = "1";
    },
    /**
     * 取消设置
     */
    _cancelSetting() {
      this.activeKey = "1";
    },
    /**
     * 删除video
     */
    _onDeleteVideo(id) {
      const videoList = [...this.videoList];
      this.videoList = videoList.filter(item => item.id !== id);
      this.cancelPutVideo(id);
      if (this.currentEditVideo && this.currentEditVideo.id === id) {
        this.currentEditVideo = null;
      }
    },
    /**
     * 单个投放/取消投放
     */
    _onPutVideo(video) {
      let isProjected = false;
      let scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
        video.id
      );
      if (scenePro) {
        // 视频已经被投放，则取消投放
        this.cancelPutVideo(video.id);
        isProjected = false;
        this._changeIsProjected(isProjected, video.id);
      } else {
        // 未投放，则投放
        const length = this._isProjectedList().length;
        const num =
          this.maxProjected - length > 0 ? this.maxProjected - length : 0;
        if (this.maxProjected <= length) {
          const vm = this;
          this.$warning({
            content: `最大投放数为${this.maxProjected}，已投放${length},还可投放${num},所选数目已超出可投放数,是否继续?`,
            okText: "确认",
            cancelText: "取消",
            onOk() {
              vm.putVideo(video);
              isProjected = true;
              vm._changeIsProjected(isProjected, video.id);
            }
          });
        } else {
          this.putVideo(video);
          isProjected = true;
          this._changeIsProjected(isProjected, video.id);
        }
      }
    },
    _changeIsProjected(isProjected, id) {
      const videoList = [...this.videoList];
      let target = videoList.find(item => item.id === id);
      if (target) {
        target.isProjected = isProjected;
        this.videoList = videoList;
      }
    },
    /**
     * 定位到摄像机位置
     */
    _onLocate(item) {
      const { cameraPosition, orientation } = item.params;
      const { Cesium, viewer } = this;
      const destination = Cesium.Cartesian3.fromDegrees(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      );
      viewer.camera.flyTo({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(orientation.heading), // 绕垂直于地心的轴旋转 ,相当于头部左右转
          pitch: Cesium.Math.toRadians(orientation.pitch), // 绕经度线旋转， 相当于头部上下
          roll: Cesium.Math.toRadians(orientation.roll) // 绕纬度线旋转 ，面对的一面瞬时针转
        }
      });
    }
  }
};
</script>

<style scoped>
.video-layer-select-div {
  width: 100%;
  padding: 12px;
}
.list-pane {
  position: relative;
}
.video-list {
  max-height: 310px;
  overflow-y: auto;
  width: 100%;
}
.list-item {
  padding: 4px 8px;
  cursor: pointer;
  display: inline-flex;
  width: 100%;
  align-items: center;
}
.full-width {
  width: 100%;
}
.item-checkbox {
  float: right;
}
.pagination-div {
  bottom: 0;
  position: absolute;
  width: 100%;
}
.pagination {
  padding: 6px 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 6px;
  width: 100%;
  border-top: 1px solid var(--border-color-split);
}
.control-content {
  max-height: 394px;
  overflow: hidden;
  overflow-y: auto;
  padding-top: 10px;
  height: 394px;
}

.list-active {
  background: var(--primary-2);
}

.camera {
  color: var(--text-color);
}

.camera-active {
  color: var(--primary-color);
}

.empty-style {
  font-size: 12px;
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

::v-deep .mapgis-ui-list-items {
  display: grid;
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
