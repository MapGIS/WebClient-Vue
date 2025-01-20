<template>
  <div class="mapgis-3d-stratified-household-wrapper">
    <mapgis-ui-collapse-card
      class="mapgis-3d-stratified-household"
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
            class="mapgis-3d-stratified-household-layers"
            :disabled="disableLayerSelect"
            :autoWidth="true"
            size="default"
            v-model="innerVueIndex"
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
        <span v-else class="mapgis-3d-stratified-household-title">{{
          title
        }}</span>
      </template>
      <mapgis-ui-space
        slot="extra"
        class="mapgis-3d-stratified-household-icons"
      >
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
      <mapgis-ui-row class="mapgis-3d-g3d-document">
        <mapgis-ui-input-search
          style="margin-bottom: 8px"
          placeholder="搜索"
          @change="onChange"
        />
        <mapgis-ui-tree
          class="mapgis-3d-g3d-document-tree"
          checkable
          showIcon
          v-model="layerIds"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="layerTree"
          :selectedKeys="selectedKeys"
          @expand="onExpand"
          @select="onSelect"
        >
          <template slot="custom" slot-scope="{}"> </template>
          <template
            slot="title"
            slot-scope="{ title, icon, version, gdbp, layerIndex, key, guid }"
          >
            <span
              :class="{
                'mapgis-3d-stratified-household-span': true,
                'mapgis-3d-stratified-household-span-inline': true,
                select: selectLayerIndex == layerIndex,
              }"
            >
              <span v-if="title && title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{
                  title.substr(title.indexOf(searchValue) + searchValue.length)
                }}
              </span>
              <span v-else>{{ title }}</span>
              <span
                v-if="version"
                class="mapgis-3d-stratified-household-version"
                >版本:{{ version }}</span
              >
              <mapgis-ui-tooltip v-for="(s, j) in submenus" :key="j">
                <template slot="title">{{ s.tooltip() }}</template>
                <mapgis-ui-iconfont
                  v-if="!isolation || selectLayerIndex == layerIndex"
                  :type="s.icon()"
                  :class="{
                    iconfont: true,
                    'iconfont-disabled': !enableStratifiedHouse,
                  }"
                  style="marginleft: 8px"
                  @click="
                    s.click({
                      title,
                      icon,
                      version,
                      gdbp,
                      layerIndex,
                      key,
                      guid,
                    })
                  "
                />
              </mapgis-ui-tooltip>
            </span>
          </template>
        </mapgis-ui-tree>
      </mapgis-ui-row>

      <StratifiedHouseholdMenus
        slot="panel"
        size="big"
        mode="m3d"
        :version="version"
        :g3dLayerIndex="g3dLayerIndex"
        :layerIndex="selectLayerIndex"
        :gdbp="gdbp"
        @enable-dynamic-query="handleDynamicQuery"
      >
      </StratifiedHouseholdMenus>
    </mapgis-ui-collapse-card>
    <mapgis-3d-feature-popup
      v-if="featureposition"
      :position="featureposition"
      :popupOptions="popupOptions"
      v-model="featurevisible"
    >
      <mapgis-3d-popup-iot
        :properties="featureproperties"
        :getProjectorStatus="getProjectorStatus"
        @project-screen="handleProjectScreen"
        :dataStoreIp="dataStoreIp"
        :dataStorePort="dataStorePort"
        :dataStoreDataset="dataStoreDataset"
      >
      </mapgis-3d-popup-iot>
    </mapgis-3d-feature-popup>
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";
import StratifiedHouseholdMenus from "./StratifiedHouseholdMenus.vue";
import { rgbToHex } from "../Utils/common/color-util";
import { InitializeOptionsType } from "@mapgis/webclient-cesium-plugin";

