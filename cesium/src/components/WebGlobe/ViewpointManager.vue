<template>
  <div class="mapgis-3d-viewpoint-manager" v-show="manager">
    <!-- <div class="viewpoint-header">
        <label class="title">设置</label>
        <div @mouseenter="hover = true" @mouseleave="hover = false">
            <img
                v-show="!hover"
                class="closeButton2"
                src="./ViewpointManager/关闭2.png"
                @click="closePanel"
            />
            <img
                v-show="hover"
                class="closeButton2"
                src="./ViewpointManager/关闭2hover.png"
                @click="closePanel"
            />
        </div>
    </div> -->

    <viewpoint-editor
      v-model="config"
      :editTuple="editTuple"
      @update="changeViewpoint($event)"
      @change="
        e => {
          editor = e;
        }
      "
      :show="editor"
      :mode="mode"
    />

    <div v-for="(item, index) in testGroup" :key="index">
      <mapgis-ui-collapse
        v-model="activeKey"
        accordion
        class="collapse"
        @change="changeActivekey"
      >
        <mapgis-ui-collapse-panel :key="index" class="collapse-item">
          <template slot="header" v-if="showEdit || editIndex !== index + 1">{{
            item.viewGroupName
          }}</template>
          <template slot="header" v-else>
            <mapgis-ui-input
              :style="{ width: '150px', height: '22px' }"
              v-model="item.viewGroupName"
            ></mapgis-ui-input>
          </template>
          <mapgis-ui-iconfont
            slot="extra"
            type="mapgis-play-circle"
            @click.stop="clickFlyPano(index)"
          />
          <mapgis-ui-iconfont
            slot="extra"
            type="mapgis-edit"
            class="edit"
            @click.stop="clickEdit(index)"
          />
          <mapgis-ui-iconfont
            slot="extra"
            type="mapgis-delete"
            @click.stop="clickDelete(index, item)"
          />
          <div class="collapse-item-div">
            <div class="content" v-if="item.viewGroupItems.length > 0">
              <mapgis-ui-collapse
                v-for="(itemChild, indexChild) in item.viewGroupItems"
                :key="indexChild"
              >
                <mapgis-ui-collapse-panel :key="indexChild">
                  <template
                    slot="header"
                    v-if="showEditChild || editChildIndex !== indexChild + 1"
                    >{{ itemChild.name }}</template
                  >
                  <template slot="header" v-else>
                    <mapgis-ui-input
                      :style="{ width: '150px', height: '22px' }"
                      v-model="itemChild.name"
                    ></mapgis-ui-input>
                  </template>
                  <mapgis-ui-iconfont
                    slot="extra"
                    type="mapgis-play-circle"
                    @click.stop="flyTo(itemChild, indexChild)"
                  />
                  <mapgis-ui-iconfont
                    slot="extra"
                    type="mapgis-edit"
                    class="edit"
                    @click.stop="clickEditChild(index, indexChild)"
                  />
                  <mapgis-ui-iconfont
                    slot="extra"
                    type="mapgis-delete"
                    @click.stop="clickDeleteChild(index, indexChild, itemChild)"
                  />
                  <div class="collapse-item-content">
                    <div class="collapse-item-left">
                      <img
                        :src="itemChild.image"
                        alt=""
                        @click.stop="clickImg(itemChild)"
                      />
                      <div
                        class="item-more-tool"
                        v-show="active >= 0"
                        ref="menu"
                        @mouseleave="active = -1"
                      >
                        <div
                          @click="editViewpoint(active)"
                          class="more-tool-btn"
                        >
                          <mapgis-ui-iconfont
                            type="mapgis-bianji"
                          ></mapgis-ui-iconfont>
                          编辑
                        </div>
                        <div
                          @click="deleteViewpoint(active)"
                          class="more-tool-btn"
                        >
                          <mapgis-ui-iconfont
                            type="mapgis-shanchu"
                          ></mapgis-ui-iconfont>
                          删除
                        </div>
                      </div>
                    </div>
                    <div class="collapse-item-right">
                      <div>
                        <div :style="{ 'margin-bottom': '10px' }">
                          <mapgis-ui-button
                            class="collapse-item-right-button"
                            @click.stop="editViewpoint(index, indexChild)"
                            >重新获取</mapgis-ui-button
                          >
                        </div>
                        <div :style="{ position: 'relative', left: '-10px' }">
                          时间:
                          <mapgis-ui-input
                            class="collapse-item-right-input"
                            placeholder="Basic usage"
                            v-model="itemChild.duration"
                          ></mapgis-ui-input>
                          s
                        </div>
                      </div>
                    </div>
                  </div>
                </mapgis-ui-collapse-panel>
              </mapgis-ui-collapse>
            </div>
            <span class="addView" @click.stop="addViewpoint(index)"
              >添加视点</span
            >
          </div>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
    </div>

    <div class="viewpoint-footer">
      <mapgis-ui-button
        type="primary"
        :block="true"
        v-if="!selectMode"
        @click="addViewpointGroup"
        >添加视点组
      </mapgis-ui-button>

      <mapgis-ui-button
        type="default"
        :block="true"
        v-else
        @click="deleteViewpoint"
        >删除视点
      </mapgis-ui-button>
    </div>
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import ViewpointEditor from "./ViewpointManager/ViewpointEditor";
import { emptyImage } from "../UI/Base64Image/base64Image";

