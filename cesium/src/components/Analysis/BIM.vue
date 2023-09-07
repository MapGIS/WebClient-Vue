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
              :class="{
                'mapgis-3d-bim-component-span': true,
                'mapgis-3d-bim-component-span-inline': true
              }"
            >
              <!-- <mapgis-ui-iconfont :type="icon" /> -->
              <mapgis-ui-tooltip
                v-if="title && title.indexOf(searchValue) > -1"
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
                <div>{{ title }}</div>
              </mapgis-ui-tooltip>

              <mapgis-ui-tooltip v-for="(s, j) in submenus" :key="j">
                <template slot="title">{{ s.tooltip() }}</template>
                <mapgis-ui-iconfont
                  v-if="!isolation || selectLayerIndex == key"
                  :type="s.icon()"
                  :class="{
                    iconfont: true,
                    'iconfont-disabled': !enableBim
                  }"
                  @click="
                    s.click({
                      title,
                      index,
                      icon,
                      key
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
          left: "0px"
        };
      }
    },
    type: { type: String, default: "ModelLoaded" /* ModelUrl ModelLoaded */ },
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
      }
    },
    enableCollapse: { type: Boolean, default: true },
    enableBim: { type: Boolean, default: false },
    enableDynamicQuery: { type: Boolean, default: false },
    // 气泡框配置
    popupConfig: {
      type: Object,
      default: () => {}
    },
    // 高亮样式
    highlightStyle: {
      type: String,
      default: "rgba(255,255,0,0.5)"
    }
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
          active: this.enablePopup
        },
        /* {
          title: "重置图层",
          icon: "mapgis-redo",
          active: false,
        }, */
        {
          title: "隐藏面板",
          icon: "mapgis-hide",
          active: false
        }
      ],
      collapsemenus: [
        {
          title: "查询",
          icon: "mapgis-highlight",
          active: this.enablePopup
        }
      ],
      submenus: [
        {
          title: "锁定/解锁图层",
          tooltip: () =>
            this.enableBim ? "锁定/解锁图层" : "请按照BIM要求制作数据",
          icon: key => (this.layerKey == key ? "mapgis-lock" : "mapgis-unlock"),
          click: payload => {
            if (this.enableBim) {
              this.changeIsolation(payload);
            }
          }
        }
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
      disableLayerSelect: false
    };
  },
  provide() {
    const self = this;
    return {
      get m3ds() {
        return self.m3ds;
      }
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
    }
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
        layer => layer.vueIndex == innerVueIndex
      );
      if (!layer) {
        this.clearData();
        this.innerVueIndex = undefined;
      }
    }
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
      const { viewer, enablePopup, type } = this;

      let promise = this.createCesiumObject();
      promise.then(find => {
        if (find && find.source) {
          let { source } = find;
          let m3d = source && source.length > 0 ? source[0] : undefined;
          if (type == "ModelUrl") {
            let find = vueCesium.M3DIgsManager.findSource(
              vueKey,
              innerVueIndex
            );
            if (find && find.options) {
              const { url } = find.options;
              m3d.m3dtreeOptions = { createType: type, url: url };
            }
          } else if (type == "ModelLoaded") {
            m3d.m3dtreeOptions = { createType: type };
          } else {
            return;
          }

          // tree数据改为从接口获取
          const url = m3d ? m3d.resource._url : undefined;
          url && this.getBIMTreeData(url);
          let tree = m3d ? m3d.m3dtree : undefined;
          // vm.parseTree(tree);
          vm.$emit("loaded", { component: vm });
          let collection = new Cesium.PrimitiveCollection();
          vueCesium.BimManager.addSource(vueKey, innerVueIndex, m3d, {
            m3d: m3d,
            tree: tree,
            collection: collection,
            primitiveCollection: viewer.scene.primitives.add(collection)
          });
          vm.recordOriginStyle();
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
      this.showAllLayer();
      this.resetAllLayer();
      this.allLayerIds = [];
      this.layerIds = [];
      this.allLayerIds = [];
      this.halfCheckedKeys = [];
      this.layerTree = [];
      this.expandedKeys = [];
      this.selectedKeys = [];
    },
    // 构件树内部逻辑
    parseTree(tree) {
      // const displaytree = this.findDisplayTree(tree);
      let cbtree = this.loopTreeNode(tree, "", undefined);
      this.layerTree.splice(0, 1, cbtree);
    },
    loopTreeNode(node, prefix, parent) {
      const vm = this;
      // let key = `${prefix}_${node.depth}`;
      let key = `${prefix}_${node.lodLevel}`;
      vm.layerIds.push(node.name);
      vm.allLayerIds.push(node.name);

      let cbnode = {
        title: node.name,
        key: node.name,
        index: node.name,
        attMap: node.attMap && node.attMap._obj ? node.attMap._obj : {},
        icon: "mapgis-sanweiditu",
        children: [],
        parent: parent,
        isleaf: false,
        count: 0,
        scopedSlots: { icon: "icon", title: "title" }
      };
      if (cbnode.index == "rootNode") {
        cbnode.rootNode = true;
      }
      if (node.childrenNode && node.childrenNode.length > 0) {
        node.childrenNode.forEach(child => {
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
    findRoot() {
      const { layerTree } = this;
      if (!layerTree || layerTree.length <= 0) return undefined;
      let root = layerTree[0];
      return root;
    },
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
    findOid(node, oid) {
      const vm = this;
      let find = undefined;
      if (!node) return find;
      if (node.attMap && Object.keys(node.attMap).indexOf(`${oid}`) >= 0) {
        return node;
      }
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          let child = node.children[i];
          find = vm.findOid(child, oid);
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
    findDisplayTree(tree) {
      if (!tree) return;
      if (tree.index == "rootNode") {
        return tree;
      } else {
        const next = tree.m3dtreeChildren;
        if (next && next.length > 0) {
          return this.findDisplayTree(next[0]);
        }
      }
      /* if (!tree || tree.length <= 0) return;
      const node = tree[0];
      const { index, rootNode } = node;
      const { children } = node;
      if (rootNode) {
        this.layerTree = children;
      } else {
        this.layerIds = this.layerIds.filter((l) => l.index != index);
        this.allLayerIds = this.allLayerIds.filter((l) => l.index != index);
        this.findDisplayTree(children);
      } */
    },
    actionTree(node, action) {
      const vm = this;
      action(node);
      if (node && node.children) {
        node.children.forEach(child => vm.actionTree(child, action));
      }
    },
    disableTree(node) {
      let root = this.findRoot();
      this.actionTree(root, n => {
        n.disabled = true;
      });
      this.actionTree(node, n => {
        n.disabled = false;
      });
    },
    enableTree(node) {
      this.actionTree(node, n => {
        n.disabled = false;
      });
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
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    onChange(e) {
      let { layerTree } = this;
      const dataList = [];
      const generateList = data => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key } = node;
          dataList.push({ key, title: key });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(layerTree);

      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, layerTree);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    },
    onSelect(e, payload) {
      this.selectedKeys = e;
      const { selectedNodes } = payload;
      if (selectedNodes && selectedNodes.length > 0) {
        let { data } = selectedNodes[0];
        let { props } = data;
        let { index } = props;
        this.highlightM3d(index);
      } else {
        this.resetAllLayer();
      }
    },
    onCheck(checks, payload) {
      const { halfCheckedKeys } = payload;
      this.layerIds = checks;
      this.halfCheckedKeys = checks.concat(halfCheckedKeys);
    },
    changeLayerVisible(layers) {
      layers = layers || this.layerIds;
      const { vueKey, innerVueIndex, vueCesium, allLayerIds } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        const { tree } = find.options;
        if (!tree) return;
        allLayerIds.forEach(layer => {
          let mapgism3dNode = tree.getM3DByName(layer);
          if (mapgism3dNode) {
            mapgism3dNode.forceInvisible = true;
          }
        });
        for (let i = 0; i < layers.length; i++) {
          let layer = layers[i];
          let mapgism3dNode = tree.getM3DByName(layer);
          if (mapgism3dNode) {
            mapgism3dNode.forceInvisible = false;
          }
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
    recordOriginStyle() {
      const { vueKey, innerVueIndex, vueCesium, allLayerIds } = this;
      let originStyles = [];

      allLayerIds.forEach(l => {
        originStyles.push({ name: l, style: undefined });
      });

      vueCesium.BimManager.changeOptions(
        vueKey,
        innerVueIndex,
        "originStyles",
        originStyles
      );
    },
    restoreOriginStyle() {
      const { vueKey, innerVueIndex, vueCesium } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options.originStyles) {
        let { tree } = find.options;
        find.options.originStyles.forEach(i => {
          let mapgism3dNode = tree.getM3DByName(i.name);
          if (mapgism3dNode) {
            mapgism3dNode.reset();
          }
        });
      }
    },
    restoreOrigindVisible() {
      const { vueKey, innerVueIndex, vueCesium, g3dLayerIndex } = this;
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      if (find && find.options.originStyles) {
        find.options.originStyles.forEach((s, i) => {
          let m3dlayer = g3dLayer.getLayer(String(i));
          m3dlayer.show = true;
        });
      }
    },
    changeIsolation(layer) {
      const { key } = layer;
      const vm = this;
      if (this.layerKey != key) {
        this.layerKey = key;
        this.isolation = true;
        window.setTimeout(() => vm.enableIsolation(layer), 10);
      } else {
        this.layerKey = undefined;
        this.isolation = false;
        window.setTimeout(() => vm.disableIsolation(), 10);
      }
    },
    enableIsolation(layer) {
      const { viewer } = this;
      const { index } = layer;
      this.featurevisible = false;
      this.selectedKeys = [`${index}`];

      let find = this.findTreePath(index);
      const { paths, node } = find;
      let indexs = paths.map(p => p.index);
      this.changeLayerVisible(indexs);
      this.flyToLayer(node.index);
      this.disableTree(node);

      let root = this.findRoot();
      this.layerTree.splice(0, 1, root);
      this.restoreM3d();
    },
    disableIsolation() {
      let root = this.findRoot();
      this.enableTree(root);
      this.resetAllLayer();
      this.showAllLayer();
      this.layerTree.splice(0, 1, root);
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
        this.resetAllLayer();
      }
    },
    flyToLayer(index) {
      const { innerVueIndex, vueKey, vueCesium, viewer } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        let { tree } = find.options;
        let mapgism3dNode = tree.getM3DByName(index);
        if (mapgism3dNode) {
          viewer.camera.flyToBoundingSphere(mapgism3dNode.boundingSphere);
        }
      }
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
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      if (find && find.options.clickhandler) {
        find.options.clickhandler.destroy();
        vueCesium.StratifiedHousehouldManager.changeOptions(
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
      handler.setInputAction(function(movement) {
        vm.$_pickEvent(movement);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    restoreM3d() {
      this.restoreOriginStyle();
    },
    highlightM3d(index) {
      const { vueKey, innerVueIndex, vueCesium, Cesium } = this;
      this.selectLayerIndex = index;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.options) {
        let { tree } = find.options;
        let mapgism3dNode = tree.getM3DByName(index);
        if (mapgism3dNode) {
          mapgism3dNode.setNodeColor(
            Cesium.Color.fromCssColorString(this.highlightStyle)
          );
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
    queryStatic(movement) {
      const vm = this;
      vm.featureproperties = undefined;
      const { Cesium, viewer } = this;
      const { vueKey, innerVueIndex, vueCesium } = this;
      const { highlightStyle } = this;
      const scene = viewer.scene;
      let root = this.findRoot();
      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();
      let bimInfo = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      let m3d;
      if (bimInfo && bimInfo.source) {
        m3d = bimInfo.source;
      }

      if (!movement) return;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let position = movement.position || movement.endPosition;
        let cartesian = viewer.getCartesian3Position(position);
        let feature = viewer.scene.pick(position);
        let ray = scene.camera.getPickRay(position, tempRay);
        let cartesian2 = scene.globe.pick(ray, scene, tempPos);
        let oid = viewer.scene.pickOid(movement.position);

        let longitudeString2, latitudeString2, heightString2;

        if (Cesium.defined(cartesian2)) {
          let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian);
          longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
          latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
          heightString2 = cartographic2.height;
        }

        if (feature) {
          let paths = [];
          let find = vm.findOid(root, oid);

          if (find) {
            this.findParent(find, paths);
            let expends = paths.map(p => p.index);
            vm.selectedKeys = [find.index];
            vm.expandedKeys = expends;
          }

          if (m3d._useRawSaveAtt && Cesium.defined(feature)) {
            let result = feature.content.getAttributeByOID(oid) || {};
            vm.featureproperties = result;
          } else {
            m3d.queryAttributes(oid).then(function(result) {
              result = result || {};
              vm.featureproperties = result;
            });
          }
          if (
            vm.featureclickenable &&
            vm.featureproperties &&
            Object.keys(vm.featureproperties).length > 0
          ) {
            vm.featurevisible = true;
            vm.featureposition = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2
            };
          }

          if (m3d) {
            const renderer_unique = {
              field: "OID",
              type: "unique-value",
              uniqueValueInfos: [
                {
                  // 单值过滤条件
                  value: oid,
                  // 渲染符号
                  symbol: {
                    // 渲染类型为M3D
                    type: "mesh-3d",
                    // 覆盖物图层
                    symbolLayers: [
                      {
                        // 图层类型-颜色填充
                        type: "fill",
                        // 图层材质
                        material: {
                          // 填充颜色
                          color: Cesium.Color.fromCssColorString(highlightStyle)
                        }
                      }
                    ]
                  }
                }
              ]
            };
            m3d.renderer = renderer_unique;
          }
        } else {
          vm.featureposition = undefined;
          vm.featurevisible = false;
          /* m3d.pickedOid = undefined; */
        }
      }
    },
    // 获取选中的构建树tree数据
    getBIMTreeData(url) {
      return new Promise((resolve, reject) => {
        const params = {
          f: "json",
          include: "descendants",
          maxDepth: 10,
          maxCount: 1000
        };
        axios
          .get(url + "/nodes/root", { params })
          .then(res => {
            this.parseTree(res.data);
            resolve();
          })
          .catch(Error => {
            this.$message.error("BIM构件树节点信息获取失败！");
            reject(Error);
          });
      });
    }
  }
};
</script>
