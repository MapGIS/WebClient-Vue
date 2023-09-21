<template>
  <div>
    <slot>
      <div class="mapgis-widget-projector-manager">
        <!-- 视频列表页面 -->
        <div class="projector-layer-select-div">
          <projector-layer-select
            :selectOptions="projectorOverlayLayerListCopy"
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
        >
          <mapgis-ui-tab-pane key="1" class="control-content list-pane">
            <span slot="tab">
              投放列表
              <mapgis-ui-tooltip slot="handle" placement="bottomRight">
                <template slot="title">
                  <span>{{ info }}</span>
                </template>
                <mapgis-ui-iconfont type="mapgis-info"></mapgis-ui-iconfont>
              </mapgis-ui-tooltip>
            </span>
            <mapgis-ui-list
              v-if="
                currentProjectorOverlayLayer &&
                  Object.keys(currentProjectorOverlayLayer).length > 0
              "
              :key="`list-${currentProjectorOverlayLayer.id}`"
              item-layout="horizontal"
              size="small"
              :data-source="projectorList"
              :pagination="pagination"
              class="mapgis-list projector-list"
              :split="false"
            >
              <mapgis-ui-empty
                :image="emptyImage"
                :image-style="imageStyle"
                v-if="emptyImage && projectorList && projectorList.length === 0"
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
                  @click="_onPutProjector(item)"
                ></mapgis-ui-toolbar-command>
                <operations-item
                  class="full-width"
                  :key="item.id"
                  :text="item.name"
                  :operations="['setting', 'delete', 'locate']"
                  :showOperations="activeIndex === index"
                  @setting="_onGotoSetting(item, index)"
                  @delete="_onDeleteProjector(item.id)"
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
                :total="pagination.total"
                :size="pagination.size"
                :show-total="total => `共${total}条数据`"
              ></mapgis-ui-pagination>
              <!-- 批量操作 -->
              <mapgis-ui-setting-footer>
                <div v-show="isBatch">
                  <mapgis-ui-button @click="_cancelPutProjectors"
                    >取消投放</mapgis-ui-button
                  >
                  <mapgis-ui-button @click="_putProjectors"
                    >投放视频</mapgis-ui-button
                  >
                  <mapgis-ui-button @click="_deleteProjectors"
                    >删除</mapgis-ui-button
                  >
                </div>
                <div v-show="!isBatch" class="full-width">
                  <mapgis-ui-button
                    @click="_newProjector"
                    type="primary"
                    class="full-width"
                  >
                    新建投放视频
                  </mapgis-ui-button>
                </div>
              </mapgis-ui-setting-footer>
            </div>
          </mapgis-ui-tab-pane>
          <mapgis-ui-tab-pane key="2" tab="设置面板" id="parameter-formList">
            <mapgis-3d-projector-setting
              class="control-content"
              v-if="
                currentEditProjector &&
                  Object.keys(currentEditProjector).length > 0
              "
              :currentProjectorOverlayLayerId="currentProjectorOverlayLayer.id"
              :settings="currentEditProjector"
              :modelUrl="modelUrl"
              :isEdit="isEdit"
              :modelOffset="modelOffset"
              :hideVPInvisible="hideVPInvisible"
              :disabled="disabledImageUrlInput"
              @update-settings="_updateSettings"
              @cancel="_cancelSetting"
            >
              <template slot="imgUpload" slot-scope="slotProps">
                <slot name="imgUpload" v-bind="slotProps"></slot>
              </template>
            </mapgis-3d-projector-setting>
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
import videojs from "video.js";
import "videojs-contrib-hls";
import "video.js/dist/video-js.css";
import { emptyImage } from "../../UI/Base64Image/base64Image";
import { newGuid } from "../../Utils/util";
import VueOptions from "./components/OperationsItem.vue";
import OperationsItem from "./components/OperationsItem.vue";
import ProjectorLayerSelect from "./components/ProjectorLayerSelect.vue";
import projectorMixins from "./mixins/projector-mixins";
import {
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable
} from "../../WebGlobe/util";

window.projectorVideoDomMap = {};

