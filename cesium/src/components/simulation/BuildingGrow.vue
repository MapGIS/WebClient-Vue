<template>
  <div>
    <mapgis-ui-card
      size="small"
      hoverable
      :style="{ width: `${width}px` }"
      class="mapgis-city-grow"
    >
      <mapgis-ui-slider
        v-if="enableSteps"
        :style="{ width: width }"
        :tip-formatter="formatter"
        :min="minSlider"
        :max="maxSlider"
        v-model="sliderValue"
        :marks="marks"
        :step="stepsCopy"
        @change="onSliderChange"
      ></mapgis-ui-slider>
      <mapgis-ui-slider
        v-else
        :style="{ width: width }"
        :tip-formatter="formatter"
        :min="minSlider"
        :max="maxSlider"
        v-model="sliderValue"
        :marks="marks"
        :step="null"
        @change="onSliderChange"
      ></mapgis-ui-slider>
      <span class="mapgis-city-grow-starttime" v-if="startTimeCopy !== ''"
        >起始时间:{{ startTimeCopy }}</span
      >
      <div class="mapgis-city-grow-toolbar">
        <mapgis-ui-tooltip>
          <template slot="title">
            跳转至开头
          </template>
          <mapgis-ui-iconfont
            type="mapgis-chevrons-left"
            @click.capture.stop="JumpToBegin"
          />
        </mapgis-ui-tooltip>
        <mapgis-ui-tooltip>
          <template slot="title">
            快退一步
          </template>
          <mapgis-ui-iconfont
            type="mapgis-chevron-left"
            @click.capture.stop="stepBack"
          />
        </mapgis-ui-tooltip>
        <mapgis-ui-iconfont
          v-if="!isStartGrow"
          type="mapgis-play-circle-fill"
          class="mapgis-city-grow-toolbar-main"
          @click.capture.stop="startGrow"
        />
        <mapgis-ui-iconfont
          v-else
          type="mapgis-zanting"
          class="mapgis-city-grow-toolbar-main"
          @click.capture.stop="stopGrow"
        />
        <mapgis-ui-tooltip>
          <template slot="title">
            快进一步
          </template>
          <mapgis-ui-iconfont
            type="mapgis-chevron-right"
            @click.capture.stop="stepForward"
          />
        </mapgis-ui-tooltip>
        <mapgis-ui-tooltip>
          <template slot="title">
            跳转至结尾
          </template>
          <mapgis-ui-iconfont
            type="mapgis-chevrons-right"
            @click.capture.stop="JumpToEnd"
          />
        </mapgis-ui-tooltip>
      </div>
      <span class="mapgis-city-grow-endtime" v-if="endTimeCopy !== ''"
        >结束时间:{{ endTimeCopy }}</span
      >
    </mapgis-ui-card>
  </div>
</template>

<script>
import BaseLayer from "../Analysis/BaseLayer";
import moment from "moment";