export default {
  name: "mapgis-3d-stratified-household",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  props: {
    getProjectorStatus: {
      type: Function,
      default: () => {},
    },
    outStyle: {
      type: Object,
      default: () => {
        return {
          position: "absolute",
          zIndex: 1000,
          padding: "0px",
          margin: "0px",
          height: "450px",
          width: "270px",
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
    enablePopup: { type: Boolean, default: true },
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      },
    },
    enableCollapse: { type: Boolean, default: true },
    enableStratifiedHouse: { type: Boolean, default: false },
    enableDynamicQuery: { type: Boolean, default: false },
    /**
     * 选中要素高亮颜色，支持rgb，rgba和十六进制格式
     */
    featureHighlightColorProp: {
      type: String,
      default: "rgba(255,255,0,0.5)",
    },
    /**
     * 选中图层高亮颜色，支持rgb，rgba和十六进制格式
     */
    layerHighlightColorProp: {
      type: String,
      default: "rgba(255,0,0,0.5)",
    },
    dataStoreIp: {
      type: String,
      default: "192.168.96.101",
    },
    dataStorePort: {
      type: String,
      default: "9014",
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1",
    },
    dataStoreStep: {
      type: Number,
      default: 2,
    },
  },
  components: {
    StratifiedHouseholdMenus,
  },
  computed: {
    layerHighlightColor() {
      let color = `color('#FFFF00', 1)`;
      if (this.layerHighlightColorProp.includes("#")) {
        color = `color('${this.layerHighlightColorProp}',1)`;
      } else if (this.layerHighlightColorProp.includes("rgb")) {
        const hex = rgbToHex(this.layerHighlightColorProp);
        let a = 1;
        if (this.layerHighlightColorProp.includes("rgba")) {
          const strs = this.layerHighlightColorProp.split(",");
          a = strs[strs.length - 1].split(")")[0];
        }
        color = `color('${hex}',${a})`;
      }
      return color;
    },
  },
  data() {
    return {
      innerVueIndex: undefined, // 这里的innerVueIndex对应layer的id
      title: "分层分户",
      layerIds: [],
      menus: [
        {
          title: "查询",
          icon: "mapgis-highlight",
          active: this.enablePopup,
        },
        {
          title: "模型爆炸",
          icon: "mapgis-fire1",
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
        {
          title: "模型爆炸",
          icon: "mapgis-fire1",
          active: false,
        },
      ],
      submenus: [
        {
          title: "进入图层菜单",
          tooltip: () =>
            this.enableStratifiedHouse
              ? "进入图层菜单"
              : "请按照分层分户要求制作数据",
          icon: () => "mapgis-layer",
          click: (payload) => {
            if (this.enableStratifiedHouse) {
              this.handleActiveItemKey(payload);
            }
          },
        },
        {
          title: "锁定/解锁图层",
          tooltip: () =>
            this.enableStratifiedHouse
              ? "锁定/解锁图层"
              : "请按照分层分户要求制作数据",
          icon: (key) =>
            this.layerKey == key ? "mapgis-lock" : "mapgis-unlock",
          click: (payload) => {
            if (this.enableStratifiedHouse) {
              this.changeIsolation(payload);
            }
          },
        },
        {
          title: "查看关系图谱",
          tooltip: () => "查看关系图谱",
          icon: () => "mapgis-share-alt",
          click: (payload) => {
            // this.relationshipInfo.layerTree = this.layerTree;
            // 获取楼层id
            this.relationshipInfo.floor = payload.guid;
            this.relationshipInfo.layerIndex = payload.layerIndex;
            this.relationshipInfo.isFloor = true;
            this.$emit("show-relationship-graph", this.relationshipInfo);
          },
        },
      ],
      layerTree: [],
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      expandItemKey: undefined,
      activeItemKey: undefined,
      gdbp: undefined,
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
      prePickFeature: undefined, // 上次选中的要素
      prePickFeatureColor: undefined, // 上次选中要素的颜色，便于恢复
      showModal: false,
      relationshipInfo: {}, // 关系谱图相关信息
      prevFloorId: undefined,
      lastPrevFloorId: undefined, // 记录楼栋切换楼层的最后一次prevFloorId
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
    console.log("mounted: ");
    this.mount();
    // 设置关系图谱数据源信息
    this.relationshipInfo.dataStoreIp = this.dataStoreIp;
    this.relationshipInfo.dataStorePort = this.dataStorePort;
    this.relationshipInfo.dataStoreDataset = this.dataStoreDataset;
    this.relationshipInfo.dataStoreStep = this.dataStoreStep;
  },
  destroyed() {
    this.restoreHighlight();
    this.restoreOriginCustomShader();
    this.restoreOriginStyle();
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
    layerIds(next) {
      this.changeLayerVisible(this.layerIds);
    },
    innerVueIndex(next) {
      this.unmount();
      this.mount();
    },
  },
  methods: {
    createCesiumObject() {
      return this.g3dIsReady();
    },
    /**
     * 判断传入的m3d图层是否加载完毕
     */
    g3dIsReady() {
      const { vueCesium, vueKey, model, innerVueIndex } = this;
      return new Promise((resolve, reject) => {
        let layerIndex = 0;
        this.$_getG3DByInterval(
          function (g3ds) {
            if (g3ds && g3ds.length > 0) {
              if (
                !g3ds[layerIndex] ||
                !g3ds[layerIndex].hasOwnProperty("options") ||
                !g3ds[layerIndex].options
              ) {
                reject(null);
              } else {
                resolve(g3ds[layerIndex]);
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
        console.log("find: ", find);
        if (find && find.source && find.options) {
          const { source } = find;
          const { commonLayer } = find.options;
          const all = [];
          const m3ds = [];
          const sublayers = commonLayer.activeScene.allSublayers.items;
          if (sublayers && sublayers.length > 0) {
            for (let i = 0; i < sublayers.length; i++) {
              const sublayer = sublayers[i];
              const { layerName, id, type, layerIndex, url } = sublayer;
              const m3d = source[layerIndex].source;
              m3d._layerIndex = layerIndex;
              m3ds.push(m3d);
              const { version } = m3d;
              if (
                source[layerIndex].type === InitializeOptionsType.MapGISM3DSet
              ) {
                all.push(`${layerIndex}`);
                vm.layerTree.push({
                  title: layerName,
                  key: `${layerIndex}`,
                  version,
                  layerIndex,
                  layerType: type,
                  gdbp: url,
                  guid: m3d._guid,
                  icon: "mapgis-layer",
                  menu: "mapgis-down",
                  scopedSlots: {
                    icon: "custom",
                    title: "title",
                  },
                });
              }
            }
            vm.m3ds = m3ds;
            // m3ds传入关系图谱
            vm.relationshipInfo.m3ds = m3ds;
            vm.layerIds = all;
            vm.$emit("loaded", { component: vm });
            let modelExplosion = new Cesium.ModelExplosion(viewer);
            let collection = new Cesium.PrimitiveCollection();
            vueCesium.StratifiedHousehouldManager.addSource(
              vueKey,
              innerVueIndex,
              source,
              {
                m3ds: m3ds,
                modelExplosion: modelExplosion,
                collection: collection,
                primitiveCollection: viewer.scene.primitives.add(collection),
              }
            );
            vm.recordOriginStyle();
            vm.recordOriginCustomShader();
            if (enablePopup) {
              vm.$_bindPickFeature();
            }
          }
        }
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, innerVueIndex } = this;
      this.$emit("unload", { component: this });
      vueCesium.StratifiedHousehouldManager.deleteSource(vueKey, innerVueIndex);
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    // 搜索需要
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    handleSelectChange(vueIndex) {
      this.innerVueIndex = vueIndex;
      let finds = this.layers.filter((l) => l.vueIndex == vueIndex);
      if (finds && finds.length > 0) {
        this.$emit("change-layer", finds[0]);
        // 动态添加关系图谱图标
        const relationship = this.collapsemenus.find(
          (item) => item.type === "relationship"
        );
        if (!relationship) {
          this.collapsemenus.push({
            title: "关系图谱",
            icon: "mapgis-share-alt",
            type: "relationship",
            active: false,
          });
        }
      }
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
    changeLayerVisible(layers) {
      layers = layers || this.layerIds;
      const { m3ds } = this;
      if (!m3ds) return;
      m3ds.forEach((m3d, i) => {
        if (layers) {
          if (layers.indexOf(`${i}`) >= 0) {
            m3d.show = true;
          } else {
            m3d.show = false;
          }
        } else {
          m3d.show = true;
        }
      });
    },
    handleExpandItemKey(key) {
      if (key == this.expandItemKey) {
        this.expandItemKey = undefined;
      } else {
        this.expandItemKey = key;
      }
    },
    handleActiveItemKey(layer) {
      const { title, version, gdbp, layerIndex, key } = layer;
      this.title = title;
      this.gdbp = gdbp;
      this.version = version;
      this.selectLayerIndex = layerIndex;
      this.layerKey = key;
      this.$refs.card && this.$refs.card.togglePanel();
      this.disableLayerSelect = true;
    },
    handleProjectScreen(payload) {
      this.$emit("project-screen", payload);
    },
    /**
     * 保存指定的M3D属性
     * @param {String} storeName 存储属性值数组的对象的名称
     * @param {Function} callback 执行存储操作的回调函数
     * */
    recordM3DProps(storeName, callback) {
      const { viewer } = this;
      const { vueKey, innerVueIndex, vueCesium, m3ds } = this;
      if (!m3ds) {
        return;
      }
      let props = [];
      m3ds.forEach((m3d) => {
        if (m3d && callback && callback instanceof Function) {
          callback(m3d, props);
        }
      });
      vueCesium.StratifiedHousehouldManager.changeOptions(
        vueKey,
        innerVueIndex,
        storeName,
        props
      );
    },
    // 存储M3D的style属性
    recordOriginStyle() {
      this.recordM3DProps("originStyles", function (m3d, props) {
        props.push(m3d.style);
      });
    },
    // 存储M3D的customShader属性
    recordOriginCustomShader() {
      this.recordM3DProps("originCustomShaders", function (m3d, props) {
        props.push(m3d.customShader);
      });
    },
    /**
     * 恢复原有的属性
     * @param {String} storeName 存储属性值数组的对象的名称
     * @param {Function} callback 执行恢复操作的回调函数
     * */
    restoreOriginProps(storeName, callback) {
      const { vueKey, innerVueIndex, vueCesium, m3ds } = this;
      if (!m3ds) {
        return;
      }
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      if (find && find.options[storeName]) {
        find.options[storeName].forEach((s, i) => {
          let m3d = m3ds[`${i}`];
          if (m3d && callback && callback instanceof Function) {
            callback(m3d, s);
          }
        });
      }
    },
    // 恢复默认样式
    restoreOriginStyle() {
      this.restoreOriginProps("originStyles", function (m3dlayer, prop) {
        m3dlayer.style = prop;
      });
    },
    // 恢复默认自定义着色器
    restoreOriginCustomShader() {
      this.restoreOriginProps("originCustomShaders", function (m3dlayer, prop) {
        m3dlayer.customShader = prop;
      });
    },
    restoreHighlight() {
      const { m3ds } = this;
      if (m3ds) {
        m3ds.forEach((m3d) => {
          if (m3d) {
            m3d.style = undefined;
          }
        });
      }
    },
    restoreOrigindVisible() {
      const { vueKey, innerVueIndex, vueCesium, m3ds } = this;
      if (!m3ds) {
        return;
      }
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      if (find && find.options.originStyles) {
        find.options.originStyles.forEach((s, i) => {
          let m3d = m3ds[i];
          m3d.show = true;
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
      const { viewer, m3ds } = this;
      if (!m3ds) {
        return;
      }
      const { layerIndex } = layer;
      this.featurevisible = false;
      this.selectedKeys = [`${layerIndex}`];
      m3ds.forEach((m3d) => {
        if (m3d._layerIndex != layerIndex) {
          m3d.show = false;
        } else {
          m3d.show = true;
          viewer.camera.flyToBoundingSphere(m3d.boundingSphere);
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
      this.layerTree.splice(0, 1, children[0]);
      this.restoreM3d();
    },
    disableIsolation() {
      let children = this.layerTree.map((c) => {
        c.disabled = false;
        return c;
      });
      this.layerTree.splice(0, 1, children[0]);
      this.restoreOrigindVisible();
    },
    enableExplosion() {
      const { Cesium, viewer, m3ds } = this;
      if (!m3ds) {
        return;
      }
      const { vueKey, innerVueIndex, vueCesium } = this;
      const vector = new Cesium.Cartesian3(0, 0, 1); //向Z轴正方向爆炸
      const expDistance = 5;
      const speed = 0.5;
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      if (find && find.options) {
        const { modelExplosion } = find.options;
        modelExplosion.multiLayerAxisExplosionNoAnimate(m3ds, {
          direction: vector,
          expDistance: expDistance,
          speed: speed,
        });
      }
    },
    disableExplosion() {
      const { vueKey, innerVueIndex, vueCesium, viewer, m3ds } = this;
      if (!m3ds) {
        return;
      }
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      if (find && find.options) {
        const { modelExplosion } = find.options;
        modelExplosion.resetExplosionByField(m3ds);
        setTimeout(function () {
          // 将mapgism3d的modelExplosion属性修改为false，确保不对其他功能造成性能影响
          modelExplosion.recover(m3ds);
        }, 1000);
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
      } else if (menu == "模型爆炸") {
        if (this.menus[1].active) {
          this.menus[1].active = false;
          this.disableExplosion();
        } else {
          this.menus[1].active = true;
          this.enableExplosion();
        }
      } else if (menu == "关系图谱") {
        this.menus[2].active = true;
        // 获取楼栋id
        this.relationshipInfo.floor = "02203205GB00643000101";
        this.relationshipInfo.layerTree = this.layerTree;
        this.relationshipInfo.isFloor = false;
        this.$emit("show-relationship-graph", this.relationshipInfo);
      }
    },
    $_pickEvent(movement) {
      this.queryStatic(movement);
    },
    $_bindPickFeature() {
      const { vueKey, innerVueIndex } = this;
      let clickhandler = this.$_bindClickHanlder();
      vueCesium.StratifiedHousehouldManager.changeOptions(
        vueKey,
        innerVueIndex,
        "clickhandler",
        clickhandler
      );
    },
    $_unbindPickFeature() {
      const { vueKey, innerVueIndex } = this;
      const vm = this;
      this.featurevisible = false;
      this.restoreHighlight();
      this.restoreM3d();
      if (vm.prePickFeature && vm.prePickFeatureColor) {
        vm.prePickFeature.color = vm.prePickFeatureColor;
      }
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
      const { vueKey, innerVueIndex, vueCesium, layerHighlightColor, m3ds } =
        this;
      if (!m3ds) {
        return;
      }
      this.selectLayerIndex = layerIndex;

      const m3d = m3ds.find((item) => item._layerIndex === layerIndex);
      this.restoreM3d();
      /**
       * @修改说明 使用组件传入的高亮颜色
       * @修改人 龚跃健
       * @修改时间 2022/1/13
       */
      m3d.style = new Cesium.Cesium3DTileStyle({
        color: layerHighlightColor,
      });
      vueCesium.StratifiedHousehouldManager.changeOptions(
        vueKey,
        innerVueIndex,
        "pickerTileset",
        m3d
      );
      vueCesium.StratifiedHousehouldManager.changeOptions(
        vueKey,
        innerVueIndex,
        "pickerTilesetStyle",
        m3d.style
      );
    },
    handleDynamicQuery() {
      this.featurevisible = false;
      this.featureclickenable = false;
    },
    handleBackMain() {
      this.featureclickenable = this.enablePopup;
      this.disableLayerSelect = false;
    },
    queryStatic(movement) {
      const vm = this;
      vm.featureproperties = undefined;
      const { Cesium, viewer, m3ds } = this;
      if (!m3ds) {
        return;
      }
      const { featureHighlightColorProp } = this;
      const scene = viewer.scene;

      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();
      if (!movement) return;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let position = movement.position || movement.endPosition;
        let cartesian = viewer.getCartesian3Position(position);
        let ray = scene.camera.getPickRay(position, tempRay);
        let cartesian2 = scene.globe.pick(ray, scene, tempPos);

        let pickedFeature = viewer.scene.pick(movement.position);

        if (!pickedFeature) {
          vm.clickvisible = false;
          vm.featurevisible = false;
          // 点击模型外去除高亮
          vm.restoreHighlight();
          vm.restoreM3d();
          return;
        }

        let longitudeString2, latitudeString2, heightString2;

        if (Cesium.defined(cartesian2)) {
          let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian);
          longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
          latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
          heightString2 = cartographic2.height;
        }

        if (cartesian || cartesian2) {
          let index = pickedFeature._content._tileset._layerIndex;

          const tileset = m3ds.find((item) => item._layerIndex === index);
          vm.selectLayerIndex = index;
          vm.selectedKeys = [`${index}`];
          vm.restoreHighlight();

          // 修改说明：M3D2.1已弃用viewer.scene.pickOid方法，后面统一从feature上获取要素id，高亮统一使用Cesium3DTileStyle设置
          // 修改人:龚跃健
          // 修改日期：2024-11-22
          const { tilesetVersion } = tileset.version;
          let id;
          let conditions;
          if (tilesetVersion === "2.1") {
            id = pickedFeature.getProperty("tid");
            conditions = [["${tid} === ${id}", featureHighlightColorProp]];
          } else {
            id = pickedFeature.getProperty("OID");
            conditions = [["${OID} === ${id}", featureHighlightColorProp]];
          }
          tileset.style = new Cesium.Cesium3DTileStyle({
            defines: {
              id,
            },
            color: {
              conditions,
            },
          });

          if (Cesium.defined(pickedFeature)) {
            let result = {};
            const propertyIds = pickedFeature.getPropertyIds();
            propertyIds.forEach((id) => {
              result[id] = pickedFeature.getProperty(id);
            });
            vm.featureproperties = result;
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
              height: heightString2,
            };
          }
        } else {
          vm.clickvisible = false;
        }
      }
    },
    changeSimpleMenu(key) {
      this.layerIds = [`${key}`];
    },
    changeSimpleSlider(keys) {
      let keyStr = keys.map((k) => `${k}`);
      this.layerIds = keyStr;
    },
    customLabel(label) {
      let show = label;
      let reg = new RegExp(/-(\S*)?楼?F?/g);
      let res = reg.exec(label);
      if (res && res.length > 0) {
        show = res[res.length - 1];
      }
      return show;
    },
    floorHighlight(data) {
      const { vueKey, innerVueIndex, vueCesium, Cesium } = this;
      const { layerIndex, viewer, m3ds, version } = this;

      this.restoreM3d();

      const expDistance = 50;
      const speed = 1;
      let tileset;
      if (m3ds) {
        tileset = m3ds.find((item) => item._layerIndex === data.layerIndex);
      }
      if (!tileset) {
        return;
      }
      let find = vueCesium.StratifiedHousehouldManager.findSource(
        vueKey,
        innerVueIndex
      );
      if (find && find.options) {
        const { modelExplosion } = find.options;
        const vectorLeft = new Cesium.Cartesian3(1, 0, 0);
        const vectorUp = new Cesium.Cartesian3(0, 1, 0);
        const vector = new Cesium.Cartesian3();
        const angle = Cesium.Math.toRadians(-45);
        vector.x =
          vectorLeft.x * Math.cos(angle) + vectorUp.x * Math.sin(angle);
        vector.y =
          vectorLeft.y * Math.cos(angle) + vectorUp.y * Math.sin(angle);
        vector.z =
          vectorLeft.z * Math.cos(angle) + vectorUp.z * Math.sin(angle);
        // 如果有移出的楼层则先还原
        if (this.prevFloorId) {
          modelExplosion.resetExplosionByField([m3ds[this.prevFloorId]]);
        }
        this.prevFloorId = data.layerIndex;
        // this.selectedKeys = [`${data.layerIndex}`];
        modelExplosion.multiLayerAxisExplosionNoAnimate([tileset], {
          direction: vector,
          expDistance: expDistance,
          speed: speed,
        });
        this.highlightM3d(data.layerIndex);
      }
    },
    houseHighlight(data) {
      this.restoreHighlight();
      const { viewer, m3ds, featureHighlightColorProp } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds.find((item) => item._layerIndex === data.layerIndex);
      }
      if (!tileset) {
        return;
      }
      // 修改说明：M3D2.1已弃用viewer.scene.pickOid方法，后面统一从feature上获取要素id，高亮统一使用Cesium3DTileStyle设置
      // 修改人:龚跃健
      // 修改日期：2024-11-22
      const { version } = tileset;
      let id = data.oid || 5;
      let conditions;
      if (version === "2.1") {
        conditions = [["${tid} === ${id}", featureHighlightColorProp]];
      } else {
        conditions = [["${OID} === ${id}", featureHighlightColorProp]];
      }
      tileset.style = new Cesium.Cesium3DTileStyle({
        defines: {
          id,
        },
        color: {
          conditions,
        },
      });
    },
    // 关系图谱打开的根节点为楼层时展示当前楼层
    lockFloor(layerIndex) {
      const { g3dLayerIndex, viewer, m3ds } = this;

      this.highlightM3d(layerIndex + "");
      this.restoreHighlight();
      this.restoreM3d();
      this.featurevisible = false;
      this.selectedKeys = [`${layerIndex}`];
      if (!m3ds) {
        return;
      }
      m3ds.forEach((m3d) => {
        if (m3d._layerIndex != layerIndex) {
          m3d.show = false;
        } else {
          m3d.show = true;
          if (layerIndex === this.prevFloorId) {
            this.restoreHighlight();
            this.restoreM3d();
          }
          viewer.camera.flyToBoundingSphere(m3d.boundingSphere);
        }
      });
    },
    reloadGraph() {
      this.restoreHighlight();
      this.restoreM3d();
    },
    resizeGraph() {
      return new Promise((resolve) => {
        this.revertFloor().then(() => {
          resolve();
        });
      });
    },

    revertFloor() {
      return new Promise((resolve) => {
        if (this.prevFloorId) {
          const { vueKey, innerVueIndex, vueCesium, m3ds } = this;
          let find = vueCesium.StratifiedHousehouldManager.findSource(
            vueKey,
            innerVueIndex
          );
          if (find && find.options) {
            const { modelExplosion } = find.options;
            modelExplosion.resetExplosionByField([m3ds[this.prevFloorId]]);
            this.restoreM3d();
          }
          this.lastPrevFloorId = this.prevFloorId;
          this.prevFloorId = undefined;
        }

        if (this.relationshipInfo.isFloor) {
          this.restoreOrigindVisible();
        }

        this.restoreHighlight();
        this.restoreM3d();
        resolve();
      });
    },

    restoreFloor() {
      return new Promise((resolve) => {
        if (this.lastPrevFloorId) {
          this.highlightM3d(this.lastPrevFloorId + "");
          this.lastPrevFloorId = undefined;
          this.restoreHighlight();
          this.restoreM3d();
        }
        resolve();
      });
    },
    changeFloor(data) {
      const layerInfo = this.relationshipInfo.layerTree.find(
        (item) => item.guid === data.guid
      );
      this.relationshipInfo.isFloor = data.isFloor;
      this.relationshipInfo.floor = data.guid;
      this.relationshipInfo.layerIndex = layerInfo
        ? layerInfo.layerIndex
        : undefined;
      this.$emit("show-relationship-graph", this.relationshipInfo);
    },
  },
};
</script>
