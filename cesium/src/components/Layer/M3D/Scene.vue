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
          <template slot="custom" slot-scope="{}"> </template>
          <template
            slot="title"
            slot-scope="{
              title,
              icon,
              version,
              gdbp,
              ip,
              port,
              domain,
              layerIndex,
              layerType,
              key,
              subLayerType,
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
                style="marginleft: 8px"
                @click="
                  () =>
                    handleActiveItemKey({
                      title,
                      version,
                      gdbp,
                      ip,
                      port,
                      domain,
                      layerIndex,
                      key,
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
                      domain,
                      layerIndex,
                      key,
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
        :domain="domain"
        @enable-dynamic-query="handleDynamicQuery"
      >
      </m3d-menus>
    </mapgis-ui-collapse-card>
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
        :dataStoreIp="dataStoreIp"
        :dataStorePort="dataStorePort"
        :dataStoreDataset="dataStoreDataset"
        v-bind="popupConfig"
      />
    </mapgis-3d-feature-popup>
  </div>
</template>

<script>
import { G3D } from "@mapgis/webclient-es6-service";
import G3DOptions from "./G3DOptions";
import { checkTypeNode, loopM3ds, checkTypeIcon } from "./util";
import M3dMenus from "./components/M3dMenus.vue";
import PopupMixin from "../Mixin/PopupMixin";
import * as Feature from "../../service/comprehensive-query/util/feature";
import {
  IGSSceneLayer,
  LayerType,
  IGSSceneOriginLayerType,
} from "@mapgis/webclient-common";
import {
  MapGISM3DSet,
  MapGISTerrainProvider,
  initializeOptions,
  InitializeOptionsType,
  UrlTemplateImageryProvider,
  MapGISMapServerImageryProvider,
} from "@mapgis/webclient-cesium-plugin";

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
      },
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
    // 气泡框展示位置default、right
    popupShowType: {
      type: String,
      default: "default",
    },
    popupOverlay: {
      type: Object,
      default: () => {},
    },
    // 高亮样式
    highlightStyle: {
      type: String,
      default: "rgba(255,255,0,0.5)",
    },
    // 挂靠的查询参数，比如三维简单要素类，如果有挂靠的查询参数，则拾取的要素属性使用从三维简单要素类里的内容
    searchParams: {
      type: Object,
      default: () => {},
    },
    // 图层跳转时间
    duration: {
      type: Number,
      default: 0,
    },
  },
  mixins: [PopupMixin],
  components: {
    M3dMenus,
  },
  data() {
    return {
      title: "G3D场景图层",
      layerIds: this.parseLayers(),
      type: {
        terrain: G3DLayerType.g3dTerrainLayer,
        cache: G3DLayerType.g3dCacheLayer,
      },
      menus: [
        {
          title: "静态单体化查询",
          icon: "mapgis-highlight",
          active: this.enablePopup,
        },
        {
          title: "批量设置",
          icon: "mapgis-setting",
          active: false,
        },
        {
          title: "隐藏面板",
          icon: "mapgis-hide",
          active: false,
        },
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
          scopedSlots: { icon: "custom", title: "title" },
        },
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
      domain: undefined,
      isolation: false,
      featureposition: undefined, // {longitude: 0, latitude: 0, height: 0},
      featureproperties: undefined,
      featurevisible: undefined,
      featureclickenable: this.enablePopup,
      iEnableIot: false,
      layerVisibleArr: [], //记录显示的图层，拾取时隐藏的图层直接忽略
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
    },
  },
  methods: {
    /**
     * 构造初始化options
     */
    getOptions() {
      const { $props } = this;
      let options = {};
      // 新增extensions属性
      // 以支持通过对象的方式批量传入图层属性，
      // 但是优先级低于单个传入属性，即如果单个属性有传入值，优先使用传入的值，
      // 如果没有传入，但是extensions中有该属性，则使用extensions里对应的值
      // 修改者：龚跃健 2024/10/28
      const tempProps = {
        ...this.$props,
        ...this.$props.extensions,
        ...this.$options.propsData,
      };
      Object.keys(tempProps).forEach(function (key) {
        options[key] = tempProps[key];
      });
      return options;
    },
    mount() {
      const vm = this;
      const { vueIndex, vueKey, vueCesium } = this;
      const { viewer, url, $props, enablePopup, layerId } = this;
      const { luminanceAtZenith, maximumMemoryUsage } = this;

      let version = this.parseVersion();
      let server = this.parseServer();
      const options = this.getOptions();
      let { ip, port, domain } = server;
      this.ip = ip;
      this.port = port;
      this.domain = domain;
      const sceneLayer = new IGSSceneLayer({
        // 服务基地址
        url,
        ...options,
        extensionOptions: { ...options },
      });
      // 加载场景服务
      sceneLayer.load().then(async (layer) => {
        const subLayers = layer.activeScene.sublayers.items;
        subLayers.map((item) => {
          if (item.type === IGSSceneOriginLayerType.terrain) {
            item.requestVertexNormals = vm.requestVertexNormals;
          }
        });
        const sceneOptions = initializeOptions(layer, viewer);
        const layers = {};
        // 存储M3D初始样式
        const originStyles = [];
        const m3ds = [];
        for (let i = 0; i < sceneOptions.length; i++) {
          const sceneSublayerOptions = Object.assign(
            {},
            options,
            sceneOptions[i]
          );
          const sceneSublayerId = String(sceneSublayerOptions.id.split(":")[1]);
          const optionsType = sceneSublayerOptions.type;

          // 根据option的类型匹配InitializeOptionType枚举变量并实例化对应的图层对象
          let imageryProvider;
          let imageryLayer;
          switch (optionsType) {
            // MapGIS M3D图层
            case InitializeOptionsType.MapGISM3DSet:
              const m3dSet = await MapGISM3DSet.fromUrl(
                sceneSublayerOptions.url,
                sceneSublayerOptions
              );
              m3dSet._layerIndex = sceneSublayerId;
              m3dSet.imageBasedLighting.luminanceAtZenith = luminanceAtZenith;
              m3dSet.cacheBytes = maximumMemoryUsage;
              viewer.scene.primitives.add(m3dSet);
              /**
               * 修改说明：这里原先用zoomTo方法做图层的跳转，但是在第一次切换二三维的时候，地图会有一个默认的跳转（zoom组件里flyTo）。
               * 由于zoomTo方法是同步的会被flyTo覆盖，因此图层的跳转没有生效。所以这里图层的跳转改成flyToBoundingSphere
               * 修改人：程文进
               * 修改时间：2025/7/15
               * */
              if (this.autoReset) {
                const boundingSphere = m3dSet.boundingSphere;
                const orientation = new Cesium.HeadingPitchRange(
                  0.0,
                  -0.5,
                  boundingSphere.radius * 2.5
                );
                viewer.camera.flyToBoundingSphere(boundingSphere, {
                  duration: options.duration,
                  offset: orientation,
                });
              }
              layers[sceneSublayerId] = {
                type: optionsType,
                source: m3dSet,
              };
              m3ds.push(m3dSet);
              originStyles.push({ id: sceneSublayerId, style: m3dSet.style });
              break;
            // MapGIS地形图层
            case InitializeOptionsType.MapGISTerrainProvider:
              viewer.terrainProvider = new MapGISTerrainProvider(
                sceneSublayerOptions
              );
              layers[sceneSublayerId] = {
                type: optionsType,
                source: viewer.terrainProvider,
              };
              break;
            // 覆盖物图层 IGS 2.0
            case InitializeOptionsType.MapGISMapServerImageryProvider:
              imageryProvider = new MapGISMapServerImageryProvider(
                sceneSublayerOptions
              );
              imageryLayer =
                viewer.imageryLayers.addImageryProvider(imageryProvider);
              layers[sceneSublayerId] = {
                type: optionsType,
                source: imageryLayer,
              };
              break;
            // 覆盖物图层 IGS 1.0
            case InitializeOptionsType.UrlTemplateImageryProvider:
              imageryProvider = new UrlTemplateImageryProvider(
                sceneSublayerOptions
              );
              imageryLayer =
                viewer.imageryLayers.addImageryProvider(imageryProvider);
              layers[sceneSublayerId] = {
                type: optionsType,
                source: imageryLayer,
              };
              break;
            case InitializeOptionsType.label:
              // TODO：注记图层暂未重构，在initializeOptions方法时已经添加到场景中
              break;
          }
        }
        vueCesium.G3DManager.addSource(vueKey, vueIndex, layers, {
          m3ds,
          originStyles,
          commonLayer: layer,
        });
        if (layers && Object.keys(layers).length) {
          this.setLayerTree(layer, layers);
        }
        if (enablePopup) {
          vm.bindPopupEvent();
        }
        // 设置图层透明度
        this.changeLayerOpacity(this.opacity);
        // 设置图层的显示、隐藏
        this.changeLayerVisible(this.layerIds);

        vm.$emit("loaded", { g3d: layers, component: vm });
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex, viewer, Cesium } = this;
      this.unbindPopupEvent();
      // 移除图层的时候，把高亮也移除
      this.cancelHighlight();
      // 移除场景服务
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        const layerIds = Object.keys(find.source);
        for (let i = 0; i < layerIds.length; i++) {
          const layerId = layerIds[i];
          const layer = find.source[layerId];
          const layerType = layer.type;
          const source = layer.source;
          switch (layerType) {
            // MapGIS M3D图层
            case InitializeOptionsType.MapGISM3DSet:
              viewer.scene.primitives.remove(source);
              break;
            // MapGIS地形图层
            case InitializeOptionsType.MapGISTerrainProvider:
              viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
              break;
            // 覆盖物图层 IGS 2.0
            case InitializeOptionsType.MapGISMapServerImageryProvider:
            // 覆盖物图层 IGS 1.0
            case InitializeOptionsType.UrlTemplateImageryProvider:
              viewer.imageryLayers.remove(source, true);
              break;
            case InitializeOptionsType.label:
              // TODO：注记图层暂未重构，在initializeOptions方法时已经添加到场景中
              break;
          }
        }
      }
      this.$emit("unload", { component: this });
      vueCesium.G3DManager.deleteSource(vueKey, vueIndex);
    },
    /**
     * 设置场景服务图层树
     */
    setLayerTree(layer, source) {
      const { ip, port, domain } = this;
      if (!source) {
        return;
      }
      // 设置服务目录树
      this.layerTree[0].title = layer.title;
      const sublayers = layer.activeScene.allSublayers.items;
      if (sublayers && sublayers.length > 0) {
        for (let i = 0; i < sublayers.length; i++) {
          const sublayer = sublayers[i];
          const { layerName, id, type, layerIndex, url } = sublayer;
          if (!source[layerIndex]) {
            continue;
          }
          const { version } = source[layerIndex].source;
          switch (source[layerIndex].type) {
            // MapGIS M3D图层
            case InitializeOptionsType.MapGISM3DSet:
              this.layerTree[0].children.push({
                title: layerName,
                key: id,
                layerIndex,
                layerType: type,
                ip,
                port,
                domain,
                gdbp: url,
                version,
                icon: "mapgis-layer",
                menu: "mapgis-down",
                scopedSlots: {
                  icon: "custom",
                  title: "title",
                },
              });
              break;
            // MapGIS地形图层
            case InitializeOptionsType.MapGISTerrainProvider:
              this.layerTree[0].children.push({
                title: layerName,
                key: id,
                layerIndex,
                layerType: type,
                subLayerType: "mapgis-terrain",
                icon: "mapgis-terrain",
                menu: "mapgis-down",
                scopedSlots: {
                  icon: "custom",
                  title: "title",
                },
              });
              break;
            // 覆盖物图层 IGS 2.0
            case InitializeOptionsType.MapGISMapServerImageryProvider:
            // 覆盖物图层 IGS 1.0
            case InitializeOptionsType.UrlTemplateImageryProvider:
              this.layerTree[0].children.push({
                title: layerName,
                key: id,
                layerIndex,
                layerType: type,
                subLayerType: "mapgis-vector",
                icon: "mapgis-vector",
                menu: "mapgis-down",
                scopedSlots: {
                  icon: "custom",
                  title: "title",
                },
              });
              break;
            case InitializeOptionsType.label:
              // TODO：注记图层暂未重构，在initializeOptions方法时已经添加到场景中
              break;
          }
        }
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
    resortLayers() {
      const vm = this;
      let childern = vm.layerTree[0].children;
      let news = childern.sort((a, b) => a.layerIndex - b.layerIndex);
    },
    parseServer(url) {
      url = url || this.url;
      const urlObj = new URL(url);
      this.ip = urlObj.hostname;
      this.port = urlObj.port;
      this.domain = urlObj.origin;
      return {
        ip: this.ip,
        port: this.port,
        domain: this.domain,
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
      let layers = layerStrs.map((l) => l);

      return layers;
    },
    /**
     * 设置图层透明度
     */
    changeLayerOpacity(opacity, opacityLayersArray) {
      const { viewer, Cesium, vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        const layerIds = Object.keys(find.source);
        for (let i = 0; i < layerIds.length; i++) {
          const layerId = layerIds[i];
          if (
            opacityLayersArray &&
            opacityLayersArray.length > 0 &&
            !opacityLayersArray.includes(layerId)
          ) {
            // 只设置指定图层的透明度，暂时不支持设置多个图层对应多个透明度
            continue;
          }
          const layer = find.source[layerId];
          const layerType = layer.type;
          const source = layer.source;
          switch (layerType) {
            // MapGIS M3D图层
            case InitializeOptionsType.MapGISM3DSet:
              source.style = new Cesium.Cesium3DTileStyle({
                color:
                  "undefined === ${COLOR}.r ? color('white'," +
                  opacity +
                  "):rgba(${COLOR}.r *255,${COLOR}.g* 255,${COLOR}.b *255, " +
                  opacity +
                  ")",
              });
              break;
            // MapGIS地形图层
            case InitializeOptionsType.MapGISTerrainProvider:
              break;
            // 覆盖物图层 IGS 2.0
            case InitializeOptionsType.MapGISMapServerImageryProvider:
            // 覆盖物图层 IGS 1.0
            case InitializeOptionsType.UrlTemplateImageryProvider:
              source.alpha = opacity;
              break;
            case InitializeOptionsType.label:
              // TODO：注记图层暂未重构，在initializeOptions方法时已经添加到场景中
              break;
          }
        }
      }
    },
    /**
     * 设置图层的显示/隐藏
     */
    changeLayerVisible(layers) {
      layers = layers || this.layerIds;
      const { viewer, Cesium, vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        const layerIds = Object.keys(find.source);
        this.layerVisibleArr = [];
        for (let i = 0; i < layerIds.length; i++) {
          const layerId = layerIds[i];
          const layer = find.source[layerId];
          const layerType = layer.type;
          const source = layer.source;
          if (layers.indexOf(`${layerId}`) >= 0) {
            source.show = true;
            this.layerVisibleArr.push(layerId);
          } else {
            source.show = false;
            const featureIndex = this.prePickFeature?.index;
            if (layerId === featureIndex) {
              this.featureproperties = undefined;
              this.featurevisible = false;
              this.restoreHighlight();
            }
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
      const { title, version, gdbp, ip, port, domain, layerIndex, key } = layer;
      this.title = title;
      this.gdbp = gdbp;
      this.version = version;
      this.ip = ip;
      this.port = port;
      this.domain = domain;
      this.selectLayerIndex = layerIndex;
      this.layerKey = key;
      this.$refs.card && this.$refs.card.togglePanel();
    },
    /**
     * 恢复M3D样式
     */
    restoreOriginStyle() {
      const { vueKey, vueIndex, vueCesium, viewer } = this;
      const find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source && find.options.originStyles) {
        find.options.originStyles.forEach((item) => {
          const { id, style } = item;
          find.source[id].source.style = style;
        });
      }
    },
    /**
     * 恢复M3D显示
     */
    restoreOriginVisible() {
      const { vueKey, vueIndex, vueCesium, viewer } = this;
      const find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source && find.options.originStyles) {
        find.options.originStyles.forEach((item) => {
          const { id } = item;
          find.source[id].source.show = true;
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
      const { viewer, Cesium, vueCesium, vueKey, vueIndex } = this;
      const { layerIndex } = layer;
      this.featurevisible = false;
      this.selectedKeys = [`${layerIndex}`];
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        const layerIds = Object.keys(find.source);
        for (let i = 0; i < layerIds.length; i++) {
          const layerId = layerIds[i];
          const layer = find.source[layerId];
          const source = layer.source;
          if (layerId != layerIndex) {
            source.show = false;
          } else {
            source.show = true;
            viewer.zoomTo(source);
          }
        }
      }
      let children = this.layerTree[0].children.map((c) => {
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
      let children = this.layerTree[0].children.map((c) => {
        c.disabled = false;
        return c;
      });
      this.layerTree[0].children.splice(0, 1, children[0]);
      this.restoreOriginVisible();
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
      const { vueKey, vueIndex, vueCesium, viewer, Cesium } = this;
      const vm = this;
      if (
        !pickedFeature ||
        !movement ||
        !(pickedFeature && pickedFeature instanceof Cesium.Cesium3DTileFeature)
      ) {
        vm.iClickVisible = false;
        return;
      }
      if (!pickedFeature._content && pickedFeature.primitive) {
        this.featurevisible = true;
        return;
      }
      let index = pickedFeature._content._tileset._layerIndex;
      let tileset;
      const find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        if (find.source[index]) {
          tileset = find.source[index].source;
        }
      }
      if (
        pickedFeature.tileset !== tileset ||
        !this.layerVisibleArr.includes(index)
      ) {
        return;
      }
      vm.selectLayerIndex = index;
      vm.selectedKeys = [`${index}`];
      this.queryStatic(movement);
    },
    cancelFeature() {
      this.$emit("pick-info", {});
      this.cancelHighlight();
    },
    cancelHighlight() {
      const { vueCesium, vueKey, vueIndex } = this;

      if (this.popupShowType === "default") {
        this.featurevisible = false;
      } else {
        if (this.popupShowType === "right") {
          this.popupOverlay && this.popupOverlay.setContent(null);
        }
      }

      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let { primitiveCollection } = find.options;
        let last = find.options.feature;
        if (last) {
          primitiveCollection.remove(last);
        }
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
          this.cancelFeature,
          true,
          false
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
      if (find && find.options && find.options.clickhandler) {
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
      const { vueKey, vueIndex, vueCesium, Cesium, viewer } = this;
      this.selectLayerIndex = layerIndex;
      let m3dlayer;
      const find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        if (find.source[layerIndex]) {
          m3dlayer = find.source[layerIndex].source;
        }
      }
      if (m3dlayer) {
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
          color: this.highlightStyle,
        });
      }
    },
    async queryStatic(movement) {
      const vm = this;
      const {
        Cesium,
        viewer,
        version,
        g3dLayerIndex,
        popupOptions,
        highlightStyle,
        popupShowType,
      } = this;
      const { vueKey, vueIndex, vueCesium } = this;
      const scene = viewer.scene;

      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();

      const pickInfo = {};

      if (!movement) return;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let position = movement.position || movement.endPosition;
        let cartesian = viewer.getCartesian3Position(position);
        let ray = scene.camera.getPickRay(position, tempRay);
        // 拾取球上地形的点，先屏蔽
        let cartesian2 = scene.globe.pick(ray, scene, tempPos);

        let pickedFeature = viewer.scene.pick(movement.position);
        if (!pickedFeature) {
          vm.clickvisible = false;
          vm.featurevisible = false;
          return;
        }

        let longitudeString2, latitudeString2, heightString2;

        let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian);
        longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
        latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
        heightString2 = cartographic2.height;

        if (cartesian || cartesian2) {
          let index = pickedFeature._content._tileset._layerIndex;
          let tileset;
          const find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
          if (find && find.source) {
            if (find.source[index]) {
              tileset = find.source[index].source;
            }
          }
          if (pickedFeature.tileset !== tileset) {
            return;
          }
          vm.featureproperties = undefined;
          vm.featurevisible = false;
          vm.restoreHighlight();
          this.prePickFeature = {
            feature: pickedFeature,
            color: pickedFeature.color,
            index: pickedFeature._content._tileset._layerIndex,
          };
          vm.selectLayerIndex = index;
          vm.selectedKeys = [`${index}`];
          // 修改说明：M3D2.1已弃用viewer.scene.pickOid方法，后面统一从feature上获取要素id，高亮统一使用Cesium3DTileStyle设置
          // 修改人:龚跃健
          // 修改日期：2024-11-22
          const tilesetVersion = tileset.version;
          let id;
          let conditions;
          if (tilesetVersion === "2.1") {
            id = pickedFeature.getProperty("tid");
            conditions = [["${tid} === ${id}", highlightStyle]];
          } else {
            id = pickedFeature.getProperty("OID");
            conditions = [["${OID} === ${id}", highlightStyle]];
          }
          pickInfo.id = id;
          tileset.style = new Cesium.Cesium3DTileStyle({
            defines: {
              id,
            },
            color: {
              conditions,
            },
          });
          const properties20 = await this.getFeaturePorpertiesById(id, index);
          if (Object.keys(properties20).length > 0) {
            if (vm.showPopup) {
              vm.featureproperties = properties20;
              vm.iClickFeatures = [{ properties20 }];
            }
            pickInfo.properties = properties20;
          } else {
            let result = {};
            const propertyIds = pickedFeature.getPropertyIds();
            // 修改说明：属性信息也统一从feature上获取，更新获取方法
            // 修改人:龚跃健
            // 修改日期：2025-1-9
            if (propertyIds && propertyIds.length) {
              for (let i = 0; i < propertyIds.length; ++i) {
                const propertyId = propertyIds[i];
                result[propertyId] = pickedFeature.getProperty(propertyId);
              }
              if (vm.showPopup) {
                vm.featureproperties = result;
                vm.iClickFeatures = [{ properties: result }];
              }
              pickInfo.properties = result;
            }

            if (popupShowType === "right") {
              vm.popupOverlay &&
                vm.popupOverlay.setContent(vm.featureproperties);
            }
          }
          if (vm.showPopup) {
            if (
              vm.featureclickenable &&
              vm.featureproperties &&
              Object.keys(vm.featureproperties).length > 0
            ) {
              if (vm.popupShowType === "default") {
                vm.featurevisible = true;
                vm.featureposition = {
                  longitude: longitudeString2,
                  latitude: latitudeString2,
                  height: heightString2,
                };
              }
            }
          }
          pickInfo.position = {
            longitude: longitudeString2,
            latitude: latitudeString2,
            height: heightString2,
          };
          pickInfo.layerId = vm.vueIndex;
          vm.$emit("pick-info", pickInfo);
        } else {
          vm.clickvisible = false;
          if (popupShowType === "right") {
            vm.popupOverlay && vm.popupOverlay.setContent(null);
          }
        }
      }
    },
    // 动态单体化下该方法执行后会导致模型大面积高亮，参考禅道bug2356
    restoreHighlight() {
      if (this.prePickFeature) {
        this.prePickFeature.feature.color = this.prePickFeature.color;
        this.prePickFeature = undefined;
      }
      this.restoreM3d();
    },
    restoreBeforeM3d() {
      if (this.prePickFeature) {
        const { vueKey, vueIndex, vueCesium } = this;
        const find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
        if (find && find.source && find.options.originStyles) {
          find.options.originStyles.forEach((item) => {
            const { id, style } = item;
            if (id === this.prePickFeature.index) {
              find.source[id].source.style = style;
            }
          });
        }
      }
    },
    handleDynamicQuery() {
      this.featurevisible = false;
      this.featureclickenable = false;
    },
    handleBackMain() {
      this.featureclickenable = this.enablePopup;
    },
    projectScreen(file) {
      this.$emit("project-screen", file);
    },
    async getFeaturePorpertiesById(id, layerIndex) {
      const properties = {};
      if (this.searchParams) {
        const { domain, serverName, layerIndex, serverType, mapList } =
          this.searchParams;
        let { gdbp } = this.searchParams;
        if (serverType === "IGSMapImage" && layerName) {
          // 关联的地图文档
          if (mapList && mapList.length > 0) {
            for (let i = 0; i < mapList.length; i++) {
              const item = mapList[i];
              if (layerIndex.includes(item.LayerIndex)) {
                gdbp = item.URL;
              }
            }
          }
        }
        const featureSet = await Feature.FeatureQuery.query(
          {
            domain,
            f: "json",
            IncludeAttribute: true,
            IncludeGeometry: false,
            IncludeWebGraphic: false,
            where: null,
            gdbp,
            docName: serverName,
            layerIdxs: layerIndex,
            rtnLabel: false,
            objectIds: id,
            requestType: "POST",
          },
          false,
          true
        );
        if (featureSet && featureSet.SFEleArray) {
          const { AttStruct, SFEleArray } = featureSet;
          const { FldAlias, FldName } = AttStruct;
          const { AttValue } = SFEleArray[0];

          for (let i = 0; i < AttValue.length; i++) {
            const tag = FldAlias[i] ? FldAlias[i] : FldName[i];
            properties[tag] = AttValue[i];
          }
        }
      }
      return properties;
    },
  },
};
</script>