export default {
  name: "mapgis-3d-projector-manager",
  inject: ["Cesium", "vueCesium", "viewer"],
  components: { OperationsItem, ProjectorLayerSelect },
  mixins: [projectorMixins],
  props: {
    ...VueOptions,
    projectorOverlayLayerList: {
      type: Array,
      default: () => []
    },
    currentLayerId: {
      type: String,
      default: ""
    },
    currentProjectorId: {
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
    },
    disabledImageUrlInput: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    projectorList: {
      get: function() {
        return this.currentProjectorOverlayLayer &&
          Object.keys(this.currentProjectorOverlayLayer).length > 0
          ? this.currentProjectorOverlayLayer.projectorList
          : [];
      },
      set: function(projectorList) {
        this.currentProjectorOverlayLayer.projectorList = projectorList;
        const projectorOverlayLayerList = [
          ...this.projectorOverlayLayerListCopy
        ];
        projectorOverlayLayerList.map(item => {
          if (item.id === this.currentProjectorOverlayLayer.id) {
            item.projectorList = [
              ...this.currentProjectorOverlayLayer.projectorList
            ];
            return item;
          }
        });
        this.projectorOverlayLayerListCopy = projectorOverlayLayerList;
        this.$emit(
          "update-projectorOverlayLayerList",
          this.projectorOverlayLayerListCopy
        );
      }
    },
    listPagination() {
      return this.isBatch ? false : this.pagination;
    },
    layerSelectDefaultValue() {
      return this.currentProjectorOverlayLayer &&
        Object.keys(this.currentProjectorOverlayLayer).length > 0
        ? this.currentProjectorOverlayLayer.name
        : "";
    }
  },
  watch: {
    projectorOverlayLayerList: {
      handler() {
        this.projectorOverlayLayerListCopy = JSON.parse(
          JSON.stringify(this.projectorOverlayLayerList)
        );
        if (this.projectorOverlayLayerListCopy.length > 0) {
          // 默认取第一个
          // this.currentProjectorOverlayLayer = this.projectorOverlayLayerListCopy[0];
          this.layerSelectOptions = [];
          for (let i = 0; i < this.projectorOverlayLayerListCopy.length; i++) {
            const { id, name } = this.projectorOverlayLayerListCopy[i];
            this.layerSelectOptions.push({ id, name });
          }
          if (this.currentLayerId) {
            this.currentProjectorOverlayLayer = this.projectorOverlayLayerListCopy.find(
              item => item.id === this.currentLayerId
            );
            this._initPutProjectors();
          }
        }
      },
      deep: true,
      immediate: true
    },
    projectorList: {
      handler() {
        this.pagination.total = this.projectorList
          ? this.projectorList.length
          : 0;
        this.reflush = !this.reflush;
      },
      deep: true,
      immediate: true
    },
    currentLayerId: {
      handler() {
        this.currentProjectorOverlayLayer = this.projectorOverlayLayerListCopy.find(
          item => item.id === this.currentLayerId
        );
        this._initPutProjectors();
      },
      immediate: true
    },
    currentProjectorId: {
      handler() {
        this.currentEditProjector = this.projectorList.find(
          item => item.id === this.currentProjectorId
        );
        if (this.currentEditProjector) {
          const { x, y, z } = this.currentEditProjector.params.cameraPosition;
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
      info: "如需投放到地形上,请开启深度检测",
      reflush: true,
      projectorOverlayLayerListCopy: [], //图层数组
      layerSelectOptions: [], //图层选中框信息
      currentProjectorOverlayLayer: {}, //当前选中图层
      currentEditProjector: null, //当前编辑projector对象
      tabBarStyle: {
        margin: "0",
        textAlign: "center"
        // borderBottom: "1px solid #F0F0F0"
      },
      emptyImage: undefined,
      imageStyle: {
        height: "150px",
        margin: "0 auto"
      },
      activeKey: "1",
      activeIndex: undefined,
      isBatch: false, //是否批量操作
      selectedIds: [], //选中projector的id集合
      pagination: {
        onChange: page => {
          // console.log(page);
          this.pagination.current = page;
        },
        current: 1,
        size: "small",
        pageSize: 20
      },
      // graphicsLayer: undefined,
      // 是否进入设置状态
      isEdit: false,
      //是否开启缓存区
      isLogarithmicDepthBufferEnable: false
    };
  },
  created() {},
  mounted() {
    this.mount();
    this.emptyImage = emptyImage();
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
      const { viewer } = this;
      //缓存区设置
      this.isLogarithmicDepthBufferEnable = isLogarithmicDepthBufferEnable(
        viewer
      );
      setLogarithmicDepthBufferEnable(false, viewer);
    },
    unmount() {
      this.$emit("unload", this);
      //缓存区设置
      if (
        this.isLogarithmicDepthBufferEnable !==
        isLogarithmicDepthBufferEnable(this.viewer)
      ) {
        setLogarithmicDepthBufferEnable(
          this.isLogarithmicDepthBufferEnable,
          this.viewer
        );
      }
    },
    _initPutProjectors() {
      this.viewer.scene.visualAnalysisManager.removeAll();
      for (let i = 0; i < this.projectorList.length; i++) {
        const projector = this.projectorList[i];
        if (projector.isProjected) {
          this.putProjector(projector);
        } else {
          this.cancelPutProjector(projector);
        }
      }
    },
    /**
     * 修改图层名
     */
    _changeLayerName({ id, dataIndex, value }) {
      const projectorOverlayLayerList = [...this.projectorOverlayLayerListCopy];
      let target = projectorOverlayLayerList.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.projectorOverlayLayerListCopy = projectorOverlayLayerList;
        this.$emit(
          "update-projectorOverlayLayerList",
          this.projectorOverlayLayerListCopy
        );
      }
    },
    /**
     * 添加图层
     */
    _addLayer(newLayer) {
      this.projectorOverlayLayerListCopy.push(newLayer);
      this.$emit(
        "update-projectorOverlayLayerList",
        this.projectorOverlayLayerListCopy
      );
    },
    /**
     * 删除图层
     */
    _deleteLayer(id) {
      const projectorOverlayLayerList = [...this.projectorOverlayLayerListCopy];
      this.projectorOverlayLayerListCopy = projectorOverlayLayerList.filter(
        item => item.id !== id
      );
      if (
        this.currentProjectorOverlayLayer &&
        Object.keys(this.currentProjectorOverlayLayer).length > 0 &&
        this.currentProjectorOverlayLayer.id === id
      ) {
        // currentEditProjector一定在currentProjectorOverlayLayer里
        this.currentProjectorOverlayLayer = {};
        this.currentEditProjector = null;
      }
      this.$emit(
        "update-projectorOverlayLayerList",
        this.projectorOverlayLayerListCopy
      );
    },
    /**
     * 更改图层名
     */
    _changeLayer(val) {
      this.currentProjectorOverlayLayer = this.projectorOverlayLayerListCopy.find(
        item => item.name === val
      );
      this.viewer.scene.visualAnalysisManager.removeAll();
      for (let i = 0; i < this.projectorList.length; i++) {
        const projector = this.projectorList[i];
        if (projector.isProjected) {
          this.putProjector(projector);
        } else {
          this.cancelPutProjector(projector);
        }
      }
    },
    /**
     * 更改tab标签
     */
    _tabChange(e) {
      if (
        this.activeIndex !== undefined &&
        !!this.projectorList[this.activeIndex]
      ) {
        if (e === "2") {
          // 切换到配置界面，直接投放已选中的视频
          this.currentEditProjector = null;
          this.isEdit = true;
          setTimeout(() => {
            this.activeKey = e;
            this.currentEditProjector = this.projectorList[this.activeIndex];
          }, 50);
        } else if (e === "1") {
          this.activeKey = e;
          // 切换到列表界面，恢复投放状态，先取消投放
          // 如果在进入配置界面之前已投放，则重新投放（以确保投放参数与之前投放的参数保持一致）
          this.cancelPutProjector(this.currentEditProjector);
          if (this.currentEditProjector.isProjected) {
            this.putProjector(this.currentEditProjector);
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
      if (!item) {
        return;
      }
      // 如果是点击删除按钮触发的，这个item已经被删除，则不需要往后走
      const projector = this.projectorList.find(pro => pro.id === item.id);
      if (!projector) {
        return;
      }
      this.activeIndex = index;
    },
    /**
     * 新建projector
     */
    _newProjector() {
      const guid = newGuid();
      const newProjector = {
        id: guid, // 视频id
        name: "newProjector", // 视频名称
        description: "", //描述
        isProjected: false, // 是否开启视频投放
        params: {
          projectorType: "video",
          imgUrl: "",
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
          hintLineVisible: true, // 是否显示投放区域线
          areaCoords: [],
          renderType: 0, //选择投放方式是绘制还是摄像头参数输入， 0:根据摄像头参数投放，1：指定区域投放
          heightReference: 2, //0:使用areaCoords坐标中的Z;1:忽略areaCoords坐标中的z,使用offsetHeight指定的高度;2:贴场景；默认贴
          offsetHeight: 5 //离地高度
        }
      };
      if (!window.graphicsLayer) {
        window.graphicsLayer = new Cesium.GraphicsLayer(viewer);
        let vueKey = "default";
        let vueIndex = this.currentProjectorOverlayLayer.id;
        viewer.scene.layers.appendGraphicsLayer(window.graphicsLayer);
        window.vueCesium.GraphicsLayerManager.addSource(
          vueKey,
          vueIndex,
          window.graphicsLayer
        );
      }
      this.isEdit = false;
      this.putProjector(newProjector);
      this.currentEditProjector = newProjector;
      this.activeKey = "2";
    },
    /**
     * 批量删除
     */
    _deleteProjectors() {
      const projectorList = [...this.projectorList];
      const { selectedIds } = this;
      for (let i = 0; i < selectedIds.length; i++) {
        const projector = projectorList.find(
          item => item.id === selectedIds[i]
        );
        if (projector.params.areaCoords && projector.params.areaCoords.length) {
          this.removeGraphic(projector.id);
        } else {
          // 取消被删除projector的投放
          this.cancelPutProjector(projector);
          if (
            this.currentEditProjector &&
            this.currentEditProjector.id === selectedIds[i]
          ) {
            this.currentEditProjector = null;
          }
        }
      }
      this.projectorList = projectorList.filter(
        item => !selectedIds.includes(item.id)
      );
      this.selectedIds = [];
    },
    _isProjectedList() {
      const projectorList = [...this.projectorList];
      const list = projectorList.filter(item => item.isProjected);
      return list || [];
    },
    /**
     * 批量投放
     */
    _putProjectors() {
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
            vm._continuePutProjectors();
          }
        });
      } else {
        this._continuePutProjectors();
      }
    },
    _continuePutProjectors() {
      const { selectedIds } = this;
      for (let i = 0; i < selectedIds.length; i++) {
        const projector = this.projectorList.find(
          item => item.id === selectedIds[i]
        );
        this.putProjector(projector);
      }
      const projectorList = [...this.projectorList];
      projectorList.map(item => {
        if (selectedIds.indexOf(item.id) > -1) {
          item.isProjected = true;
          return item;
        }
      });
      this.projectorList = projectorList;
    },
    /**
     * 批量取消投放
     */
    _cancelPutProjectors() {
      const { selectedIds } = this;
      for (let i = 0; i < selectedIds.length; i++) {
        const projector = this.projectorList.find(
          item => item.id === selectedIds[i]
        );
        this.cancelPutProjector(projector);
      }
      const projectorList = [...this.projectorList];
      projectorList.map(item => {
        if (selectedIds.indexOf(item.id) > -1) {
          item.isProjected = false;
          return item;
        }
      });
      this.projectorList = projectorList;
    },
    /**
     * 跳转到projector配置界面
     */
    _onGotoSetting(projector, index) {
      this.currentEditProjector = null;
      this.isEdit = true;
      setTimeout(() => {
        this.activeIndex = index;
        this.activeKey = "2";
        this.currentEditProjector = projector;
      }, 50);
    },
    /**
     * 更新projector参数
     */
    _updateSettings(settings) {
      let target = this.projectorList.find(item => item.id === settings.id);
      let projectorList = [...this.projectorList];
      if (target) {
        // 编辑
        this.projectorList = projectorList.map(item => {
          if (item.id === settings.id) {
            return settings;
          }
          return item;
        });
      } else {
        // 新建
        projectorList.push(settings);
        this.$emit(
          "update-projectorOverlayLayerList",
          this.projectorOverlayLayerListCopy
        );
        this.projectorList = projectorList;
      }
      this.activeKey = "1";
    },
    /**
     * 取消设置
     */
    _cancelSetting() {
      this.activeKey = "1";
    },
    /**
     * 删除projector
     */
    _onDeleteProjector(id) {
      const projectorList = [...this.projectorList];
      let projector = projectorList.find(item => item.id == id);
      if (projector.params.areaCoords && projector.params.areaCoords.length) {
        this.removeGraphic(projector.id);
      } else {
        this.cancelPutProjector(projector);
      }
      this.projectorList = projectorList.filter(item => item.id !== id);
      if (this.currentEditProjector && this.currentEditProjector.id === id) {
        this.currentEditProjector = null;
      }
    },

    // 移除graphic
    removeGraphic(graphicId) {
      if (window.graphicsLayer) {
        window.graphicsLayer.removeGraphicByID(graphicId + "graphic");
      }
    },
    /**
     * 单个投放/取消投放
     */
    _onPutProjector(projector) {
      let isProjected = false;
      let scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
        projector.id
      );
      if (scenePro) {
        // 视频已经被投放，则取消投放
        this.cancelPutProjector(projector);
        isProjected = false;
        this._changeIsProjected(isProjected, projector.id);
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
              vm.putProjector(projector);
              isProjected = true;
              vm._changeIsProjected(isProjected, projector.id);
            }
          });
        } else {
          this.putProjector(projector);
          isProjected = true;
          this._changeIsProjected(isProjected, projector.id);
        }
      }
    },
    _changeIsProjected(isProjected, id) {
      const projectorList = [...this.projectorList];
      let target = projectorList.find(item => item.id === id);
      if (target) {
        target.isProjected = isProjected;
        this.projectorList = projectorList;
      }
    },
    /**
     * 定位到摄像机位置
     */
    _onLocate(item) {
      const {
        cameraPosition,
        orientation,
        areaCoords,
        areaType,
        renderType
      } = item.params;
      const { Cesium, viewer } = this;
      // 摄像头参数投放方式下，projectAreaCoords为undefined
      if (renderType === 0) {
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
      } else {
        let xmin, ymin, xmax, ymax;
        if (areaType === "rectangle") {
          xmin = Math.min(areaCoords[0][0], areaCoords[1][0]);
          ymin = Math.min(areaCoords[0][1], areaCoords[1][1]);
          xmax = Math.max(areaCoords[0][0], areaCoords[1][0]);
          ymax = Math.max(areaCoords[0][1], areaCoords[1][1]);
        } else if (areaType === "polygon") {
          for (let i = 0; i < areaCoords.length; i++) {
            if (xmin === undefined) {
              xmin = areaCoords[i][0];
            } else {
              xmin = Math.min(xmin, areaCoords[i][0]);
            }
            if (ymin === undefined) {
              ymin = areaCoords[i][1];
            } else {
              ymin = Math.min(ymin, areaCoords[i][1]);
            }
            if (xmax === undefined) {
              xmax = areaCoords[i][0];
            } else {
              xmax = Math.max(xmax, areaCoords[i][0]);
            }
            if (ymax === undefined) {
              ymax = areaCoords[i][1];
            } else {
              ymax = Math.max(ymax, areaCoords[i][1]);
            }
          }
        }
        const rectangle = new Cesium.Rectangle.fromDegrees(
          xmin,
          ymin,
          xmax,
          ymax
        );
        // 绘制投放方式下
        viewer.camera.flyTo({
          destination: rectangle
        });
      }
    }
  }
};
</script>

<style scoped>
.projector-layer-select-div {
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color-split);
}
.list-pane {
  position: relative;
}
.projector-list {
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
  /* max-height: 394px; */
  /* overflow: hidden;
  overflow-y: auto; */
  /* padding-top: 10px; */
  /* height: 394px; */
  height: calc(60vh);
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
