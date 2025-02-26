<template>
  <div class="mapgis-3d-bim-component-wrapper">
    <mapgis-ui-collapse-card
      class="mapgis-3d-bim-component"
      ref="card"
      position="top-left"
      :defaultCollapse="false"
      :outStyle="outStyle"
      :title="title"
      @toggle-main="handleBackMain"
    >
      <mapgis-ui-iconfont type="mapgis-layer1" slot="icon-hiden" />
      <template slot="title">
        <div v-if="layers && layers.length > 0">
          <mapgis-ui-select
            class="mapgis-3d-bim-component-layers"
            :disabled="disableLayerSelect"
            :autoWidth="true"
            size="default"
            @change="handleSelectChange"
            placeholder="请选择图层"
          >
            <mapgis-ui-select-option
              v-for="(l, i) in layers"
              :key="i"
              :value="l.vueIndex"
              >{{ l.title }}</mapgis-ui-select-option
            >
          </mapgis-ui-select>
        </div>
        <span v-else class="mapgis-3d-bim-component-title">{{ title }}</span>
      </template>
      <mapgis-ui-space slot="extra" class="mapgis-3d-bim-component-icons">
        <mapgis-ui-tooltip
          v-for="(m, i) in enableCollapse ? menus : collapsemenus"
          :key="i"
        >
          <template slot="title">{{ m.title }}</template>
          <mapgis-ui-iconfont
            :class="{ active: m.active }"
            :type="m.icon"
            @click="handleMenu(m.title)"
          />
        </mapgis-ui-tooltip>
      </mapgis-ui-space>
      <mapgis-ui-row class="mapgis-3d-bim-component-document">
        <mapgis-ui-input-search
          style="margin-bottom: 8px"
          size="default"
          placeholder="搜索"
          @change="onChange"
        />
        <mapgis-ui-tree
          class="mapgis-3d-bim-component-tree"
          :checkedKeys="layerIds"
          :show-line="false"
          :multiple="false"
          :checkable="true"
          :checkStrictly="false"
          :tree-data="layerTree"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :selectedKeys="selectedKeys"
          @expand="onExpand"
          @select="onSelect"
          @check="onCheck"
        >
          <template slot="icon" slot-scope="{}"> </template>
          <template
            slot="title"
            slot-scope="{ title, index, icon, key, count }"
          >
            <span
              :id="`tree_${key}`"
              :class="{
                'mapgis-3d-bim-component-span': true,
                'mapgis-3d-bim-component-span-inline': true,
              }"
            >
              <!-- <mapgis-ui-iconfont :type="icon" /> -->
              <mapgis-ui-tooltip
                v-if="title && searchValue && title.indexOf(searchValue) > -1"
              >
                <template slot="title">{{ title }}({{ count }})</template>
                <div>
                  {{ title.substr(0, title.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{
                    title.substr(
                      title.indexOf(searchValue) + searchValue.length
                    )
                  }}
                  ({{ count }})
                </div>
              </mapgis-ui-tooltip>
              <mapgis-ui-tooltip v-else>
                <template slot="title">{{ title }}</template>
                <div>{{ title }}({{ count }})</div>
              </mapgis-ui-tooltip>

              <mapgis-ui-tooltip v-for="(s, j) in submenus" :key="j">
                <template slot="title">{{ s.tooltip() }}</template>
                <mapgis-ui-iconfont
                  v-if="!isolation || selectLayerIndex == index"
                  :type="s.icon()"
                  :class="{
                    iconfont: true,
                    'iconfont-disabled': !enableBim,
                  }"
                  @click="
                    s.click({
                      title,
                      index,
                      icon,
                      key,
                    })
                  "
                />
              </mapgis-ui-tooltip>
            </span>
          </template>
        </mapgis-ui-tree>
      </mapgis-ui-row>

      <mapgis-3d-feature-popup
        v-if="featureposition"
        :position="featureposition"
        :popupOptions="popupOptions"
        :componentWidth="popupWidth"
        v-bind="popupConfig"
        v-model="featurevisible"
      >
        <component
          :is="popupComponent"
          :properties="featureproperties"
          v-bind="popupConfig"
        />
      </mapgis-3d-feature-popup>
    </mapgis-ui-collapse-card>
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";
import clonedeep from "lodash.clonedeep";
import axios from "axios";

export default {
  name: "mapgis-3d-bim-component",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          position: "absolute",
          zIndex: 1000,
          padding: "0px",
          margin: "0px",
          height: "600px",
          width: "400px",
          top: "0px",
          left: "0px",
        };
      },
    },
    /**
     * @description 分层分户的图层列表, 每个内部{title, vueIndex},
     * @see vueIndex表示当前激活的图层序号
     */
    layers: { type: Array, default: () => [] },
    /**
     * @description 是否激活查询弹窗
     */
    enablePopup: { type: Boolean, default: false },
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      },
    },
    enableCollapse: { type: Boolean, default: true },
    enableBim: { type: Boolean, default: false },
    enableDynamicQuery: { type: Boolean, default: false },
    // 气泡框配置
    popupConfig: {
      type: Object,
      default: () => {},
    },
    // 高亮样式
    highlightStyle: {
      type: String,
      default: "rgba(255,255,0,0.5)",
    },
  },
  data() {
    return {
      innerVueIndex: this.vueIndex,
      title: "BIM",
      layerIds: [],
      allLayerIds: [],
      halfCheckedKeys: [],
      menus: [
        {
          title: "查询",
          icon: "mapgis-highlight",
          active: this.enablePopup,
        },
        /* {
          title: "重置图层",
          icon: "mapgis-redo",
          active: false,
        }, */
        {
          title: "隐藏面板",
          icon: "mapgis-hide",
          active: false,
        },
      ],
      collapsemenus: [
        {
          title: "查询",
          icon: "mapgis-highlight",
          active: this.enablePopup,
        },
      ],
      submenus: [
        {
          title: "锁定/解锁图层",
          tooltip: () =>
            this.enableBim ? "锁定/解锁图层" : "请按照BIM要求制作数据",
          icon: (key) =>
            this.layerKey == key ? "mapgis-lock" : "mapgis-unlock",
          click: (payload) => {
            if (this.enableBim) {
              this.changeIsolation(payload);
            }
          },
        },
      ],
      layerTree: [],
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      expandItemKey: undefined,
      activeItemKey: undefined,
      g3dLayerIndex: undefined, // g3d图层再整个viewer中的顺序
      layerKey: undefined,
      selectLayerIndex: undefined, // 当前g3d图层中子图层m3d的图层顺序
      selectedKeys: [],
      version: undefined,
      isolation: false,
      featureposition: undefined, // {longitude: 0, latitude: 0, height: 0},
      featureproperties: undefined,
      featurevisible: undefined,
      featureclickenable: this.enablePopup,
      disableLayerSelect: false,
      layerUrl: undefined,
    };
  },
  provide() {
    const self = this;
    return {
      get m3ds() {
        return self.m3ds;
      },
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  computed: {
    popupComponent() {
      return this.popupConfig?.component || "mapgis-3d-popup-iot";
    },
    popupWidth() {
      return this.popupConfig?.componentWidth || 260;
    },
  },
  watch: {
    enablePopup(next) {
      this.featureclickenable = next;
      if (next) {
        this.$_bindPickFeature();
      } else {
        this.$_unbindPickFeature();
      }
    },
    halfCheckedKeys(next) {
      this.changeLayerVisible(next);
    },
    innerVueIndex(next) {
      this.unmount();
      this.mount();
    },
    layers(next) {
      if (!this.layers || this.layers.length == 0) {
        this.clearData();
        this.innerVueIndex = undefined;
        return;
      }
      const { innerVueIndex } = this;
      const layer = this.layers.filter(
        (layer) => layer.vueIndex == innerVueIndex
      );
      if (!layer) {
        this.clearData();
        this.innerVueIndex = undefined;
      }
    },
  },
  methods: {
    createCesiumObject() {
      return this.m3dIsReady();
    },
    /**
     * 判断传入的m3d图层是否被加载，不等于子图层数据全部加载完毕
     */
    m3dIsReady() {
      const { vueCesium, vueKey, model, innerVueIndex } = this;
      return new Promise((resolve, reject) => {
        let layerIndex = 0;
        this.$_getM3DByInterval(
          function (m3ds) {
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

      const promise = this.createCesiumObject();
      promise.then(async (find) => {
        if (find && find.source) {
          let { source } = find;
          const m3d = source && source.length > 0 ? source[0] : undefined;
          const version = m3d?.version;
          // m3d2.1的tree数据改为从接口获取
          this.layerUrl = m3d ? m3d.resource._url : undefined;
          let tree;
          if (version === "2.0") {
            tree = Cesium.M3DTree.createM3DTree(m3d, {
              createType: "ModelLoaded",
            });
            this.parseTree(tree, version);
          } else if (version === "2.1") {
            if (this.layerUrl) {
              tree = await this.getBIMTreeData(this.layerUrl);
            }
          }

          // vm.parseTree(tree);
          vm.$emit("loaded", { component: vm });
          const collection = new Cesium.PrimitiveCollection();
          vueCesium.BimManager.addSource(vueKey, innerVueIndex, m3d, {
            m3d: m3d,
            tree: tree,
            collection: collection,
            primitiveCollection: viewer.scene.primitives.add(collection),
            version: version,
          });
          if (enablePopup) {
            vm.$_bindPickFeature();
          }
        }
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      this.clearData();
      const { vueCesium, vueKey, innerVueIndex } = this;
      const { viewer } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
      }
      this.$emit("unload", { component: this });
      vueCesium.BimManager.deleteSource(vueKey, innerVueIndex);
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    clearData() {
      this.restoreM3d();
      this.allLayerIds = [];
      this.layerIds = [];
      this.allLayerIds = [];
      // 将树状json对象转成一维数组
      this.allLayerObjs = [];
      // 当前图层的url地址
      this.layerUrl = undefined;
      this.halfCheckedKeys = [];
      this.layerTree = [];
      this.expandedKeys = [];
      this.selectedKeys = [];
    },
    // 构件树内部逻辑
    parseTree(tree, version) {
      let bimTree;
      if (version === "2.0") {
        bimTree = this.loopTreeNode(tree, "", undefined);
      } else if (version === "2.1") {
        bimTree = this.loopTreeNodeNew(tree, "", undefined);
        // 获取当前构件树所有叶子节点
        this.leafNodeArr = this.allLayerObjs.filter((item) => !item.children);
      }
      this.layerTree.splice(0, 1, bimTree);
      return bimTree;
    },
    generateId() {
      return parseInt(String(Math.random() * 10000000));
    },
    // m3d2.0数据解析
    loopTreeNode(node, prefix, parent) {
      const vm = this;
      let key = `${prefix}_${node.depth}`;
      // 有节点无nodeName信息 但index属性记录了nodeName对应的属性
      vm.layerIds.push(node.index || node.nodeName);
      vm.allLayerIds.push(node.index || node.nodeName);

      let cbnode = {
        title: node.index || node.nodeName,
        key: node.index || node.nodeName,
        index: node.index,
        attMap: node.attMap && node.attMap._obj ? node.attMap._obj : {},
        icon: "mapgis-sanweiditu",
        children: [],
        parent: parent,
        isleaf: false,
        count: 0,
        scopedSlots: { icon: "icon", title: "title" },
      };
      if (cbnode.depth == 0) {
        cbnode.rootNode = true;
      }
      if (node.m3dtreeChildren && node.m3dtreeChildren.length > 0) {
        node.m3dtreeChildren.forEach((child) => {
          let c = vm.loopTreeNode(child, key, cbnode);
          cbnode.children.push(c);
          cbnode.count += c.count;
        });
      }
      if (cbnode.children.length <= 0) {
        [delete cbnode.children];
        cbnode.count = 1;
        cbnode.isleaf = true;
      }
      return cbnode;
    },
    // m3d2.1数据解析
    loopTreeNodeNew(node, prefix, parent) {
      const vm = this;
      // let key = `${prefix}_${node.depth}`;
      let key = `${prefix}_${node.lodLevel}`;
      // 给节点设置id
      const uuid = this.generateId();
      node.id = uuid;
      vm.layerIds.push(node.id);
      vm.allLayerIds.push(node.id);
      vm.allLayerObjs.push(node);

      let cbnode = {
        title: node.name,
        key: node.id,
        index: node.id,
        icon: "mapgis-sanweiditu",
        children: [],
        parent: parent,
        isleaf: false,
        count: 0,
        property: node.property,
        scopedSlots: { icon: "icon", title: "title" },
      };
      if (cbnode.level === 0) {
        cbnode.rootNode = true;
      }
      if (node.children?.items && node.children?.items.length > 0) {
        node.children.items.forEach((child) => {
          let c = vm.loopTreeNodeNew(child, key, cbnode);
          cbnode.children.push(c);
          cbnode.count += c.count;
        });
      }
      if (cbnode.children.length <= 0) {
        [delete cbnode.children];
        cbnode.count = 1;
        cbnode.isleaf = true;
      }
      return cbnode;
    },
    findTreePath(index) {
      let result = {
        paths: [],
        node: undefined,
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

    findRoot() {
      const { layerTree } = this;
      if (!layerTree || layerTree.length <= 0) return undefined;
      let root = layerTree[0];
      return root;
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
    findId(node, id) {
      const vm = this;
      let find = undefined;
      if (!node) return find;
      if (node.attMap && Object.keys(node.attMap).indexOf(`${id}`) >= 0) {
        return node;
      }
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          let child = node.children[i];
          find = vm.findId(child, id);
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
          node.children.forEach((child) => {
            this.findChildren(child, paths);
          });
        }
      }
    },
    actionTree(node, action) {
      const vm = this;
      action(node);
      if (node && node.children) {
        node.children.forEach((child) => vm.actionTree(child, action));
      }
    },
    disableTree(index) {
      // 根据index查找构件树节点
      const currentNode = this.findCurrentNode(index);
      this.actionTree(currentNode, (n) => {
        n.disabled = true;
      });
    },
    enableTree(index) {
      // 根据index查找构件树节点
      const currentNode = this.findCurrentNode(index);
      this.actionTree(currentNode, (n) => {
        n.disabled = false;
      });
      this.$forceUpdate();
    },
    findCurrentNode(index, treeData) {
      if (!treeData) {
        treeData = this.layerTree;
      }
      let targetNode = treeData.find((item) => item.index === index);
      if (targetNode) {
        return targetNode;
      } else {
        treeData.forEach((item) => {
          if (item.children) {
            targetNode = this.findCurrentNode(index, item.children);
          }
        });
      }
      return targetNode;
    },
    // 搜索需要
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    handleSelectChange(value) {
      this.innerVueIndex = value;
    },
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    // 根据数据结构节点将树状结构转为一维数组
    getCurrentNodeAndChildNodeId(data, allIndexs = []) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { id } = node;
        allIndexs.push(id);
        if (node.children?.items) {
          this.getCurrentNodeAndChildNodeId(node.children.items, allIndexs);
        }
      }
    },
    onChange(e) {
      let { layerTree } = this;
      const dataList = [];
      const generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key, title } = node;
          dataList.push({ key, title });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(layerTree);

      const value = e.target.value;
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, layerTree);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    onSelect(e, payload) {
      // 如果当前构件树有节点被锁定则不进行该操作
      if (this.isolation) {
        return;
      }
      this.selectedKeys = e;
      const { selectedNodes } = payload;
      if (selectedNodes && selectedNodes.length > 0) {
        const {
          data: { key },
        } = selectedNodes[0];
        this.highlightM3d(key);
      } else {
        this.restoreM3d();
      }
    },
    onCheck(checks, payload) {
      // 处于锁定图层的状态下构件树的勾选功能不触发
      if (this.isolation) return;
      const { halfCheckedKeys } = payload;
      this.layerIds = checks;
      this.halfCheckedKeys = [...checks, ...halfCheckedKeys];
    },
    changeLayerVisible(layers) {
      layers = layers || this.layerIds;
      const { vueKey, innerVueIndex, vueCesium, Cesium, allLayerIds } = this;
      const find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);

      const version = find?.options?.version;
      if (version === "2.0") {
        const tree = find.options?.tree;
        if (tree) {
          // 先让所有节点显示/隐藏
          allLayerIds.forEach((key) => {
            const targetNode = tree.getM3DByName(key);
            if (targetNode) {
              targetNode.forceInvisible = true;
            }
          });

          layers.forEach((key) => {
            const targetNode = tree.getM3DByName(key);
            if (targetNode) {
              targetNode.forceInvisible = false;
            }
          });
        }
      } else if (version === "2.1") {
        const bimLayer = find?.source;
        if (bimLayer) {
          let conditions = [];
          // 如果layers为空则获取根节点设置minTid和maxTid 并且设置透明度为0
          if (layers.length === 0) {
            const rootNode = this.findRoot();
            const {
              property: { minTid, maxTid },
            } = rootNode;
            conditions.push([
              "(${tid} >= " + minTid + ") && (${tid} <= " + maxTid + ")",
              "color('#ffffff', 0)",
            ]);
          } else {
            // 通过layers找到构件树叶子节点进行设置minTid和maxTid 并且设置透明度为1
            const selectedNodes = this.leafNodeArr.filter((item) =>
              layers.includes(item.id)
            );
            const unSelectedNodes = this.leafNodeArr.filter(
              (item) => !layers.includes(item.id)
            );
            // 设置选中的节点显示
            selectedNodes.forEach((item) => {
              const {
                property: { minTid, maxTid },
              } = item;
              conditions.push([
                "(${tid} >= " + minTid + ") && (${tid} <=" + maxTid + ")",
                "color('#ffffff', 1)",
              ]);
            });

            // 设置未选中的节点隐藏
            unSelectedNodes.forEach((item) => {
              const {
                property: { minTid, maxTid },
              } = item;
              conditions.push([
                "(${tid} >= " + minTid + ") && (${tid} <=" + maxTid + ")",
                "color('#ffffff', 0)",
              ]);
            });
          }
          const targetStyle = new Cesium.Cesium3DTileStyle({
            color: {
              conditions,
            },
          });
          bimLayer.style = targetStyle;
        }
      }
    },
    handleExpandItemKey(key) {
      if (key == this.expandItemKey) {
        this.expandItemKey = undefined;
      } else {
        this.expandItemKey = key;
      }
    },
    handleActiveItemKey(layer) {
      const { title, version, gdbp, ip, port, index, key } = layer;
      this.title = title;
      this.gdbp = gdbp;
      this.version = version;
      this.ip = ip;
      this.port = port;
      this.selectLayerIndex = index;
      this.layerKey = key;
      this.$refs.card && this.$refs.card.togglePanel();
      this.disableLayerSelect = true;
    },

    // 重置bim构件树整体样式
    restoreOriginStyle() {
      const { vueKey, innerVueIndex, vueCesium, Cesium } = this;
      const find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      // 获取当前m3d的版本
      const version = find?.options?.version;
      if (!version) return;

      if (version === "2.0") {
        if (find && find.options && find.options.tree) {
          const { tree } = find.options;
          const { allLayerIds } = this;
          allLayerIds.forEach((key) => {
            const targetNode = tree.getM3DByName(key);
            targetNode && targetNode.reset();
          });
        }
      } else if (version === "2.1") {
        if (find && find.source) {
          // 重置样式
          const { source } = find;
          const originStyle = new Cesium.Cesium3DTileStyle({
            show: "true",
            color: "color('#ffffff')",
          });
          source.style = originStyle;
        }
      }
    },
    changeIsolation(layer) {
      const { key, index } = layer;
      const vm = this;
      if (this.layerKey != key) {
        this.layerKey = key;
        this.selectLayerIndex = index;
        this.isolation = true;
        this.$nextTick(() => {
          vm.enableIsolation(layer);
        });
      } else {
        this.layerKey = undefined;
        this.selectLayerIndex = undefined;
        this.isolation = false;
        this.$nextTick(() => {
          vm.disableIsolation(layer);
        });
      }
    },
    enableIsolation(node) {
      const { vueKey, innerVueIndex, vueCesium } = this;
      const { allLayerIds } = this;
      const find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      // 获取当前m3d的版本
      const version = find?.options?.version;
      if (!version) return;

      const { index } = node;
      // 关闭拾取
      this.featurevisible = false;
      this.selectedKeys = [`${index}`];

      let isolationNode;
      // 找到锁定的节点（包括下级节点）
      let allIndexs = [];
      if (version === "2.0") {
        const result = this.findTreePath(index);
        const { paths, node } = result;
        allIndexs = paths.map((p) => p.index);
      } else if (version === "2.1") {
        isolationNode = this.allLayerObjs.find((item) => item.id === index);
        this.getCurrentNodeAndChildNodeId([isolationNode], allIndexs);
      }
      // 设置模型锁定可见的部分
      this.changeLayerVisible(allIndexs);
      // flyto到模型锁定位置
      this.flyToLayer(isolationNode, allIndexs, version);
      // 禁用bim构件树锁定节点及子节点
      this.disableTree(index);
    },
    disableIsolation(node) {
      const { vueKey, innerVueIndex, vueCesium } = this;
      const { allLayerIds } = this;
      const find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      // 获取当前m3d的版本
      const version = find?.options?.version;
      if (!version) return;

      const { index } = node;
      // 解除构件树的禁用
      this.enableTree(index);
      // 重置图层
      if (version === "2.0") {
        this.changeLayerVisible(allLayerIds);
      } else if (version === "2.1") {
        this.restoreM3d();
      }
    },
    handleMenu(menu) {
      if (menu == "隐藏面板") {
        this.$refs.card && this.$refs.card.hide();
      } else if (menu == "查询") {
        if (this.menus[0].active) {
          this.menus[0].active = false;
          this.$_unbindPickFeature();
        } else {
          this.menus[0].active = true;
          this.$_bindPickFeature();
        }
      } else if (menu == "重置图层") {
        this.restoreM3d();
      }
    },
    flyToLayer(node, allIndexs, version) {
      if (version === "2.0") {
        const index = this.selectedKeys[0];
        const { innerVueIndex, vueKey, vueCesium, viewer } = this;
        const find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
        if (find && find.options && find.options.tree) {
          const { tree } = find.options;
          const targetNode = tree.getM3DByName(index);
          if (targetNode) {
            viewer.camera.flyToBoundingSphere(targetNode.boundingSphere);
          }
        }
      } else if (version === "2.1") {
        // 要素tid范围默认选择最大边界值
        const {
          property: { maxTid },
        } = node;
        this.flyToFeature(node, maxTid, allIndexs);
      }
    },
    async flyToFeature(node, tid, allIndexs) {
      // 判断当前节点是否为叶子节点
      const isLeaf = this.leafNodeArr.find((item) => item.id === node.id);
      // 找到最小边界值的节点
      let targetNode;
      if (isLeaf) {
        targetNode = node;
      } else {
        // 找到所有叶子节点
        const childLeafNodes = this.leafNodeArr.filter((item) =>
          allIndexs.includes(item.id)
        );
        // 找到maxTid跟tid相同的节点
        targetNode = childLeafNodes.find(
          (item) => item.property.maxTid === tid
        );
      }
      // 返回的是targetNode的minTid-maxTid所有值对应的数组
      const nodeArr = await this.combineItems(targetNode.childrenUri);
      const nodeInfo =
        nodeArr.find((item) => item.property.tid === tid) || nodeArr[0];
      this.flyToBox(nodeInfo.property.box);
    },
    // 处理分页存储的构件树JSON文件
    async combineItems(childrenUri, items = []) {
      const { data } = await axios.get(this.layerUrl + `/${childrenUri}`);
      items.push(...data.items);
      if (data.nextItemsUri) {
        let nextItemsUri = data.nextItemsUri;
        if (!nextItemsUri.startsWith("structuretree/")) {
          nextItemsUri = `structuretree/${nextItemsUri}`;
        }
        this.combineItems(nextItemsUri, items);
      }
      return items;
    },
    // 将相机视角定位到指定包围体范围
    flyToBox(box) {
      const { Cesium, viewer } = this;
      // 包围盒矩形的长宽高
      const width = Math.abs(box[0] - box[3]);
      const height = Math.abs(box[1] - box[4]);
      const depth = Math.abs(box[2] - box[5]);
      // 计算对角线长度
      const diagonalLength = Math.sqrt(
        width * width + height * height + depth * depth
      );
      // 计算包围球半径
      const boundingSphereRadius = diagonalLength / 2;
      // 计算中心点坐标
      const centerPosition = new Cesium.Cartesian3(
        (box[0] + box[3]) / 2,
        (box[1] + box[4]) / 2,
        (box[2] + box[5]) / 2
      );
      // 将相机飞到指定的包围球位置
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(
          centerPosition, // 包围球的中心点坐标
          boundingSphereRadius // 包围球的半径
        ),
        {
          duration: 1, // 相机视角飞行时间
        }
      );
    },

    $_pickEvent(movement) {
      const { enableDynamicQuery } = this;
      if (enableDynamicQuery) {
        // m3d 不支持动态查询 只有g3d支持动态查询
        this.queryDynamic(movement);
      } else {
        this.queryStatic(movement);
      }
    },
    $_bindPickFeature() {
      const { vueKey, innerVueIndex } = this;
      let clickhandler = this.$_bindClickHanlder();
      vueCesium.BimManager.changeOptions(
        vueKey,
        innerVueIndex,
        "clickhandler",
        clickhandler
      );
    },
    $_unbindPickFeature() {
      const { vueKey, innerVueIndex } = this;
      this.featurevisible = false;
      this.restoreM3d();
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options.clickhandler) {
        find.options.clickhandler.destroy();
        vueCesium.BimManager.changeOptions(
          vueKey,
          innerVueIndex,
          "clickhandler",
          undefined
        );
      }
    },
    $_bindClickHanlder() {
      const vm = this;
      const { Cesium, viewer } = this;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        vm.$_pickEvent(movement);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    restoreM3d() {
      this.restoreOriginStyle();
    },
    highlightM3d(key) {
      const { vueKey, innerVueIndex, vueCesium, Cesium } = this;
      const { highlightStyle } = this;
      this.selectLayerIndex = key;
      const find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      // 获取当前m3d的版本
      const version = find?.options?.version;
      if (!version) return;

      if (version === "2.0") {
        if (find && find.options && find.options.tree) {
          const { tree } = find.options;
          const targetNode = tree.getM3DByName(key);
          targetNode &&
            targetNode.setNodeColor(
              Cesium.Color.fromCssColorString(highlightStyle)
            );
        }
      } else if (version === "2.1") {
        if (find && find.source) {
          const { source } = find;
          // 获取当前点击的节点
          const currentNode = this.allLayerObjs.find((item) => item.id === key);
          // 获取当前节点及子节点的index
          const allIndexs = [];
          this.getCurrentNodeAndChildNodeId([currentNode], allIndexs);
          // 获取需要高亮的子节点
          const selectedNodes = this.leafNodeArr.filter((item) =>
            allIndexs.includes(item.id)
          );
          // 设置样式
          const conditions = [];
          selectedNodes.forEach((item) => {
            const {
              property: { minTid, maxTid },
            } = item;
            conditions.push([
              "(${tid} >= " + minTid + ") && (${tid} <=" + maxTid + ")",
              highlightStyle,
            ]);
          });
          const targetStyle = new Cesium.Cesium3DTileStyle({
            color: {
              conditions,
            },
          });
          source.style = targetStyle;
        }
      }
    },
    handleDynamicQuery() {
      this.featurevisible = false;
      this.featureclickenable = false;
    },
    handleBackMain() {
      this.featureclickenable = this.enablePopup;
      this.disableLayerSelect = false;
    },
    queryDynamic(movement) {
      // m3d 不支持动态查询 只有g3d支持动态查询
    },
    async queryStatic(movement) {
      const { Cesium, viewer } = this;
      const { vueKey, innerVueIndex, vueCesium } = this;
      const { highlightStyle } = this;
      const scene = viewer.scene;
      const tempRay = new Cesium.Ray();
      const tempPos = new Cesium.Cartesian3();
      const bimInfo = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      const m3d = bimInfo?.source;
      const version = bimInfo?.options?.version;
      // 找不到当前的图层对象不再执行
      if (!m3d || !version) return;

      if (!movement) return;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        const position = movement.position || movement.endPosition;
        const cartesian = viewer.getCartesian3Position(position);
        const feature = viewer.scene.pick(position);
        const ray = scene.camera.getPickRay(position, tempRay);
        const cartesian2 = scene.globe.pick(ray, scene, tempPos);

        let longitudeString2, latitudeString2, heightString2;

        if (Cesium.defined(cartesian2)) {
          const cartographic2 = Cesium.Cartographic.fromCartesian(cartesian);
          longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
          latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
          heightString2 = cartographic2.height;
        }

        if (feature instanceof Cesium.Cesium3DTileFeature) {
          // 修改说明：M3D2.1已弃用viewer.scene.pickOid方法，后面统一从feature上获取要素id，高亮统一使用Cesium3DTileStyle设置
          // 修改人:龚跃健
          // 修改日期：2024-11-22
          let id, conditions;
          if (version === "2.0") {
            id = feature.getProperty("OID");
            conditions = [["${OID} === ${id}", highlightStyle]];
          } else if (version === "2.1") {
            id = await feature.getProperty("tid");
            conditions = [["${tid} === ${id}", highlightStyle]];
          }

          m3d.style = new Cesium.Cesium3DTileStyle({
            defines: {
              id,
            },
            color: {
              conditions,
            },
          });

          const result = {};
          // 兼容属性外置和属性内置的模型，属性外置的模型进行拾取时返回的是promise对象，以及后续获取属性信息同样返回promise对象
          const propertykeys = await feature.getPropertyIds();
          await Promise.all(
            propertykeys.map(async (item) => {
              result[item] = await feature.getProperty(item);
            })
          );
          this.featureproperties = result;
          if (
            this.featureclickenable &&
            this.featureproperties &&
            Object.keys(this.featureproperties).length > 0
          ) {
            this.$nextTick(() => {
              this.featurevisible = true;
              this.featureposition = {
                longitude: longitudeString2,
                latitude: latitudeString2,
                height: heightString2,
              };
            });
          }
        } else {
          this.featureposition = undefined;
          this.featurevisible = false;
        }
      }
    },

    // 获取选中的构建树tree数据
    getBIMTreeData(url, version = "2.1") {
      const { Cesium } = this;
      return new Promise((resolve, reject) => {
        if (version === "2.0") {
          try {
          } catch (error) {
            this.$message.error("BIM构件树节点信息获取失败！");
            reject(error);
          }
        } else if (version === "2.1") {
          axios
            .get(url + "/structuretree.json")
            .then((res) => {
              // const structureTree = res.data;
              resolve(this.parseTree(res.data, version));
            })
            .catch((Error) => {
              this.$message.error("BIM构件树节点信息获取失败！");
              reject(Error);
            });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.mapgis-3d-bim-component {
  .mapgis-ui-collapse-card {
    &::-webkit-scrollbar-thumb {
      background: #939392;
    }
  }
}
</style>
