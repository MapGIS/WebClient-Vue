<template>
  <div>
    <mapgis-ui-collapse-card
      class="mapgis-3d-scene-layer"
      v-if="enableControl"
      ref="card"
      position="top-left"
      :defaultCollapse="false"
      :outStyle="outStyle"
      :title="title"
      @toggle-main="handleBackMain"
    >
      <mapgis-ui-iconfont type="mapgis-layer1" slot="icon-hiden" />
      <span class="mapgis-3d-scene-layer-title" slot="title">{{ title }}</span>
      <mapgis-ui-space slot="extra" class="mapgis-3d-scene-layer-icons">
        <mapgis-ui-tooltip v-for="(m, i) in menus" :key="i">
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
          <template slot="custom" slot-scope="{}">
            <!-- <mapgis-ui-iconfont :type="icon" /> -->
          </template>
          <template
            slot="title"
            slot-scope="{
              title,
              icon,
              version,
              gdbp,
              ip,
              port,
              layerIndex,
              layerType,
              key,
              subLayerType
            }"
          >
            <mapgis-ui-iconfont
              :type="subLayerType"
              :style="{ marginRight: '2px' }"
            />
            <span
              :class="{
                'mapgis-3d-scene-layer-span': true,
                'mapgis-3d-scene-layer-span-inline': true,
                select: selectLayerIndex == layerIndex
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
                v-if="version && key == '地图场景默认键值'"
                class="mapgis-3d-scene-layer-version"
                >版本:{{ version }}</span
              >
              <mapgis-ui-iconfont
                v-if="
                  layerType == type.cache &&
                    (!isolation || selectLayerIndex == layerIndex)
                "
                :type="icon"
                class="iconfont"
                style="marginLeft:8px;"
                @click="
                  () =>
                    handleActiveItemKey({
                      title,
                      version,
                      gdbp,
                      ip,
                      port,
                      layerIndex,
                      key
                    })
                "
              />
              <mapgis-ui-iconfont
                v-if="
                  layerType == type.cache &&
                    (!isolation || selectLayerIndex == layerIndex)
                "
                :type="layerKey == key ? 'mapgis-unlock' : 'mapgis-lock'"
                class="iconfont"
                @click="
                  () =>
                    changeIsolation({
                      title,
                      icon,
                      version,
                      gdbp,
                      ip,
                      port,
                      layerIndex,
                      key
                    })
                "
              />
            </span>
          </template>
        </mapgis-ui-tree>
      </mapgis-ui-row>

      <m3d-menus
        slot="panel"
        size="big"
        :mode="layerKey == '地图场景默认键值' ? 'g3d' : 'm3d'"
        :version="version"
        :g3dLayerIndex="g3dLayerIndex"
        :layerIndex="selectLayerIndex"
        :gdbp="gdbp"
        :ip="ip"
        :port="port"
        @enable-dynamic-query="handleDynamicQuery"
      >
      </m3d-menus>
    </mapgis-ui-collapse-card>
    <!-- <mapgis-3d-virtual-popup
      :enablePopup="enablePopup"
      :enableTips="enableTips"
      :enableIot="iEnableIot"
      :popupOptions="popupOptions"
      :tipsOptions="tipsOptions"
      :iotOptions="iotOptions"
      :clickVisible="iClickVisible"
      :clickPosition="iClickPosition"
      :clickFeatures="iClickFeatures"
    >
    </mapgis-3d-virtual-popup> -->
    <mapgis-3d-feature-popup
      v-if="featureposition"
      :position="featureposition"
      :popupOptions="popupOptions"
      v-model="featurevisible"
    >
      <mapgis-3d-popup-iot
        :properties="featureproperties"
        :dataStoreIp="dataStoreIp"
        :dataStorePort="dataStorePort"
        :dataStoreDataset="dataStoreDataset"
      >
      </mapgis-3d-popup-iot>
    </mapgis-3d-feature-popup>
    <mapgis-3d-popup-feature-detail
      v-if="showDetail && isUnClosePopup"
      :properties="featureproperties"
      :dataStoreIp="dataStoreIp"
      :dataStorePort="dataStorePort"
      :dataStoreDataset="dataStoreDataset"
      @close-popup-window="closePopupWindow"
      @project-screen="projectScreen"
    />
  </div>