export default {
  name: "mapgis-3d-building-grow",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    width: {
      type: Number,
      default: 500
    },
    enableSteps: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Number,
      default: 2
    },
    // 开始点击单体生长时间轴前是否显示整个模型，默认不显示
    isVisibleBeforeGrowing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerVueIndex: this.vueIndex,
      layerTree: [],
      layerIds: [],
      allLayerIds: [],
      sortDate: [],
      isGrowing: true,
      marks: {},
      stepsCopy: 1,
      currentNode: 0,
      startNode: 0,
      endNode: 0,

      tree: undefined,
      mapgism3dNode: undefined,
      minSlider: 0,
      maxSlider: 100,
      sliderValue: 0,
      startTimeCopy: "",
      endTimeCopy: "",
      isStartGrow: false,
      infinite: true,

      currentFps: -1
    };
  },
  watch: {
    steps: {
      handler(next) {
        this.stepsCopy = next;
      },
      immediate: true
    },
    vueIndex: {
      handler(next) {
        this.unmount();
        this.mount();
      }
    },
    isVisibleBeforeGrowing: {
      handler(next) {
        this.isVisibleBeforeGrowing = next;
        this.unmount();
        this.mount();
      }
    }
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      return this.m3dIsReady();
    },
    /**
     * 判断传入的m3d图层是否加载完毕
     */
    m3dIsReady() {
      let vm = this;
      const { vueCesium, vueKey, model, innerVueIndex } = this;
      return new Promise((resolve, reject) => {
        let layerIndex = 0;
        this.$_getM3DByInterval(
          function(m3ds) {
            if (m3ds && m3ds.length > 0) {
              if (
                !m3ds[layerIndex] ||
                !m3ds[layerIndex].hasOwnProperty("options") ||
                !m3ds[layerIndex].options
              ) {
                reject(null);
              } else {
                resolve(m3ds[layerIndex]);
              }
            } else {
              reject(null);
            }
          },
          vueKey,
          innerVueIndex
        );
      });
    },
    mount() {
      const vm = this;
      const { innerVueIndex, vueKey, vueCesium } = this;
      const { viewer, enablePopup } = this;

      let promise = this.createCesiumObject();
      promise.then(find => {
        if (find && find.source) {
          let { source } = find;
          let m3d = source && source.length > 0 ? source[0] : undefined;
          if (m3d.m3dtree === undefined) {
            this.$message.warning("该m3d模型不能进行单体化建筑生长");
          }
          m3d.m3dtreeOptions = { createType: "ModelLoaded" };
          let tree = m3d ? m3d.m3dtree : undefined;
          vm.parseTree(tree);
          vm.$emit("loaded", { component: vm });
          let collection = new Cesium.PrimitiveCollection();
          vueCesium.BimManager.addSource(vueKey, innerVueIndex, m3d, {
            m3d: m3d,
            tree: tree,
            collection: collection,
            primitiveCollection: viewer.scene.primitives.add(collection)
          });
          debugger;
          // 1.通过构件树隐藏m3d模型
          if (!vm.isVisibleBeforeGrowing) {
            vm.hideRootNode();
          }
          // 2.对获取的树数据中name:时间 进行升序排序
          this.sortDateTime();
        }
      });
      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, innerVueIndex } = this;
      const { viewer } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        this.clearData();
      }
      this.$emit("unload", { component: this });
      vueCesium.BimManager.deleteSource(vueKey, innerVueIndex);
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    clearData() {
      this.showAllLayer();
      this.resetAllLayer();
      this.allLayerIds = [];
      this.layerTree = [];
    },
    resetAllLayer() {
      const { innerVueIndex, vueKey, vueCesium } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        let { m3d } = find.options;
        m3d.reset && m3d.reset();
      }
    },
    showAllLayer() {
      const { innerVueIndex, vueKey, vueCesium, allLayerIds } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        let { tree } = find.options;
        allLayerIds.forEach(layer => {
          let mapgism3dNode = tree.getM3DByName(layer);
          if (mapgism3dNode) {
            mapgism3dNode.forceInvisible = false;
          }
        });
      }
    },

    parseTree(tree) {
      let vm = this;
      let cbtree = this.loopTreeNode(tree, "", undefined);
      this.layerTree.splice(0, 1, cbtree);
    },
    loopTreeNode(node, prefix, parent) {
      const vm = this;
      let key = `${prefix}_${node.depth}`;
      vm.layerIds.push(/* key +  */ node.index);
      vm.allLayerIds.push(/* key +  */ node.index);
      let cbnode = {
        title: node.index,
        key: /*  key +  */ node.index,
        index: node.index,
        icon: "mapgis-sanweiditu",
        children: [],
        parent: parent,
        isleaf: false,
        count: 0,
        scopedSlots: { icon: "icon", title: "title" }
      };
      node.m3dtreeChildren.forEach(child => {
        let c = vm.loopTreeNode(child, key, cbnode);
        cbnode.children.push(c);
        cbnode.count += c.count;
      });
      if (cbnode.children.length <= 0) {
        [delete cbnode.children];
        cbnode.count = 1;
        cbnode.isleaf = true;
      }
      return cbnode;
    },
    // 隐藏整个tree
    hideRootNode(layers, currentIndex) {
      layers = layers || this.layerIds;
      const { vueKey, innerVueIndex, vueCesium, allLayerIds } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        const { tree } = find.options;
        if (!tree) return;
        for (let i = 0; i < layers.length; i++) {
          let layer = layers[i];
          if (currentIndex) {
            layer = layers[i].index;
          }
          let mapgism3dNode = tree.getM3DByName(layer);
          if (mapgism3dNode) {
            mapgism3dNode.forceInvisible = true;
          }
        }
      }
    },
    showLayerNode(layers) {
      let vm = this;
      layers = layers || this.layerIds;
      const { vueKey, innerVueIndex, vueCesium } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        const { tree } = find.options;
        if (!tree || !vm.isStartGrow) return;
        for (let i = 0; i < layers.length; i++) {
          let layer = layers[i];
          let mapgism3dNode = tree.getM3DByName(layer.index);
          if (mapgism3dNode) {
            mapgism3dNode.forceInvisible = false;
          }
        }
      }
    },
    // 查找整个树节点
    findRoot() {
      const { layerTree } = this;
      if (!layerTree || layerTree.length <= 0) return undefined;
      let root = layerTree[0];
      return root;
    },
    // 根据index值查找路径
    findTreePath(index) {
      let result = {
        paths: [],
        node: undefined
      };
      let root = this.findRoot();
      let find = this.findNode(root, index);
      let paths = [];
      this.findParent(find, paths);
      this.findChildren(find, paths);
      result.paths = paths;
      result.node = find;
      return result;
    },
    findNode(node, index) {
      const vm = this;
      let find = undefined;
      if (!node) return find;
      if (node.index == index) {
        return node;
      }
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          let child = node.children[i];
          find = vm.findNode(child, index);
          if (find) {
            break;
          }
        }
      }
      return find;
    },
    findParent(node, paths) {
      if (node && node.parent) {
        paths.push(node.parent);
        this.findParent(node.parent, paths);
      }
    },
    findChildren(node, paths) {
      if (node) {
        paths.push(node);
        if (node && node.children) {
          node.children.forEach(child => {
            this.findChildren(child, paths);
          });
        }
      }
    },
    //升序排序
    sortDateTime() {
      let vm = this;
      //先判断是否是年-月-日的日期格式
      let dateFormat = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
      this.layerIds = this.layerIds.filter(x => dateFormat.test(x));
      //  dateFormat = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/
      vm.sortDate = this.layerIds.sort(function(obj1, obj2) {
        let a = new Date(obj1) / 1000;
        let b = new Date(obj2) / 1000;
        return a > b ? 1 : -1;
      });
      // 为播放条的最大最小值赋值
      let length = vm.sortDate.length;
      vm.stepsCopy = vm.stepsCopy * 24 * 60 * 60;

      vm.minSlider = parseInt(moment(vm.sortDate[0]).valueOf() / 1000);
      vm.maxSlider = parseInt(moment(vm.sortDate[length - 1]).valueOf() / 1000);
      for (let i = 0; i < length; i++) {
        let key = parseInt(moment(vm.sortDate[i]).valueOf() / 1000);
        vm.marks[key] = {
          style: { display: "none" },
          label: parseInt(moment(vm.sortDate[i]).valueOf() / 1000)
        };
      }
      vm.startTimeCopy = vm.sortDate[0];
      vm.endTimeCopy = vm.sortDate[length - 1];
    },

    formatter(value) {
      let date = this.formatDate(value);
      return `${date}`;
    },
    formatDate(timestamp) {
      // 时间戳转时间 方法一：
      let time = new Date(timestamp * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      return y + "-" + this.addT(m) + "-" + this.addT(d);
      // 时间戳转时间 方法二：
      // return moment(timestamp).format("YYYY-MM-DD");
    },
    addT(m) {
      return m < 10 ? "0" + m : m;
    },
    // 做建筑节点跳转
    onSliderChange(e) {
      let vm = this;
      if (vm.infinite) return;
      // 先判断  1. stepsCopy == 0,则走按照建筑时间顺序生长 2.有stepsCopy != 0,则走播放条steps进度生长
      if (!vm.enableSteps) {
        for (let i = 0; i < vm.sortDate.length; i++) {
          if (e === parseInt(moment(vm.sortDate[i]).valueOf() / 1000)) {
            if (vm.currentFps > i) {
              let nodeArr = [];
              // 当 当前已播放进度 大于 要跳转的e位置，隐藏i之后的所有节点
              for (let j = i; j <= vm.currentFps; j++) {
                let node = vm.sortDate[j];
                nodeArr.push(node);
                vm.hideRootNode(nodeArr);
              }
              vm.currentFps = i;
            } else {
              // 当 当前已播放进度 小于 要跳转的e位置，显示i之前的所有节点
              for (let j = i; j >= vm.currentFps; j--) {
                let node = vm.sortDate[j];
                let allNode = vm.findTreePath(node);
                let nodeArr = allNode.paths;
                vm.showLayerNode(nodeArr);
              }
              vm.currentFps = i;
            }
          }
        }
      } else {
        // 2. 有stepsCopy != 0,则走播放条steps进度生长
        if (e <= vm.currentNode) {
          // 当 当前已播放进度 大于 要跳转的e位置，隐藏i之后的所有节点
          for (let i = 0; i < vm.sortDate.length; i++) {
            let sortDateTime = parseInt(
              moment(vm.sortDate[i]).valueOf() / 1000
            );
            let nodeArr = [];
            if (sortDateTime >= e) {
              let node = vm.sortDate[i];
              nodeArr.push(node);
              vm.hideRootNode(nodeArr);
            }
          }
          vm.currentFps = (e - vm.startNode) / vm.stepsCopy;
        } else {
          // 当 当前已播放进度 小于 要跳转的e位置， 显示i之前的所有节点
          for (let i = 0; i < vm.sortDate.length; i++) {
            let sortDateTime = parseInt(
              moment(vm.sortDate[i]).valueOf() / 1000
            );
            if (sortDateTime <= e) {
              let node = vm.sortDate[i];
              let allNode = vm.findTreePath(node);
              let nodeArr = allNode.paths;
              vm.showLayerNode(nodeArr);
            }
          }
          vm.currentFps = (e - vm.startNode) / vm.stepsCopy;
        }
      }
    },

    startGrow() {
      // 若初始不隐藏节点，则在开始生长后先将所有节点全部隐藏，再开始建筑生长
      if (this.isVisibleBeforeGrowing) {
        this.hideRootNode();
      }
      let vm = this;
      vm.isStartGrow = true;
      vm.infinite = false;
      const { vueKey, innerVueIndex, vueCesium, sortDate } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        const { tree } = find.options;
        if (!tree) return;
        vm.startNode = parseInt(moment(vm.sortDate[0]).valueOf() / 1000);
        vm.endNode = parseInt(
          moment(vm.sortDate[vm.sortDate.length - 1]).valueOf() / 1000
        );
        // 先分类：1.按照播放条steps进度生长 2.按照建筑时间顺序生长
        if (vm.enableSteps) {
          // 获取首尾两个节点，累加steps值
          let step = Math.ceil((vm.endNode - vm.startNode) / vm.stepsCopy);
          window.setInterval(() => {
            if (!vm.isStartGrow) return;
            vm.currentFps++;
            if (vm.currentFps > step) {
              vm.currentFps = -1;
              // 隐藏所有树节点
              vm.hideRootNode();
            }
            vm.currentNode = vm.startNode + vm.stepsCopy * vm.currentFps;
            vm.sliderValue = vm.currentNode;
            // 比较当前节点和sortDate数组中元素大小
            vm.compareSortDate(vm.currentNode);
          }, 1000);
        } else {
          // 循环显示模型树结构数据
          window.setInterval(() => {
            if (!vm.isStartGrow) return;
            vm.currentFps++;
            if (vm.currentFps > sortDate.length) {
              vm.currentFps = -1;
              // 隐藏所有树节点
              vm.hideRootNode();
            }
            let node = sortDate[vm.currentFps];
            let allNode = vm.findTreePath(node);
            let nodeArr = allNode.paths;
            vm.showLayerNode(nodeArr);
            vm.sliderValue = parseInt(
              moment(vm.sortDate[vm.currentFps]).valueOf() / 1000
            );
          }, 1000);
        }
      }
    },
    compareSortDate(currentNode) {
      let vm = this;
      for (let i = 0; i < vm.sortDate.length; i++) {
        if (parseInt(moment(vm.sortDate[i]).valueOf() / 1000) <= currentNode) {
          let node = vm.sortDate[i];
          let allNode = vm.findTreePath(node);
          let nodeArr = allNode.paths;
          vm.showLayerNode(nodeArr);
        }
      }
    },
    stopGrow() {
      let vm = this;
      vm.isStartGrow = false;
    },

    //跳转至开头
    JumpToBegin() {
      // 隐藏整个tree
      let vm = this;
      vm.currentFps = -1;
      vm.sliderValue = vm.startNode;
      this.hideRootNode();
    },
    JumpToEnd() {
      let vm = this;
      if (vm.enableSteps) {
        vm.currentFps = Math.ceil((vm.endNode - vm.startNode) / vm.stepsCopy);
      } else {
        vm.currentFps = vm.sortDate.length;
      }
      vm.sliderValue = vm.endNode;
      this.showAllLayer();
    },
    stepForward() {
      let vm = this;
      // 判断enableStep分支 找到下一个时间节点
      if (vm.enableSteps) {
        this.currentFps = this.currentFps + 4;
      } else {
        this.currentFps = this.currentFps + 2;
      }
    },
    stepBack() {
      let vm = this;
      // 判断enableStep分支 找到上一个时间节点
      if (vm.enableSteps) {
        this.currentFps = this.currentFps - 4;
      } else {
        this.currentFps = this.currentFps - 2;
      }
    }
  }
};
</script>

<style scoped>
.mapgis-city-grow {
  position: absolute;
  /* left: 10px;
  bottom: 10px; */
  margin: 0px auto;
}

.mapgis-city-grow-toolbar {
  display: flex;
  width: 110px;
  margin: 0px auto;
}

.mapgis-city-grow-toolbar-main:hover {
  color: #49a8ff;
}

.mapgis-city-grow-toolbar-main {
  color: #1890ff;
}

.mapgis-city-grow-toolbar > .anticon {
  font-size: 22px;
}

.mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 6px 12px;
}

.mapgis-city-grow-starttime {
  position: absolute;
  left: 10px;
}

.mapgis-city-grow-endtime {
  position: absolute;
  right: 10px;
  bottom: 12px;
}
</style>
