import layerEvents from "../../lib/layerEvents";
import mixin from "./layerMixin";
import { LayerType, TileInfoUtil } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-mapboxgl-plugin";

export default {
  name: "mapgis-rastertile-layer",
  mixins: [mixin],
  props: {
    /**
     * webclient-common库的Layer对象，用于构造MapBox引擎的图层对象
     */
    commonLayer: {
      type: Object,
      default: null,
    },
  },
  watch: {
    /*
     * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
     * 修改说明: 监听是否传入了commonLayer属性，如果传入了，就使用该对象构造MapBox引擎的图层对象，否则使用原有逻辑添加
     * 修改人: 杨琨 2025-11-10
     */
    commonLayer: {
      handler: function (newLayer, oldLayer) {
        // 是否重新加载图层
        let reloadLayer = true;
        // 更改透明度或者显隐参数，不重新加载图层
        const layerId = this.$_getLayerId();
        if (oldLayer && newLayer.opacity !== oldLayer.opacity) {
          reloadLayer = false;
          /*
           * feat(3395): PTSYB-天地图放大到一定程度后，不显示“此级别下，该区域无影像”
           * 修改说明: 支持调整自定义图层的透明度
           * 版权所有: 武汉中地数码科技有限公司
           * 修改人: 杨琨 2025-11-27
           */
          if (this.customLayer) {
            this.customLayer.setOpacity(newLayer.opacity);
          } else {
            this.map.setPaintProperty(
              layerId,
              "raster-opacity",
              newLayer.opacity
            );
          }
        }
        if (oldLayer && newLayer.visible !== oldLayer.visible) {
          reloadLayer = false;
          if (newLayer.visible === true) {
            this.map.setLayoutProperty(layerId, "visibility", "visible");
          } else {
            this.map.setLayoutProperty(layerId, "visibility", "none");
          }
        }
        // 重新加载图层
        if (reloadLayer) {
          if (!this.isFirstAddLayer) {
            this.$_deferredMountByCommonLayer();
            this.isFirstAddLayer = true;
          } else {
            const oldLayerJSON = oldLayer.toJSON();
            const newLayerJSON = newLayer.toJSON();
            try {
              if (
                JSON.stringify(oldLayerJSON) !== JSON.stringify(newLayerJSON)
              ) {
                this.$_deferredMountByCommonLayer();
              }
            } catch (error) {
              this.$_deferredMountByCommonLayer();
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      /*
       * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
       * 修改说明: 新增layerIdBack，sourceIdBack和sourceBack属性，用于使用webclient-common图层象构造MapBox引擎的图层对象
       * 不使用原有的layerId等属性，因为其是props上的对象，只能外部传入，不能在组件内部二次赋值
       * 修改人: 杨琨 2025-11-6
       */
      // 用于保存mapbox样式图层的id
      layerIdBack: null,
      // 用于保存mapbox的source的id
      sourceIdBack: null,
      // 用于保存mapbox的source对象
      sourceBack: null,
      // 用于保存mapbox的layer对象
      layerBack: null,
      // 是否是第一次通过传入common图层的方式加载图层
      isFirstAddLayer: false,
    };
  },
  created() {
    /*
     * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
     * 修改说明: 如果外部没有传入commonLayer，则按原有逻辑构造图层
     * 修改人: 杨琨 2025-11-10
     */
    if (!this.commonLayer) {
      this.$_deferredMount();

      if (this.url) {
        this.$watch("url", function (next) {
          if (this.initial) return;
          this.$_deferredUnMount();
          this.$_deferredMount();
        });
      }
    }
  },

  methods: {
    $_deferredMount() {
      /*
       * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
       * 修改说明: 使用统一接口获取layerId或sourceId
       * 修改人: 杨琨 2025-11-10
       */
      const sourceObject = this.$_getSource();
      let source = {
        type: "raster",
        tiles: [this.url],
        mapgisOffset: this.mapgisOffset,
        ...sourceObject,
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      const sourceId = this.$_getSourceId();
      try {
        this.map.addSource(sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(sourceId);
          this.map.addSource(sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },

    $_addLayer() {
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: this.layerId });
          return existed;
        }
      }
      /*
       * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
       * 修改说明: 使用统一接口获取layerId或sourceId
       * 修改人: 杨琨 2025-11-10
       */
      const layerId = this.$_getLayerId();
      const sourceId = this.$_getSourceId();
      const layerObject = this.$_getLayer();
      let layer = {
        ...layerObject,
        id: layerId,
        type: "raster",
        source: sourceId,
      };

      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    },
    $_deferredUnMount() {
      /*
       * feat(7686): 兼容GeoServer平台发布的WMS/WMTS服务
       * 修改说明: 优化删除图层的方法，只有确保图层和source存在时才删除
       * 修改人: 杨琨 2025-11-10
       */
      let layerId = this.$_getLayerId();
      let sourceId = this.$_getSourceId();
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }
      if (this.map.getSource(sourceId)) {
        this.map.removeSource(sourceId);
      }
      this.initial = true;
    },
    /**
     * 通过webclient-common的layer来构造并添加mapboxgl的图层
     */
    $_deferredMountByCommonLayer() {
      const { commonLayer } = this;
      if (commonLayer) {
        this.$_deferredUnMount();
        const mapboxglOptions = initializeOptions(commonLayer);
        const { layers, sources } = mapboxglOptions;
        layers[0].id = commonLayer.id;
        this.layerIdBack = layers[0].id;
        this.sourceIdBack = layers[0].source;
        this.sourceBack = sources[this.sourceIdBack];
        this.layerBack = layers[0];
        if (this.sourceBack) {
          this.$_deferredMount();
        }
      }
    },
  },
};