</template>

<script>
import { G3D } from "@mapgis/webclient-es6-service";
import G3DOptions from "./G3DOptions";
import { checkTypeNode, loopM3ds, checkTypeIcon } from "./util";
import M3dMenus from "./components/M3dMenus.vue";
import PopupMixin from "../Mixin/PopupMixin";

const { G3DLayerType, M3DTileDataInfo } = G3D;

export default {
  name: "mapgis-3d-scene-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...G3DOptions,
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      }
    },
    dataStoreIp: {
      type: String,
      default: "192.168.96.101"
    },
    dataStorePort: {
      type: String,
      default: "9014"
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1"
    },
    // 气泡框展示位置default、right
    popupShowType: {
      type: String,
      default: "default"
    }
  },
  mixins: [PopupMixin],
  components: {
    M3dMenus
  },
  data() {
    return {
      title: "G3D场景图层",
      layerIds: this.parseLayers(),
      type: {
        terrain: G3DLayerType.g3dTerrainLayer,
        cache: G3DLayerType.g3dCacheLayer
      },
      menus: [
        {
          title: "静态单体化查询",
          icon: "mapgis-highlight",
          active: this.enablePopup
        },
        {
          title: "批量设置",
          icon: "mapgis-setting",
          active: false
        },
        {
          title: "隐藏面板",
          icon: "mapgis-hide",
          active: false
        }
      ],
      layerTree: [
        {
          title: "地图场景",
          key: "地图场景默认键值",
          version: "",
          layerIndex: -99,
          icon: "mapgis-layer1",
          menu: "mapgis-down",
          children: [],
          scopedSlots: { icon: "custom", title: "title" }
        }
      ],
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
      ip: "localhost",
      port: "6163",
      isolation: false,
      featureposition: undefined, // {longitude: 0, latitude: 0, height: 0},
      featureproperties: undefined,
      featurevisible: undefined,
      featureclickenable: this.enablePopup,
      iEnableIot: false,
      showDetail: false,
      isUnClosePopup: true
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
  watch: {
    enablePopup(next) {
      this.featureclickenable = next;
      if (next) {
        this.bindPopupEvent();
      } else {
        this.unbindPopupEvent();
      }
    },
    opacity(next) {
      if (this.opacityLayersArray.length > 0) {
        this.opacityLayersArray.forEach((item, index) => {
          if (typeof item == "number") {
            this.opacityLayersArray[index] = item.toString();
          }
        });
        this.changeLayerOpacity(next, this.opacityLayersArray);
      } else {
        this.changeLayerOpacity(next);
      }
    },
    opacityLayersArray(next) {
      this.changeLayerOpacity(this.opacity, next);
    },
    layers(next) {
      this.layerIds = this.parseLayers(next);
      this.changeLayerVisible(this.layerIds);
    },
    layerIds(next) {
      this.changeLayerVisible(this.layerIds);
    }
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    onM3dLoaded(e) {},
    mount() {
      const vm = this;
      const { vueIndex, vueKey, vueCesium } = this;
      const { viewer, url, $props, enablePopup, layerId } = this;

      let version = this.parseVersion();
      let server = this.parseServer();
      let { ip, port } = server;
      this.ip = ip;
      this.port = port;
      let g3dLayer = this.createCesiumObject();
      let layers = this.parseLayers();
      if (!layers) this.layerIds = [];

      g3dLayer.then(e => {
        let g3d = viewer.scene.layers.appendSceneLayer(url, {
          ...$props,
          loaded: function(layer) {
            // 该回调有多少图层循环进多少次
          },
          getDocLayerIndexes: vm.getDocLayerIndexes
        });
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      const { viewer } = this;
      const { g3dLayerIndex } = this;
      // 移除图层的时候，把高亮也移除
      this.cancelHighlight();
      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      g3dLayer.remove(true);
      this.$emit("unload", { component: this });
      vueCesium.G3DManager.deleteSource(vueKey, vueIndex);
    },
    // 图层回调解析
    getDocLayerIndexes(indexes, g3d) {
      const { vueIndex, vueKey, vueCesium, viewer, enablePopup } = this;
      const { ip, port } = this;
      const vm = this;
      let layers = this.parseLayers();
      // 该回调只触发一次
      vm.g3dLayerIndex = indexes[0];
      let collection = new Cesium.PrimitiveCollection();
      vueCesium.G3DManager.addSource(vueKey, vueIndex, g3d, {
        m3ds: [],
        layerId: vueIndex,
        g3dLayerIndex: vm.g3dLayerIndex,
        collection: collection,
        primitiveCollection: viewer.scene.primitives.add(collection)
      });
      let g3dLayer = viewer.scene.layers.getLayer(vm.g3dLayerIndex);
      vm.layerTree[0].version = g3dLayer.version;
      vm.version = g3dLayer.version;
      vm.layerTree[0].title = g3dLayer.name;
      let layerIndexs = g3dLayer.getM3DLayerIndexes();

      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);

      if (find && find.options && find.options.m3ds) {
        let props = layerIndexs.map((i, j) => {
          let gIndex = i;
          let layer = g3dLayer.getLayer(`${gIndex}`);
          return layer.readyPromise;
        });
        Promise.all(props).then(m3ds => {
          vm.$emit("loaded", { g3d: vm, component: vm });
          vm.recordOriginStyle();
          if (enablePopup) {
            vm.bindPopupEvent();
          }
          vm.m3ds = m3ds;
          vueCesium.G3DManager.changeOptions(vueKey, vueIndex, "m3ds", m3ds);
          let all = [];
          m3ds.forEach((m3d, i) => {
            // 形参的m3d并不是表示序号i对应的图层，下一行才是序号i对应的图层
            let gIndex = layerIndexs[i];
            let info = g3dLayer.getLayerInfo(gIndex);
            let layer = g3dLayer.getLayer(`${gIndex}`);
            let { layerName, gdbpUrl, layerType } = info;
            all.push(`${gIndex}`);
            vm.layerTree[0].children.push({
              title: layerName,
              key: `${gIndex}`,
              version: g3dLayer.version,
              layerIndex: gIndex,
              layerType,
              ip,
              port,
              gdbp: gdbpUrl,
              icon: "mapgis-layer",
              menu: "mapgis-down",
              scopedSlots: {
                icon: "custom",
                title: "title"
              }
            });
            if (layers) {
              if (layers.indexOf(`${i}`) >= 0) {
                layer.show = true;
              } else {
                layer.show = false;
              }
            } else {
              layer.show = true;
            }
          });
          loopM3ds(m3ds, types => {
            types.forEach((t, i) => {
              const child = vm.layerTree[0].children;
              child[layerIndexs[i]].subLayerType = checkTypeIcon(t);
            });
          });
          vm.parseTerrain();
          vm.parserVector();
          vm.resortLayers();
          vm.layerIds = vm.layerIds.concat(all);
          // 修改全部/指定图层透明度
          if (vm.opacityLayersArray.length > 0) {
            vm.opacityLayersArray.forEach((item, index) => {
              if (typeof item == "number") {
                vm.opacityLayersArray[index] = item.toString();
              }
            });
            vm.changeLayerOpacity(vm.opacity, vm.opacityLayersArray);
          } else {
            vm.changeLayerOpacity(vm.opacity);
          }
        });
      }
    },
    // 搜索需要
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
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
        let { layerIndex } = props;
        this.highlightM3d(layerIndex);
      }
    },
    // 图层解析
    parseTerrain() {
      const vm = this;
      const { vueKey, vueIndex, vueCesium } = this;
      const { g3dLayerIndex } = this;

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      if (!g3dLayer) return;
      let indexes = g3dLayer.getTerrainLayerIndexes();
      let terrains = g3dLayer.getTerrainLayers();
      indexes.forEach(i => {
        let info = g3dLayer.getLayerInfo(i);
        let { layerName, layerType } = info;
        layerType =
          typeof layerType === "string" ? parseInt(layerType) : layerType;
        if (layerType == G3DLayerType.g3dTerrainLayer) {
          vm.layerTree[0].children.push({
            title: layerName,
            key: `${i}`,
            layerIndex: i,
            layerType,
            subLayerType: "mapgis-terrain",
            icon: "mapgis-terrain",
            menu: "mapgis-down",
            scopedSlots: {
              icon: "custom",
              title: "title"
            }
          });
        }
        vm.layerIds.push(`${i}`);
      });
      vueCesium.G3DManager.changeOptions(
        vueKey,
        vueIndex,
        "terrains",
        terrains
      );
    },
    parserVector() {
      const vm = this;
      const { vueKey, vueIndex, vueCesium } = this;
      const { g3dLayerIndex } = this;

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      if (!g3dLayer) return;
      let indexes = g3dLayer.getVectorLayerIndexes();
      let vectors = g3dLayer.getVectorLayers();
      indexes.forEach(i => {
        let info = g3dLayer.getLayerInfo(i);
        let { layerName, layerType } = info;
        layerType =
          typeof layerType === "string" ? parseInt(layerType) : layerType;
        if (layerType == G3DLayerType.g3dVectorLayer) {
          vm.layerTree[0].children.push({
            title: layerName,
            key: `${i}`,
            layerIndex: i,
            layerType,
            subLayerType: "mapgis-vector",
            icon: "mapgis-vector",
            menu: "mapgis-down",
            scopedSlots: {
              icon: "custom",
              title: "title"
            }
          });
        }
        vm.layerIds.push(`${i}`);
      });
      vueCesium.G3DManager.changeOptions(vueKey, vueIndex, "vectors", vectors);
    },
    resortLayers() {
      const vm = this;
      let childern = vm.layerTree[0].children;
      let news = childern.sort((a, b) => a.layerIndex - b.layerIndex);
      console.log("news", news[1]);
      // vm.layerTree.splice(0, 1, news);
    },
    parseServer(url) {
      url = url || this.url;
      let ip = new RegExp(/^[http:]*[https:]*\/\/.*\//);
      let ips = url.match(ip);
      let temp = ips[0].split("http://");
      let domains = temp[1].split(":");
      ip = domains[0];
      let port = domains[1].split("/")[0];
      this.ip = ip;
      this.port = port;
      return {
        ip,
        port
      };
    },
    parseVersion(url) {
      url = url || this.url;
      let g3d = new RegExp("/igs/rest/g3d/");
      let scene = new RegExp("/SceneServer");
      let find = url.search(g3d);
      let findScene = url.search(scene);
      if (find >= 0) {
        // 0.0 1.0版本的m3d图层，等于2.0版本的g3d图层
        this.version = "1.0";
      } else if (findScene >= 0) {
        // 2.0 版本
        this.version = "2.0";
      } else {
        this.version = "1.0";
      }
      return this.version;
    },
    parseName(m3d) {
      let { _gdbpUrl } = m3d;
      let name;
      let reg = new RegExp(/\\.*\.mcj/g);
      let result = _gdbpUrl.match(reg);
      if (result && result.length > 0) {
        let temp = result[0];
        let res = temp.split("\\");
        let proj = res[res.length - 1];
        let names = proj.split(".mcj");
        name = names && names.length > 0 ? names[0] : "未命名";
      }
      return name;
    },
    parseLayers(layerString) {
      layerString = layerString || this.layers;
      if (!layerString) return [];
      let pattern = new RegExp(/show:/i);
      if (!pattern.test(layerString)) {
        console.warn("layers格式错误，格式为show:0,1,2");
      }
      let layerStr = layerString.replace(/show:/i, "");
      let layerStrs = layerStr.split(",");
      let layers = layerStrs.map(l => l);

      return layers;
    },
    changeLayerOpacity(opacity, layers) {
      layers = layers || this.layerIds;
      const { g3dLayerIndex, viewer } = this;
      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      let indexes = g3dLayer.getAllLayerIndexes();
      indexes.forEach(index => {
        let layer = g3dLayer.getLayer(index);
        if (layers.indexOf(`${index}`) >= 0) {
          if (layer) {
            g3dLayer.translucencyByLayerIndex(index, opacity);
          }
        } else {
          if (layer) {
            // g3dLayer.translucencyByLayerIndex(index, opacity);
          }
        }
      });
    },
    changeLayerVisible(layers) {
      layers = layers || this.layerIds;
      const { g3dLayerIndex, viewer } = this;
      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      let indexes = g3dLayer.getAllLayerIndexes();
      indexes.forEach(index => {
        let layer = g3dLayer.getLayer(index);
        if (layers.indexOf(`${index}`) >= 0) {
          if (layer) {
            layer.show = true;
            g3dLayer.showByLayerIndex(index, true);
          }
        } else {
          if (layer) {
            layer.show = false;
            g3dLayer.showByLayerIndex(index, false);
          }
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
      const { title, version, gdbp, ip, port, layerIndex, key } = layer;
      this.title = title;
      this.gdbp = gdbp;
      this.version = version;
      this.ip = ip;
      this.port = port;
      this.selectLayerIndex = layerIndex;
      this.layerKey = key;
      this.$refs.card && this.$refs.card.togglePanel();
    },
    recordOriginStyle() {
      const { g3dLayerIndex, viewer } = this;
      const { vueKey, vueIndex, vueCesium } = this;

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      let layerIndexs = g3dLayer.getM3DLayerIndexes();
      let originStyles = [];
      layerIndexs.forEach(index => {
        let m3dlayer = g3dLayer.getLayer(index);
        originStyles.push(m3dlayer.style);
      });
      vueCesium.G3DManager.changeOptions(
        vueKey,
        vueIndex,
        "originStyles",
        originStyles
      );
    },
    restoreOriginStyle() {
      const { vueKey, vueIndex, vueCesium, g3dLayerIndex } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      if (find && find.options.originStyles) {
        find.options.originStyles.forEach((s, i) => {
          let m3dlayer = g3dLayer.getLayer(String(i));
          m3dlayer.style = s;
        });
      }
    },
    restoreOrigindVisible() {
      const { vueKey, vueIndex, vueCesium, g3dLayerIndex } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
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
      const { g3dLayerIndex, viewer } = this;
      const { layerIndex } = layer;

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      let layerIndexs = g3dLayer.getM3DLayerIndexes();
      this.featurevisible = false;
      this.selectedKeys = [`${layerIndex}`];
      layerIndexs.forEach(index => {
        let m3dlayer = g3dLayer.getLayer(index);
        if (index != layerIndex) {
          m3dlayer.show = false;
        } else {
          m3dlayer.show = true;
          viewer.camera.flyToBoundingSphere(m3dlayer.boundingSphere);
        }
      });
      let children = this.layerTree[0].children.map(c => {
        if (c.layerIndex == layerIndex) {
          c.disabled = false;
        } else {
          c.disabled = true;
        }
        return c;
      });
      this.layerTree[0].children.splice(0, 1, children[0]);
    },
    disableIsolation() {
      let children = this.layerTree[0].children.map(c => {
        c.disabled = false;
        return c;
      });
      this.layerTree[0].children.splice(0, 1, children[0]);
      this.restoreOrigindVisible();
      // this.restoreOriginStyle();
    },
    handleMenu(menu) {
      if (menu == "隐藏面板") {
        this.$refs.card && this.$refs.card.hide();
      } else if (menu == "静态单体化查询") {
        if (this.menus[0].active) {
          this.menus[0].active = false;
          this.unbindPopupEvent();
        } else {
          this.menus[0].active = true;
          this.bindPopupEvent();
        }
      }
    },
    pickFeature(payload) {
      const { movement, pickedFeature } = payload;
      const vm = this;
      const { g3dLayerIndex } = this;

      if (!pickedFeature) {
        vm.iClickVisible = false;
        return;
      }

      /* if (vm.featureclickenable) {
        vm.featurevisible = true;
      } */

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      if (!pickedFeature._content && pickedFeature.primitive) {
        this.featurevisible = true;
        // 右侧展示气泡框展示控制条件之一，关闭再打开会进入这里，showDetail一个控制条件不够
        if (!this.isUnClosePopup) {
          this.isUnClosePopup = !this.isUnClosePopup;
        }
        return;
      }
      let index = pickedFeature._content._tileset._layerIndex;
      vm.selectLayerIndex = index;
      vm.selectedKeys = [`${index}`];
      let layerInfo = g3dLayer.getLayerInfo(index);
      const { children } = layerInfo;
      let enableDynamic = children && children.length > 0 ? true : false;
      if (enableDynamic) {
        this.queryDynamic(movement, index);
      } else {
        this.queryStatic(movement);
      }
    },
    cancelFeature() {
      this.cancelHighlight();
    },
    cancelHighlight() {
      const { vueCesium, vueKey, vueIndex } = this;

      if (this.popupShowType === "default") {
        this.featurevisible = false;
      } else {
        if (this.popupShowType === "right" && this.isUnClosePopup) {
          this.isUnClosePopup = !this.isUnClosePopup;
        }
      }

      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let { primitiveCollection } = find.options;
        let last = find.options.feature;
        primitiveCollection.remove(last);
      }
      this.restoreHighlight();
      this.restoreM3d();
    },
    bindPopupEvent() {
      const { vueKey, vueIndex } = this;
      const { enablePopup, enableTips } = this;

      let clickhandler, hoverhandler;
      if (enablePopup) {
        clickhandler = this.$_bindClickEvent(
          this.pickFeature,
          this.cancelFeature
        );
      }

      vueCesium.G3DManager.changeOptions(
        vueKey,
        vueIndex,
        "clickhandler",
        clickhandler
      );
    },
    unbindPopupEvent() {
      const { vueKey, vueIndex } = this;
      this.featurevisible = false;
      this.restoreHighlight();
      this.restoreM3d();
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options.clickhandler) {
        find.options.clickhandler.destroy();
        vueCesium.G3DManager.changeOptions(
          vueKey,
          vueIndex,
          "clickhandler",
          undefined
        );
      }
    },
    restoreM3d() {
      this.restoreOriginStyle();
    },
    highlightM3d(layerIndex) {
      const { vueKey, vueIndex, vueCesium } = this;
      this.selectLayerIndex = layerIndex;
      let g3dLayer = viewer.scene.layers.getLayer(this.g3dLayerIndex);
      let m3dlayer = g3dLayer.getLayer(`${layerIndex}`);
      this.restoreM3d();
      vueCesium.G3DManager.changeOptions(
        vueKey,
        vueIndex,
        "pickerTileset",
        m3dlayer
      );
      vueCesium.G3DManager.changeOptions(
        vueKey,
        vueIndex,
        "pickerTilesetStyle",
        m3dlayer.style
      );
      m3dlayer.style = new Cesium.Cesium3DTileStyle({
        color: `color('#FFFF00', 1)`
      });
    },
    queryDynamic(movement, layerIndex) {
      const vm = this;
      const { Cesium, viewer, g3dLayerIndex } = this;
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let { primitiveCollection } = find.options;
        let cartesian = viewer.getCartesian3Position(movement.position);
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let height = cartographic.height;
          let mapPosition = { x: lng, y: lat, z: height };
          if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
          let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
          let layerIndexs = g3dLayer.getM3DLayerIndexes();
          if (layerIndex == undefined || layerIndex < 0) {
            vm.featurevisible = false;
            return;
          } else {
            if (typeof layerIndex === "string") {
              layerIndex = parseInt(layerIndex);
            }
          }
          // 查询容差小数位数与坐标位数保持一致。提高查询精度
          const latStr = lat.toString().split(".")[1];
          const tolerance = Number(`0.${latStr}`) / Number(latStr);

          g3dLayer.Monomerization(
            function callback(result) {
              vm.featurevisible = false;
              let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
              if (find) {
                let last = find.options.feature;
                primitiveCollection.remove(last);
              }
              if (result && result.length > 0) {
                let feature = result[0];
                if (vm.popupShowType === "default") {
                  vm.featurevisible = true;
                  vm.featureposition = {
                    longitude: lng,
                    latitude: lat,
                    height: height
                  };
                } else if (vm.popupShowType === "right") {
                  vm.showDetail = true;
                  if (!vm.isUnClosePopup) {
                    vm.isUnClosePopup = !vm.isUnClosePopup;
                  }
                }

                vm.featureproperties = feature.property;
                // _extrudedHeight和_height这样设置后才能贴模型
                feature.geometryInstances.geometry._extrudedHeight = 0;
                feature.geometryInstances.geometry._height = 100000;
                primitiveCollection.add(feature);
                vueCesium.G3DManager.changeOptions(
                  vueKey,
                  vueIndex,
                  "feature",
                  feature
                );
              } else {
                if (vm.popupShowType === "right" && vm.isUnClosePopup) {
                  vm.isUnClosePopup = !vm.isUnClosePopup;
                }
              }
            },
            {
              position: new Cesium.Cartesian3(
                mapPosition.x,
                mapPosition.y,
                mapPosition.z
              ),
              tolerance,
              layerIndex: String(layerIndex)
            }
          );
        }
      }
    },
    queryStatic(movement) {
      const vm = this;
      vm.featurevisible = false;
      const { Cesium, viewer, version, g3dLayerIndex, popupOptions } = this;
      const { vueKey, vueIndex, vueCesium } = this;
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
          // 点击模型外去除高亮
          vm.restoreHighlight();
          vm.restoreM3d();
          return;
        }

        vm.restoreHighlight();
        vm.restoreM3d();
        let longitudeString2, latitudeString2, heightString2;

        if (Cesium.defined(cartesian2)) {
          let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian);
          longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
          latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
          heightString2 = cartographic2.height;
        }

        if (cartesian || cartesian2) {
          if (vm.featureclickenable) {
            if (vm.popupShowType === "default") {
              vm.featurevisible = true;
              vm.featureposition = {
                longitude: longitudeString2,
                latitude: latitudeString2,
                height: heightString2
              };
            } else {
              vm.showDetail = true;
              if (!vm.isUnClosePopup) {
                vm.isUnClosePopup = !vm.isUnClosePopup;
              }
            }
          }

          let g3dLayer = viewer.scene.layers.getLayer(vm.g3dLayerIndex);
          let index = pickedFeature._content._tileset._layerIndex;
          vm.selectLayerIndex = index;
          vm.selectedKeys = [`${index}`];
          if (version == "1.0" || version == "0.0") {
            let layerInfo = g3dLayer.getLayerInfo(index);
            const { layerName, gdbpUrl } = layerInfo;
            vm.featureproperties = { layerName, gdbpUrl };
            vm.iClickFeatures = [{ properties: { layerName, gdbpUrl } }];
            vm.highlightM3d(index);
          } else if (version == "2.0") {
            if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0)
              return;
            let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);

            let oid = viewer.scene.pickOid(movement.position);
            let feature = viewer.scene.pick(movement.position);

            let m3ds = g3dLayer.getM3DLayerIndexes();
            let tileset = g3dLayer.getLayer(`${index}`);

            /* m3ds.forEach((index) => {
              let m3d = g3dLayer.getLayer(index);
              m3d && m3d.reset();
            });*/

            tileset.pickedOid = oid;
            tileset.pickedColor = Cesium.Color.fromCssColorString(
              "rgba(255,255,0,0.5)"
            );
            if (tileset._useRawSaveAtt && Cesium.defined(feature)) {
              let result = feature.content.getAttributeByOID(oid) || {};
              vm.featureproperties = result;
              vm.iClickFeatures = [{ properties: result }];
            } else {
              tileset.queryAttributes(oid).then(function(result) {
                result = result || {};
                vm.featureproperties = result;
                vm.iClickFeatures = [{ properties: result }];
              });
            }
          }
        } else {
          vm.clickvisible = false;
        }
      }
    },
    restoreHighlight() {
      const { g3dLayerIndex, viewer } = this;

      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      let m3ds = g3dLayer.getM3DLayerIndexes();
      m3ds.forEach(index => {
        let m3d = g3dLayer.getLayer(index);
        if (m3d) {
          m3d.reset(); //该函数目前底层MapGISM3DSet.reset无效 后期记得修改
          m3d.pickedOid = undefined;
        }
      });
    },
    handleDynamicQuery() {
      this.featurevisible = false;
      this.featureclickenable = false;
    },
    handleBackMain() {
      this.featureclickenable = this.enablePopup;
    },
    closePopupWindow() {
      this.isUnClosePopup = false;
    },
    projectScreen(file) {
      this.$emit("project-screen", file);
    }
  }
};
</script>
