<script>
import VueOptions from "../../Base/Vue/VueOptions";
import { G3D } from "@mapgis/webclient-es6-service";
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
  name: "mapgis-3d-igs-terrain",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    autoReset: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
    },
    scale: {
      type: Number,
      default: 1,
    },
    requestVertexNormals: {
      type: Boolean,
      default: false,
    },
    ...VueOptions,
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    show: function (next) {
      if (next) {
        this.mount();
      } else {
        this.unmount();
      }
    },
    scale: function (next) {
      this.changeScale();
    },
  },
  methods: {
    mount() {
      const vm = this;
      const { vueIndex, vueKey, vueCesium } = this;
      const { viewer, url, $props } = this;

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
              viewer.scene.primitives.add(m3dSet);
              if (this.autoReset) {
                viewer.zoomTo(m3dSet);
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
        vueCesium.IgsTerrainManager.addSource(vueKey, vueIndex, layers, {
          m3ds,
          originStyles,
          commonLayer: layer,
        });
        if (layers && Object.keys(layers).length) {
          this.setLayerTree(layer, layers);
        }

        vm.$emit("loaded", this);
      });

      if (viewer.isDestroyed()) return;
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
        ...this.$options.propsData,
        ...this.$props.extensions,
      };
      Object.keys(tempProps).forEach(function (key) {
        options[key] = tempProps[key];
      });
      return options;
    },
    changeScale() {
      const { viewer } = this;
      viewer.scene.globe.terrainExaggeration = this.scale;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex, viewer, Cesium } = this;
      // 移除场景服务
      let find = vueCesium.IgsTerrainManager.findSource(vueKey, vueIndex);
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
      vueCesium.IgsTerrainManager.deleteSource(vueKey, vueIndex);
    },
  },
  render(h) {
    return h("span", {
      class: "mapgis-3d-igs-terrain",
      ref: "m3d",
    });
  },
};
</script>