export default {
  name: "mapgis-3d-viewpoint-manager",
  components: {
    ViewpointEditor
  },
  mixins: [ServiceLayer],
  props: {
    // 视点管理配置信息
    viewpointConfig: {
      type: Array,
      default: undefined
    }
  },
  model: {
    prop: "viewpointConfig",
    event: "change"
  },
  mounted() {
    this.mount();
  },
  watch: {
    items: {
      handler: function() {
        this.$emit("change", this.items);
      },
      deep: true
    },
    viewpointConfig: {
      handler: function(e) {
        if (e !== undefined && e !== null) {
          this.items = e;
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      /* loading删除时的等待 */
      loading: false,
      /* 点击edit下标显示input */
      editIndex: 1,
      /* 点击editChild下标显示input */
      editChildIndex: 1,
      /* 展示编辑input */
      showEdit: true,
      /* 展示子节点编辑input */
      showEditChild: true,
      /* editTuple */
      editTuple: [],
      /* 测试数据 */
      testGroup: [
        {
          viewGroupName: "one",
          viewGroupItems: [
            {
              duration: 3,
              image: require("./ViewpointManager/upload/globe.jpg"),
              orientation: { heading: 360, roll: 0, pitch: -90 },
              name: "视点_1",
              destination: {
                x: 104,
                y: 28.011763478186143,
                z: 10071759.273162084
              }
            },
            {
              duration: 3,
              image: require("./ViewpointManager/upload/china.jpg"),
              orientation: { heading: 360, roll: 0, pitch: -90 },
              name: "视点_2",
              destination: {
                x: 108.91,
                y: 32.52,
                z: 5000000.0
              }
            },
            {
              duration: 3,
              image: require("./ViewpointManager/upload/wuhan.jpg"),
              orientation: { heading: 360, roll: 0, pitch: -90 },
              name: "视点_3",
              destination: {
                x: 114.21,
                y: 30.42,
                z: 150000.0
              }
            }
          ]
        }
      ],
      currentItem: 0,
      selectMode: false,
      mode: undefined, //add edit
      selectItems: [],
      editor: false,
      editItem: undefined,
      hover: undefined,
      manager: true,
      imgIndex: undefined,
      active: -1,
      config: undefined,
      clickActive: false,
      activeKey: ["1"],
      // 设置初始视点对象
      originViewPoint: {
        name: "",
        image: emptyImage(),
        destination: {
          x: 0,
          y: 0,
          z: 0
        },
        orientation: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        duration: 0.5
      },

      /* 视点列表 */
      items: [
        {
          name: "全球",
          image: require("./ViewpointManager/upload/globe.jpg"),
          destination: {
            x: 104,
            y: 28.011763478186143,
            z: 10071759.273162084
          },
          orientation: {
            heading: 360,
            pitch: -90,
            roll: 0
          },
          duration: 0.5
        },
        {
          name: "中国",
          image: require("./ViewpointManager/upload/china.jpg"),
          destination: {
            x: 108.91,
            y: 32.52,
            z: 5000000.0
          },
          orientation: {
            heading: 360,
            pitch: -90,
            roll: 0
          },
          duration: 0.5
        },
        {
          name: "武汉",
          image: require("./ViewpointManager/upload/wuhan.jpg"),
          destination: {
            x: 114.21,
            y: 30.42,
            z: 150000.0
          },
          orientation: {
            heading: 360,
            pitch: -90,
            roll: 0
          },
          duration: 0.5
        }
      ]
    };
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    /**
     * @function clickFlyPano
     * @description 飞行控件
     */
    async clickFlyPano(index) {
      const vm = this;
      const { viewer, Cesium } = this;

      const marksIndex = 2;
      const pitchValue = -20;

      const marks = this.testGroup[index].viewGroupItems;

      for (var i = 0; i < marks.length; i++) {
        (function(i, data) {
          // 匿名函数的形参
          setTimeout(function() {
            viewer.scene.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                marks[i].destination.x,
                marks[i].destination.y,
                marks[i].destination.z
              ), //定位坐标点，建议使用谷歌地球坐标位置无偏差
              duration: marks[i].duration, //定位的时间间隔,
              orientation: {
                heading: Cesium.Math.toRadians(marks[i].orientation.heading),
                pitch: Cesium.Math.toRadians(marks[i].orientation.pitch),
                roll: Cesium.Math.toRadians(marks[i].orientation.roll)
              }
            });
            if (i === marks.length) {
              console.log("飞行结束！");
            }
          }, 2500 * i); // 还是每秒执行一次，不是累加的
        })(i, "其他参数"); // 实参，这里把要用的参数传进去
      }
    },

    /**
     * @function clickDelete
     * @description 删除视点管理组item
     */
    clickDelete(index, item) {
      const vm = this;
      this.$confirm({
        content: `确定删除'${item.viewGroupName}'?`,
        onOk() {
          vm.testGroup.splice(index, 1);
        },
        okText: "确定",
        cancelText: "取消",
        onCancel() {}
      });
      console.log(index);
    },

    /**
     * @function clickDeleteChild
     * @description 删除视点管理组子节点
     */
    clickDeleteChild(index, indexChild, item) {
      console.log(item);
      const vm = this;
      this.$confirm({
        content: `确定删除'${item.name}'?`,
        onOk() {
          vm.testGroup[index].viewGroupItems.splice(indexChild, 1);
        },
        okText: "确定",
        cancelText: "取消",
        onCancel() {}
      });
    },

    /**
     * @function changeActivekey
     * @description 打印修改active面板
     */
    changeActivekey(content) {
      console.log(content);
    },

    /**
     * @function ClickEdit
     * @description 改变显示组名修改input
     */
    clickEdit(index) {
      this.editIndex = index + 1;
      console.log(this.editIndex);
      this.showEdit = !this.showEdit;
    },

    /**
     * @function clickEditChild
     * @description 改变子节点显示组名修改并显示edit编辑器
     */
    clickEditChild(index, indexChild) {
      this.editChildIndex = indexChild + 1;
      this.showEditChild = !this.showEditChild;
      // this.editViewpoint(index, indexChild);
    },

    /**
     * @function flyTo
     * @description 视点跳转
     */
    flyTo(item, i) {
      // if (this.clickActive === i) {
      //   this.clickActive = undefined;
      // } else {
      //   this.clickActive = i;
      // }
      const { viewer, Cesium } = this;
      this.currentItem = i;

      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          item.destination.x,
          item.destination.y,
          item.destination.z
        ),
        orientation: {
          heading: Cesium.Math.toRadians(item.orientation.heading),
          pitch: Cesium.Math.toRadians(item.orientation.pitch),
          roll: Cesium.Math.toRadians(item.orientation.roll)
        },
        duration: item.duration
      });
    },
    mount() {
      this.$emit("loaded", this);
    },
    unmount() {
      this.$emit("unload");
    },
    /* 添加视点组 */

    addViewpointGroup(content) {
      this.testGroup.push({ viewGroupName: "飞行视点组", viewGroupItems: [] });

      console.log("content");
    },
    /* 增加视点 */
    addViewpoint(index) {
      const vm = this;
      this.editTuple = [index, undefined];
      // 修改：新增视点默认为初始化参数
      vm.config = vm.originViewPoint;
      this.editor = true;
      this.mode = "add";
      // if (vm.currentItem >= 0 ) {
      //     /* 新增视点时默认填充已有的视点参数 */
      //     vm.config = vm.items[vm.currentItem];
      // }
    },
    /* 激活单个视点的编辑、删除菜单 */
    handleMenu(i, e) {
      // console.log(i, e);
      this.active = i;
      if (this.active >= 0) {
        if (this.active % 2 === 0) {
          /* 设置菜单的位置 */
          this.$refs.menu.style.left = `${e.x}px`;
          this.$refs.menu.style.top = `${e.y}px`;
        } else {
          this.$refs.menu.style.left = `${e.x - 88}px`;
          this.$refs.menu.style.top = `${e.y}px`;
        }
      }
    },
    /* 编辑视点 */
    editViewpoint(index, indexChild) {
      // 确定修改的父子节点关系
      this.editTuple = [index, indexChild];
      this.editItem = indexChild;
      this.config = this.testGroup[index].viewGroupItems[indexChild];
      this.editor = true;
      this.mode = "edit";
    },
    /* 处理编辑器传回的config参数 */
    changeViewpoint(event) {
      console.log(event);
      const val = event[0];
      const editTuple = event[1];
      const vm = this;
      // 先判断新增或编辑视点的name是否为空

      if (vm.mode === "add") {
        if (val.name === "") {
          val.name =
            "视点" +
            "_" +
            (vm.testGroup[editTuple[0]].viewGroupItems.length + 1);
        }
        /* 增加视点 */
        console.log(vm.testGroup);
        vm.testGroup[editTuple[0]].viewGroupItems.push(val);
      } else if (vm.mode === "edit") {
        if (val.name === "") {
          val.name =
            "视点" + "_" + (vm.testGroup[editTuple[0]].viewGroupItems + 1);
        }
        /* 编辑视点 */
        Object.assign(
          vm.testGroup[editTuple[0]].viewGroupItems[editTuple[1]],
          val
        );
      }
    },
    /* 复选框选择视点 */
    selectItem(e, i) {
      const vm = this;
      /* 记录复选框选择的视点 */
      if (e.target.checked) {
        vm.selectItems.push(i);
        vm.selectMode = true;
      } else {
        let index = vm.selectItems.indexOf(i);
        vm.selectItems.splice(index, 1);
        if (vm.selectItems.length === 0) {
          vm.selectMode = false;
        }
      }
    },
    /* 删除视点 */
    deleteViewpoint(i) {
      const vm = this;
      if (vm.selectMode) {
        /* 删除复选框勾选的视点 */
        vm.selectItems.forEach(function(index) {
          vm.items.splice(index, 1);
        });
        vm.selectItems = [];
        vm.selectMode = false;
      } else {
        /* 删除单个视点 */
        vm.items.splice(i, 1);
      }

      if (vm.items.length === 0) {
        /* 视点列表为空时，当前视点为空 */
        vm.currentItem = -1;
      } else if (vm.items.length <= vm.currentItem) {
        /* 当前视点被删除时，将当前视点设为第一个视点 */
        vm.currentItem = -1;
      }
    },
    /* 关闭视点编辑器 */
    closePanel() {
      this.manager = false;
    }
  }
};
</script>

