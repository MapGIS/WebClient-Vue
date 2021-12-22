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
            size="small"
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
          size="small"
          placeholder="搜索"
          @change="onChange"
        />
        <mapgis-ui-tree
          class="mapgis-3d-bim-component-tree"
          :checkedKeys="layerIds"
          :show-line="false"
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
          <template slot="title" slot-scope="{ title, icon, count }">
            <span
              :class="{
                'mapgis-3d-bim-component-span': true,
                'mapgis-3d-bim-component-span-inline': true,
              }"
            >
              <mapgis-ui-iconfont :type="icon" />
              <span v-if="title && title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{
                  title.substr(title.indexOf(searchValue) + searchValue.length)
                }}
                ({{ count }})
              </span>
              <span v-else>{{ title }} </span>
              <mapgis-ui-tooltip v-for="(s, j) in submenus" :key="j">
                <template slot="title">{{ s.tooltip() }}</template>
                <mapgis-ui-iconfont
                  v-if="!isolation"
                  :type="s.icon()"
                  :class="{
                    iconfont: true,
                    'iconfont-disabled': !enableBim,
                  }"
                  @click="
                    s.click({
                      title,
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
        :properties="featureproperties"
        :popupOptions="popupOptions"
        v-model="featurevisible"
      >
      </mapgis-3d-feature-popup>
    </mapgis-ui-collapse-card>
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";

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
          height: "450px",
          width: "fit-content",
          minWidth: "270px",
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
        {
          title: "重置图层",
          icon: "mapgis-redo",
          active: false,
        },
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
          title: "进入图层菜单",
          tooltip: () =>
            this.enableBim ? "进入图层菜单" : "请按照BIM要求制作数据",
          icon: () => "mapgis-layer",
          click: (payload) => {
            if (this.enableBim) {
              this.handleActiveItemKey(payload);
            }
          },
        },
        {
          title: "锁定/解锁图层",
          tooltip: () =>
            this.enableBim ? "锁定/解锁图层" : "请按照BIM要求制作数据",
          icon: (key) => (this.layerKey == key ? "mapgis-lock" : "mapgis-lock"),
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
  },
  methods: {
    createCesiumObject() {
      return this.m3dIsReady();
    },
    /**
     * 判断传入的m3d图层是否加载完毕
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

      let promise = this.createCesiumObject();
      promise.then((find) => {
        if (find && find.options) {
          let { source } = find;
          let m3d = source && source.length > 0 ? source[0] : undefined;
          let tree = m3d ? m3d.tree : undefined;
          vm.parseTree(tree);
          vm.$emit("loaded", { component: vm });
          let collection = new Cesium.PrimitiveCollection();
          vueCesium.BimManager.addSource(vueKey, innerVueIndex, m3d, {
            m3d: m3d,
            tree: m3d.tree,
            collection: collection,
            primitiveCollection: viewer.scene.primitives.add(collection),
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
    parseTree(tree) {
      let cbtree = this.loopTreeNode(tree, "");
      this.layerTree.splice(0, 1, cbtree);
    },
    loopTreeNode(node, prefix) {
      const vm = this;
      let key = `${prefix}_${node.depth}`;
      vm.layerIds.push(/* key +  */ node.index);
      vm.allLayerIds.push(/* key +  */ node.index);
      let cbnode = {
        title: node.index,
        key: /*  key +  */ node.index,
        icon: "mapgis-sanweiditu",
        children: [],
        count: 0,
        scopedSlots: { icon: "icon", title: "title" },
      };
      node.treeChildren.forEach((child) => {
        let c = vm.loopTreeNode(child, key);
        cbnode.children.push(c);
        cbnode.count += c.count;
      });
      if (cbnode.children.length <= 0) {
        [delete cbnode.children];
        cbnode.count = 1;
      }
      return cbnode;
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
    onChange(e) {
      let { layerTree } = this;
      const dataList = [];
      const generateList = (data) => {
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
      this.selectedKeys = e;
      const { selectedNodes } = payload;
      if (selectedNodes && selectedNodes.length > 0) {
        let { data } = selectedNodes[0];
        let { props } = data;
        let { layerIndex } = props;
        this.highlightM3d(layerIndex);
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
        allLayerIds.forEach((layer) => {
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
      const { title, version, gdbp, ip, port, layerIndex, key } = layer;
      this.title = title;
      this.gdbp = gdbp;
      this.version = version;
      this.ip = ip;
      this.port = port;
      this.selectLayerIndex = layerIndex;
      this.layerKey = key;
      this.$refs.card && this.$refs.card.togglePanel();
      this.disableLayerSelect = true;
    },
    recordOriginStyle() {
      const { vueKey, innerVueIndex, vueCesium, allLayerIds } = this;
      let originStyles = [];

      allLayerIds.forEach((l) => {
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
        find.options.originStyles.forEach((i) => {
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
          let m3dlayer = g3dLayer.getLayer(i);
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
      /* const { g3dLayerIndex, viewer } = this;
      const { layerIndex } = layer;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      let layerIndexs = g3dLayer.getM3DLayerIndexes();
      this.featurevisible = false;
      this.selectedKeys = [`${layerIndex}`];
      layerIndexs.forEach((index) => {
        let m3dlayer = g3dLayer.getLayer(index);
        if (index != layerIndex) {
          m3dlayer.show = false;
        } else {
          m3dlayer.show = true;
          viewer.camera.flyToBoundingSphere(m3dlayer.boundingSphere);
        }
      });
      let children = this.layerTree.map((c) => {
        if (c.layerIndex == layerIndex) {
          c.disabled = false;
        } else {
          c.disabled = true;
        }
        return c;
      });
      this.layerTree.splice(0, 1, children[0]); */
    },
    disableIsolation() {
      /* let children = this.layerTree.map((c) => {
        c.disabled = false;
        return c;
      });
      this.layerTree.splice(0, 1, children[0]);
      this.restoreOrigindVisible(); */
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
        this.$_resetLayer();
      }
    },
    $_resetLayer() {
      const { innerVueIndex, vueKey, vueCesium } = this;
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      if (find && find.source) {
        let m3d = find.source;
        m3d.reset();
      }
    },
    $_pickEvent(movement) {
      const { enableBim, enableDynamicQuery } = this;
      if (enableDynamicQuery) {
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
      handler.setInputAction(function (movement) {
        vm.$_pickEvent(movement);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    restoreM3d() {
      this.restoreOriginStyle();
    },
    highlightM3d(layerIndex) {
      const { vueKey, innerVueIndex, vueCesium } = this;
      this.selectLayerIndex = layerIndex;
      let g3dLayer = viewer.scene.layers.getLayer(this.g3dLayerIndex);
      let m3dlayer = g3dLayer.getLayer(layerIndex);
      this.restoreM3d();
      vueCesium.StratifiedHousehouldManager.changeOptions(
        vueKey,
        innerVueIndex,
        "pickerTileset",
        m3dlayer
      );
      vueCesium.StratifiedHousehouldManager.changeOptions(
        vueKey,
        innerVueIndex,
        "pickerTilesetStyle",
        m3dlayer.style
      );
      m3dlayer.style = new Cesium.Cesium3DTileStyle({
        color: `color('#FFFF00', 1)`,
      });
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
      const { Cesium, viewer } = this;
      const { vueKey, innerVueIndex, vueCesium } = this;
      const scene = viewer.scene;
      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();
      let find = vueCesium.BimManager.findSource(vueKey, innerVueIndex);
      let m3d;
      if (find && find.source) {
        m3d = find.source;
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
          if (vm.featureclickenable) {
            vm.featurevisible = true;
          }

          vm.featureposition = {
            longitude: longitudeString2,
            latitude: latitudeString2,
            height: heightString2,
          };

          m3d.pickedOid = oid;
          m3d.pickedColor = Cesium.Color.fromCssColorString(
            "rgba(255, 255, 0, 0.75)"
          );

          if (m3d._useRawSaveAtt && Cesium.defined(feature)) {
            let result = feature.content.getAttributeByOID(oid) || {};
            vm.featureproperties = result;
          } else {
            m3d.queryAttributes(oid).then(function (result) {
              result = result || {};
              vm.featureproperties = result;
            });
          }
        } else {
          vm.featurevisible = false;
          m3d.pickedOid = undefined;
        }
      }
    }
  },
};
</script>
