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
          <mapgis-ui-tab-pane key="1" tab="投放列表" style="position: relative">
            <mapgis-ui-list
              :key="`list-${currentVideoOverlayLayer.id}`"
              item-layout="horizontal"
              size="small"
              :data-source="videoList"
              :pagination="pagination"
              class="mapgis-list"
              style="height:280px;overflow-y: auto;width:100%"
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
                <mapgis-ui-iconfont
                  style="margin:0px 5px"
                  type="mapgis-shexiangji"
                >
                </mapgis-ui-iconfont>
                <operations-item
                  style="width:100%"
                  :key="item.id"
                  :text="item.name"
                  :operations="['setting', 'delete', 'put']"
                  :showOperations="activeIndex === index"
                  @setting="onGotoSetting(item, index)"
                  @delete="onDeleteVideo(item.id)"
                  @put="onPutVideo(item)"
                ></operations-item>
                <mapgis-ui-checkbox style="float:right" v-show="isBatch">
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
                  <mapgis-ui-button @click="newVideo" class="control-button"
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
              :id="currentEditVideo.id"
              :isPubliced="currentEditVideo.isPubliced"
              :params="currentEditVideo.params"
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
import emptyImage from "@mapgis/webclient-vue-ui/src/components/iconfont/image/empty.png";
import VueOptions from "./components/OperationsItem.vue";
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
      tabBarStyle: {
        margin: "0",
        textAlign: "center",
        borderBottom: "1px solid #F0F0F0"
      },
      activeKey: "1",
      isBatch: false, //是否批量操作
      currentEditVideo: null, //当前编辑video对象
      pagination: {
        onChange: page => {
          console.log(page);
          this.pagination.current = page;
        },
        current: 1,
        size: "small",
        pageSize: 3
      },
      emptyImage: emptyImage,
      imageStyle: {
        height: "150px",
        margin: "0 auto"
      },
      activeIndex: undefined
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
     * 更改layer
     */
    changeLayer(val) {
      this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy.find(
        item => item.name === val
      );
    },
    tabChange(e) {
      this.activeKey = e;
      if (e === "2") {
      }
    },
    changeBatch({ target }) {
      this.isBatch = target.checked;
    },

    clickListItem(item, index) {
      let vm = this;
      this.activeIndex = index;
      this.currentEditVideo = item;
    },
    /**
     * 从配置界面回到列表界面
     */
    onGotoHome() {
      this.edit = false;
    },
    /**
     * 新建video
     */
    newVideo() {},
    /**
     * 批量删除
     */
    deleteVideos() {
      const videoList = [...this.videoList];
      const { selectedRowKeys } = this.rowSelection;
      this.videoList = videoList.filter(
        item => !selectedRowKeys.includes(item.id)
      );
    },
    /**
     * 批量投放
     */
    putVideos() {},
    /**
     * 跳转到video配置界面
     */
    onGotoSetting(video, index) {
      this.actionMenuVisible = false;
      this.currentEditVideo = video;
      this.activeIndex = index;
      this.activeKey = "2";
    },
    /**
     * 删除video
     */
    onDeleteVideo(id) {
      this.actionMenuVisible = false;
      const videoList = [...this.videoList];
      this.videoList = videoList.filter(item => item.id !== id);
    },
    /**
     * 投放video
     */
    onPutVideo(video) {
      this.actionMenuVisible = false;
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