<style scoped lang="less">
.mapgis-3d-viewpoint-manager {
  ::v-deep .mapgis-ui-collapse-content-box {
    padding: 0;
  }
  ::v-deep .mapgis-ui-collapse .mapgis-ui-collapse-item {
    border-bottom: 0;
  }
  ::v-deep
    .mapgis-ui-collapse
    > .mapgis-ui-collapse-item-active
    > .mapgis-ui-collapse-header {
    background-color: var(--primary-6);
  }
  width: 100%;
  .collapse {
    .collapse-item {
      .collapse-item-div {
        .content {
          margin: 0 0 0 16px;
          .collapse-item-content {
            .collapse-item-left {
              margin: 10px 30px 10px -30px;
            }
            .collapse-item-right {
              div {
                .collapse-item-right-input {
                  width: 60px;
                }
                .collapse-item-right-button {
                }
              }
            }
            .collapse-item-right > div {
              padding: 0px 10px 0px 10px;
              position: relative;
              top: 26px;
            }
          }
          .collapse-item-content > div {
            display: inline-block;
            padding: 10 20px;
            img {
              width: 100px;
              height: 80px;
            }
          }
        }
      }
      .content {
        border-bottom: 1px solid var(--border-color-base);
      }
      text-align: center;
      span {
        display: inline-block;
        width: 100px;
        height: 25px;
        line-height: 25px;
        border: 1px solid var(--border-color-base);
        background-color: var(--border-color-base);
        border-top: 0;
        color: #6296ff;
        cursor: pointer;
      }
      span:hover {
        color: #3b7cff;
      }
    }
  }
  ::v-deep .mapgis-ui-collapse-header {
    text-align: left;
    border-left: unset !important;
  }
  .edit {
    margin: 0 5px;
  }
  .viewpoint-footer {
    border-top: 0px;
  }
}
</style>
