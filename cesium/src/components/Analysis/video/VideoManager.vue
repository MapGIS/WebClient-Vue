<template>
  <div>
    <slot>
      <div class="mapgis-widget-video-manager">
        <div v-if="!edit">
          <!-- 视频列表页面 -->
          <div style="width:100%;padding:12px">
            <mapgis-ui-select
              v-model="currentVideoOverlayLayerId"
              placeholder="选择图层"
              style="width:100%;"
              @change="changeLayer"
            >
              <mapgis-ui-select-option
                v-for="{ id, name } in videoOverlayLayerList"
                :key="id"
                :value="id"
                :title="name"
              >
                {{ name }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </div>
          <!-- 批量操作 -->
          <div class="buttom-div">
            <mapgis-ui-toolbar-command
              icon="mapgis-shanchu"
              title="删除"
              @click="deleteVideos"
            ></mapgis-ui-toolbar-command>
            <mapgis-ui-toolbar-command
              icon="mapgis-plus"
              title="新建"
              @click="newVideo"
            ></mapgis-ui-toolbar-command>
            <mapgis-ui-toolbar-command
              icon="mapgis-shexiangji"
              title="投放"
              @click="putVideos"
            ></mapgis-ui-toolbar-command>
          </div>
        </div>
        <div v-if="videoList && videoList.length > 0">
          <div v-if="!edit">
            <div class="video-container">
              <mapgis-ui-table
                :key="reflush"
                :rowKey="record => record.id"
                :data-source="videoList"
                :columns="columns"
                :pagination="pagination"
                :row-selection="rowSelection"
                size="small"
              >
                <div slot="name" slot-scope="text, record">
                  <video-item
                    :name="text"
                    @update-name="val => changeName(record.id, 'name', $event)"
                    @edit-video="onGotoSetting(record)"
                    @delete-video="onDeleteVideo(record.id)"
                    @put-video="onPutVideo(record)"
                  ></video-item>
                </div>
              </mapgis-ui-table>
            </div>
          </div>
          <div v-else>
            <!-- video配置页面 -->
            <div class="header" @click="onGotoHome">
              <div>
                <mapgis-ui-iconfont class="return" type="mapgis-left" />
              </div>
              <div class="name">{{ currentEditVideo.name }}</div>
            </div>
            <video-setting
              :id="currentEditVideo.id"
              :isPubliced="currentEditVideo.isPubliced"
              :params="currentEditVideo.params"
            ></video-setting>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";
import VideoItem from "./VideoItem.vue";
import VideoSetting from "./VideoSetting.vue";
import videoOverlayLayerList from "./videosData.js";
export default {
  name: "mapgis-3d-video-manager",
  inject: ["Cesium", "vueCesium", "viewer"],
  components: { VideoItem, VideoSetting },
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
        }
      },
      deep: true,
      immediate: true
    },
    videoList: {
      handler() {
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
      currentVideoOverlayLayer: {}, //当前选中图层
      currentVideoOverlayLayerId: undefined, //当前选中图层的id
      edit: false, //是否编辑
      currentEditVideo: null, //当前编辑video对象
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.rowSelection.selectedRowKeys = selectedRowKeys;
          console.log(selectedRowKeys, selectedRows);
        },
        onSelect: (record, selected) => {
          console.log(record, selected);
        },
        selectedRowKeys: []
      },
      columns: [
        {
          title: "名称",
          key: "name",
          dataIndex: "name",
          align: "left",
          scopedSlots: { customRender: "name" }
        }
      ],
      pagination: { total: 0, pageSize: 3 }
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
     * 更改layer
     */
    changeLayer(val) {
      this.currentVideoOverlayLayer = this.videoOverlayLayerListCopy.find(
        item => item.id === val
      );
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
    onGotoSetting(video) {
      this.actionMenuVisible = false;
      this.currentEditVideo = video;
      this.edit = true;
    },
    /**
     * 修改video的name
     */
    changeName(id, dataIndex, value) {
      const videoList = [...this.videoList];
      const target = videoList.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.videoList = videoList;
      }
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
  .buttom-div {
    width: 100%;
    padding: 3px 0;
    margin-bottom: 12px;
    text-align: center;
    background: var(--panel-inner-color);
  }

  .video-container {
  }

  .header {
    cursor: pointer;
    display: flex;
    align-content: center;
    .return {
      // color: @primary-color;
      margin: 0 10px 0 0;
    }
    .name {
      flex: 1;
    }
  }
}

::v-deep .mapgis-ui-table-thead {
  display: none;
}
</style>
